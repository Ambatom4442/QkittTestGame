#!/usr/bin/env node
import { Buffer } from "node:buffer";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import process from "node:process";
import { chromium } from "@playwright/test";

const CLEAR_COLOR = [16, 24, 32];
const ARTIFACT_PATH = "artifacts/golden-boot.png";
const BASE_URL = (process.env.QGAME_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const TARGET_URL = `${BASE_URL}/?test=1`;
const SAMPLE_GRID = { columns: 12, rows: 7 };
const MIN_DIFFERENT_SAMPLES = 2;

function fail(messages, context = {}) {
  const what = messages.join("; ");
  const details = Object.entries(context)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(" ");
  globalThis.console.error(`WHAT: golden-boot failed: ${what}`);
  globalThis.console.error("WHY:  The golden journey did not boot/render correctly in real Chromium.");
  globalThis.console.error(`FIX:  Inspect ${ARTIFACT_PATH}, console/page errors, and boot/runtime wiring.${details ? ` (${details})` : ""}`);
  process.exit(1);
}

function differsFromClear(pixel) {
  if (!Array.isArray(pixel) || pixel.length < 4) {
    return false;
  }
  const [r, g, b, a] = pixel;
  if (a <= 0) {
    return false;
  }
  return Math.abs(r - CLEAR_COLOR[0]) > 2 || Math.abs(g - CLEAR_COLOR[1]) > 2 || Math.abs(b - CLEAR_COLOR[2]) > 2;
}

function buildSampleFractions() {
  const points = [];
  const stepX = 1 / (SAMPLE_GRID.columns + 1);
  const stepY = 1 / (SAMPLE_GRID.rows + 1);

  for (let row = 1; row <= SAMPLE_GRID.rows; row += 1) {
    for (let column = 1; column <= SAMPLE_GRID.columns; column += 1) {
      points.push([stepX * column, stepY * row]);
    }
  }

  return points;
}

async function waitForHealthy(url, timeoutMs = 25000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await globalThis.fetch(`${url}/api/health`);
      if (response.ok) {
        return true;
      }
    } catch {
      // keep polling
    }
    await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
  }
  return false;
}

async function ensureApp() {
  if (await waitForHealthy(BASE_URL, 2000)) {
    return null;
  }

  const parsed = new globalThis.URL(BASE_URL);
  const isLocalHost = parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost";
  if (!isLocalHost) {
    fail([`app is not reachable at ${BASE_URL}`], { baseUrl: BASE_URL });
  }

  const env = {
    ...process.env,
    HOST: parsed.hostname,
    PORT: parsed.port || "3000",
    QGAME_TEST_MODE: "1"
  };

  const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "start"], {
    cwd: process.cwd(),
    env,
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});

  const healthy = await waitForHealthy(BASE_URL, 30000);
  if (!healthy) {
    child.kill("SIGTERM");
    fail([`app did not become healthy at ${BASE_URL} after start attempt`], { baseUrl: BASE_URL });
  }

  return child;
}

async function sampleCanvasScreenshot(page, canvasLocator, screenshotBytes) {
  const encoded = Buffer.from(screenshotBytes).toString("base64");
  const samplePoints = buildSampleFractions();

  const sampleResult = await page.evaluate(
    async ({ base64Png, clearColor, points }) => {
      const image = new globalThis.Image();
      const dataUrl = `data:image/png;base64,${base64Png}`;

      await new Promise((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Failed to decode canvas screenshot PNG."));
        image.src = dataUrl;
      });

      const sampleCanvas = globalThis.document.createElement("canvas");
      sampleCanvas.width = image.width;
      sampleCanvas.height = image.height;

      const context = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        return { samples: [], differentCount: 0 };
      }

      context.drawImage(image, 0, 0);

      const differs = (pixel) => {
        if (!pixel || pixel.length < 4) {
          return false;
        }
        const [r, g, b, a] = pixel;
        if (a <= 0) {
          return false;
        }
        return Math.abs(r - clearColor[0]) > 2 || Math.abs(g - clearColor[1]) > 2 || Math.abs(b - clearColor[2]) > 2;
      };

      const samples = [];
      let differentCount = 0;

      for (const [fx, fy] of points) {
        const x = Math.min(sampleCanvas.width - 1, Math.max(0, Math.floor(sampleCanvas.width * fx)));
        const y = Math.min(sampleCanvas.height - 1, Math.max(0, Math.floor(sampleCanvas.height * fy)));
        const pixel = Array.from(context.getImageData(x, y, 1, 1).data);
        const isDifferent = differs(pixel);
        if (isDifferent) {
          differentCount += 1;
        }
        samples.push({ fx, fy, pixel, isDifferent });
      }

      return { samples, differentCount };
    },
    { base64Png: encoded, clearColor: CLEAR_COLOR, points: samplePoints }
  );

  const canvasBounds = await canvasLocator.boundingBox();
  return { ...sampleResult, canvasBounds, sampleCount: samplePoints.length };
}

async function main() {
  await mkdir("artifacts", { recursive: true });

  let appProcess = null;
  let browser = null;
  const consoleErrors = [];
  const pageErrors = [];

  try {
    appProcess = await ensureApp();

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1000);

    const canvasLocator = page.locator("#qgame-canvas");
    const canvasCount = await canvasLocator.count();
    if (canvasCount !== 1) {
      fail(["#qgame-canvas is missing"], { canvasCount, baseUrl: BASE_URL });
    }

    const screenshotBytes = await canvasLocator.screenshot({ path: ARTIFACT_PATH });

    const hookState = await page.evaluate(() => ({
      hasHook: typeof globalThis.window.__qgame === "object" && globalThis.window.__qgame !== null,
      fps: typeof globalThis.window.__qgame?.fps === "function" ? Number(globalThis.window.__qgame.fps()) : null
    }));

    const sampleResult = await sampleCanvasScreenshot(page, canvasLocator, screenshotBytes);

    const failures = [];
    if (consoleErrors.length > 0) {
      failures.push("console error(s) detected");
    }
    if (pageErrors.length > 0) {
      failures.push("page error(s) detected");
    }
    if (!hookState.hasHook) {
      failures.push("window.__qgame is missing");
    }
    if (!(Number.isFinite(hookState.fps) && hookState.fps > 0)) {
      failures.push("window.__qgame.fps() is not > 0");
    }
    if (!(Number.isFinite(sampleResult.differentCount) && sampleResult.differentCount >= MIN_DIFFERENT_SAMPLES)) {
      failures.push("canvas screenshot samples did not differ from clear colour at enough points");
    }

    if (failures.length > 0) {
      fail(failures, {
        samples: sampleResult.samples,
        differentCount: sampleResult.differentCount,
        sampleCount: sampleResult.sampleCount,
        minDifferentSamples: MIN_DIFFERENT_SAMPLES,
        canvasBounds: sampleResult.canvasBounds,
        consoleErrors,
        pageErrors,
        fps: hookState.fps,
        baseUrl: BASE_URL
      });
    }

    const centerSample = sampleResult.samples.find(
      (entry) => Math.abs(entry.fx - 0.5) < 1e-9 && Math.abs(entry.fy - 0.5) < 1e-9
    ) ?? null;
    if (centerSample && !differsFromClear(centerSample.pixel)) {
      globalThis.console.log("golden-boot: center sample matched clear colour, but grid sampling passed threshold.");
    }

    globalThis.console.log(`golden-boot: OK (artifact at ${ARTIFACT_PATH})`);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (appProcess) {
      appProcess.kill("SIGTERM");
    }
  }
}

main().catch((error) => {
  fail([error.message], { stack: error.stack, baseUrl: BASE_URL });
});

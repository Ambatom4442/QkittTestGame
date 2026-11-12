#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import process from "node:process";
import { chromium } from "@playwright/test";

const CLEAR_COLOR = [16, 24, 32];
const ARTIFACT_PATH = "artifacts/golden-boot.png";
const BASE_URL = (process.env.QGAME_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const TARGET_URL = `${BASE_URL}/?test=1`;

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

async function collectPixel(page) {
  return page.evaluate(() => {
    const canvas = globalThis.document.getElementById("qgame-canvas");
    if (!canvas) {
      return null;
    }

    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const x = Math.floor(gl.drawingBufferWidth / 2);
      const y = Math.floor(gl.drawingBufferHeight / 2);
      const sample = new Uint8Array(4);
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, sample);
      return Array.from(sample);
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return null;
    }

    const x = Math.floor(canvas.width / 2);
    const y = Math.floor(canvas.height / 2);
    const sample = context.getImageData(x, y, 1, 1).data;
    return Array.from(sample);
  });
}

async function main() {
  await mkdir("artifacts", { recursive: true });

  let appProcess = null;
  let browser = null;
  let page = null;
  const consoleErrors = [];
  const pageErrors = [];

  try {
    appProcess = await ensureApp();

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    page = await context.newPage();

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

    await page.screenshot({ path: ARTIFACT_PATH, fullPage: true });

    const hookState = await page.evaluate(() => ({
      hasHook: typeof globalThis.window.__qgame === "object" && globalThis.window.__qgame !== null,
      fps: typeof globalThis.window.__qgame?.fps === "function" ? Number(globalThis.window.__qgame.fps()) : null
    }));

    const pixel = await collectPixel(page);

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
    if (!differsFromClear(pixel)) {
      failures.push("canvas sample did not differ from clear colour");
    }

    if (failures.length > 0) {
      fail(failures, { pixel, consoleErrors, pageErrors, fps: hookState.fps, baseUrl: BASE_URL });
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

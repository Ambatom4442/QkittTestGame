import { test, expect } from "@playwright/test";

test("serves boot assets and test-mode client config", async ({ page, request }) => {
  const configResponse = await request.get("/api/client-config");
  expect(configResponse.ok()).toBeTruthy();
  await expect(configResponse.json()).resolves.toEqual({ testModeEnabled: true });

  const pageResponse = await page.goto("/?test=1");
  expect(pageResponse?.ok()).toBeTruthy();
  await expect(page.locator('script[src="/client.boot.js"]')).toHaveCount(1);

  const bootScriptResponse = await request.get("/client.boot.js");
  expect(bootScriptResponse.ok()).toBeTruthy();
  await expect(bootScriptResponse.text()).resolves.toContain("bootClient");

  const threeResponse = await request.get("/vendor/three.module.js");
  expect(threeResponse.ok()).toBeTruthy();
  await expect(threeResponse.text()).resolves.toContain("WebGLRenderer");
});

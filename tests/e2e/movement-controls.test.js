import { test, expect } from "@playwright/test";

test("serves movement scene shell in real browser mode", async ({ page, request }) => {
  const pageResponse = await page.goto("/?test=1");
  expect(pageResponse?.ok()).toBeTruthy();

  await expect(page.locator("#qgame-canvas")).toHaveCount(1);
  await expect(page.locator("#qgame-interactables")).toHaveCount(1);

  const healthResponse = await request.get("/api/health");
  expect(healthResponse.ok()).toBeTruthy();
  await expect(healthResponse.json()).resolves.toEqual({ status: "ok" });
});

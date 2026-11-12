import { test, expect } from "@playwright/test";

test("[shell check] serves built client and health endpoint", async ({ page, request }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle("Q-Game");
  await expect(page.getByRole("heading", { level: 1, name: "Q-Game" })).toBeVisible();

  const healthResponse = await request.get("/api/health");
  expect(healthResponse.ok()).toBeTruthy();
  await expect(healthResponse.json()).resolves.toEqual({ status: "ok" });
});

import { test, expect } from "@playwright/test";

test("renders L-06 interactables in the visible list and exposes them through test hook state", async ({ page }) => {
  const pageResponse = await page.goto("/?test=1");
  expect(pageResponse?.ok()).toBeTruthy();

  const clues = page.locator("#qgame-interactables li");
  await expect(clues).toHaveCount(5);

  const objectIds = await clues.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-object-id")));
  expect(objectIds).toEqual([
    "barred-shutters",
    "bell-pull",
    "ventilator",
    "bed-frame",
    "bell-wire"
  ]);

  const testHookInteractables = await page.evaluate(() => {
    const hook = globalThis.__qgame;
    if (!hook) {
      return null;
    }
    return hook.interactables().map((entry) => entry.objectId);
  });
  expect(testHookInteractables).toEqual(objectIds);
});

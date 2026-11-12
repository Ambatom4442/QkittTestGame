import { test, expect } from "@playwright/test";

test("exposes test hook only in test mode and mutates game state", async ({ page }) => {
  const testResponse = await page.goto("/?test=1");
  expect(testResponse?.ok()).toBeTruthy();

  const testModeState = await page.evaluate(() => {
    const hook = globalThis.__qgame;
    if (!hook) {
      return null;
    }

    const before = hook.state();
    const skipped = hook.skipAnimations();
    const interacted = hook.interact("bell-wire", "inspect");
    const moved = hook.moveTo(1.75, 2.1);
    const after = hook.state();

    return { before, after, skipped, interacted, moved };
  });

  expect(testModeState).not.toBeNull();
  expect(testModeState.skipped).toBe(1);
  expect(testModeState.interacted).toEqual({ objectId: "bell-wire", action: "inspect" });
  expect(testModeState.after.skippedAnimations).toBe(1);
  expect(testModeState.after.lastInteraction).toEqual({ objectId: "bell-wire", action: "inspect" });
  expect(testModeState.before.player.position).not.toEqual(testModeState.after.player.position);
  expect(testModeState.moved).toMatchObject({ x: 1.75, z: 2.1 });

  const normalResponse = await page.goto("/");
  expect(normalResponse?.ok()).toBeTruthy();
  await expect.poll(() => page.evaluate(() => typeof globalThis.__qgame)).toBe("undefined");
});

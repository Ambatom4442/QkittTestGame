import { test, expect } from "@playwright/test";

test("moves the player through the test hook and updates in-game position state", async ({ page }) => {
  const pageResponse = await page.goto("/?test=1");
  expect(pageResponse?.ok()).toBeTruthy();

  await expect.poll(() => page.evaluate(() => typeof globalThis.__qgame)).toBe("object");

  const movement = await page.evaluate(() => {
    const hook = globalThis.__qgame;
    if (!hook) {
      return null;
    }

    const start = hook.state().player.position;
    const moved = hook.moveTo(2, 2);
    const afterMove = hook.state().player.position;
    const clamped = hook.moveTo(10, 10);
    const afterClamp = hook.state().player.position;

    return { start, moved, afterMove, clamped, afterClamp };
  });

  expect(movement).not.toBeNull();
  expect(movement.start).not.toEqual(movement.afterMove);
  expect(movement.moved).toMatchObject({ x: 2, z: 2 });
  expect(movement.clamped.x).toBe(10);
  expect(movement.clamped.z).toBe(10);
  expect(movement.afterClamp).toMatchObject({ x: 10, z: 10 });
});

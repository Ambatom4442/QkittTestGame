import { test, expect } from "@playwright/test";
import { createGame, createProfile, uniqueName } from "./helpers.js";

test("persists the in-game moved position and returns it from resume", async ({ page, request }) => {
  const profile = await createProfile(request, uniqueName("sherlock"));
  const game = await createGame(request, { profileId: profile.id, slot: 1 });

  const openResponse = await page.goto(`/?test=1&game=${game.id}`);
  expect(openResponse?.ok()).toBeTruthy();

  await expect.poll(() => page.evaluate(() => typeof globalThis.__qgame)).toBe("object");

  const moved = await page.evaluate(() => {
    const hook = globalThis.__qgame;
    if (!hook) {
      return null;
    }

    const before = hook.state().player.position;
    const after = hook.moveTo(1.25, -2.75);
    return { before, after };
  });

  expect(moved).not.toBeNull();
  expect(moved.before).not.toEqual(moved.after);

  const autosaveResponse = await request.put(`/api/games/${game.id}/position`, {
    data: {
      sceneId: "L-06",
      transform: moved.after
    }
  });
  expect(autosaveResponse.ok()).toBeTruthy();

  const resumeResponse = await request.get(`/api/games/${game.id}/resume`);
  expect(resumeResponse.ok()).toBeTruthy();
  await expect(resumeResponse.json()).resolves.toMatchObject({
    id: game.id,
    caseId: "speckled-band",
    sceneId: "L-06",
    transform: moved.after
  });
});

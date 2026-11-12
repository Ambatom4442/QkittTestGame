import { test, expect } from "@playwright/test";
import { createGame, createProfile, interact, uniqueName } from "./helpers.js";

test("changes in-game interaction state and grants all L-06 clues through event submissions", async ({ page, request }) => {
  const profile = await createProfile(request, uniqueName("watson"));
  const game = await createGame(request, { profileId: profile.id, slot: 2 });

  const loadResponse = await page.goto(`/?test=1&game=${game.id}`);
  expect(loadResponse?.ok()).toBeTruthy();

  await expect.poll(() => page.evaluate(() => typeof globalThis.__qgame)).toBe("object");

  const interactionState = await page.evaluate(() => {
    const hook = globalThis.__qgame;
    if (!hook) {
      return null;
    }

    const before = hook.state().lastInteraction;
    const applied = hook.interact("barred-shutters", "inspect");
    const after = hook.state().lastInteraction;
    return { before, applied, after };
  });

  expect(interactionState).not.toBeNull();
  expect(interactionState.before).toBeNull();
  expect(interactionState.applied).toEqual({ objectId: "barred-shutters", action: "inspect" });
  expect(interactionState.after).toEqual({ objectId: "barred-shutters", action: "inspect" });

  const sceneResponse = await request.get("/api/scenes/L-06");
  expect(sceneResponse.ok()).toBeTruthy();
  const scene = await sceneResponse.json();

  const clueIds = [];
  for (const interactable of scene.interactables) {
    const payload = await interact(request, game.id, {
      sceneId: "L-06",
      objectId: interactable.objectId,
      action: interactable.action
    });
    clueIds.push(payload.clueId);
  }

  expect(clueIds).toEqual(["E-07", "E-09", "E-10", "E-11", "E-12"]);
});

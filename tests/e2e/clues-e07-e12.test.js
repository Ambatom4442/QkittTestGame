import { test, expect } from "@playwright/test";
import { createGame, createProfile, interact, uniqueName } from "./helpers.js";

test("[shell check] collects all L-06 interaction clues through the events API flow", async ({ page, request }) => {
  const profile = await createProfile(request, uniqueName("watson"));
  const game = await createGame(request, { profileId: profile.id, slot: 2 });

  const loadResponse = await page.goto("/?test=1");
  expect(loadResponse?.ok()).toBeTruthy();

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

  const saveSlotsResponse = await request.get(`/api/profiles/${profile.id}/saves`);
  expect(saveSlotsResponse.ok()).toBeTruthy();
  await expect(saveSlotsResponse.json()).resolves.toMatchObject({
    saveSlots: [
      {
        id: game.id,
        clues: ["E-07", "E-09", "E-10", "E-11", "E-12"]
      }
    ]
  });
});

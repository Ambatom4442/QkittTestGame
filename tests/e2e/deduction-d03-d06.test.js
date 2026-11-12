import { test, expect } from "@playwright/test";
import { createGame, createProfile, interact, uniqueName } from "./helpers.js";

test("returns a hint for wrong D-03 links and unlocks D-06 with the full clue set", async ({ page, request }) => {
  const profile = await createProfile(request, uniqueName("helen"));
  const game = await createGame(request, { profileId: profile.id, slot: 3 });

  const loadResponse = await page.goto("/?test=1");
  expect(loadResponse?.ok()).toBeTruthy();

  await interact(request, game.id, {
    sceneId: "L-06",
    objectId: "barred-shutters",
    action: "inspect"
  });

  const wrongD03Response = await request.post(`/api/games/${game.id}/deductions`, {
    data: {
      deductionId: "D-03",
      clueIds: ["E-07"]
    }
  });

  expect(wrongD03Response.ok()).toBeTruthy();
  await expect(wrongD03Response.json()).resolves.toEqual({
    gameId: game.id,
    deductionId: "D-03",
    result: "incorrect",
    hintId: "H-D03-SHUTTERS"
  });

  for (const interaction of [
    { objectId: "bell-pull", action: "pull" },
    { objectId: "ventilator", action: "inspect" },
    { objectId: "bed-frame", action: "inspect" },
    { objectId: "bell-wire", action: "inspect" }
  ]) {
    await interact(request, game.id, {
      sceneId: "L-06",
      objectId: interaction.objectId,
      action: interaction.action
    });
  }

  const d06Response = await request.post(`/api/games/${game.id}/deductions`, {
    data: {
      deductionId: "D-06",
      clueIds: ["E-09", "E-10", "E-11", "E-12"]
    }
  });

  expect(d06Response.ok()).toBeTruthy();
  await expect(d06Response.json()).resolves.toEqual({
    gameId: game.id,
    deductionId: "D-06",
    result: "correct",
    alreadyUnlocked: false,
    deductions: ["D-06"]
  });

  const resumeResponse = await request.get(`/api/games/${game.id}/resume`);
  expect(resumeResponse.ok()).toBeTruthy();
  await expect(resumeResponse.json()).resolves.toMatchObject({
    id: game.id,
    clues: ["E-07", "E-09", "E-10", "E-11", "E-12"],
    deductions: ["D-06"]
  });
});

import { test, expect } from "@playwright/test";
import { createGame, createProfile, interact, uniqueName } from "./helpers.js";

test("[shell check] opens casebook and lists collected clues exactly once", async ({ page, request }) => {
  const profile = await createProfile(request, uniqueName("helen"));
  const game = await createGame(request, { profileId: profile.id, slot: 4 });

  for (const interaction of [
    { objectId: "barred-shutters", action: "inspect" },
    { objectId: "barred-shutters", action: "inspect" },
    { objectId: "ventilator", action: "inspect" },
    { objectId: "bed-frame", action: "inspect" }
  ]) {
    await interact(request, game.id, {
      sceneId: "L-06",
      objectId: interaction.objectId,
      action: interaction.action
    });
  }

  const casebookResponse = await request.get(`/api/games/${game.id}/casebook`);
  expect(casebookResponse.ok()).toBeTruthy();
  await expect(casebookResponse.json()).resolves.toMatchObject({
    gameId: game.id,
    clues: [
      { id: "E-07" },
      { id: "E-10" },
      { id: "E-11" }
    ]
  });

  const openResponse = await page.goto(`/?test=1&game=${game.id}`);
  expect(openResponse?.ok()).toBeTruthy();
  await expect(page.locator("#qgame-casebook-toggle")).toHaveAttribute("aria-controls", "qgame-casebook");
  await expect(page.locator("#qgame-casebook-clues")).toHaveCount(1);
});

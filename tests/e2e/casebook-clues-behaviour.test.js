import { test, expect } from "@playwright/test";
import { createGame, createProfile, interact, uniqueName } from "./helpers.js";

test("opens the casebook panel and visibly lists unique collected clues", async ({ page, request }) => {
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

  const openResponse = await page.goto(`/?test=1&game=${game.id}`);
  expect(openResponse?.ok()).toBeTruthy();

  const panel = page.locator("#qgame-casebook");
  const toggle = page.locator("#qgame-casebook-toggle");
  await expect(panel).toBeHidden();
  await toggle.click();
  await expect(panel).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  const clues = page.locator("#qgame-casebook-clues li");
  await expect(clues).toHaveCount(3);
  await expect(clues.nth(0)).toContainText("E-07");
  await expect(clues.nth(1)).toContainText("E-10");
  await expect(clues.nth(2)).toContainText("E-11");
});

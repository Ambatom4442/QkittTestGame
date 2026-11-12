import { test, expect } from "@playwright/test";
import { createGame, createProfile, uniqueName } from "./helpers.js";

test("saves and resumes position through live app endpoints", async ({ page, request }) => {
  const profile = await createProfile(request, uniqueName("sherlock"));
  const game = await createGame(request, { profileId: profile.id, slot: 1 });

  const autosaveResponse = await request.put(`/api/games/${game.id}/position`, {
    data: {
      sceneId: "L-06",
      transform: { x: 1.25, y: 1.6, z: -2.75 }
    }
  });

  expect(autosaveResponse.ok()).toBeTruthy();
  await expect(autosaveResponse.json()).resolves.toMatchObject({
    id: game.id,
    sceneId: "L-06",
    transform: { x: 1.25, y: 1.6, z: -2.75 }
  });

  const openResponse = await page.goto(`/?test=1&game=${game.id}`);
  expect(openResponse?.ok()).toBeTruthy();

  const resumeResponse = await request.get(`/api/games/${game.id}/resume`);
  expect(resumeResponse.ok()).toBeTruthy();
  await expect(resumeResponse.json()).resolves.toMatchObject({
    id: game.id,
    caseId: "speckled-band",
    sceneId: "L-06",
    transform: { x: 1.25, y: 1.6, z: -2.75 }
  });
});

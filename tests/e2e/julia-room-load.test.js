import { test, expect } from "@playwright/test";

test("loads L-06 scene data and returns interactables in chapter order", async ({ page, request }) => {
  const chapterResponse = await request.get("/api/chapters/C-04/scenes");
  expect(chapterResponse.ok()).toBeTruthy();
  const chapterPayload = await chapterResponse.json();

  expect(chapterPayload).toMatchObject({ chapterId: "C-04" });
  expect(chapterPayload.scenes.map((scene) => scene.id)).toEqual(["L-05", "L-06", "L-07"]);

  const sceneResponse = await request.get("/api/scenes/L-06");
  expect(sceneResponse.ok()).toBeTruthy();
  const scenePayload = await sceneResponse.json();

  expect(scenePayload).toMatchObject({
    id: "L-06",
    chapterId: "C-04",
    title: "Julia's bedroom"
  });
  expect(scenePayload.interactables.map((entry) => entry.objectId)).toEqual([
    "barred-shutters",
    "bell-pull",
    "ventilator",
    "bed-frame",
    "bell-wire"
  ]);

  const pageResponse = await page.goto("/");
  expect(pageResponse?.ok()).toBeTruthy();
  await expect(page.locator("#qgame-interactables")).toHaveCount(1);
});

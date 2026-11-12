import { describe, expect, it } from "vitest";
import { buildServer } from "../../server/src/buildServer.js";

describe("julia-room-load", () => {
  it("loads L-06 scene data and returns interactables in chapter order", async () => {
    const server = buildServer({ logger: false, testModeEnabled: true });

    try {
      const chapterScenesResponse = await server.inject({
        method: "GET",
        url: "/api/chapters/C-04/scenes"
      });
      expect(chapterScenesResponse.statusCode).toBe(200);
      const chapterPayload = chapterScenesResponse.json();
      expect(chapterPayload).toMatchObject({ chapterId: "C-04" });
      expect(chapterPayload.scenes.map((scene) => scene.id)).toEqual(["L-05", "L-06", "L-07"]);

      const sceneResponse = await server.inject({
        method: "GET",
        url: "/api/scenes/L-06"
      });
      expect(sceneResponse.statusCode).toBe(200);
      const scenePayload = sceneResponse.json();
      expect(scenePayload).toMatchObject({
        id: "L-06",
        chapterId: "C-04",
        title: "Julia's bedroom"
      });

      const interactableIds = scenePayload.interactables.map((entry) => entry.objectId);
      expect(interactableIds).toEqual(["barred-shutters", "bell-pull", "ventilator", "bed-frame", "bell-wire"]);

      const pageResponse = await server.inject({
        method: "GET",
        url: "/"
      });
      expect(pageResponse.statusCode).toBe(200);
      expect(pageResponse.body).toContain('id="qgame-interactables"');
    } finally {
      await server.close();
    }
  });
});

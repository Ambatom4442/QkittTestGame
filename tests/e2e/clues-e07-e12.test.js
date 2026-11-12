import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { buildServer } from "../../server/src/buildServer.js";
import { closeDatabase, openDatabase } from "../../server/src/db/sqlite.js";

const tempDirectories = [];

afterEach(() => {
  for (const directory of tempDirectories.splice(0, tempDirectories.length)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("clues-e07-e12", () => {
  it("collects all L-06 interaction clues through the events API flow", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-clues-e07-e12-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db, testModeEnabled: true });

    try {
      const profileResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Watson" }
      });
      const profile = profileResponse.json();

      const gameResponse = await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 2, caseId: "speckled-band" }
      });
      const game = gameResponse.json();

      const sceneResponse = await server.inject({
        method: "GET",
        url: "/api/scenes/L-06"
      });
      expect(sceneResponse.statusCode).toBe(200);

      const scene = sceneResponse.json();
      const clueIds = [];

      for (const interactable of scene.interactables) {
        const response = await server.inject({
          method: "POST",
          url: `/api/games/${game.id}/interact`,
          payload: {
            sceneId: "L-06",
            objectId: interactable.objectId,
            action: interactable.action
          }
        });

        expect(response.statusCode).toBe(200);
        const payload = response.json();
        clueIds.push(payload.clueId);
      }

      expect(clueIds).toEqual(["E-07", "E-09", "E-10", "E-11", "E-12"]);

      const saveSlotsResponse = await server.inject({
        method: "GET",
        url: `/api/profiles/${profile.id}/saves`
      });
      expect(saveSlotsResponse.statusCode).toBe(200);
      expect(saveSlotsResponse.json()).toMatchObject({
        saveSlots: [
          {
            id: game.id,
            clues: ["E-07", "E-09", "E-10", "E-11", "E-12"]
          }
        ]
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

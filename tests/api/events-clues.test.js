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

describe("events-clues", () => {
  it("grants L-06 clues E-07 to E-12 from interaction events", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-events-clues-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db });

    try {
      const profileResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Sherlock" }
      });
      const profile = profileResponse.json();

      const gameResponse = await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 1, caseId: "speckled-band" }
      });
      const game = gameResponse.json();

      const interactions = [
        { objectId: "barred-shutters", action: "inspect", clueId: "E-07" },
        { objectId: "bell-pull", action: "pull", clueId: "E-09" },
        { objectId: "ventilator", action: "inspect", clueId: "E-10" },
        { objectId: "bed-frame", action: "inspect", clueId: "E-11" },
        { objectId: "bell-wire", action: "inspect", clueId: "E-12" }
      ];

      let latest = null;
      for (const interaction of interactions) {
        const response = await server.inject({
          method: "POST",
          url: `/api/games/${game.id}/interact`,
          payload: {
            sceneId: "L-06",
            objectId: interaction.objectId,
            action: interaction.action
          }
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject({
          gameId: game.id,
          sceneId: "L-06",
          clueId: interaction.clueId,
          alreadyCollected: false
        });

        latest = response.json();
      }

      expect(latest?.clues).toEqual(["E-07", "E-09", "E-10", "E-11", "E-12"]);

      const duplicateResponse = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/interact`,
        payload: {
          sceneId: "L-06",
          objectId: "bell-pull",
          action: "pull"
        }
      });

      expect(duplicateResponse.statusCode).toBe(200);
      expect(duplicateResponse.json()).toMatchObject({
        clueId: "E-09",
        alreadyCollected: true,
        clues: ["E-07", "E-09", "E-10", "E-11", "E-12"]
      });

      const resumeResponse = await server.inject({
        method: "GET",
        url: `/api/games/${game.id}/resume`
      });

      expect(resumeResponse.statusCode).toBe(200);
      expect(resumeResponse.json()).toMatchObject({
        id: game.id,
        sceneId: "L-06",
        clues: ["E-07", "E-09", "E-10", "E-11", "E-12"]
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

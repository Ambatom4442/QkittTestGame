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

describe("deductions", () => {
  it("validates D-03 and D-06 clue links server-side", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-deductions-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db });

    try {
      const profileResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Holmes" }
      });
      const profile = profileResponse.json();

      const gameResponse = await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 1, caseId: "speckled-band" }
      });
      const game = gameResponse.json();

      const d06Interactions = [
        { objectId: "bell-pull", action: "pull" },
        { objectId: "ventilator", action: "inspect" },
        { objectId: "bed-frame", action: "inspect" },
        { objectId: "bell-wire", action: "inspect" }
      ];

      for (const interaction of d06Interactions) {
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
      }

      const wrongD06Response = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/deductions`,
        payload: {
          deductionId: "D-06",
          clueIds: ["E-09", "E-10"]
        }
      });

      expect(wrongD06Response.statusCode).toBe(200);
      expect(wrongD06Response.json()).toEqual({
        gameId: game.id,
        deductionId: "D-06",
        result: "incorrect",
        hintId: "H-D06-ROUTE"
      });

      const correctD06Response = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/deductions`,
        payload: {
          deductionId: "D-06",
          clueIds: ["E-12", "E-11", "E-10", "E-09"]
        }
      });

      expect(correctD06Response.statusCode).toBe(200);
      expect(correctD06Response.json()).toEqual({
        gameId: game.id,
        deductionId: "D-06",
        result: "correct",
        alreadyUnlocked: false,
        deductions: ["D-06"]
      });

      const repeatD06Response = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/deductions`,
        payload: {
          deductionId: "D-06",
          clueIds: ["E-09", "E-10", "E-11", "E-12"]
        }
      });

      expect(repeatD06Response.statusCode).toBe(200);
      expect(repeatD06Response.json()).toMatchObject({
        deductionId: "D-06",
        result: "correct",
        alreadyUnlocked: true,
        deductions: ["D-06"]
      });

      const current = db
        .prepare("SELECT position_json FROM save_slots WHERE id = ?")
        .get(game.id);
      const state = JSON.parse(current.position_json);
      state.clues = ["E-07", "E-08", ...state.clues.filter((clueId) => clueId !== "E-07")];
      db.prepare("UPDATE save_slots SET position_json = ? WHERE id = ?")
        .run(JSON.stringify(state), game.id);

      const correctD03Response = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/deductions`,
        payload: {
          deductionId: "D-03",
          clueIds: ["E-08", "E-07"]
        }
      });

      expect(correctD03Response.statusCode).toBe(200);
      expect(correctD03Response.json()).toEqual({
        gameId: game.id,
        deductionId: "D-03",
        result: "correct",
        alreadyUnlocked: false,
        deductions: ["D-06", "D-03"]
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

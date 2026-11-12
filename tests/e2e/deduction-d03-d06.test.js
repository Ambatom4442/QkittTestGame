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

describe("deduction-d03-d06", () => {
  it("returns a hint for wrong D-03 links and unlocks D-06 with the full clue set", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-deduction-d03-d06-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db, testModeEnabled: true });

    try {
      const profileResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Helen" }
      });
      const profile = profileResponse.json();

      const gameResponse = await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 3, caseId: "speckled-band" }
      });
      const game = gameResponse.json();

      await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/interact`,
        payload: {
          sceneId: "L-06",
          objectId: "barred-shutters",
          action: "inspect"
        }
      });

      const wrongD03Response = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/deductions`,
        payload: {
          deductionId: "D-03",
          clueIds: ["E-07"]
        }
      });

      expect(wrongD03Response.statusCode).toBe(200);
      expect(wrongD03Response.json()).toEqual({
        gameId: game.id,
        deductionId: "D-03",
        result: "incorrect",
        hintId: "H-D03-SHUTTERS"
      });

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

      const d06Response = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/deductions`,
        payload: {
          deductionId: "D-06",
          clueIds: ["E-09", "E-10", "E-11", "E-12"]
        }
      });

      expect(d06Response.statusCode).toBe(200);
      expect(d06Response.json()).toEqual({
        gameId: game.id,
        deductionId: "D-06",
        result: "correct",
        alreadyUnlocked: false,
        deductions: ["D-06"]
      });

      const resumeResponse = await server.inject({
        method: "GET",
        url: `/api/games/${game.id}/resume`
      });

      expect(resumeResponse.statusCode).toBe(200);
      expect(resumeResponse.json()).toMatchObject({
        id: game.id,
        clues: ["E-07", "E-09", "E-10", "E-11", "E-12"],
        deductions: ["D-06"]
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

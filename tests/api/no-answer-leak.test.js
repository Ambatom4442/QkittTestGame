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

describe("no-answer-leak", () => {
  it("returns hint ids for wrong links without leaking required clue ids", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-no-answer-leak-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db });

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

      await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/interact`,
        payload: {
          sceneId: "L-05",
          objectId: "iron-safe",
          action: "inspect"
        }
      });

      const wrongD06 = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/deductions`,
        payload: {
          deductionId: "D-06",
          clueIds: ["E-14"]
        }
      });

      expect(wrongD06.statusCode).toBe(200);
      expect(wrongD06.json()).toEqual({
        gameId: game.id,
        deductionId: "D-06",
        result: "incorrect",
        hintId: "H-D06-ROUTE"
      });

      const leakCheck = JSON.stringify(wrongD06.json());
      expect(leakCheck).not.toContain("requiredClueIds");
      expect(leakCheck).not.toContain("E-09");
      expect(leakCheck).not.toContain("E-10");
      expect(leakCheck).not.toContain("E-11");
      expect(leakCheck).not.toContain("E-12");

      await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/interact`,
        payload: {
          sceneId: "L-06",
          objectId: "barred-shutters",
          action: "inspect"
        }
      });

      const wrongD03 = await server.inject({
        method: "POST",
        url: `/api/games/${game.id}/deductions`,
        payload: {
          deductionId: "D-03",
          clueIds: ["E-07"]
        }
      });

      expect(wrongD03.statusCode).toBe(200);
      expect(wrongD03.json()).toEqual({
        gameId: game.id,
        deductionId: "D-03",
        result: "incorrect",
        hintId: "H-D03-SHUTTERS"
      });
      expect(JSON.stringify(wrongD03.json())).not.toContain("E-08");
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

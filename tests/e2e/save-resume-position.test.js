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

describe("save-resume-position", () => {
  it("resumes a saved scene and position after reload", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-save-resume-"));
    tempDirectories.push(tempDirectory);

    const dbPath = join(tempDirectory, "qgame.db");

    const firstDb = openDatabase({ dbPath });
    const firstServer = buildServer({ logger: false, db: firstDb });

    let gameId;

    try {
      const createProfileResponse = await firstServer.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Sherlock" }
      });
      const profile = createProfileResponse.json();

      const createGameResponse = await firstServer.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 1, caseId: "speckled-band" }
      });

      gameId = createGameResponse.json().id;

      const autosaveResponse = await firstServer.inject({
        method: "PUT",
        url: `/api/games/${gameId}/position`,
        payload: {
          sceneId: "L-06",
          transform: { x: 1.25, y: 1.6, z: -2.75 }
        }
      });

      expect(autosaveResponse.statusCode).toBe(200);
      expect(autosaveResponse.json()).toMatchObject({
        id: gameId,
        sceneId: "L-06",
        transform: { x: 1.25, y: 1.6, z: -2.75 }
      });
    } finally {
      await firstServer.close();
      closeDatabase(firstDb);
    }

    const secondDb = openDatabase({ dbPath });
    const secondServer = buildServer({ logger: false, db: secondDb });

    try {
      const resumeResponse = await secondServer.inject({
        method: "GET",
        url: `/api/games/${gameId}/resume`
      });

      expect(resumeResponse.statusCode).toBe(200);
      expect(resumeResponse.json()).toMatchObject({
        id: gameId,
        caseId: "speckled-band",
        sceneId: "L-06",
        transform: { x: 1.25, y: 1.6, z: -2.75 }
      });
    } finally {
      await secondServer.close();
      closeDatabase(secondDb);
    }
  });
});

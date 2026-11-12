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

describe("autosave", () => {
  it("autosaves position for an existing game slot", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-autosave-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db });

    try {
      const createProfileResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Helen" }
      });
      const profile = createProfileResponse.json();

      const createGameResponse = await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 3, caseId: "speckled-band" }
      });
      const game = createGameResponse.json();

      const autosaveResponse = await server.inject({
        method: "PUT",
        url: `/api/games/${game.id}/position`,
        payload: {
          sceneId: "L-06",
          transform: { x: 10.5, y: 0.0, z: -3.25 }
        }
      });

      expect(autosaveResponse.statusCode).toBe(200);
      expect(autosaveResponse.json()).toMatchObject({
        id: game.id,
        slot: 3,
        caseId: "speckled-band",
        sceneId: "L-06",
        transform: { x: 10.5, y: 0, z: -3.25 }
      });

      const listSavesResponse = await server.inject({
        method: "GET",
        url: `/api/profiles/${profile.id}/saves`
      });

      expect(listSavesResponse.statusCode).toBe(200);
      expect(listSavesResponse.json()).toMatchObject({
        saveSlots: [
          {
            id: game.id,
            slot: 3,
            sceneId: "L-06",
            transform: { x: 10.5, y: 0, z: -3.25 }
          }
        ]
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

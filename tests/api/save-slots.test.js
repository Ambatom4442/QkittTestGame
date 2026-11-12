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

describe("save-slots", () => {
  it("lists slots for a profile", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-save-slots-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db });

    try {
      const createProfileResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Sherlock" }
      });
      const profile = createProfileResponse.json();

      await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 2, caseId: "speckled-band" }
      });

      const listSavesResponse = await server.inject({
        method: "GET",
        url: `/api/profiles/${profile.id}/saves`
      });

      expect(listSavesResponse.statusCode).toBe(200);
      expect(listSavesResponse.json()).toMatchObject({
        saveSlots: [
          {
            profileId: profile.id,
            slot: 2,
            caseId: "speckled-band",
            sceneId: null,
            transform: null
          }
        ]
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

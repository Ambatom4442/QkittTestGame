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

describe("games", () => {
  it("creates a game slot and continues it on a repeated request", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-games-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db });

    try {
      const createProfileResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Dr Watson" }
      });
      const profile = createProfileResponse.json();

      const createGameResponse = await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 1, caseId: "speckled-band" }
      });

      expect(createGameResponse.statusCode).toBe(201);
      expect(createGameResponse.json()).toMatchObject({
        profileId: profile.id,
        slot: 1,
        caseId: "speckled-band",
        sceneId: null,
        transform: null
      });

      const continueGameResponse = await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 1, caseId: "speckled-band" }
      });

      expect(continueGameResponse.statusCode).toBe(200);
      expect(continueGameResponse.json()).toMatchObject({
        id: createGameResponse.json().id,
        profileId: profile.id,
        slot: 1,
        caseId: "speckled-band"
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

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

describe("profiles", () => {
  it("creates a profile and returns it from the list", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-profiles-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db });

    try {
      const createResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "  Helen Stoner  " }
      });

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.json()).toMatchObject({
        id: 1,
        name: "Helen Stoner"
      });

      const listResponse = await server.inject({ method: "GET", url: "/api/profiles" });

      expect(listResponse.statusCode).toBe(200);
      expect(listResponse.json()).toMatchObject({
        profiles: [
          {
            id: 1,
            name: "Helen Stoner"
          }
        ]
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });

  it("rejects creating a profile with an empty name", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-profiles-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db });

    try {
      const response = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "   " }
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        code: "INVALID_PROFILE_NAME",
        message: "Profile name is required"
      });
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

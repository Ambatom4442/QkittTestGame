import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { closeDatabase, getAppliedMigrations, openDatabase } from "../../server/src/db/sqlite.js";

const tempDirectories = [];

afterEach(() => {
  for (const directory of tempDirectories.splice(0, tempDirectories.length)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("migrations", () => {
  it("applies numbered migrations in ascending order", () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-migrations-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });

    try {
      expect(getAppliedMigrations(db)).toEqual([
        { version: 1, name: "001_create_profiles.sql" },
        { version: 2, name: "002_create_save_slots.sql" }
      ]);

      const profileTable = db
        .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
        .get("profiles");
      const saveSlotsTable = db
        .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
        .get("save_slots");

      expect(profileTable).toEqual({ name: "profiles" });
      expect(saveSlotsTable).toEqual({ name: "save_slots" });
    } finally {
      closeDatabase(db);
    }
  });
});

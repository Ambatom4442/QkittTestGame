import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { closeDatabase, getJournalMode, openDatabase } from "../../server/src/db/sqlite.js";

const tempDirectories = [];

afterEach(() => {
  for (const directory of tempDirectories.splice(0, tempDirectories.length)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("db.wal", () => {
  it("enables WAL mode for the SQLite database", () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-db-wal-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });

    try {
      expect(getJournalMode(db).toLowerCase()).toBe("wal");
    } finally {
      closeDatabase(db);
    }
  });
});

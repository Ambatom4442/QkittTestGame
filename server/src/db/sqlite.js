import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const MIGRATION_PATTERN = /^(\d+)_.*\.sql$/;

function listMigrationFiles(migrationsDir) {
  return readdirSync(migrationsDir)
    .filter((name) => MIGRATION_PATTERN.test(name))
    .sort((left, right) => left.localeCompare(right, "en"));
}

function ensureMigrationTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL
    )
  `);
}

function appliedMigrationVersions(db) {
  return new Set(
    db.prepare("SELECT version FROM schema_migrations ORDER BY version").all().map((row) => row.version)
  );
}

function applyMigration(db, migrationPath, version, name) {
  const sql = readFileSync(migrationPath, "utf8");

  db.exec("BEGIN");
  try {
    db.exec(sql);
    db.prepare(
      "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)"
    ).run(version, name, new Date().toISOString());
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw new Error(`Failed to apply migration ${name}: ${error.message}`);
  }
}

function applyMigrations(db, migrationsDir) {
  const migrationFiles = listMigrationFiles(migrationsDir);
  const alreadyApplied = appliedMigrationVersions(db);

  for (const name of migrationFiles) {
    const match = name.match(MIGRATION_PATTERN);
    if (!match) {
      continue;
    }

    const version = Number.parseInt(match[1], 10);
    if (alreadyApplied.has(version)) {
      continue;
    }

    applyMigration(db, resolve(migrationsDir, name), version, name);
  }
}

export function openDatabase({
  dbPath = "data/qgame.db",
  migrationsDir = "server/migrations"
} = {}) {
  const resolvedDbPath = resolve(dbPath);
  const resolvedMigrationsDir = resolve(migrationsDir);

  mkdirSync(dirname(resolvedDbPath), { recursive: true });

  const db = new DatabaseSync(resolvedDbPath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  ensureMigrationTable(db);
  applyMigrations(db, resolvedMigrationsDir);

  return db;
}

export function closeDatabase(db) {
  db.close();
}

export function getJournalMode(db) {
  const row = db.prepare("PRAGMA journal_mode;").get();
  return row?.journal_mode ?? "unknown";
}

export function getAppliedMigrations(db) {
  return db
    .prepare("SELECT version, name FROM schema_migrations ORDER BY version")
    .all()
    .map((row) => ({ version: row.version, name: row.name }));
}

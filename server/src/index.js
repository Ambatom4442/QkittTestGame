import { buildServer } from "./buildServer.js";
import { closeDatabase, openDatabase } from "./db/sqlite.js";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const host = process.env.HOST ?? "0.0.0.0";
const staticRoot = process.env.QGAME_CLIENT_DIST ?? "client/build";
const dbPath = process.env.QGAME_DB_PATH ?? "data/qgame.db";
const migrationsDir = process.env.QGAME_MIGRATIONS_DIR ?? "server/migrations";

const db = openDatabase({ dbPath, migrationsDir });
const server = buildServer({ logger: true, staticRoot, db });

const shutdown = async (exitCode = 0) => {
  try {
    await server.close();
  } finally {
    closeDatabase(db);
    process.exit(exitCode);
  }
};

process.on("SIGINT", () => {
  void shutdown(0);
});
process.on("SIGTERM", () => {
  void shutdown(0);
});

server
  .listen({ host, port })
  .then(() => {
    server.log.info(`Q-Game server running at http://${host}:${port}`);
  })
  .catch(async (error) => {
    server.log.error(error);
    await shutdown(1);
  });

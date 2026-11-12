import { buildServer } from "./buildServer.js";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const host = process.env.HOST ?? "0.0.0.0";
const staticRoot = process.env.QGAME_CLIENT_DIST ?? "client/build";

const server = buildServer({ logger: true, staticRoot });

server
  .listen({ host, port })
  .then(() => {
    server.log.info(`Q-Game server running at http://${host}:${port}`);
  })
  .catch(async (error) => {
    server.log.error(error);
    await server.close();
    process.exit(1);
  });


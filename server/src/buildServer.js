import Fastify from "fastify";
import { access, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function contentTypeFor(filePath) {
  return CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
}

function resolveClientPath(staticRoot, rawPath) {
  const requestPath = decodeURIComponent((rawPath ?? "/").split("?")[0]);
  const normalizedPath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const root = resolve(staticRoot);
  const candidate = resolve(root, normalizedPath);

  if (!candidate.toLowerCase().startsWith(root.toLowerCase())) {
    return null;
  }

  return candidate;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function formatProfile(row) {
  return {
    id: Number(row.id),
    name: row.name,
    createdAt: row.created_at
  };
}

export function buildServer({ logger = false, staticRoot = "client/build", db = null } = {}) {
  const app = Fastify({ logger });

  app.get("/api/health", async () => ({ status: "ok" }));

  app.get("/api/profiles", async (request, reply) => {
    if (!db) {
      return reply.code(503).send({ code: "DB_UNAVAILABLE", message: "Database is not available" });
    }

    const profiles = db
      .prepare("SELECT id, name, created_at FROM profiles ORDER BY id ASC")
      .all()
      .map((row) => formatProfile(row));

    return { profiles };
  });

  app.post("/api/profiles", async (request, reply) => {
    if (!db) {
      return reply.code(503).send({ code: "DB_UNAVAILABLE", message: "Database is not available" });
    }

    const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
    if (!name) {
      return reply.code(400).send({ code: "INVALID_PROFILE_NAME", message: "Profile name is required" });
    }

    const createdAt = new Date().toISOString();
    const insertResult = db
      .prepare("INSERT INTO profiles (name, created_at) VALUES (?, ?)")
      .run(name, createdAt);
    const row = db
      .prepare("SELECT id, name, created_at FROM profiles WHERE id = ?")
      .get(insertResult.lastInsertRowid);

    return reply.code(201).send(formatProfile(row));
  });

  app.get("/*", async (request, reply) => {
    const pathFromRequest = resolveClientPath(staticRoot, request.raw.url ?? "/");
    if (!pathFromRequest) {
      return reply.code(400).send({ code: "INVALID_PATH", message: "Invalid asset path" });
    }

    const selectedPath = (await exists(pathFromRequest))
      ? pathFromRequest
      : resolve(staticRoot, "index.html");

    if (!(await exists(selectedPath))) {
      return reply.code(404).send({ code: "CLIENT_BUILD_MISSING", message: "Built client not found" });
    }

    const body = await readFile(selectedPath);
    return reply
      .header("content-type", contentTypeFor(selectedPath))
      .send(body);
  });

  return app;
}

import Fastify from "fastify";
import { access, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

const THREE_MODULE_PATH = fileURLToPath(new URL("../../node_modules/three/build/three.module.js", import.meta.url));

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

function parseSlotName(slotName) {
  const match = /^slot-(\d+)$/.exec(slotName);
  if (!match) {
    throw new Error(`Invalid slot name: ${slotName}`);
  }

  return Number.parseInt(match[1], 10);
}

function parseSlotState(positionJson) {
  if (!positionJson) {
    return { caseId: null, transform: null };
  }

  const parsed = JSON.parse(positionJson);
  const caseId = typeof parsed.caseId === "string" ? parsed.caseId : null;
  const transform = parsed.transform && typeof parsed.transform === "object" ? parsed.transform : null;

  return { caseId, transform };
}

function formatSaveSlot(row) {
  const state = parseSlotState(row.position_json);

  return {
    id: Number(row.id),
    profileId: Number(row.profile_id),
    slot: parseSlotName(row.slot_name),
    caseId: state.caseId,
    sceneId: row.scene_id,
    transform: state.transform,
    updatedAt: row.updated_at
  };
}

function sendDbUnavailable(reply) {
  return reply.code(503).send({ code: "DB_UNAVAILABLE", message: "Database is not available" });
}

export function buildServer({ logger = false, staticRoot = "client/build", db = null, testModeEnabled = false } = {}) {
  const app = Fastify({ logger });

  app.get("/api/health", async () => ({ status: "ok" }));

  app.get("/api/client-config", async () => ({ testModeEnabled }));

  app.get("/vendor/three.module.js", async (request, reply) => {
    if (!(await exists(THREE_MODULE_PATH))) {
      return reply.code(404).send({ code: "THREE_MODULE_MISSING", message: "Three.js module not found" });
    }

    const body = await readFile(THREE_MODULE_PATH);
    return reply.header("content-type", "text/javascript; charset=utf-8").send(body);
  });

  app.get("/api/profiles", async (request, reply) => {
    if (!db) {
      return sendDbUnavailable(reply);
    }

    const profiles = db
      .prepare("SELECT id, name, created_at FROM profiles ORDER BY id ASC")
      .all()
      .map((row) => formatProfile(row));

    return { profiles };
  });

  app.post("/api/profiles", async (request, reply) => {
    if (!db) {
      return sendDbUnavailable(reply);
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

  app.get("/api/profiles/:id/saves", async (request, reply) => {
    if (!db) {
      return sendDbUnavailable(reply);
    }

    const profileId = Number.parseInt(request.params?.id ?? "", 10);
    if (!Number.isInteger(profileId) || profileId <= 0) {
      return reply.code(400).send({ code: "INVALID_PROFILE_ID", message: "Profile id must be a positive integer" });
    }

    const saveSlots = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE profile_id = ? ORDER BY slot_name ASC")
      .all(profileId)
      .map((row) => formatSaveSlot(row));

    return { saveSlots };
  });

  app.post("/api/games", async (request, reply) => {
    if (!db) {
      return sendDbUnavailable(reply);
    }

    const profileId = Number.parseInt(`${request.body?.profileId ?? ""}`, 10);
    const slot = Number.parseInt(`${request.body?.slot ?? ""}`, 10);
    const caseId = typeof request.body?.caseId === "string" ? request.body.caseId.trim() : "";

    if (!Number.isInteger(profileId) || profileId <= 0 || !Number.isInteger(slot) || slot <= 0 || !caseId) {
      return reply.code(400).send({ code: "INVALID_GAME_REQUEST", message: "profileId, slot, and caseId are required" });
    }

    const slotName = `slot-${slot}`;
    const now = new Date().toISOString();

    const existing = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE profile_id = ? AND slot_name = ?")
      .get(profileId, slotName);

    if (existing) {
      const existingState = parseSlotState(existing.position_json);
      const shouldResetProgress = existingState.caseId !== caseId;
      const nextPositionJson = shouldResetProgress
        ? JSON.stringify({ caseId, transform: null })
        : JSON.stringify({ caseId, transform: existingState.transform });
      const nextSceneId = shouldResetProgress ? null : existing.scene_id;

      db.prepare("UPDATE save_slots SET scene_id = ?, position_json = ?, updated_at = ? WHERE id = ?")
        .run(nextSceneId, nextPositionJson, now, existing.id);

      const row = db
        .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
        .get(existing.id);

      return reply.code(200).send(formatSaveSlot(row));
    }

    const positionJson = JSON.stringify({ caseId, transform: null });
    const insertResult = db
      .prepare("INSERT INTO save_slots (profile_id, slot_name, scene_id, position_json, updated_at) VALUES (?, ?, ?, ?, ?)")
      .run(profileId, slotName, null, positionJson, now);
    const row = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
      .get(insertResult.lastInsertRowid);

    return reply.code(201).send(formatSaveSlot(row));
  });


  app.get("/api/games/:id/resume", async (request, reply) => {
    if (!db) {
      return sendDbUnavailable(reply);
    }

    const gameId = Number.parseInt(request.params?.id ?? "", 10);
    if (!Number.isInteger(gameId) || gameId <= 0) {
      return reply.code(400).send({ code: "INVALID_GAME_ID", message: "Game id must be a positive integer" });
    }

    const row = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
      .get(gameId);

    if (!row) {
      return reply.code(404).send({ code: "GAME_NOT_FOUND", message: "Game not found" });
    }

    return formatSaveSlot(row);
  });
  app.put("/api/games/:id/position", async (request, reply) => {
    if (!db) {
      return sendDbUnavailable(reply);
    }

    const gameId = Number.parseInt(request.params?.id ?? "", 10);
    const sceneId = typeof request.body?.sceneId === "string" ? request.body.sceneId.trim() : "";
    const transform = request.body?.transform;

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return reply.code(400).send({ code: "INVALID_GAME_ID", message: "Game id must be a positive integer" });
    }

    if (!sceneId || !transform || typeof transform !== "object" || Array.isArray(transform)) {
      return reply
        .code(400)
        .send({ code: "INVALID_POSITION_PAYLOAD", message: "sceneId and transform are required" });
    }

    const existing = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
      .get(gameId);

    if (!existing) {
      return reply.code(404).send({ code: "GAME_NOT_FOUND", message: "Game not found" });
    }

    const existingState = parseSlotState(existing.position_json);
    const updatedAt = new Date().toISOString();
    const positionJson = JSON.stringify({ caseId: existingState.caseId, transform });

    db.prepare("UPDATE save_slots SET scene_id = ?, position_json = ?, updated_at = ? WHERE id = ?")
      .run(sceneId, positionJson, updatedAt, gameId);

    const row = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
      .get(gameId);

    return formatSaveSlot(row);
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


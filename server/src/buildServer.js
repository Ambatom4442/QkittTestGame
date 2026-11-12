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

const THREE_BUILD_ROOT = fileURLToPath(new URL("../../node_modules/three/build/", import.meta.url));

const CLUE_DEFINITIONS = Object.freeze({
  "E-06": Object.freeze({ id: "E-06", title: "Repairs not needed", text: "A pretext to move Helen into Julia's room." }),
  "E-07": Object.freeze({ id: "E-07", title: "Barred shutters", text: "Nobody entered by the window." }),
  "E-09": Object.freeze({ id: "E-09", title: "Dummy bell-pull", text: "Rings nothing; hooked above the ventilator." }),
  "E-10": Object.freeze({ id: "E-10", title: "Ventilator into next room", text: "The rooms connect through a small opening." }),
  "E-11": Object.freeze({ id: "E-11", title: "Bed clamped", text: "The bed is fixed under the cord." }),
  "E-12": Object.freeze({ id: "E-12", title: "New bell-pull and ventilator", text: "Installed shortly before Julia died." }),
  "E-14": Object.freeze({ id: "E-14", title: "Iron safe", text: "Something in the safe matters." }),
  "E-15": Object.freeze({ id: "E-15", title: "Saucer of milk", text: "Food placed for an animal." })
});

const DEDUCTION_RULES = Object.freeze({
  "D-03": Object.freeze({
    id: "D-03",
    requiredClueIds: Object.freeze(["E-07", "E-08"]),
    hintId: "H-D03-SHUTTERS"
  }),
  "D-06": Object.freeze({
    id: "D-06",
    requiredClueIds: Object.freeze(["E-09", "E-10", "E-11", "E-12"]),
    hintId: "H-D06-ROUTE"
  })
});

const SCENE_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "L-05",
    chapterId: "C-04",
    title: "Roylott's bedroom",
    interactables: Object.freeze([
      Object.freeze({ objectId: "iron-safe", action: "inspect", clueId: "E-14", prompt: "Inspect iron safe" }),
      Object.freeze({ objectId: "saucer-of-milk", action: "inspect", clueId: "E-15", prompt: "Inspect saucer of milk" })
    ])
  }),
  Object.freeze({
    id: "L-06",
    chapterId: "C-04",
    title: "Julia's bedroom",
    interactables: Object.freeze([
      Object.freeze({ objectId: "barred-shutters", action: "inspect", clueId: "E-07", prompt: "Inspect barred shutters" }),
      Object.freeze({ objectId: "bell-pull", action: "pull", clueId: "E-09", prompt: "Pull bell-pull" }),
      Object.freeze({ objectId: "ventilator", action: "inspect", clueId: "E-10", prompt: "Inspect ventilator" }),
      Object.freeze({ objectId: "bed-frame", action: "inspect", clueId: "E-11", prompt: "Inspect bed frame" }),
      Object.freeze({ objectId: "bell-wire", action: "inspect", clueId: "E-12", prompt: "Inspect bell wire" })
    ])
  }),
  Object.freeze({
    id: "L-07",
    chapterId: "C-04",
    title: "Helen's bedroom",
    interactables: Object.freeze([
      Object.freeze({ objectId: "repair-wall", action: "inspect", clueId: "E-06", prompt: "Inspect repaired wall" })
    ])
  })
]);

function contentTypeFor(filePath) {
  return CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
}

function resolveThreeModulePath(rawPath) {
  const requestPath = decodeURIComponent((rawPath ?? "").split("?")[0]).replace(/^\/+/, "");
  if (!requestPath) {
    return null;
  }

  const root = resolve(THREE_BUILD_ROOT);
  const candidate = resolve(root, requestPath);
  if (!candidate.toLowerCase().startsWith(root.toLowerCase())) {
    return null;
  }

  return candidate;
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

function normalizeClues(clues) {
  if (!Array.isArray(clues)) {
    return [];
  }

  return clues
    .filter((value) => typeof value === "string" && value.length > 0)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function normalizeDeductions(deductions) {
  if (!Array.isArray(deductions)) {
    return [];
  }

  return deductions
    .filter((value) => typeof value === "string" && value.length > 0)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function parseSlotState(positionJson) {
  if (!positionJson) {
    return { caseId: null, transform: null, clues: [], deductions: [] };
  }

  const parsed = JSON.parse(positionJson);
  const caseId = typeof parsed.caseId === "string" ? parsed.caseId : null;
  const transform = parsed.transform && typeof parsed.transform === "object" ? parsed.transform : null;
  const clues = normalizeClues(parsed.clues);
  const deductions = normalizeDeductions(parsed.deductions);

  return { caseId, transform, clues, deductions };
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
    clues: state.clues,
    deductions: state.deductions,
    updatedAt: row.updated_at
  };
}

function sendDbUnavailable(reply) {
  return reply.code(503).send({ code: "DB_UNAVAILABLE", message: "Database is not available" });
}

function findSceneInteractable(sceneId, objectId, action) {
  const scene = SCENE_DEFINITIONS.find((candidate) => candidate.id === sceneId);
  if (!scene) {
    return null;
  }

  return scene.interactables.find(
    (interactable) => interactable.objectId === objectId && interactable.action === action
  ) ?? null;
}
function formatCasebookClue(clueId) {
  const known = CLUE_DEFINITIONS[clueId];
  if (known) {
    return { id: known.id, title: known.title, text: known.text };
  }

  return { id: clueId, title: clueId, text: "" };
}

function formatCasebook(state) {
  return state.clues.map((clueId) => formatCasebookClue(clueId));
}

function areSameIdSet(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
}

function formatScene(scene) {
  return {
    id: scene.id,
    chapterId: scene.chapterId,
    title: scene.title,
    interactables: scene.interactables.map((interactable) => ({
      objectId: interactable.objectId,
      action: interactable.action,
      clueId: interactable.clueId,
      prompt: interactable.prompt
    }))
  };
}
export function buildServer({ logger = false, staticRoot = "client/build", db = null, testModeEnabled = false } = {}) {
  const app = Fastify({ logger });

  app.get("/api/health", async () => ({ status: "ok" }));

  app.get("/api/client-config", async () => ({ testModeEnabled }));

  app.get("/api/chapters/:id/scenes", async (request, reply) => {
    const chapterId = String(request.params?.id ?? "").trim();
    if (!chapterId) {
      return reply.code(400).send({ code: "INVALID_CHAPTER_ID", message: "Chapter id is required" });
    }

    const scenes = SCENE_DEFINITIONS
      .filter((scene) => scene.chapterId === chapterId)
      .map((scene) => formatScene(scene));

    if (scenes.length === 0) {
      return reply.code(404).send({ code: "CHAPTER_NOT_FOUND", message: "Chapter not found" });
    }

    return { chapterId, scenes };
  });

  app.get("/api/scenes/:id", async (request, reply) => {
    const sceneId = String(request.params?.id ?? "").trim();
    if (!sceneId) {
      return reply.code(400).send({ code: "INVALID_SCENE_ID", message: "Scene id is required" });
    }

    const scene = SCENE_DEFINITIONS.find((candidate) => candidate.id === sceneId);
    if (!scene) {
      return reply.code(404).send({ code: "SCENE_NOT_FOUND", message: "Scene not found" });
    }

    return formatScene(scene);
  });
  app.get("/vendor/:moduleName", async (request, reply) => {
    const requestedPath = resolveThreeModulePath(request.params?.moduleName);
    if (!requestedPath || extname(requestedPath) !== ".js") {
      return reply.code(404).send({ code: "THREE_MODULE_MISSING", message: "Three.js module not found" });
    }

    if (!(await exists(requestedPath))) {
      return reply.code(404).send({ code: "THREE_MODULE_MISSING", message: "Three.js module not found" });
    }

    const body = await readFile(requestedPath);
    return reply.header("content-type", contentTypeFor(requestedPath)).send(body);
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
        ? JSON.stringify({ caseId, transform: null, clues: [], deductions: [] })
        : JSON.stringify({
          caseId,
          transform: existingState.transform,
          clues: existingState.clues,
          deductions: existingState.deductions
        });
      const nextSceneId = shouldResetProgress ? null : existing.scene_id;

      db.prepare("UPDATE save_slots SET scene_id = ?, position_json = ?, updated_at = ? WHERE id = ?")
        .run(nextSceneId, nextPositionJson, now, existing.id);

      const row = db
        .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
        .get(existing.id);

      return reply.code(200).send(formatSaveSlot(row));
    }

    const positionJson = JSON.stringify({ caseId, transform: null, clues: [], deductions: [] });
    const insertResult = db
      .prepare("INSERT INTO save_slots (profile_id, slot_name, scene_id, position_json, updated_at) VALUES (?, ?, ?, ?, ?)")
      .run(profileId, slotName, null, positionJson, now);
    const row = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
      .get(insertResult.lastInsertRowid);

    return reply.code(201).send(formatSaveSlot(row));
  });

  app.post("/api/games/:id/interact", async (request, reply) => {
    if (!db) {
      return sendDbUnavailable(reply);
    }

    const gameId = Number.parseInt(request.params?.id ?? "", 10);
    const sceneId = typeof request.body?.sceneId === "string" ? request.body.sceneId.trim() : "";
    const objectId = typeof request.body?.objectId === "string" ? request.body.objectId.trim() : "";
    const action = typeof request.body?.action === "string" ? request.body.action.trim() : "";

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return reply.code(400).send({ code: "INVALID_GAME_ID", message: "Game id must be a positive integer" });
    }

    if (!sceneId || !objectId || !action) {
      return reply.code(400).send({ code: "INVALID_INTERACTION", message: "sceneId, objectId, and action are required" });
    }

    const interactable = findSceneInteractable(sceneId, objectId, action);
    if (!interactable || !interactable.clueId) {
      return reply.code(404).send({ code: "INTERACTION_NOT_FOUND", message: "Interaction not found" });
    }

    const existing = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
      .get(gameId);

    if (!existing) {
      return reply.code(404).send({ code: "GAME_NOT_FOUND", message: "Game not found" });
    }

    const existingState = parseSlotState(existing.position_json);
    const alreadyCollected = existingState.clues.includes(interactable.clueId);
    const clues = alreadyCollected ? existingState.clues : [...existingState.clues, interactable.clueId];
    const updatedAt = new Date().toISOString();
    const positionJson = JSON.stringify({
      caseId: existingState.caseId,
      transform: existingState.transform,
      clues,
      deductions: existingState.deductions
    });

    db.prepare("UPDATE save_slots SET scene_id = ?, position_json = ?, updated_at = ? WHERE id = ?")
      .run(sceneId, positionJson, updatedAt, gameId);

    return {
      gameId,
      sceneId,
      objectId,
      action,
      clueId: interactable.clueId,
      alreadyCollected,
      clues
    };
  });

  app.get("/api/games/:id/casebook", async (request, reply) => {
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

    const slot = formatSaveSlot(row);
    return {
      gameId: slot.id,
      clues: formatCasebook({ clues: slot.clues })
    };
  });

  app.post("/api/games/:id/deductions", async (request, reply) => {
    if (!db) {
      return sendDbUnavailable(reply);
    }

    const gameId = Number.parseInt(request.params?.id ?? "", 10);
    const deductionId = typeof request.body?.deductionId === "string" ? request.body.deductionId.trim() : "";
    const clueIds = normalizeClues(request.body?.clueIds);

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return reply.code(400).send({ code: "INVALID_GAME_ID", message: "Game id must be a positive integer" });
    }

    if (!deductionId) {
      return reply.code(400).send({ code: "INVALID_DEDUCTION_ID", message: "deductionId is required" });
    }

    if (clueIds.length === 0) {
      return reply.code(400).send({ code: "INVALID_DEDUCTION_CLUES", message: "clueIds must include at least one clue id" });
    }

    const rule = DEDUCTION_RULES[deductionId];
    if (!rule) {
      return reply.code(404).send({ code: "DEDUCTION_NOT_FOUND", message: "Deduction not found" });
    }

    const row = db
      .prepare("SELECT id, profile_id, slot_name, scene_id, position_json, updated_at FROM save_slots WHERE id = ?")
      .get(gameId);

    if (!row) {
      return reply.code(404).send({ code: "GAME_NOT_FOUND", message: "Game not found" });
    }

    const state = parseSlotState(row.position_json);
    if (!clueIds.every((clueId) => state.clues.includes(clueId))) {
      return reply.code(400).send({
        code: "INVALID_DEDUCTION_CLUES",
        message: "Submitted clues must already exist in the casebook"
      });
    }

    if (!areSameIdSet(clueIds, rule.requiredClueIds)) {
      return {
        gameId,
        deductionId,
        result: "incorrect",
        hintId: rule.hintId
      };
    }

    const alreadyUnlocked = state.deductions.includes(deductionId);
    const deductions = alreadyUnlocked ? state.deductions : [...state.deductions, deductionId];
    const positionJson = JSON.stringify({
      caseId: state.caseId,
      transform: state.transform,
      clues: state.clues,
      deductions
    });
    const updatedAt = new Date().toISOString();

    db.prepare("UPDATE save_slots SET position_json = ?, updated_at = ? WHERE id = ?")
      .run(positionJson, updatedAt, gameId);

    return {
      gameId,
      deductionId,
      result: "correct",
      alreadyUnlocked,
      deductions
    };
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
    const positionJson = JSON.stringify({
      caseId: existingState.caseId,
      transform,
      clues: existingState.clues,
      deductions: existingState.deductions
    });

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



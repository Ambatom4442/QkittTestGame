import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateCasePayloads } from "../../content-tools/validate-content.mjs";

const REQUIRED_FILES = ["case.json", "clues.json", "deductions.json"];
const DEFAULT_CASE_ID = "speckled-band";

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function assertString(value, fieldName, itemName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${itemName}: ${fieldName} must be a non-empty string`);
  }
}

function normalizeInteractables(scene) {
  if (!Array.isArray(scene.interactables)) {
    throw new Error(`scene ${scene.id}: interactables must be an array`);
  }

  return scene.interactables.map((entry, index) => {
    const itemName = `scene ${scene.id} interactable ${index}`;
    assertString(entry?.objectId, "objectId", itemName);
    assertString(entry?.action, "action", itemName);
    assertString(entry?.prompt, "prompt", itemName);

    const clueId = typeof entry?.clueId === "string" ? entry.clueId.trim() : "";
    return Object.freeze({
      objectId: entry.objectId.trim(),
      action: entry.action.trim(),
      clueId: clueId || null,
      prompt: entry.prompt.trim()
    });
  });
}

function normalizeScenes(caseData) {
  if (!Array.isArray(caseData?.scenes) || caseData.scenes.length === 0) {
    throw new Error("case.json: scenes must be a non-empty array");
  }

  return Object.freeze(caseData.scenes.map((scene, index) => {
    const itemName = `scene ${index}`;
    assertString(scene?.id, "id", itemName);
    assertString(scene?.chapterId, "chapterId", itemName);
    assertString(scene?.title, "title", itemName);

    return Object.freeze({
      id: scene.id.trim(),
      chapterId: scene.chapterId.trim(),
      title: scene.title.trim(),
      interactables: Object.freeze(normalizeInteractables(scene))
    });
  }));
}

function normalizeDeductionRules(deductions) {
  const rules = new Map();
  for (const deduction of deductions) {
    const hintId = typeof deduction.hintId === "string" ? deduction.hintId.trim() : "";
    if (!hintId) {
      throw new Error(`deductions.json: ${deduction.id} is missing hintId`);
    }

    rules.set(
      deduction.id,
      Object.freeze({
        id: deduction.id,
        requiredClueIds: Object.freeze([...deduction.requiredClueIds]),
        hintId
      })
    );
  }

  return rules;
}

function resolveCaseDirectory(caseId) {
  const contentCasesRoot = fileURLToPath(new URL("../../content/cases", import.meta.url));
  return resolve(contentCasesRoot, caseId);
}

export function loadCaseContent(caseId = DEFAULT_CASE_ID) {
  const caseDirectory = resolveCaseDirectory(caseId);

  for (const fileName of REQUIRED_FILES) {
    const filePath = resolve(caseDirectory, fileName);
    if (!existsSync(filePath)) {
      throw new Error(`content missing required file: ${filePath}`);
    }
  }

  const parsed = validateCasePayloads({
    caseData: readJson(resolve(caseDirectory, "case.json")),
    cluesData: readJson(resolve(caseDirectory, "clues.json")),
    deductionsData: readJson(resolve(caseDirectory, "deductions.json"))
  });

  if (parsed.errors.length > 0 || !parsed.caseData) {
    throw new Error(`invalid case content for ${caseId}: ${parsed.errors.join("; ")}`);
  }

  const cluesById = new Map(parsed.clues.map((clue) => [clue.id, Object.freeze({ id: clue.id, title: clue.title, text: clue.text })]));
  const deductionRules = normalizeDeductionRules(parsed.deductions);
  const scenes = normalizeScenes(parsed.caseData);

  return Object.freeze({
    cluesById,
    deductionRules,
    scenes
  });
}

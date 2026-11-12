#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runFairPlaySkeleton, validateCasePayloads } from "../content-tools/validate-content.mjs";

const contentPath = "content/cases";
const requiredFiles = ["case.json", "clues.json", "deductions.json"];

function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

if (!existsSync(contentPath)) {
  console.log("content:validate: no content yet");
  process.exit(0);
}

const entries = readdirSync(contentPath, { withFileTypes: true }).filter((d) => d.isDirectory());
if (entries.length === 0) {
  console.log("content:validate: no content yet");
  process.exit(0);
}

const errors = [];
const warnings = [];

for (const entry of entries) {
  const caseDir = join(contentPath, entry.name);
  const missing = requiredFiles.filter((fileName) => !existsSync(join(caseDir, fileName)));
  if (missing.length > 0) {
    errors.push(`${entry.name}: missing required files ${missing.join(", ")}`);
    continue;
  }

  let parsed;
  try {
    parsed = validateCasePayloads({
      caseData: readJsonFile(join(caseDir, "case.json")),
      cluesData: readJsonFile(join(caseDir, "clues.json")),
      deductionsData: readJsonFile(join(caseDir, "deductions.json"))
    });
  } catch (error) {
    errors.push(`${entry.name}: ${error.message}`);
    continue;
  }

  for (const issue of parsed.errors) {
    errors.push(`${entry.name}: ${issue}`);
  }

  const fairPlay = runFairPlaySkeleton({ clues: parsed.clues, deductions: parsed.deductions });
  for (const issue of fairPlay.errors) {
    errors.push(`${entry.name}: ${issue}`);
  }
  for (const warning of fairPlay.warnings) {
    warnings.push(`${entry.name}: ${warning}`);
  }
}

if (errors.length > 0) {
  for (const issue of errors) {
    console.error(`content:validate:error: ${issue}`);
  }
  process.exit(1);
}

for (const warning of warnings) {
  console.warn(`content:validate:warn: ${warning}`);
}

console.log(`content:validate: validated ${entries.length} case directory(ies)`);
process.exit(0);

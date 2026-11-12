#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const JS_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".cjs"]);
const TS_EXTENSIONS = new Set([".ts", ".tsx"]);

const CONFORMANCE_TARGETS = [
  {
    name: "client",
    sourceDir: "client/src",
    milestoneFeature: "F-005",
    requiredSubdirs: ["engine", "game", "ui", "state", "app"]
  },
  {
    name: "server",
    sourceDir: "server/src",
    milestoneFeature: "F-001",
    requiredSubdirs: ["http", "rules", "content", "repo", "db"]
  },
  {
    name: "shared",
    sourceDir: "shared/src",
    milestoneFeature: "F-001",
    requiredSubdirs: ["schemas", "ids", "api"]
  },
  {
    name: "content-tools",
    sourceDir: "content-tools/src",
    milestoneFeature: "F-008",
    requiredSubdirs: []
  }
];

function toPosixPath(filePath) {
  return filePath.replace(/\\/g, "/");
}


function readJsonFile(path) {
  const raw = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function parseRootFromArgs() {
  const rootFlagIndex = process.argv.indexOf("--root");
  if (rootFlagIndex >= 0 && process.argv[rootFlagIndex + 1]) {
    return resolve(process.argv[rootFlagIndex + 1]);
  }
  return process.cwd();
}

function loadFeatureStates(rootDir) {
  const featureListPath = resolve(rootDir, "harness", "feature_list.json");
  if (!existsSync(featureListPath)) {
    return new Map();
  }

  const payload = readJsonFile(featureListPath);
  const states = new Map();
  for (const feature of payload.features ?? []) {
    if (typeof feature.id === "string") {
      states.set(feature.id, feature.state ?? "unknown");
    }
  }
  return states;
}

function isMilestoneStarted(featureStates, featureId) {
  const state = featureStates.get(featureId);
  return state !== undefined && state !== "not_started";
}

function listCodeFiles(rootDir) {
  if (!existsSync(rootDir)) {
    return [];
  }

  const files = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }
      if (CODE_EXTENSIONS.has(extname(entry.name))) {
        files.push(absolutePath);
      }
    }
  }

  return files;
}

function isDirectory(path) {
  if (!existsSync(path)) {
    return false;
  }
  return statSync(path).isDirectory();
}

function hasExplicitClientDistIgnore(rootDir) {
  const gitignorePath = resolve(rootDir, ".gitignore");
  if (!existsSync(gitignorePath)) {
    return false;
  }
  const lines = readFileSync(gitignorePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  return lines.some((line) => {
    const normalized = line.replace(/\\/g, "/");
    return normalized === "client/dist/" || normalized === "/client/dist/" || normalized === "client/dist/**";
  });
}

function listTrackedClientDistFiles(rootDir) {
  const probe = spawnSync("git", ["ls-files", "--", "client/dist"], {
    cwd: rootDir,
    encoding: "utf8"
  });

  if (probe.error || probe.status !== 0) {
    return [];
  }

  return probe.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function hasDirectViteDependency(rootDir) {
  const packageJsonPath = resolve(rootDir, "package.json");
  if (!existsSync(packageJsonPath)) {
    return false;
  }

  const payload = readJsonFile(packageJsonPath);
  const dependencies = payload.dependencies ?? {};
  const devDependencies = payload.devDependencies ?? {};
  return typeof dependencies.vite === "string" || typeof devDependencies.vite === "string";
}

function fail(issues) {
  globalThis.console.error(`WHAT: architecture-conformance failed: ${issues.join("; ")}`);
  globalThis.console.error(
    "WHY:  The agreed architecture requires TypeScript source layout, explicit Vite toolchain ownership, and dist-artifact hygiene."
  );
  globalThis.console.error(
    "FIX:  Move source into the required TypeScript folders, add missing layer directories, declare vite directly, and keep client/dist ignored and untracked."
  );
  process.exit(1);
}

const root = parseRootFromArgs();
const issues = [];
const featureStates = loadFeatureStates(root);

for (const target of CONFORMANCE_TARGETS) {
  const milestoneStarted = isMilestoneStarted(featureStates, target.milestoneFeature);
  if (!milestoneStarted) {
    continue;
  }

  const sourceRoot = resolve(root, target.sourceDir);
  if (!isDirectory(sourceRoot)) {
    issues.push(`missing required source directory ${target.sourceDir} (milestone ${target.milestoneFeature} started)`);
    continue;
  }

  for (const subdir of target.requiredSubdirs) {
    const subdirPath = resolve(sourceRoot, subdir);
    if (!isDirectory(subdirPath)) {
      issues.push(`missing required layer folder ${toPosixPath(relative(root, subdirPath))}`);
    }
  }

  const files = listCodeFiles(sourceRoot);
  const tsFiles = files.filter((filePath) => TS_EXTENSIONS.has(extname(filePath)));
  const jsFiles = files.filter((filePath) => JS_EXTENSIONS.has(extname(filePath)));

  if (tsFiles.length === 0) {
    issues.push(`${target.sourceDir} has no .ts/.tsx source files`);
  }
  for (const jsFile of jsFiles) {
    issues.push(`forbidden JavaScript source ${toPosixPath(relative(root, jsFile))}`);
  }
}

if (!hasDirectViteDependency(root)) {
  issues.push("package.json is missing a direct vite dependency");
}

if (!hasExplicitClientDistIgnore(root)) {
  issues.push(".gitignore is missing explicit client/dist/ ignore");
}

const trackedDistFiles = listTrackedClientDistFiles(root);
if (trackedDistFiles.length > 0) {
  issues.push(`client/dist contains tracked files: ${trackedDistFiles.join(", ")}`);
}

if (issues.length > 0) {
  fail(issues);
}

globalThis.console.log("architecture-conformance: OK");

#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import process from "node:process";

const TARGET_REGEX = /\b(?:E|D|R)-\d{2}\b/g;
const CODE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx"]);

function toPosixPath(path) {
  return path.replace(/\\/g, "/");
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

function isExempt(relativePath) {
  const normalized = toPosixPath(relativePath);
  if (normalized === "server/src/contentLoader.js") {
    return true;
  }
  if (normalized.includes("/tests/") || normalized.includes(".test.")) {
    return true;
  }
  return false;
}

function fail(issues) {
  globalThis.console.error(`WHAT: content-as-data failed: ${issues.join("; ")}`);
  globalThis.console.error("WHY:  Case evidence, deductions, and red-herring ids must come from content files, not source literals.");
  globalThis.console.error("FIX:  Move id literals into content/cases/* JSON and load them through the content loader.");
  process.exit(1);
}

function parseRootFromArgs() {
  const rootFlagIndex = process.argv.indexOf("--root");
  if (rootFlagIndex >= 0 && process.argv[rootFlagIndex + 1]) {
    return resolve(process.argv[rootFlagIndex + 1]);
  }
  return process.cwd();
}

const root = parseRootFromArgs();
const requiredCaseFile = resolve(root, "content", "cases", "speckled-band", "case.json");
const issues = [];

if (!existsSync(requiredCaseFile)) {
  issues.push("missing content/cases/speckled-band/case.json");
}

const scanRoots = [
  resolve(root, "server", "src"),
  resolve(root, "client", "src")
];

for (const scanRoot of scanRoots) {
  for (const filePath of listCodeFiles(scanRoot)) {
    const relativePath = toPosixPath(relative(root, filePath));
    if (isExempt(relativePath)) {
      continue;
    }

    const content = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (let index = 0; index < content.length; index += 1) {
      const line = content[index];
      TARGET_REGEX.lastIndex = 0;
      const matches = line.match(TARGET_REGEX);
      if (!matches || matches.length === 0) {
        continue;
      }
      issues.push(`${relativePath}:${index + 1} contains ${matches.join(", ")}`);
    }
  }
}

if (issues.length > 0) {
  fail(issues);
}

globalThis.console.log("content-as-data: OK");

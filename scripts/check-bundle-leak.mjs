#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const CHECK_NAME = "check:bundle-leak";
const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".map", ".txt"]);
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const forbiddenPatterns = [
  {
    name: "deduction-id",
    regex: /\bD-\d{2}\b/g,
    reason: "Deduction ids must stay server-side."
  },
  {
    name: "hint-id",
    regex: /\bH-D\d{2}-[A-Z0-9-]+\b/g,
    reason: "Hint ids must stay server-side."
  },
  {
    name: "required-clues-key",
    regex: /\brequiredClueIds\b/g,
    reason: "Deduction answer shape must not be shipped to the client."
  },
  {
    name: "canonical-answer-string",
    regex: /trained swamp adder/gi,
    reason: "Canonical explanation answers must stay server-side."
  }
];

async function walkFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function readBundleTextFiles(bundleRoot) {
  const files = await walkFiles(bundleRoot);
  const textFiles = [];

  for (const filePath of files) {
    if (!TEXT_EXTENSIONS.has(extname(filePath).toLowerCase())) {
      continue;
    }

    const fileStat = await stat(filePath);
    if (fileStat.size > MAX_FILE_SIZE_BYTES) {
      continue;
    }

    const content = await readFile(filePath, "utf8");
    textFiles.push({ filePath, content });
  }

  return textFiles;
}

function findLeaks(textFiles, bundleRoot) {
  const leaks = [];

  for (const { filePath, content } of textFiles) {
    for (const pattern of forbiddenPatterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      const match = regex.exec(content);
      if (!match) {
        continue;
      }

      leaks.push({
        file: relative(bundleRoot, filePath),
        type: pattern.name,
        sample: match[0],
        reason: pattern.reason
      });
    }
  }

  return leaks;
}

async function main() {
  const bundleRoot = resolve(process.cwd(), "client", "build");
  const textFiles = await readBundleTextFiles(bundleRoot);

  if (textFiles.length === 0) {
    console.error(`WHAT: ${CHECK_NAME} found no client/build text files to scan.`);
    console.error("WHY: A missing or empty bundle cannot be validated for leakage.");
    console.error("FIX: Ensure client/build exists and includes bundle files before running this check.");
    process.exit(1);
  }

  const leaks = findLeaks(textFiles, bundleRoot);
  if (leaks.length > 0) {
    console.error(`WHAT: ${CHECK_NAME} found ${leaks.length} potential server-only leak(s) in client/build.`);
    for (const leak of leaks) {
      console.error(`- ${leak.file}: ${leak.type} -> ${JSON.stringify(leak.sample)} (${leak.reason})`);
    }
    console.error("WHY: Server-only deduction ids or answer data must never ship in client output.");
    console.error("FIX: Remove leaked values from client-visible files and keep deduction answers on the server.");
    process.exit(1);
  }

  console.log(`${CHECK_NAME}: pass (${textFiles.length} files scanned, no server-only leaks detected)`);
}

main().catch((error) => {
  console.error(`WHAT: ${CHECK_NAME} failed unexpectedly.`);
  console.error(`WHY: ${error instanceof Error ? error.message : String(error)}`);
  console.error("FIX: Resolve the script error and re-run the check.");
  process.exit(1);
});

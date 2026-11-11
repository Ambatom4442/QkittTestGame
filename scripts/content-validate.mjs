#!/usr/bin/env node
import { existsSync, readdirSync } from "node:fs";

const contentPath = "content/cases";

if (!existsSync(contentPath)) {
  console.log("content:validate: no content yet");
  process.exit(0);
}

const entries = readdirSync(contentPath, { withFileTypes: true }).filter((d) => d.isDirectory());
if (entries.length === 0) {
  console.log("content:validate: no content yet");
  process.exit(0);
}

console.log(`content:validate: found ${entries.length} case directory(ies)`);
process.exit(0);

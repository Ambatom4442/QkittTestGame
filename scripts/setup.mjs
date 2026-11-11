#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync("package.json")) {
  console.error("setup: run from repository root.");
  process.exit(1);
}

if (existsSync(".nvmrc")) {
  const wanted = readFileSync(".nvmrc", "utf8").trim();
  console.log(`setup: Node target from .nvmrc is ${wanted}`);
}

run("npm", ["install"]);
console.log("setup: complete. Next step: npm run check:fast");

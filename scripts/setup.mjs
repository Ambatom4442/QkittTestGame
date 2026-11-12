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

function check(command, args = []) {
  const result = spawnSync(command, args, {
    stdio: "pipe",
    encoding: "utf8",
    shell: process.platform === "win32"
  });
  return {
    ok: result.status === 0,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim()
  };
}

function printMissing({ what, why, fix }) {
  console.error(`- WHAT: ${what}`);
  console.error(`  WHY: ${why}`);
  console.error(`  FIX: ${fix}`);
}

if (!existsSync("package.json")) {
  console.error("setup: run from repository root.");
  process.exit(1);
}

if (existsSync(".nvmrc")) {
  const wanted = readFileSync(".nvmrc", "utf8").trim();
  console.log(`setup: Node target from .nvmrc is ${wanted}`);
}

const prerequisites = [
  {
    label: "Docker Desktop",
    probe: () => check("docker", ["compose", "version"]),
    why: "sandbox commands use docker compose for local/CI parity.",
    fix: "Install Docker Desktop, start it, then run `docker compose version`."
  },
  {
    label: "Node.js",
    probe: () => check("node", ["--version"]),
    why: "npm scripts and workspace tooling run on Node.js.",
    fix: "Install Node.js LTS and verify `node --version` succeeds."
  },
  {
    label: "Python",
    probe: () => {
      const python = check("python", ["--version"]);
      if (python.ok) {
        return python;
      }
      const python3 = check("python3", ["--version"]);
      return python3.ok ? python3 : python;
    },
    why: "harness checks run through Python scripts.",
    fix: "Install Python 3 and verify `python --version` (or `python3 --version`) succeeds."
  },
  {
    label: "GitHub CLI (gh)",
    probe: () => check("gh", ["--version"]),
    why: "harness workflow requires opening pull requests from the terminal.",
    fix: "Install GitHub CLI (Windows: `winget install --id GitHub.cli`) and verify `gh --version`."
  }
];

const missing = [];
for (const prerequisite of prerequisites) {
  const result = prerequisite.probe();
  if (result.ok) {
    const version = result.stdout.split(/\r?\n/)[0] || "ok";
    console.log(`setup: found ${prerequisite.label} (${version})`);
    continue;
  }

  missing.push(prerequisite);
}

if (missing.length > 0) {
  console.error("\nsetup: missing prerequisites.");
  for (const prerequisite of missing) {
    printMissing({
      what: `${prerequisite.label} is unavailable in this shell.`,
      why: prerequisite.why,
      fix: prerequisite.fix
    });
  }
  process.exit(1);
}

run("npm", ["install"]);

const ghAuth = check("gh", ["auth", "status"]);
if (!ghAuth.ok) {
  console.log("setup: note: `gh auth status` failed. Run `gh auth login` once for PR workflows.");
}

console.log("setup: complete. Next step: npm run check:fast");

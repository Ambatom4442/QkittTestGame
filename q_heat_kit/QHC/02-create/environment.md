# Environment

Goal: any session — human or agent, laptop, container or CI — sets up and runs
the project the same way with one command.

## Standard paths

Define and document these four (in `AGENTS.md` quick start and `docs/RELIABILITY.md`):

| Path | Example | Must |
|---|---|---|
| Setup | `./init.sh` or `make setup` | Work from a clean checkout; be safe to run twice |
| Start | `make start` | Bring the app to a ready state and say so |
| Fast check | `make check-fast` | Finish in about a minute; run before every commit |
| Full check | `make check` | Everything CI runs |

`init.sh` ([template](../../templates/root/init.sh.tmpl)) does: confirm root,
check tool versions, install dependencies from lock files, prepare local
services and seed data, run a smoke test, print the next command.

## Reproducibility

- Lock dependencies (commit lock files).
- Pin runtime versions in files (`.nvmrc`, `.python-version`, `global.json`,
  `rust-toolchain.toml`).
- Prefer a devcontainer or Docker Compose for services (database, queue, cache).
- Seed data and test accounts come from scripts in the repo; test credentials
  are clearly fake and local-only ([secrets.md](../08-safety/secrets.md)).
- Configuration through env vars with a committed `.env.example`; real `.env`
  is ignored by git.

## Sandboxing agent work

Agents run code. Decide where:

| Option | Isolation | Use when |
|---|---|---|
| Local checkout | None beyond permissions | Solo, trusted, interactive |
| Git worktree per agent | Files and branches | Parallel agents on one machine |
| Devcontainer / Docker | Processes, filesystem, network rules | Team default; untrusted dependencies |
| Cloud sandbox / VM | Full machine | Unattended loops, CI agents |

Bind-mounting the repo into a container gives isolation of processes and
network without copying code. Restrict network egress to what the task needs
([permissions-and-sandbox.md](../08-safety/permissions-and-sandbox.md)).

## Self-describing environment

The repo states its own requirements: tool versions, services, ports, env
vars. A new session never has to ask a human how to start the app.

## Failure to avoid

"Works on my machine" setups that depend on global installs or a person's
shell profile. Test the setup path from a clean container during `init`
acceptance and in CI.

# Harness intake - Q-Game

Filled by Q-HEAT during init (2026-11-11).

## Product
- Purpose and users: Browser-based 3D detective game where the player is Sherlock Holmes, aimed at adults/older teens on desktop browsers. Source: requirements/01-vision-and-scope.md, README.md.
- Main workflow: Explore scenes, inspect clues, converse, build deductions, complete vigil, answer final explanation. Source: requirements/05-gameplay.md.
- Critical journeys (3-5):
  1. Create profile, start/continue save, autosave and resume.
  2. Collect clues and unlock deductions up to D-12.
  3. Complete vigil sequence with timing constraints.
  4. Submit final explanation with cited deductions.
  5. Use hints/settings without breaking progression.
  Source: requirements/04-deduction-chain.md, requirements/05-gameplay.md, requirements/06-functional-requirements.md.
- In scope for this repo / in other repos: Entire game is intended in this repo; no companion repos were identified. Source: requirements/01-vision-and-scope.md.

## Stack and run
- Languages / frameworks / versions: Proposed TypeScript strict, Three.js client, Fastify server, SQLite, Vite, Vitest, Playwright, Docker. Source: architecture/02-tech-stack.md.
- Package managers (lock files): Intended npm workspaces; currently no package manager files exist yet. Source: architecture/02-tech-stack.md plus repo scan.
- Setup command (verified?): Not implemented yet in this greenfield repo.
- Start command and ready signal: Not implemented yet.
- Local services and start: Planned single Node server and one SQLite file. Source: architecture/01-system-overview.md.
- Env vars (names only): Planned `PORT`, `QGAME_DB_PATH`, `QGAME_ACCESS_KEY`, `QGAME_TEST_MODE`, `QGAME_BACKUP_DIR`. Source: architecture/08-deployment.md.

## Verification today

| Check | Command | Duration | Passing? | In CI? |
|---|---|---|---|---|
| Git cleanliness preflight | `git status --short --branch` | < 1 s | Yes | No |
| Product checks | None yet (no runnable code) | N/A | N/A | No |

## Architecture
- Domains: Client engine/game/ui/state, server http/rules/content/repo/db, shared schemas/types, content data, assets. Source: architecture/03-client.md, architecture/04-server-and-api.md, architecture/06-repo-layout.md.
- Layers / dependency rules: Strict client and server import boundaries; server-only solution data must never ship to client. Source: architecture/06-repo-layout.md.
- Cross-cutting concerns: Server-side rule validation, strict typing, CSP self-hosting, deterministic test mode. Source: architecture/04-server-and-api.md, architecture/07-testing-strategy.md.
- Hot spots: Deduction validation, chapter gating, save compatibility across content versions, bundle leak prevention. Source: architecture/04-server-and-api.md, architecture/05-data-model.md, architecture/07-testing-strategy.md.

## Risk and policy
- Security-sensitive areas: API input validation, server-side-only solution rules, optional access key, security headers. Source: requirements/07-non-functional-requirements.md.
- Personal data / money / compliance: Low personal data (local profile names only), no payments/accounts. Source: requirements/01-vision-and-scope.md.
- Frozen areas (and why, owner): `q_heat_kit/` is read-only per Q-HEAT constitution; owner is harness maintainers.
- Actions needing approval: Tier choice confirmation (default standard), any security posture changes, frozen-path changes, irreversible or external actions.

## Team and tools
- People and roles; harness owners: Human reviewers own harness decisions; agents propose changes.
- Branching model, review rules, integration branch: Branch + PR workflow; do not merge/push directly to main. Source: q_heat_kit/AGENTS.md and user run rules.
- Agent tools in use: VS Code + GitHub Copilot and Claude Code. Source: user-provided run context.
- CI/CD system and environments: Not implemented yet; planned CI harness checks per architecture/07-testing-strategy.md.
- Escalation channels: Pull request review and chat with user.

## Assessment
- Repo type: empty (greenfield requirements + architecture + harness kit, no product code).
- Baseline results (brownfield): N/A.
- Harnessability (1-5): types 1, boundaries 2, tests 1, startup 1, observability 1, docs 5.

## Open questions
1. Exceptions to defaults in requirements/open-questions.md were not specified in this run; proceeding with all proposed defaults.

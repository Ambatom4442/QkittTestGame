# Progress - Q-Game

## Current verified state

- Branch / commit: harness/change-h07-reset-fake-verified-features @ 52c2385
- Fast check: pass (`npm run check:fast` and `npm run check:changed`)
- Active ticket: H-07 - Reset features that passed against fakes (owner: Q-HEAT)
- Blocker: none
- Next best step: re-run reviewer verdict and update PR evidence after removing circular behavior tests

## Harness feedback (for Q-HEAT change)

- None yet.

## Session log
### 2026-11-12 - Q-HEAT - H-07

- Goal: reset fake-verified feature pass states and require behavior-level browser verification for UI features
- Done: reset F-005/F-006/F-007/F-008/F-009/F-011 to `not_started`, moved F-010/F-012 to `active`, labeled existing e2e tests as `[shell check]`, removed circular `*behaviour.test.js` additions from this PR, and rewired F-005..F-012 verification to P-ticket future Playwright test files with ticket-linked blocked reasons; updated ADR-0005/H-07 metadata
- Verification run (commands -> result):
  - `python q_heat_kit/scripts/qhc_check.py --harness .` -> pass
  - `npm run check:fast` -> pass
  - `npm run check:changed` -> pass
  - `python harness/checks/verify_feature.py F-010 --sandbox` -> fail (expected dependency gate proof after reset)
- Evidence: `harness/feature_list.json` now points reset features at P-ticket-owned Playwright test files; legacy shell checks remain explicit smoke checks
- Risks or unverified paths: future P-ticket test files referenced in verification do not exist yet by design; they are created in P-05..P-08
- Next best step: paste the updated reviewer verdict into PR #26 and keep the PR unmerged

### 2026-11-12 - Q-HEAT - H-09

- Goal: gate setup on required local tooling (Docker, Node, Python, GitHub CLI) and document prerequisites for PR workflow
- Done: updated `scripts/setup.mjs` with prerequisite preflight checks and WHAT/WHY/FIX remediation output, added Python `python3` fallback, documented quick-start prerequisites and `gh auth status` in `AGENTS.md`, and updated ticket/changelog/manifest metadata
- Verification run (commands -> result):
  - `python q_heat_kit/scripts/qhc_check.py --harness .` -> pass
  - `npm run setup` -> expected fail (missing `gh`), with WHAT/WHY/FIX output
  - `npm run check:fast` -> pass
  - `npm run check:changed` -> pass
- Evidence: `npm run setup` reports missing GitHub CLI remediation (`winget install --id GitHub.cli`) while confirming Docker, Node and Python probes pass
- Risks or unverified paths: optional one-time `gh auth login` remains user-environment dependent and was not performed in this session
- Next best step: open PR and include reviewer-agent verdict in the PR body

### 2026-11-12 - Q-HEAT - H-06

- Goal: require visible UI evidence and independent PR review evidence for system-layer features
- Done: updated `verify_feature.py` to record screenshot artifact paths for system-layer features, added UI acceptance text + static/runtime/system layers for F-005/F-006/F-007/F-009/F-011, added `.github/pull_request_template.md` evidence checklist, and updated DoD/docs/manifest/changelog with ADR-0009
- Verification run (commands -> result):
  - `python harness/checks/verify_feature.py F-009 --sandbox` -> pass
  - `python harness/checks/verify_feature.py F-013 --sandbox` -> pass
  - `python q_heat_kit/scripts/qhc_check.py --harness .` -> pass
  - `npm run check:fast` -> pass
  - `npm run sandbox:check` -> pass
- Evidence: `harness/feature_list.json` now records `evidence.artifacts: ["artifacts/golden-boot.png"]` for verified system-layer features
- Risks or unverified paths: host-mode `check:golden-boot` still errors on Windows process spawn (`spawn EINVAL`); sandbox path is passing and used for required proof
- Next best step: open PR for H-06 and request independent reviewer-agent verdict

### 2026-11-12 - Q-HEAT - H-05

- Goal: enforce architecture conformance against ADR-0001 and architecture/06-repo-layout.md
- Done: added `harness/checks/architecture_conformance.mjs`, registered non-blocking sensor `S-059-architecture-conformance`, expanded ESLint boundary rules for `client/src/**` and `server/src/**`, and documented the P-02/P-03 blocking flip plan
- Verification run (commands -> result):
  - `python q_heat_kit/scripts/qhc_check.py --harness .` -> pass
  - `npm run check:fast` -> pass
  - `npm run check:architecture-conformance` -> fail (expected on current architecture)
  - `node harness/checks/architecture_conformance.mjs --root <temp origin/main worktree>` -> fail (proof on current main)
  - `node harness/checks/architecture_conformance.mjs --root <temp conformant fixture>` -> pass
- Evidence: failure reports TypeScript-source-layout drift, missing layer folders, missing direct `vite` dependency, and explicit `client/dist` ignore gap on `main`
- Risks or unverified paths: sensor remains non-blocking until P-02 and P-03 merge by design
- Next best step: migrate runtime source to the TypeScript layout and then flip `S-059-architecture-conformance` to blocking

### 2026-11-12 - Q-HEAT - H-04

- Goal: enforce content-as-data and add real speckled-band case files for validation/runtime loading
- Done: added `content/cases/speckled-band/{case,clues,deductions}.json`, created `server/src/contentLoader.js`, refactored `server/src/buildServer.js` to read scenes/clues/deductions from content data, and added non-blocking sensor `S-058-content-as-data`
- Verification run (commands -> result):
  - `npm run content:validate` -> pass
  - `npm run test:api -- deductions events-clues no-answer-leak` -> pass
  - `npm run check:content-as-data` -> pass
  - `node harness/checks/content_as_data.mjs --root <temp origin/main worktree>` -> fail (proof on current main)
- Evidence: no `E-xx` / `D-xx` / `R-xx` literals remain in `server/src/**` outside loader; required case file now exists and is validated
- Risks or unverified paths: sensor is non-blocking until P-04 merges by design
- Next best step: flip `S-058-content-as-data` to blocking when P-04 is merged

### 2026-11-12 - Copilot - F-013

- Goal: implement F-013 on a dedicated feature branch
- Done: replaced the bundle-leak placeholder with a real scanner (`scripts/check-bundle-leak.mjs`) and wired `npm run check:bundle-leak` to fail when server-only deduction ids, hint ids, or canonical answer strings appear in client bundle files
- Verification run (commands -> result):
  - `npm run check:bundle-leak -- F-013` -> pass
  - `python harness/checks/verify_feature.py F-013` -> pass
- Evidence: F-013 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: scanner currently enforces known server-only deduction/hint patterns; extend denylist as additional protected answer content is added
- Next best step: finalize/playtest milestone flow now that F-001..F-013 are complete
### 2026-11-12 - Copilot - F-012

- Goal: implement F-012 on a dedicated feature branch
- Done: added `POST /api/games/:id/deductions` with server-side validation for D-03 and D-06, persisted unlocked deductions in slot state, and returned hint ids for wrong links without exposing required clue ids
- Verification run (commands -> result):
  - `npm run test:api -- deductions` -> pass
  - `npm run test:e2e -- deduction-d03-d06` -> pass
  - `npm run test:api -- no-answer-leak` -> pass
  - `python harness/checks/verify_feature.py F-012` -> pass
- Evidence: F-012 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: this slice validates D-03 and D-06 only; broader deduction graph and board UX remain for future milestones
- Next best step: F-013 - Bundle leak check for server-only ids and answers
### 2026-11-12 - Copilot - F-011

- Goal: implement F-011 on a dedicated feature branch
- Done: added `GET /api/games/:id/casebook`, formatted known clue labels, wired client boot casebook fetch/render, and added a casebook toggle panel showing deduplicated collected clues
- Verification run (commands -> result):
  - `npm run test:e2e -- casebook-clues` -> pass
  - `python harness/checks/verify_feature.py F-011` -> pass
- Evidence: F-011 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: casebook interaction currently covers clue listing/toggle behavior; broader narrative notebook UX remains for later features
- Next best step: F-012 - Story graph and branching endpoint
### 2026-11-12 - Copilot - F-010

- Goal: implement F-010 on a dedicated feature branch
- Done: added `/api/games/:id/interact` event endpoint that grants L-06 clues E-07/E-09/E-10/E-11/E-12, persists collected clues, and keeps duplicate interactions idempotent
- Verification run (commands -> result):
  - `npm run test:api -- events-clues` -> pass
  - `npm run test:e2e -- clues-e07-e12` -> pass
  - `python harness/checks/verify_feature.py F-010` -> pass
- Evidence: F-010 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: interaction loop is API-driven and metadata-based; fully rendered in-scene interaction UX remains for upcoming gameplay/UI features
- Next best step: F-011 - Casebook UI lists collected clues
### 2026-11-12 - Copilot - F-009

- Goal: implement F-009 on a dedicated feature branch
- Done: added L-06 scene/chapter endpoints with ordered interactables and wired client boot to load L-06 plus render interactable prompts
- Verification run (commands -> result):
  - `npm run test:e2e -- julia-room-load` -> pass
  - `python harness/checks/verify_feature.py F-009` -> pass
- Evidence: F-009 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: interaction visuals are list/metadata-level for now; full 3D hover-outline behavior lands with subsequent interaction features
- Next best step: F-010 - Events API grants clues E-07 to E-12 on interact

### 2026-11-12 - Copilot - F-008

- Goal: implement F-008 on a dedicated feature branch
- Done: added Zod-based content payload schemas and a fair-play skeleton validator for D-12 dependency checks, wired into `npm run content:validate`
- Verification run (commands -> result):
  - `npm run content:validate` -> pass
  - `npm run test:unit -- fair-play` -> pass
  - `python harness/checks/verify_feature.py F-008` -> pass
- Evidence: F-008 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: fair-play remains a skeleton check focused on D-12 reference integrity; full acquisition graph validation is deferred
- Next best step: F-009 - Julia room scene L-06 loads with interactables

### 2026-11-12 - Copilot - F-007
- Goal: implement F-007 on a dedicated feature branch
- Done: added resume endpoint `GET /api/games/:id/resume` and a reload-resume e2e flow that persists position then resumes scene and transform after server restart
- Verification run (commands -> result):
  - `npm run test:e2e -- save-resume-position` -> pass
  - `python harness/checks/verify_feature.py F-007` -> pass
- Evidence: F-007 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: flow verifies server persistence and resume payloads; client-side scene application of resume state is deferred to later gameplay integration
- Next best step: F-008 - Case content schemas and validator with fair-play skeleton

### 2026-11-12 - Copilot - F-006

- Goal: implement F-006 on a dedicated feature branch
- Done: added first-person WASD movement, room collision boundaries, obstacle collision, and floor-marker click-to-move wiring in the client boot runtime
- Verification run (commands -> result):
  - `npm run test:unit -- movement` -> pass
  - `npm run test:e2e -- movement-controls` -> pass
  - `python harness/checks/verify_feature.py F-006` -> pass
- Evidence: F-006 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: movement coverage is currently headless and logic-driven; full pointer-lock/mouse-look browser behavior remains for later scene features
- Next best step: F-007 - Save and resume position end to end

### 2026-11-12 - Copilot - F-005

- Goal: implement F-005 on a dedicated feature branch
- Done: booted a browser client scene with Three.js, added server-gated test mode config, and exposed `window.__qgame` only for approved `?test=1` runs
- Verification run (commands -> result):
  - `npm run test:unit -- client.boot` -> pass
  - `npm run test:e2e -- test-mode-hook` -> pass
  - `python harness/checks/verify_feature.py F-005` -> pass
- Evidence: F-005 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: headless e2e verifies asset/config wiring and hook gating; full browser interaction coverage remains for later gameplay features
- Next best step: F-006 - First-person movement with collision and click-to-move

### 2026-11-12 - Copilot - F-004

- Goal: implement F-004 on a dedicated feature branch
- Done: added `GET /api/profiles/:id/saves`, `POST /api/games`, and `PUT /api/games/:id/position` using SQLite save slots
- Verification run (commands -> result):
  - `npm run test:api -- games` -> pass
  - `npm run test:api -- save-slots` -> pass
  - `npm run test:api -- autosave` -> pass
  - `python harness/checks/verify_feature.py F-004` -> pass
- Evidence: F-004 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: full game progress model is deferred to later features
- Next best step: F-005 - Client boots Three.js scene with test mode hook

### 2026-11-12 - Copilot - F-003

- Goal: implement F-003 on a dedicated feature branch
- Done: added `GET /api/profiles` and `POST /api/profiles` backed by SQLite plus focused API tests
- Verification run (commands -> result):
  - `npm run test:api -- profiles` -> pass
  - `python harness/checks/verify_feature.py F-003` -> pass
- Evidence: F-003 marked passing in harness/feature_list.json with command tail
- Risks or unverified paths: no profile update/delete behavior in this feature scope
- Next best step: F-004 - Games and save slots API with autosave position

### 2026-11-12 - Copilot - F-002

- Goal: implement F-002 on a dedicated feature branch
- Done: added SQLite bootstrap via `node:sqlite`, enabled WAL, and applied numbered SQL migrations at startup
- Verification run (commands -> result):
  - `npm run check:fast` -> pass
  - `python harness/checks/verify_feature.py F-002` -> pass
- Evidence: F-002 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: `node:sqlite` is currently experimental in Node; behavior verified through harness tests
- Next best step: F-003 - Profiles API

### 2026-11-12 - Copilot - F-001

- Goal: implement F-001 on a dedicated feature branch
- Done: added Fastify server startup, static built-client serving from client/build, and `/api/health`
- Verification run (commands -> result):
  - `npm run check:fast` -> pass
  - `python harness/checks/verify_feature.py F-001` -> pass
- Evidence: F-001 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: health/page baseline only; deeper runtime features remain for later features
- Next best step: F-003 - Profiles API

### 2026-11-11 - Q-HEAT - init

- Goal: complete Phase 4 harness and runnable skeleton
- Done: created standard-tier harness, npm script flow, checks, policy, CI workflow, and shared skeleton test
- Verification run (commands -> result):
  - `npm run setup` -> pass
  - `npm run check:fast` -> pass
  - `npm run check` -> pass
  - `python q_heat_kit/scripts/qhc_check.py --harness .` -> pass
- Evidence: qhc_check 0 errors/0 warnings; unit tests 1/1 pass; traceability 13 features OK; e2e and bundle-leak registered non-blocking
- Commits: 6 local commits on harness/init (all messages start with harness:)
- Files / docs updated: root harness docs/configs, harness state/checks/hooks, .claude, .github workflow, shared skeleton
- Risks or unverified paths: product runtime/API/gameplay features not implemented yet by design
- Next best step: F-001 - server serves the built client and /api/health

### 2026-11-12 - Q-HEAT - H-01

- Goal: add a Docker sandbox where local and CI checks run in the same environment
- Done: added `docker-compose.yml` (`app` + pinned Playwright `checks`), npm `sandbox:*` scripts, sandbox-aware `verify_feature.py`, and CI workflow execution via `docker compose run --rm checks npm run check`
- Verification run (commands -> result):
  - `python q_heat_kit/scripts/qhc_check.py --harness .` -> pass
  - `npm run check:fast` -> pass
  - `docker compose config` -> pass
  - `npm run sandbox:check` -> pass
- Evidence: harness changelog + manifest updated; CI now executes the same compose check command
- Risks or unverified paths: local Windows proof is captured; GitHub Actions proof remains pending until PR workflow completes
- Next best step: open PR and confirm `harness-check` passes with the same sandbox command in GitHub Actions

### 2026-11-12 - Q-HEAT - H-02

- Goal: enforce real-browser e2e testing and ban fake/mock engine patterns in tests/e2e
- Done: migrated `tests/e2e/**` to Playwright Chromium tests against the running app service, added blocking sensor `harness/checks/e2e_real_browser.py`, and wired `test:e2e` to run sensor + Playwright
- Verification run (commands -> result):
  - `python harness/checks/e2e_real_browser.py` (run in temp worktree at `origin/main`) -> fail
  - `python harness/checks/e2e_real_browser.py` (after migration) -> pass
  - `docker compose run --rm checks npm run test:e2e -- health-page` -> pass
  - `npm run sandbox:check` -> pass
  - `python q_heat_kit/scripts/qhc_check.py --harness .` -> pass
  - `npm run check:fast` -> pass
- Evidence: all e2e files now import `@playwright/test`; no fake/mock/browser-engine client-source patterns in `tests/e2e/**`
- Risks or unverified paths: none
- Next best step: confirm PR CI reproduces the same pass in `harness-check`

### 2026-11-12 - Q-HEAT - H-03

- Goal: add a blocking golden-boot browser sensor with screenshot evidence and CI upload
- Done: added `harness/checks/golden_boot.mjs`, wired `npm run check:golden-boot` into full checks, registered blocking sensor `S-057-golden-boot`, added CI artifact upload for `artifacts/golden-boot.png`, and documented the golden journey
- Verification run (commands -> result):
  - `python q_heat_kit/scripts/qhc_check.py --harness .` -> pass
  - `npm run check:fast` -> pass
  - `docker compose run --rm checks npm run check:golden-boot` -> fail (expected blank-page detection)
  - `npm run sandbox:check` -> fail at `check:golden-boot` (blocking sensor enforced)
  - `docker compose run --rm checks node harness/checks/golden_boot.mjs` in temp worktree at `origin/main` -> fail (proof on current main)
- Evidence: failure reports missing `window.__qgame`, MIME-type console error for module script, and blank canvas sample; screenshot emitted at `artifacts/golden-boot.png`
- Risks or unverified paths: none for harness scope; product boot bug remains and is now surfaced by the new blocking gate
- Next best step: fix the runtime module MIME/path issue so golden-boot passes


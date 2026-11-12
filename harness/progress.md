# Progress - Q-Game

## Current verified state

- Branch / commit: feature/f-012-deduction-validation @ working tree (uncommitted)
- Fast check: pass (qhc, typecheck, lint, content validate, unit tests, policy)
- Full check (last CI): local pass (`npm run check`)
- Active feature: F-012 - Deduction board server-side validation for D-03 and D-06 (owner: Copilot)
- Blocker: none
- Next best step: F-013 - Bundle leak check for server-only ids and answers

## Harness feedback (for Q-HEAT change)

- None yet.

## Session log

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


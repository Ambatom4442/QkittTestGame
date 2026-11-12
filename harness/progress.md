# Progress - Q-Game

## Current verified state

- Branch / commit: feature/f-006-movement-controls @ working tree (uncommitted)
- Fast check: pass (qhc, typecheck, lint, content validate, unit tests, policy)
- Full check (last CI): local pass (`npm run check`)
- Active feature: F-006 - First-person movement with collision and click-to-move (owner: Copilot)
- Blocker: none
- Next best step: F-007 - Save and resume position end to end

## Harness feedback (for Q-HEAT change)

- None yet.

## Session log


### 2026-11-12 - Copilot - F-006

- Goal: implement F-006 on a dedicated feature branch
- Done: added first-person WASD movement, room collision boundaries, obstacle collision, and floor-marker click-to-move wiring in the client boot runtime
- Verification run (commands -> result):
  - `npm run test:unit -- movement` -> pass
  - `npm run test:e2e -- movement-controls` -> pass
  - `python harness/checks/verify_feature.py F-006` -> pass
- Evidence: F-006 marked passing in harness/feature_list.json with command tails
- Risks or unverified paths: movement coverage is currently headless and logic-driven; full pointer-lock/mouse-look browser behavior remains for later scene features
- Next best step: F-007 - Save and resume position end to end`r`n`r`n### 2026-11-12 - Copilot - F-005

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





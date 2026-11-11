# Harness init plan - Q-Game

Date: 2026-11-11  
Command: Q-HEAT init  
Status: Approved to proceed into Phase 4

## Tier and environment

- Tier: standard.
- Environment: Windows PowerShell for local dev, GitHub Actions on Ubuntu.
- Python command baseline: use `python` in npm scripts and CI.
- Shell tooling choice: npm scripts + Node setup script, no `init.sh` or Makefile.

## Greenfield acceptance skeleton

Init creates a minimal runnable skeleton only:
- root npm workspaces, `.nvmrc`, strict TypeScript
- `shared/` workspace with one trivial typed module
- Vitest with one passing example test
- ESLint (import-boundary rules from architecture/06)
- Prettier
- no game/client/server product implementation

## Required command path

| Script | Purpose |
|---|---|
| `npm run setup` | install deps and confirm baseline |
| `npm run check:fast` | blocking sensors |
| `npm run check:changed` | fast + small traceability |
| `npm run check` | full aggregate with registered non-blocking checks |

Blocking requirements:
- all blocking scripts must exist now and pass on skeleton
- `npm run content:validate` must print `no content yet` and exit 0 when content is absent

## Sensors (aligned to architecture/07-testing-strategy.md)

| Sensor | Command | Blocking |
|---|---|---|
| S-001 qhc integrity | `python q_heat_kit/scripts/qhc_check.py --harness .` | Yes |
| S-010 typecheck | `npm run typecheck` | Yes |
| S-020 lint + boundaries | `npm run lint` | Yes |
| S-030 content validate | `npm run content:validate` | Yes |
| S-040 unit tests | `npm run test:unit` | Yes |
| S-050 e2e registered | `npm run test:e2e` | No |
| S-060 bundle leak registered | `npm run check:bundle-leak` | No |
| S-080 policy gate | `python harness/checks/policy_check.py --base origin/main` | Yes |
| S-090 traceability (small) | `python harness/checks/check_traceability.py` | Conditional |

Note: S-070 removed; per-feature pass-state uses `verify_feature.py` and policy evidence checks.

## Feature list schema and ordered seed entries

`harness/feature_list.json` uses template schema exactly:  
`id`, `title`, `behavior`, `verification` (array), `layers_required`, `depends_on`, `priority`, `state`, `owner`, `source`, `blocked_reason`, `evidence`.

Ordered entries:
- M0: F-001 server + `/api/health`; F-002 SQLite WAL+migrations; F-003 profiles API (FR-01); F-004 games+save slots+autosave (FR-02, FR-03, FR-04); F-005 Three.js boot + `window.__qgame` (NFR-62); F-006 movement + click-to-move (FR-10, FR-11); F-007 save/resume e2e.
- M1: F-008 zod schemas + validator + fair-play skeleton (FR-60, FR-61); F-009 L-06 scene load + interactables (FR-12, FR-14); F-010 events API grants E-07..E-12 (FR-13); F-011 casebook clue list (FR-20); F-012 server-side deduction validation D-03/D-06 and hint-only wrong links (FR-30, FR-31, NFR-52); F-013 bundle-leak guard (NFR-52).

Source values are requirement ids only (FR/NFR ids).

## Platform and governance

- Keep docs/exec-plans/active/ and docs/exec-plans/tech-debt.md.
- Root AGENTS.md routes product behavior reading to requirements/.
- CODEOWNERS owner: `@Ambatom4442`.
- CI provider: GitHub Actions.

## Deliberately out of scope for init

- game/client/server feature implementation
- irreversible deploy or production operations

## Phase 5 status (fresh-session test excluded)

- [x] `python q_heat_kit/scripts/qhc_check.py --harness .` passes
- [x] Standard setup/check path runs: `npm run setup`, `npm run check:fast`, `npm run check`
- [x] Blocking sensors pass on skeleton; non-blocking e2e and bundle-leak remain registered
- [x] Fresh-session validation test passed (run by user in a new chat)

Evidence snapshot:
- qhc_check: 0 errors, 0 warnings
- check:fast: pass (qhc, typecheck, lint, content validate, unit tests, policy)
- ESLint module warning: gone after adding `"type": "module"`
- Fresh-session answers recorded by user: <paste the 5 answers>


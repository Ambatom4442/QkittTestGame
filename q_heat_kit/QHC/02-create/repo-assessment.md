# Repository assessment

## Classify the repository

| Type | Signs | Init focus |
|---|---|---|
| **Empty** | No code, maybe requirements and architecture docs | Choose a harnessable stack; scaffold; first test; feature list from requirements |
| **Scaffold** | Framework skeleton, few features | Lock conventions early (agents copy patterns); boundaries from day one |
| **Brownfield** | Real code, history, users | Document what exists; baseline checks; protect risky areas; harness the hot spots first |
| **Monorepo** | Several apps/packages | Root map + nested `AGENTS.md` per package; per-package checks |
| **Multi-repo product** | Feature spans repos | One harness per repo + a cross-repo map; one repo per change |

## Detect, do not guess

Record the evidence for each finding (file and line, or command output):

- Languages and versions (`.nvmrc`, `.python-version`, `global.json`, toolchain files).
- Package manager (lock file present decides it).
- Setup, start, test, lint, type-check, format commands that actually work.
- Test framework and how long the suite takes; which tests are flaky.
- Containers and local services (`docker-compose`, devcontainer).
- CI system and what it runs today.
- Existing agent files and their content.

## Harnessability score (1–5 each)

| Property | 1 | 5 |
|---|---|---|
| Types | Untyped, dynamic everywhere | Strict typing, checked in CI |
| Boundaries | Anything imports anything | Layers and modules with enforced directions |
| Tests | None or not runnable | Fast, deterministic, cover critical flows |
| Startup | Manual multi-step, tribal knowledge | One command from clean checkout |
| Observability | Print statements | Structured logs, health checks |
| Docs | None or stale | Current, near the code |

Low scores are where the harness must do the most work. In brownfield repos,
start with the area that is both risky and frequently changed.

## Greenfield: choose for harnessability

When the stack is not yet fixed, recommend (and let the human decide):
strongly typed language, opinionated framework, one-command startup,
fast test runner, linter with custom-rule support, structured logging.
Record the choice as the first decision record.

## Output

Add an "Assessment" section to `docs/harness/intake.md` with the type, the
detected commands (verified), the baseline results, and the harnessability
scores. These drive the [tier](tiers.md) and the [sensors](verification-setup.md).

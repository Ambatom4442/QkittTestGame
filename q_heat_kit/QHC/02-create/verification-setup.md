# Verification setup

Feedback is the subsystem with the highest return. During `init`, Q-HEAT wires
a verification path that is runnable, fast enough to use every session, and
enforced in CI. Principles are in [04-verify](../04-verify/README.md); this page
is the build checklist.

## 1. Inventory existing checks

Tests (unit, integration, e2e), type check, lint, format, build, security
scan, architecture rules. Record command, duration, flakiness, and whether CI
runs it.

## 2. Create the sensor registry

`harness/sensors.json` ([template](../../templates/harness/sensors.json.tmpl)) lists
every check with: `id`, `command`, `kind` (computational / inferential), `layer`
(static / runtime / system), `tier` (fast / changed / full), `paths` it
applies to, `blocking` (true/false), `owner`, and `introduced_by` (decision or
failure it came from).

Every script named in the registry must exist in the repo (usually
`harness/checks/`). A registry entry whose script is missing is a broken
sensor — `qhc_check.py` reports it.

## 3. Check tiers

| Tier | Runs | Time budget | Used by |
|---|---|---|---|
| `check-fast` | Format, lint, types, unit tests, cheap architecture rules | ~1 min | Every commit, hooks |
| `check-changed` | Above + tests for changed paths | ~3–5 min | End of every feature |
| `check` | Everything incl. integration, e2e, build | CI budget | CI on every PR |

Expose them as `make` targets or package scripts; `AGENTS.md` names them.

## 4. Minimum first sensors by tier

- **Minimal**: build, unit tests, lint.
- **Standard**: + type check, architecture/import rules, a smoke e2e for the
  top golden journey, secret scan, "no edits to frozen paths" check.
- **Advanced**: + full e2e/browser journeys, evaluator review, coverage or
  mutation thresholds on critical modules, doc-freshness check.

## 5. Greenfield: one passing test

Write one example test that runs in the chosen framework and passes. It proves
the path works and gives agents a pattern to copy.

## 6. Brownfield: baseline, then ratchet

Do not turn on a strict rule that fails 500 places on day one. Record the
current count and fail only if it **increases** (ratchet). Lower the ceiling
as features clean areas up.

## 7. Make messages agent-readable

Each check prints WHAT failed, WHY it matters, and HOW to fix
([error-messages.md](../04-verify/error-messages.md)).

## 8. Prove each sensor

For every new check: run it on a known-bad example (must fail with a clear
message) and on the current code (must pass or match the baseline). Record
both results in the init plan.

## 9. Enforce

- CI runs `check` on every PR ([ci-cd.md](../07-automate/ci-cd.md)).
- Optional hooks run `check-fast` after edits or when the agent stops
  ([09-platforms](../09-platforms/README.md)).
- Branch protection requires the CI check — a human sets this.

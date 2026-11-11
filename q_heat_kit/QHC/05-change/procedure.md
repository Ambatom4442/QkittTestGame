# Change procedure

The command file [commands/change.md](../../commands/change.md) lists the steps.
This page holds the rules behind them.

## Impact map

For every change, walk the five subsystems plus the supporting surfaces and
write one line per affected file (or "none"):

| Surface | Ask |
|---|---|
| Instructions | Does `AGENTS.md`, a nested `AGENTS.md`, or a topic doc need a new link, rule or command? |
| Knowledge | Does `ARCHITECTURE.md`, a spec, or a decision record change? |
| State | New or split features? Dependencies? Any feature now invalid? |
| Scope / policy | New allowed paths? Opening a frozen area? New approval rule? |
| Sensors | New invariant to check? Check paths to update? Old check obsolete? |
| Environment | New service, env var, tool version, seed data? |
| Safety | New secret, external system, data class, permission? |
| Platforms | Path-scoped rules, agents, skills, hooks, MCP config? |
| Automation / CI | Workflow, schedule, loop contract affected? |
| Ownership | CODEOWNERS, escalation contacts? |

The impact map goes in the PR description. Reviewers check it first.

## Choosing the edit

In order of preference:

1. **Delete** something obsolete (often the right answer).
2. **A check** that makes the mistake impossible or loud.
3. **A template or example** the agent copies.
4. **A path-scoped rule or topic doc** loaded only where it applies.
5. **A line in a nested `AGENTS.md`.**
6. **A line in the root `AGENTS.md`** — last resort; root rules cost every
   session's attention.

## Rules for every change

- Additive and merge-friendly when other branches are active
  ([multi-developer.md](multi-developer.md)).
- Each new rule carries source, scope and expiry ([instruction-hygiene.md](instruction-hygiene.md)).
- A changed blocking sensor or policy line needs a decision record.
- Keep the root file under its limit; if a change would exceed it, move
  something out first.
- Update `harness/manifest.json` and `harness/CHANGELOG.md`
  ([template](../../templates/harness/CHANGELOG.md.tmpl)).

## Verify the change

1. `python q_heat_kit/scripts/qhc_check.py --harness .` — links, sizes, registry.
2. `check-fast` passes (or matches baseline).
3. New sensor: fails on a seeded bad example, passes on good code.
4. New instruction: run one representative task in a fresh session and confirm
   behaviour changed as intended. If behaviour did not change, the rule is
   noise — remove it.
5. For larger changes, run the harness eval suite before and after ([evals.md](../04-verify/evals.md)).

## Rollback

Every harness PR says how to undo it (usually: revert the PR). Changes to
policy or sensors that affect in-flight branches state the date from which
they apply.

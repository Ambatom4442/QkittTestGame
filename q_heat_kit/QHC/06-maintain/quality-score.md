# Quality score

`docs/QUALITY_SCORE.md` ([template](../../templates/docs/quality-score.md.tmpl))
shows where the codebase is strong and weak, so agents and humans know where to
be careful and what to fix next.

## Grades

| Grade | Meaning |
|---|---|
| A | All verification passing, boundaries enforced, agent-legible, stable tests |
| B | Verification passing, minor gaps in legibility or coverage |
| C | Partially working, known gaps, hard for agents to understand |
| D | Broken, unsafe, or structurally unclear |

## Two tables

- **Product domains** (from `ARCHITECTURE.md`): grade, verification status,
  agent legibility, test stability, key gaps, last updated.
- **Architectural layers**: grade, boundary enforcement, legibility, key gaps.

## Extra sections (advanced tier)

- **Benchmark snapshots**: date, harness variant, completion rate, retries,
  defects before review.
- **Simplification log**: component removed, outcome, decision.
- **Rule coverage**: share of hard rules and dependency rules that have a sensor.

## How it is used

- Agents read it at clock-in when working in a domain graded C or D, and take
  extra verification steps there.
- `maintain` regrades after each milestone and records a change history
  (promoted, demoted, gaps opened, gaps closed).
- Planning uses D-graded areas as candidates for cleanup features.

Grades must cite evidence (check results, test stability, audit findings),
not impressions.

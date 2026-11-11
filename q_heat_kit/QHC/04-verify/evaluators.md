# Evaluators: separating maker from checker

A model grading its own work is too generous: during generation it convinced
itself the path was right, and on review it sees its own reasoning rather than
the mistakes. This is true of every generative model. **Someone in the crew
must not believe the maker.**

## Ways to separate

| Pattern | How | Cost |
|---|---|---|
| Deterministic gate | Checks and tests decide; agent cannot override | Low |
| Fresh-context reviewer | A second agent session that sees only the diff, spec and evidence — not the maker's reasoning | Medium |
| Different model | Reviewer runs on another model or vendor | Medium |
| Adversarial verify | N independent skeptics try to refute a finding; majority rejection kills it | High |
| Human review | The final sensor on every PR | Human time |

## Planner / generator / evaluator

A proven three-role harness for long application work:

- **Planner** expands a short requirement into a full spec: product context
  and high-level design, ambitious in scope, not granular technical detail
  (early technical mistakes cascade).
- **Generator** builds feature by feature; before each, agrees a **sprint
  contract** with the evaluator (scope, checks, exclusions); self-checks, then
  hands to QA.
- **Evaluator** tests like a real user (browser, API, database state), scores
  against a rubric with hard thresholds, and returns detailed feedback.

Public example: a full music-production app built this way ran ~3 h 50 min for
about $125, the planning step under 5 minutes.

## Rubrics

Use dimensions × grades with written criteria, and a hard threshold per
dimension. General rubric: [evaluator-rubric.md.tmpl](../../templates/docs/evaluator-rubric.md.tmpl)
(correctness, verification, scope discipline, reliability, maintainability,
handoff readiness). App QA example dimensions: product depth, functionality,
visual design, code quality.

## Tuning an evaluator

1. Collect cases where the evaluator's verdict differed from a human's.
2. Read the evaluator's transcript for those cases.
3. Adjust its prompt or rubric (be nitpicky about the gaps it missed).
4. Re-run on the same cases. Keep a small set as a regression suite ([evals.md](evals.md)).

## Reviewer agent definition

Give the reviewer read-only tools, no write access to the code under review,
the spec and rubric as input, and a required output format: verdict, findings
with file/line evidence, required fixes. Platform files:
[09-platforms](../09-platforms/README.md); template:
[reviewer agent](../../templates/platforms/claude/agents/reviewer.md.tmpl).

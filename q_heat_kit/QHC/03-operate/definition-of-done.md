# Definition of done

## Why agents declare victory early

Models are systematically over-confident about their own work, and the agent
that wrote the code is its own best defence lawyer. Unit tests passing is not
done: interface mismatches, state propagation errors (e.g. stale ORM cache
after a migration), resource leaks and environment dependencies pass unit tests
and fail in real use.

## The definition Q-HEAT writes into `AGENTS.md`

A feature is done only when **all** are true:

1. The target behaviour is implemented, and nothing outside the feature scope changed.
2. The required verification **actually ran** in all applicable layers (below) and passed.
3. Evidence (command, result summary, commit) is recorded by the check in the feature list.
4. Affected docs (spec, architecture, reliability) are updated in the same change.
5. The repo is still restartable from the standard startup path.

## Three-layer termination check

Do not move to the next layer if the previous one fails.

| Layer | Checks | Examples |
|---|---|---|
| 1. Static | Syntax, types, lint, architecture rules | `tsc`, `ruff`, `eslint`, import rules |
| 2. Runtime behaviour | Tests run; the app starts; critical paths execute | Unit + integration tests, health endpoint |
| 3. System | End-to-end and user scenarios across components | Browser journey, API flow against real DB |

Layer 3 is required whenever the change crosses a component boundary.
Skipping a required layer means not complete.

## Runtime signals that count as evidence

- The app reached its ready state (log line or health check).
- The critical path for this feature executed (trace, log, test output).
- Side effects are correct (database rows, files, messages), not just the response.
- Temporary resources were cleaned up.

## Separate the judge from the worker

For anything beyond trivial, the verdict comes from a check or a separate
reviewer, not the implementing agent's own summary
([evaluators.md](../04-verify/evaluators.md)). Use the evaluator rubric
([template](../../templates/docs/evaluator-rubric.md.tmpl)): correctness,
verification, scope discipline, reliability, maintainability, handoff
readiness — verdict accept / revise / block.

## Never

- Mark `passing` by hand.
- Delete, skip or weaken a test to get green.
- Report "should work" or "looks right" as done.

# Evals: measuring the harness

Sensors check one piece of work. **Evals** check the model-plus-harness system
across many tasks, so you can tell whether a harness change helped.

## Terms

- **Task** — one test with inputs and success criteria.
- **Trial** — one attempt; run several because outputs vary.
- **Grader** — logic that scores an aspect (code-based, model-based, human).
- **Transcript** — the full record of a trial (tool calls, reasoning, output).
- **Outcome** — the final state of the environment (e.g. the row exists),
  regardless of what the agent claimed.
- **Suite** — a set of tasks for one capability.

## Graders

| Type | Strength | Weakness |
|---|---|---|
| Code-based | Fast, cheap, reproducible | Brittle on open-ended work |
| Model-based | Flexible | Non-deterministic; calibrate against humans |
| Human | Gold standard | Slow, expensive |

Grade the outcome and the produced work, not a rigid sequence of steps.

## pass@k vs pass^k

- **pass@k**: at least one of k trials succeeds — fine when one success is enough.
- **pass^k**: all k succeed — needed when consistency matters. 75% per trial
  is only ~42% for three in a row.

## Two kinds of suite

- **Capability evals** — start with low pass rates; a hill to climb.
- **Regression evals** — should stay near 100%; catch backsliding after a
  harness or model change. Mature capability tasks graduate into regression.

## Starting a harness eval suite

1. Collect 20–50 tasks from **real failures** and manual checks in this repo.
2. Make each unambiguous with a reference solution; balance positive and
   negative cases.
3. Run each trial in a clean, isolated environment (fresh worktree or container).
4. Record per task: pass/fail, turns, time, cost, defects found before review.
5. **Read transcripts.** A 0% task is usually a broken task or grader, not an
   incapable agent. (One published benchmark rose from 42% to 95% after fixing
   rigid grading and ambiguous specs.)
6. Watch for saturation; add harder tasks when everything passes.

## Using evals in the harness lifecycle

- Before/after any significant `Q-HEAT change` to instructions or sensors.
- Monthly ablation runs ([simplification.md](../06-maintain/simplification.md)).
- After a model upgrade.

Record snapshots in `docs/QUALITY_SCORE.md` → Benchmark snapshots.

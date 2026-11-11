# Guides and sensors

A control-system view of the harness (after Böckeler / Thoughtworks).

## Two directions

- **Guides (feedforward)** steer *before* the agent acts, raising the chance
  of a good first attempt: instructions, skills, templates, examples, specs,
  type definitions, code generators.
- **Sensors (feedback)** observe *after* the agent acts so it can correct
  itself: tests, linters, type checkers, architecture checks, reviewers,
  runtime signals.

Only guides → the agent follows rules nobody checks. Only sensors → the agent
repeats the same mistake every time. A good harness pairs them: a rule in a
doc **and** a check that enforces it.

## Two kinds of control

| | Computational | Inferential |
|---|---|---|
| Runs on | CPU, deterministic | Model, non-deterministic |
| Speed / cost | Milliseconds–seconds, cheap | Seconds–minutes, costly |
| Examples | Tests, lint, types, import rules, codemods | AI review, LLM-as-judge, review skills |
| Use for | Everything you can express as a rule | Semantics: intent, over-engineering, duplication |

Prefer computational. Add inferential where meaning matters, and calibrate it
against human judgement ([evaluators.md](../04-verify/evaluators.md)).

## Write sensor output for the agent

A sensor message is read by a model. It must say **what** failed, **why** it
matters, and **how to fix** it ([error-messages.md](../04-verify/error-messages.md)).

## Keep quality left — timing

Run each check as early as its cost allows; earlier is cheaper to fix.

| When | What runs |
|---|---|
| While editing (hooks) | Formatter, fast lint, type check on changed files |
| Before commit / end of task | Fast test suite, architecture rules, basic review |
| CI on the PR | Everything above again + full tests, e2e, mutation, deep review |
| Human review | The final sensor in the change flow |
| Continuously (scheduled) | Dead code, coverage quality, dependency scan, drift |
| Runtime | SLO alerts, log anomalies, sampled quality judgements |

## Three things a harness regulates

1. **Maintainability** — internal quality: duplication, complexity, style,
   coverage. Tooling is mature; easiest to harness.
2. **Architecture fitness** — fitness functions for structure, performance,
   observability (e.g. import-direction checks, latency budgets).
3. **Behaviour** — does the product do what users need? Hardest. Use specs as
   guides and e2e tests, approved fixtures and human acceptance as sensors.
   Do not trust agent-written tests alone.

## Harnessability

Some codebases are easier to harness: strong types, clear module boundaries,
fast deterministic tests, one-command startup, opinionated frameworks. For a
new project, choose these deliberately. For a legacy project, the harness is
most needed where it is hardest to build — start with the riskiest area.

## The steering loop

The human's main job is to steer: whenever a problem recurs, improve a guide
or add a sensor so it becomes unlikely or impossible. Agents can draft those
improvements; humans approve them.

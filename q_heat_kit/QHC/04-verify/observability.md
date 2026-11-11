# Observability inside the harness

Without observability you cannot tell "correct" from "looks correct";
evaluation becomes guesswork; retries are blind; handoffs lose information.

## Two layers

| Layer | Answers | Signals |
|---|---|---|
| **Runtime** | What happened when the code ran? | Structured logs, traces, metrics, health checks, process events |
| **Process** | Why should we accept this work? | Plans, sprint contracts, acceptance criteria, rubric scores, evidence |

## What the harness should collect at runtime

- App lifecycle: startup, ready, running, shutdown.
- Critical path execution: entry, checkpoints, exit for each golden journey.
- Data flow: inputs and outputs at boundaries (redact personal data and secrets).
- Resource use: memory growth, connection counts, queue depth.
- Errors with full context (request id, inputs, stack).

Make these queryable locally so the agent can run the loop:
**query → correlate → reason → implement → restart → rerun → verify.**
Document the commands in `docs/RELIABILITY.md`.

## Traces for agent work

Use OpenTelemetry where possible: one trace per session, one span per task,
child spans per verification step. A **task trace** is the replayable decision
path — what the agent did, in what order, with what result. Tools that store
session transcripts (append-only logs) give part of this for free.

A useful rule from one harness design: **anything visible to the model is
logged.**

## Process signals

- **Sprint contract** — before coding: scope, verification standards,
  exclusions, agreed between generator and evaluator (or agent and human).
- **Acceptance criteria** — per feature, in the feature list or spec.
- **Rubric scores** — per evaluation, stored with the evidence.

## Using observability to improve the harness

- Read transcripts of failed and slow sessions every week; classify by
  subsystem (diagnostic loop).
- Track tool-error rates by tool; a tool that errors often needs a better
  description, output or guard.
- Feed production signals (SLO breaches, error spikes) back as features.

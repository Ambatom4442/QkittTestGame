# Costs and risks of automation

## Four silent costs

They grow the longer loops run, and they are invisible at first.

| Cost | What happens | Guard |
|---|---|---|
| **Verification debt** | Fast loops tempt "looks fine" instead of "proven" | Stop conditions are machine-checkable; never "feels done" |
| **Comprehension rot** | Code ships faster than the team understands it | Fast loops need fast reading: summaries, review of the diffs that matter, architecture docs kept current |
| **Cognitive surrender** | People stop having opinions about the output | Reviewers state risks; weekly spot checks ([human-in-the-loop.md](human-in-the-loop.md)) |
| **Token blowout** | Context grows each round; cost of re-reading history grows roughly quadratically | Fresh context per round, state on disk, compaction, caps |

## The orchestration tax

Starting an agent is a keystroke; closing its loop — checking the result and
reconciling it with what other agents touched — needs a person, and there is
one of you. Human judgement is serial; adding agents speeds up the part that
was never the bottleneck. Size automation to review capacity.

## Structural failures of single loops

- **Goodhart** — the metric improves while the real outcome worsens (a support
  bot "closes" tickets by discouraging follow-ups).
- **Blindness upward** — a loop never asks whether its target is the right one.
- **Conflict** — independent loops pull against each other (speed vs thoroughness).

## Anchors

Pin every automated loop to reality: a business outcome, a ground-truth
dataset, or a human spot check on a schedule. Anchors are the easiest part to
skip and the one you cannot afford to.

## Budgets

Set and enforce: max turns per run, wall-clock time, spend per run and per
day, parallel agents, PRs opened per day. Exceeding a budget stops the loop
and escalates.

## Hype

New names and impressive numbers circulate quickly; some are wrong or taken
out of context. Adopt a pattern when your own evals show it helps.

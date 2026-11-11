# Auditing a harness

An audit answers: does this harness still do its job, and what is the next
best improvement? It is read-only and produces a report
([template](../../templates/docs/audit-report.md.tmpl)).

## When

- After `init` (acceptance), and after any hand-made harness change.
- Weekly as part of `maintain`; before `automate`.
- After a kit upgrade or model change.
- When a senior developer pulls the repo and edits the harness directly —
  `Q-HEAT audit` validates their work.

## What to check

| Area | Checks | Source |
|---|---|---|
| Integrity | Links resolve, files within size limits, registry scripts exist, manifest matches disk | `qhc_check.py` |
| Five subsystems | Score 1–5 each with evidence | [five-subsystems.md](../01-foundations/five-subsystems.md) |
| Fresh session | Five questions answered from repo files; files opened per answer | [system-of-record.md](../01-foundations/system-of-record.md#fresh-session-test) |
| Instructions | Length, hard-rule count, source/scope/expiry, contradictions, critical rules placement | [instruction-hygiene.md](../05-change/instruction-hygiene.md) |
| Sensors | Every blocking sensor runs automatically; none permanently silent untested; messages WHAT/WHY/FIX | [sensors.md](../04-verify/sensors.md) |
| State | `passing` always has evidence; WIP ≤ limit; VCR; progress recency | [state-and-scope.md](../02-create/state-and-scope.md) |
| Policy and safety | Permissions configured per platform; frozen paths owned; secrets absent; CODEOWNERS | [08-safety](../08-safety/README.md) |
| Drift | Commands in docs still run; docs match code; stale decisions | [cleanup.md](cleanup.md) |
| Metrics | Trend of the core metrics | [metrics.md](metrics.md) |
| Kit version | Manifest version vs kit; upgrade actions | [versioning.md](versioning.md) |

## Scoring summary

Report the five subsystem scores, the lowest area, and the top three fixes.
Treat the lowest score as a **candidate** bottleneck; confirm with real
failures (the diagnostic loop) before claiming it is the cause.

## Knowledge visibility gap (spot test)

Pick five facts a recent task needed. Count how many were discoverable in the
repo without asking a human. Target ≥ 90%.

## Harness debt

Record unresolved findings in `docs/exec-plans/tech-debt.md` with a trigger
for revisiting. An audit that finds the same item three times escalates it to
a human decision.

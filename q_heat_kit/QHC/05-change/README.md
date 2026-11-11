# 05 — Change: evolving the harness

A harness that does not change with the product goes stale and then misleads.
These pages define **when** the harness changes, **who** changes it, and **how**,
including when many developers and agents work on many branches at once.

| Page | Covers |
|---|---|
| [triggers.md](triggers.md) | The events that require a harness change, by type |
| [procedure.md](procedure.md) | The change procedure and the impact map |
| [requirement-intake.md](requirement-intake.md) | New requirement → scope doc → features → policy → sensors |
| [multi-developer.md](multi-developer.md) | Ownership, branches, conflicts, parallel agents, industry practice |
| [feedback-promotion.md](feedback-promotion.md) | Turning repeated review comments and failures into checks |
| [instruction-hygiene.md](instruction-hygiene.md) | Source / scope / expiry; placement; contradictions; pruning |

Command: [commands/change.md](../../commands/change.md).

## The core loop

```text
something changed ─► classify (trigger) ─► impact map ─► smallest edit
       ▲                                                      │
       │                                                      ▼
  observe next sessions ◄── PR + human approval ◄── verify (self-check + checks)
```

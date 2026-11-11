# 03 — Operate: how developer agents work inside the harness

These pages define the working rules that Q-HEAT writes **into the target
repo's** `AGENTS.md` and topic docs. Developer agents follow them; Q-HEAT
checks them during `audit`.

| Page | Rule it installs |
|---|---|
| [session-lifecycle.md](session-lifecycle.md) | Fixed clock-in / clock-out routine |
| [task-boundaries.md](task-boundaries.md) | One feature at a time; finish before starting |
| [definition-of-done.md](definition-of-done.md) | Done = verified in three layers, with evidence |
| [continuity.md](continuity.md) | State on disk; handoffs; compaction strategy |
| [clean-state.md](clean-state.md) | Every session ends restartable |

## The developer flow in one picture

```text
clock-in ─► baseline check ─► pick ONE feature ─► (plan / sprint contract)
   ▲                                                   │
   │                                                   ▼
clock-out ◄─ record evidence ◄─ verify 3 layers ◄─ implement in small commits
   │                    ▲                │
   │                    └── fix ◄────────┘ (fail)
   └─ if a harness rule is wrong or missing: propose `Q-HEAT change`, don't edit
```

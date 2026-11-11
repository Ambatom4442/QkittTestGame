# Loops

Loop engineering means designing the system that prompts the agent, instead of
prompting it yourself step by step. The human moves from inside the loop to
outside it: define the goal and stop condition, review results, adjust rules.

## Anatomy of a loop

Minimum three parts, plus the parts that make it safe:

| Part | Question | Example |
|---|---|---|
| **Goal** | What does the end state look like? | "All features in milestone M2 are `passing`" |
| **Verification** | How is progress checked — by whom? | `make check` + reviewer agent |
| **Stop condition** | When does it stop? | Goal met, budget spent, or a human decision needed |
| Budget | Max turns, time, money, parallelism | 40 turns, 3 h, $30 |
| State on disk | Where does each round read and write progress? | `harness/progress.md`, feature list |
| Isolation | Where does it run? | Worktree or container per run |
| Separate checker | Who judges "done"? | Not the maker's session |
| Escalation | Who is told, how, when it stops? | PR comment + chat message |

Template: [goal.md.tmpl](../../templates/automation/goal.md.tmpl).

## Which loop

**Does the work have an end?**

| Type | Trigger | Stops when | Platform examples | Use for |
|---|---|---|---|---|
| Turn-based | Human prompt | Agent thinks done / human interrupts | Normal chat | Small or exploratory work |
| Goal-based | Human gives a goal | Independent check confirms, or budget hit | `/goal` in Claude Code and Codex | Work with a clear finish line |
| Time-based | Schedule | Human stops it, or run exits | `/loop`, desktop/cloud scheduled tasks, cron | Watching, periodic checks |
| Event-driven | PR opened, CI failed, issue filed | Event handled or retries exhausted | Routines/webhooks, CI workflows | Reactive automation |

Has an end → goal loop. No end → timer or event loop. Do not put goal work in
a timer loop: each run starts from scratch and repeats the same beginning.

## Six primitives

1. **Automations** — the heartbeat: schedules and triggers.
2. **Worktrees** — isolation so parallel runs cannot collide.
3. **Skills** — written-down know-how so each run does not re-learn the project.
4. **Connectors (MCP)** — reach real tools: issue tracker, CI, chat, database.
5. **Sub-agents** — split maker from checker; isolate noisy work.
6. **External state** — memory on disk; the spine everything else relies on.

## A complete loop

```text
trigger ─► discover work (feature list / tracker) ─► dispatch sub-agent (worktree)
   ▲                                                       │
   │                                                       ▼
   └── work remains ◄── persist (progress, commit, PR) ◄── verify (checks + reviewer)
                              │
                              └── done or blocked ─► human review inbox
```

## A pattern worth copying: the ratchet

One public research loop split files by owner — fixed infrastructure (nobody
edits), the file the agent edits, and a methodology document the **human**
edits. Each experiment had the same fixed budget, every result was logged,
and only verified improvements were kept in git. Humans steer direction;
agents change code; the ratchet only moves forward.

## Start small

One goal loop on a recurring task, with a markdown state file and a separate
checker. Run daily for a week and watch it before widening.

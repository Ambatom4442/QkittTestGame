# Continuity across sessions

Context windows are finite. Compaction keeps *what* happened but tends to lose
*why*. The next session — or another person — must be able to continue from
repo files alone.

## Key metric: rebuild cost

Time a new session spends recovering context before doing useful work. A good
harness keeps it to a few minutes. Watch also for **drift**: each session
re-interprets the goal slightly differently when state is not written down.

## Persistent state files

| File | Holds |
|---|---|
| `harness/progress.md` | Current verified state (commit, tests x/y, lint, active feature, blocker, next step) + session log |
| `docs/decisions/` | Decision, reason, rejected alternative, constraint |
| `harness/feature_list.json` | What is passing, active, blocked |
| Git commits | Checkpoints with what + why in the message |
| `docs/exec-plans/active/` | Multi-session plans with a progress section |

## Strategy by task length

- **Short (< ~30 min)**: finish in one session; still record progress.
- **Long**: work in verified increments, commit each, write state after each.
- **Start the handoff when ~60% of the window is used**, not at the limit.
  Near a full window, agents rush and skip verification.
- After compaction, re-read the progress file and the active feature before continuing.

## Handoff note (four parts)

Template: [session-handoff.md.tmpl](../../templates/harness/session-handoff.md.tmpl).

1. **Repo state** — branch, last commit, what is committed vs not.
2. **Runtime state** — what was verified and how (test counts, journeys run).
3. **Blockers and risks** — known defects, unverified paths.
4. **Next actions** — the next best step, what counts as passing, and what
   must not change during it.

## Memory layers

| Layer | Who writes | Lives in |
|---|---|---|
| Instruction memory | Humans / Q-HEAT | `AGENTS.md`, docs (version-controlled) |
| Project state | Agents | Progress log, feature list, decisions (version-controlled) |
| Tool auto-memory | The tool | Tool-specific folders, machine-local |

Project facts belong in version-controlled files, not tool auto-memory, so
every person and agent sees them. Do not store derivable facts (code structure,
history) in memory — they go stale; read the code instead.

## Model differences

Some models show strong "context anxiety" (rushing near the limit); newer ones
less so. Handoff thresholds and reset-vs-compact choices are model-specific —
revisit them on model upgrades ([simplification.md](../06-maintain/simplification.md)).

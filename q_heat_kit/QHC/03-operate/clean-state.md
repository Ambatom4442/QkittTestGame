# Clean state

Entropy is the default: code systems degrade unless work is done to keep them
clean, and agents copy whatever patterns they find — including bad ones.
Every session must leave the repo so the next one can start immediately.

## Five conditions

1. **Build passes.**
2. **Tests pass** — including tests that existed before the session.
3. **Progress recorded** — progress log and feature states are current and machine-readable.
4. **No stale artifacts** — no debug logs, temp files, commented-out code,
   stray TODOs without an owner, leftover containers or ports.
5. **Startup path works** — the standard setup and start commands succeed.

Verify these in CI, not only locally. Checklist template:
[clean-state-checklist.md.tmpl](../../templates/harness/clean-state-checklist.md.tmpl).

## Session integrity

A session either commits a complete, verified step or rolls back. Half-done
work is never committed silently; if it must be saved, it goes on a branch and
the progress log says exactly what is unfinished.

## Two cleanup modes

| Mode | When | Who | Scope |
|---|---|---|---|
| Immediate | End of every session | Developer agent | Its own changes |
| Periodic | Weekly / per milestone | `Q-HEAT maintain` | Whole repo: drift, quality score, benchmarks |

Cleanup operations must be **idempotent** — safe to run twice.

## Evidence it matters

A 12-week comparison: without cleanup, build success fell to 68%, tests to
61%, startup took 60+ minutes, and 103 stale artifacts accumulated. With
cleanup: 97% / 95%, 9-minute startup, 11 stale artifacts.

## Golden rules (encode taste once)

Turn recurring cleanup into rules and checks rather than manual Fridays:
prefer shared utilities over copies; validate data at boundaries instead of
guessing shapes; follow the layer model; keep files and functions small.
See [cleanup.md](../06-maintain/cleanup.md).

# Q-HEAT status

Explain the harness in plain language to a person. Read-only.

## Steps

1. Startup per [AGENTS.md](../AGENTS.md#2-startup-every-invocation).
2. If not initialised: say so, list what `init` would create
   ([target-layout.md](../QHC/02-create/target-layout.md)), and stop.
3. Read `harness/manifest.json`, root `AGENTS.md`, `harness/feature_list.json`,
   `harness/progress.md`, `harness/sensors.json`, `harness/policy.json`.
4. Answer, in this order and without jargon:
   1. **What** the harness is for in this repo (one paragraph).
   2. **Reading order** for a newcomer: the 5–7 files to open first, one line each.
   3. **How a developer agent works here**: start, pick work, verify, finish.
   4. **What is checked automatically** and when (local, pre-commit, CI).
   5. **What is protected** (frozen paths, approvals).
   6. **Where things stand**: features passing / active / blocked / not started.
   7. **Who changes the harness** and how ([harness-surface.md](../QHC/00-constitution/harness-surface.md)).
5. Offer one diagram (text or mermaid) of the session flow if the user wants it.

# Q-HEAT commands

Each command is a procedure. Follow the steps in order, record evidence, and
stop at the marked human checkpoints (🛑).

| Command | File | Writes files? | Typical length |
|---|---|---|---|
| `init` | [init.md](init.md) | Yes, on a branch | 1–3 sessions |
| `change` | [change.md](change.md) | Yes, on a branch | Minutes to 1 session |
| `audit` | [audit.md](audit.md) | Report only | Minutes |
| `maintain` | [maintain.md](maintain.md) | Yes, on a branch | 1 session |
| `automate` | [automate.md](automate.md) | Yes, on a branch | 1 session |
| `status` | [status.md](status.md) | No | Minutes |

## Shared rules for every command

- Start with the startup steps in [../AGENTS.md](../AGENTS.md#2-startup-every-invocation).
- Branch name: `harness/<command>-<short-topic>` (for example `harness/change-payments-module`).
- Commit messages start with `harness:` so harness history is easy to filter.
- Every file you create must be listed in `harness/manifest.json`
  ([template](../templates/harness/manifest.json.tmpl)).
- Finish with the report in [../AGENTS.md](../AGENTS.md#5-how-you-finish).
- If a step cannot be done (missing tool, no access), record it as a gap in the
  report and keep going with the steps that do not depend on it.

## Choosing a command when the request is vague

| The user wants… | Command |
|---|---|
| "set up agents for this repo", "make this repo agent-ready" | `init` |
| "we're adding X", "new client requirement", "new service" | `change` |
| "is our harness OK?", "validate", "review the harness" | `audit` |
| "agents keep making a mess", "clean up", "simplify" | `maintain` (after `audit`) |
| "run overnight", "nightly", "on every PR", "parallel agents" | `automate` |
| "what is all this?", "explain the harness" | `status` |

# OpenAI Codex

Codex treats the repository as the system of record and `AGENTS.md` as a
directory page. Its design is the model for much of the QHC.

## Instructions

- Reads `AGENTS.md` files hierarchically: a global file in the user's Codex
  home, then from the repository root down to the working directory; the file
  closest to the work wins. Check the current docs for override files and
  size limits in your version.
- Keep the root file around 100 lines; move detail into `docs/` and link.
- List verification commands explicitly; Codex runs them as part of its work.

## Sandbox and approvals

- Sandbox modes range from read-only to workspace-write to full access; use
  workspace-write for development and read-only for review agents.
- Approval policies decide when Codex asks before running commands; keep
  asking on network and out-of-workspace writes for interactive work.
- For unattended runs (`codex exec` in CI or cron), set the sandbox and
  approval policy explicitly and run in a container or worktree.

## Isolation and parallelism

- Each task can run in its own git worktree, paired with a local observability
  stack (logs, metrics, traces) so changes are verified in isolation.
- Subagents run with their own context; definitions live in Codex
  configuration (e.g. agent definition files under `.codex/`). They inherit
  `AGENTS.md` from the parent.

## Context management

Write state to files; select via `AGENTS.md` links; compress with automatic or
manual compaction (a custom compaction prompt can preserve harness state);
isolate with subagents. Codex sends environment changes as deltas rather than
repeating the full context.

## Automations

Codex automations (thread heartbeats and standalone scheduled runs with a
triage inbox) and `codex exec` + cron cover timer and event loops; `/goal`
covers goal loops ([loops.md](../07-automate/loops.md)).

## Skills

Codex supports the Agent Skills format ([skills-standard.md](skills-standard.md));
check its docs for the repository skills folder in your version.

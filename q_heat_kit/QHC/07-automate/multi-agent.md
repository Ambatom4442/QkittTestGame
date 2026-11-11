# Multi-agent patterns

Use more than one agent for: context limits (research + implementation do not
fit one window), specialisation (researcher, implementer, reviewer),
parallelism, and maker/checker separation.

## Three delegation patterns

| Pattern | Shape | Use when | Guard |
|---|---|---|---|
| **Coordinator** | One lead synthesises and dispatches workers | Complex multi-phase tasks | Lead must understand results, not just forward them |
| **Fork** | Parent spawns children for a sub-task | Parallel exploration | **Single level**: children may not fork (cost explodes) |
| **Swarm / roster** | Flat team of persistent roles | Ongoing specialised teammates | Members cannot spawn members |

## Worker prompts must be self-contained

Workers start with **zero** context — they do not see the parent's
conversation. "Based on your findings…" is an anti-pattern. The coordinator
digests first, then writes a prompt with: task, background facts and
decisions already made, constraints (what not to touch), tools available,
expected output format, and how the result will be verified.

## Least privilege per role

| Role | Tools |
|---|---|
| Researcher | Read, search, web fetch; no writes |
| Implementer | Read, edit, run checks in its worktree; no push to protected branches |
| Reviewer | Read diff, run checks; no edits to code under review |
| Release/merge | Human, or a merge queue |

## Isolation

- One git worktree (or container) per writing agent; separate branches.
- Separate progress/session files per agent.
- Results come back as summaries; the bulky work (logs, searches) stays in the
  worker's context.

## Parallelism limits

Starting agents is cheap; reviewing and reconciling their work is not. The
human reviewer is the serial bottleneck ([costs-and-risks.md](costs-and-risks.md)).
Size parallelism to review capacity, and prefer non-overlapping file
ownership to avoid merge conflicts.

## Coordination patterns from public work

- Task locks: an agent claims a task by writing a lock file or claim commit
  before working; others skip claimed tasks.
- Git as the synchronisation point: agents pull, rebase, verify, push.
- Issue tracker as control plane: each issue is a unit; status changes are the signals.
- Clean-context reviewers and "ask a smarter model" escalation for hard decisions.

## Platform specifics

Subagent and custom-agent file formats: [09-platforms](../09-platforms/README.md).

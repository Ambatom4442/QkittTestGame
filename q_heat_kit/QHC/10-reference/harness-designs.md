# Lessons from product harness designs

How leading agent products implement the five subsystems, and what to copy.

## Claude Code — a complete runtime

- **Layered instructions** by scope (organisation, user, project, local) with
  subdirectory files loaded on demand.
- **Separation of extension types**: `CLAUDE.md` says *what*, skills say *how*,
  MCP says *where to connect*, hooks say *when to enforce*. Mixing them
  leaks context.
- **Compaction as a staged funnel**: lossless steps before lossy summaries.
- **Hooks** turn "do not claim done early" into a runtime rule (`Stop`, `PostToolUse`).
- **Subagents** keep their own transcript, so sub-tasks do not inflate the main context.
- **Append-only session storage** with resume and fork: handoffs rely on the
  storage layer, not on memory.

## Codex — subtraction

- Repository is the system of record; `AGENTS.md` is a ~100-line directory page.
- **Enforce invariants, not implementations**; verification commands in the spec.
- **Worktree per task** with a local observability stack.
- Context strategy: write, select, compress, isolate; send environment deltas only.
- Approval policies and plan mode put humans in front of risky steps.

## Pi — minimal core, programmable extensions

- Minimal system prompt; skills loaded on demand (cache-friendly, cheaper).
- **Pluggable compaction** and a **session tree** instead of forced summaries.
- The agent can modify its own harness through extension points.

## DeepSeek Harness — everything is a plugin

- The harness is a model-independent runtime; even the agent loop is a plugin.
- **Capability seams**: depend on capability interfaces, not concrete tools,
  so environments (local, remote sandbox) can be swapped.
- **Model-visible means logged**: everything the model sees is in an
  append-only event log — observability as a first principle.
- Permissions, guards and policies attach as listeners before tool execution.

## Designs Q-HEAT adopts

| Design | Where in the QHC |
|---|---|
| Entry file as directory page | [instructions.md](../02-create/instructions.md) |
| Scoped instructions near the code | [instruction-hygiene.md](../05-change/instruction-hygiene.md) |
| Deterministic hooks for completion | [claude-code.md](../09-platforms/claude-code.md) |
| Worktree isolation | [multi-agent.md](../07-automate/multi-agent.md) |
| Context isolation via subagents | [context-engineering.md](../01-foundations/context-engineering.md) |
| Everything visible is logged | [observability.md](../04-verify/observability.md) |
| Swappable environments | [environment.md](../02-create/environment.md) |

Contrast to remember: some products put memory, permissions and subagents
into the core (addition); others keep the core small and rely on repository
conventions (subtraction). Q-HEAT generates repository conventions that work
with either.

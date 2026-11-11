# Context engineering

Context is a finite **attention budget**. Every token the model reads draws it
down, and accuracy falls as context grows (**context rot**). The goal is the
smallest set of high-signal tokens that gets the task done.

## Four operations

| Operation | Meaning | Harness mechanism |
|---|---|---|
| **Write** | Persist knowledge outside the window | Progress log, decision records, docs |
| **Select** | Load only what this task needs, when it needs it | Entry file links, path-scoped rules, skills |
| **Compress** | Shrink old context without losing what matters | Compaction, handoff notes, clearing old tool output |
| **Isolate** | Keep sub-tasks from polluting the main context | Subagents, worktrees, separate sessions |

## Rules for harness authors

1. **Right altitude.** Neither brittle step-by-step scripts nor vague advice.
   Start minimal; add an instruction only after a real failure shows it is needed.
2. **Progressive disclosure.** Startup context: repo purpose, stack (one line),
   commands, hard rules, active feature. Everything else loads on demand via
   links with an applicability condition ("read when adding an endpoint").
3. **Canonical examples over rule lists.** Two or three good examples teach a
   pattern better than twenty edge-case rules.
4. **Tools: few, clear, non-overlapping.** If a person cannot tell which tool
   to use, the agent cannot either. Tool output should be token-efficient.
5. **Hard caps on variable-length content** (logs, search results) with a
   pointer to the full output ("full log: `logs/test.txt`").
6. **Just-in-time retrieval.** Keep paths, queries and links in context; load
   the content when used.
7. **Lossless before lossy.** Drop stale tool results before summarising;
   summarise before discarding.
8. **Critical rules at the top or bottom** of a file, never buried in the
   middle — models recall the middle worst.

## Long-horizon techniques

- **Compaction** keeps the "what" but tends to lose the "why"; write the why to
  disk first ([continuity.md](../03-operate/continuity.md)).
- **Structured notes** (progress, decisions) survive any window.
- **Subagents** do noisy work (searches, test runs, log analysis) in their own
  context and return a summary.
- **Start a handoff** when roughly 60% of the window is used, not at 95%.

## Evidence on instruction files

Results are mixed, so measure in your own repo:

- A study of `AGENTS.md` files (gpt-5.2-codex, 10 repos, 124 PR tasks) found
  ~29% lower runtime and ~17% fewer output tokens.
- An ETH Zurich study found context files did not generally raise success and
  added ~20% cost — keep human-written requirements minimal and test them.

The lesson is not "no instruction file". It is "short, specific, tested".

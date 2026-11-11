# The repository is the system of record

An agent sees three things: its prompt, the repository files, and tool
output. Knowledge that lives in chat threads, wikis, tickets or people's heads
is invisible. **If it is not in the repo, it does not exist** (article 1).

## Terms

- **Knowledge visibility gap** — share of the facts needed for a task that are
  not discoverable in the repo. Aim below 10%.
- **Discovery cost** — how many files and steps it takes to find a fact.
- **Knowledge decay** — docs go stale; a stale doc is worse than none because
  the agent trusts it.

## Principles

1. **Knowledge next to the code it governs** — module-level `ARCHITECTURE.md`
   or nested `AGENTS.md` beside the module, not a distant wiki.
2. **A standard entry file** — the root `AGENTS.md` answers what / how to run /
   how to verify in under a minute of reading.
3. **Minimal but complete** — every fact a task needs, nothing it does not.
4. **Update docs with code** — in the same PR. CI reminds when code under a
   documented module changes without its doc.
5. **Encode unseen knowledge** — when someone says "we decided in Slack",
   write it into the matching repo file the same day
   ([knowledge-docs.md](../02-create/knowledge-docs.md#encoding-unseen-knowledge)).

## Fresh-session test

Start a new agent session with no chat history. It must answer from repo files:

| # | Question | Usually answered by |
|---|---|---|
| 1 | What is this project? | `AGENTS.md`, `README.md` |
| 2 | How is it organised? | `ARCHITECTURE.md`, module docs |
| 3 | How do I run it? | `init.sh`, `Makefile`, `AGENTS.md` quick start |
| 4 | How do I verify my work? | `AGENTS.md` verify section, `harness/sensors.json` |
| 5 | Where are we, what is next? | `harness/progress.md`, `harness/feature_list.json`, `git log` |

Pass = all five answered correctly, each within a few file reads. Run this
test at the end of `init` and in every `audit`.

## State with ACID properties

Treat harness state like a database:

- **Atomic** — commit one verified logical step at a time; discard failed work
  rather than committing half of it.
- **Consistent** — run the verification predicates before committing state.
- **Isolated** — parallel agents use separate branches/worktrees and separate
  progress files.
- **Durable** — state files are tracked in git, not kept in memory or chat.

## Public reference point

OpenAI reported about 1,500 PRs over five months (~3.5 PRs per engineer per
day) with the repo as the only source of truth, a structured `docs/` folder,
and checks for doc freshness and cross-links.

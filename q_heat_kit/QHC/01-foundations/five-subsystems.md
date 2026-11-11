# The five subsystems

Every harness has five parts. Q-HEAT designs, audits and scores each one.

| Subsystem | Question it answers | Typical artifacts |
|---|---|---|
| **Instructions** | What is this, what are the rules, where do I look? | `AGENTS.md`, `CLAUDE.md`, topic docs, skills |
| **Tools** | What can I do and touch? | Shell, file edit, browser, MCP servers, permissions |
| **Environment** | Can I run it the same way every time? | `init.sh`, lock files, runtime version files, devcontainer, sandbox |
| **State** | What is done, in progress, blocked, next? | `feature_list.json`, `progress.md`, decision records, git history |
| **Feedback** | Is my work correct? | Tests, type checks, lint, architecture checks, e2e, reviewers |

## Principles across all five

- **Map, not manual** — instructions point to detail; they do not contain it.
- **Constrain, don't micromanage** — enforce invariants; leave choices open.
- **Enough access, least privilege** — do not disable the shell to be safe;
  restrict what is dangerous instead.
- **Self-describing environment** — the repo says how to set itself up.
- **Separate maker from checker** — feedback the agent cannot talk itself past.
- **Feedback has the highest return** — if you can only add one thing, add
  runnable verification commands.

## A typical improvement path

Teams commonly see roughly: no harness ~20% task success → add `AGENTS.md`
~60% → add verification commands ~80% → add progress/state ~80–100% on
multi-session work. Numbers vary; the order of returns is consistent.

## Measuring a subsystem's value

- **Controlled removal**: on the same tasks, remove one subsystem and compare
  results. The drop is its marginal value.
- **Failure attribution**: classify each failure by subsystem (diagnostic
  loop); the most frequent class is the bottleneck. Use attribution to find
  the bottleneck and removal to confirm it.

## Scoring (used by `Q-HEAT audit`)

| Score | Meaning |
|---|---|
| 1 | Missing |
| 2 | Exists but wrong, stale, or unused |
| 3 | Present and correct but manual or incomplete |
| 4 | Complete, current, and used every session |
| 5 | Complete, enforced by checks/CI, and measured |

Record one line of evidence for each score. The lowest score is the next
thing to improve — confirm with real failures before claiming it is the cause.

## Two gulfs

- **Gulf of execution** — the agent does not know *how* (fix with
  instructions, tools, environment).
- **Gulf of evaluation** — the agent does not know *whether it is right*
  (fix with feedback and state).

The harness rots like code. Unmaintained, each subsystem drifts; see
[06-maintain](../06-maintain/README.md).

# The stack: prompt → context → harness → loop → graph

Each layer stacks on the one below; none replaces it.

| Layer | Controls | Question | Main artifacts |
|---|---|---|---|
| Prompt | The instruction | How do we tell the model what to do? | Task text, examples, output format |
| Context | The information | What should the model know before deciding? | Docs, history, memory, tool definitions |
| Harness | The execution system | How does one run stay reliable and resumable? | The five subsystems |
| Loop | The runtime | How does work continue until a goal is met without a human prompting? | Goal, verification, stop condition, schedule |
| Graph | The system of agents | How do many agents, loops, tools and people work together? | Nodes, edges, shared state, routing |

## What this means for Q-HEAT

- `init`, `change`, `maintain` work at the **harness** layer and make single
  sessions reliable.
- `automate` works at the **loop** and **graph** layers and makes runs
  continuous. It only amplifies the harness underneath (article 15).
- Inside every loop node there is still a prompt and a context; the harness
  rules keep applying.

## Maturity ladder

| Level | You have | Typical next step |
|---|---|---|
| 0 | Prompts only | `Q-HEAT init` (minimal tier) |
| 1 | Harness: instructions, state, verify | Standard tier, CI gate |
| 2 | Goal runner: `/goal` with a machine stop condition | One scheduled loop |
| 3 | Scheduled loops; maker and checker split; worktrees | Event-driven loops |
| 4 | Self-feeding: loop picks its next task from the feature list | Explicit graph |
| 5 | Fleet: several loops sharing memory, with anchors | Ongoing governance |

Most teams sit at levels 2–3. Level 1 done well gives the largest return.

## Do not chase names

New terms appear every few weeks. The engineering that lasts is: work that
can be **replayed**, **observed** and **recovered**. Judge any new pattern by
whether it improves those three.

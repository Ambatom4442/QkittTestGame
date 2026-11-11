# Graphs

When one loop is not enough — several specialised agents, parallel work,
rollbacks, approvals — the structure becomes a graph. A graph is not new: it is
a workflow whose nodes may be full agents. The new part is that nodes became
cheap, so graphs became worth drawing.

## Four parts

| Part | Meaning |
|---|---|
| **Nodes** | Units of work: deterministic code, a model call, a tool, a full agent with its own loop, or a human approval |
| **Edges** | Hand-offs: sequence, parallel fan-out/fan-in, conditional, retry, rollback |
| **Shared state** | The only thing nodes share (requirements, code ref, test results, review verdict, attempt count). Each node's context stays private. |
| **Routing rules** | Where execution goes next: tests pass → merge; fail → implement; missing info → research |

## Loop vs graph

- A loop is a **deferred** decision: one agent handles everything; failures
  are hidden inside its context. Cheap; good for exploration.
- A graph is an **up-front** decision: you declare who owns what, how tasks
  depend, where each failure returns. More work; readable, auditable, locally
  repairable. Good for production.

## When you need a graph

Score these five; build a graph only if **three or more** hold:

1. The task decomposes into independent work units.
2. There are real branch or rollback paths.
3. Intermediate state is worth saving (pause/resume).
4. Every node's result can be verified explicitly.
5. Coordination benefit exceeds coordination cost.

"Many steps" is not a reason — a 20-step linear pipeline is a script. Five
nodes with real rollback, parallelism and approval is a graph.

## Building one

1. Define the shared state and who reads/writes each field.
2. List nodes: type (agent / code / human), inputs, outputs. The **verify node
   gets a fresh context** — it sees the code in state, never the implementer's reasoning.
3. Wire edges; mark conditional and rollback edges.
4. Write the routing table in plain if-then form.
5. Checkpoint state after every step; add `pause before merge` for human approval.
6. Run with a thread/run id so runs can be resumed and compared.

Write it as `docs/harness/graphs/<name>.md` ([template](../../templates/automation/graph.md.tmpl)).
The document and the implementation (LangGraph, Agent SDKs, CI workflow) must
match one-to-one; a mismatch is a bug in one of them.

## Questions for systems of loops

Which loops feed which? Who owns the targets other loops chase? Which loop can
veto or roll back another's output? Which metrics may move and which are frozen?
If you cannot answer these, do not draw the graph yet.

## Anthropic's five composable patterns

Prompt chaining, routing, parallelisation, orchestrator–workers,
evaluator–optimiser. Most useful graphs are combinations of these.

## Remember

Shape is the easy part and is disposable. What lasts is **replayability,
observability and recoverability**.

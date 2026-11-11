# State and scope

## The feature list

`harness/feature_list.json` ([template](../../templates/harness/feature_list.json.tmpl))
is the single source of truth for **what to build**. It serves as scheduler,
verifier input, progress tracker and handoff report at once.

Each feature is a triple plus evidence:

| Field | Meaning |
|---|---|
| `id` | Stable id, e.g. `F-012` |
| `behavior` | What a user can do when it works — one sentence |
| `verification` | The exact command(s) that prove it |
| `state` | `not_started` · `active` · `blocked` · `passing` |
| `evidence` | Command output summary, date, commit — written by the check, not by hand |
| `depends_on` | Feature ids that must be `passing` first |
| `priority`, `owner`, `source` | Order, assignee (agent slot or person), requirement reference |

### State rules

- Transitions: `not_started → active → passing`; `active ↔ blocked`.
- Only a successful verification run sets `passing` (pass-state gating). The
  agent never edits `state: passing` by hand.
- `passing` is sticky: a later regression creates a new fix feature or flips
  back via the check, with the reason recorded.
- `blocked` needs a reason and what would unblock it.

### Granularity

One feature = completable and verifiable in one session.
- Too broad: "implement cart".
- Right: "user can add an item to the cart and see the count update".
- Too narrow: "create name field".

### Writing features from requirements

1. Split each requirement into user-visible behaviours.
2. For each, write the verification command before any code exists.
3. Order by dependency (providers before consumers), then by priority.
4. Record `source` (requirement id, document, ticket) for traceability.

Case data: unstructured notes → ~20 min re-inferring scope per session plus
rework; a structured list → ~3 min and no rework.

## The progress log

`harness/progress.md` ([template](../../templates/harness/progress.md.tmpl)) holds
the **current verified state** at the top (commit, test pass counts, active
feature, blocker, next step) and a **session log** below (date, goal, done,
verification run, evidence, commits, risks, next best step). Read at clock-in,
written at clock-out.

## Decisions

Non-trivial choices made during work go to `docs/decisions/`: decision,
reason, rejected alternative, constraint it creates. Agents re-litigate
decisions they cannot see.

## Scope surface and WIP

The feature list plus `depends_on` forms a graph of work. The harness lets an
agent activate only one feature at a time and blocks new activations while
active features are unverified. Details: [task-boundaries.md](../03-operate/task-boundaries.md).

## Multi-developer variant (advanced tier)

One JSON file edited on many branches causes merge conflicts. Use
`harness/features/<id>.json` (one file per feature) and
`harness/sessions/<branch>.md` (one log per branch or agent slot), with a
script that builds a combined view. See [multi-developer.md](../05-change/multi-developer.md).

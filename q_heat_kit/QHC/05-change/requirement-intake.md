# Requirement intake: from request to harness-ready work

How a new requirement becomes features that developer agents can pick up
safely. This is the most common `Q-HEAT change`.

## Flow

```text
inputs (ticket, client call, QA bug, roadmap)
   │
   ▼
1. scope doc ── docs/product-specs/<area>-<topic>.md (draft by agent, provenance tagged)
   │
   ▼
2. human settles scope ── sizes, priorities, open questions answered  🛑
   │
   ▼
3. decision records ── for new areas, frozen-path openings, new dependencies  🛑
   │
   ▼
4. features ── entries in the feature list (behaviour, verification, deps, source)
   │
   ▼
5. harness updates ── policy (scope), sensors, ARCHITECTURE.md, nested AGENTS.md
   │
   ▼
6. PR merged ── developer agents pick features in dependency order
```

## 1. Scope doc

Template: [product-spec.md.tmpl](../../templates/docs/product-spec.md.tmpl).
- Problem, users, behaviours, acceptance criteria, out of scope.
- **Provenance tag** on every item: where it came from (ticket id, meeting
  date, person) so a reviewer can trace it.
- Size each item S / M / L; L items must be split before becoming features.
- Open questions listed explicitly, never guessed.

## 2–3. Human checkpoints

The product owner or architect settles scope and answers open questions.
Anything that opens a frozen area, adds a dependency, changes a public API or
data schema gets a decision record accepted by a human.

## 4. Cutting features

- One deliverable per feature, verifiable in one session.
- **One repository per change** in multi-repo products; the consumer feature
  depends on the provider feature.
- Write the verification command before implementation starts. For UI, name
  the browser journey.
- `source` links back to the scope-doc item.

## 5. Harness updates

- New invariant ("amounts are always integers in cents") → a check.
- New module → `ARCHITECTURE.md` row, boundary rule, CODEOWNERS line.
- Opening a frozen path → additive line in `policy.json` with decision id and date.
- New external system → `SECURITY.md`, env vars, sandbox/network rules.

## 6. Handing over

The PR description lists the new features in order. Developer agents start
with clock-in and pick the first feature whose dependencies pass.

## Teams using spec-driven development (Spec Kit)

The flow above matches spec-driven development; map, don't duplicate:

| Spec Kit | Harness equivalent |
|---|---|
| `constitution.md` | `AGENTS.md` hard rules + `ARCHITECTURE.md` rules + decision records |
| `/specify` → `spec.md` | `docs/product-specs/` (what and why) |
| `/plan` → `plan.md` | `docs/exec-plans/active/` + decision records (how) |
| `/tasks` → `tasks.md` | Feature entries with verification commands |

Keep one of each; if Spec Kit files exist, link them from the harness instead
of copying their content.

## Where agents claim work

In team setups an agent "claims" a feature by setting `owner` and `state:
active` on its branch with a claim commit (`WIP: F-012 … [claim]`). The claim
is visible to others once pushed; another agent does not take a claimed feature.

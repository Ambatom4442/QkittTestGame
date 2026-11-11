# Knowledge docs

The `docs/` tree and `ARCHITECTURE.md` hold everything an agent may need but
should not read every session.

## `ARCHITECTURE.md`

Template: [ARCHITECTURE.md.tmpl](../../templates/root/ARCHITECTURE.md.tmpl). Contains:

- **System shape** — product, main workflow, runtime surfaces (web, API, worker, CLI).
- **Domain map** — table: domain, purpose, entry points, related spec.
- **Layer model** — a fixed direction such as
  `Types → Config → Repo → Service → Runtime → UI`; lower layers never import
  higher ones. Cross-cutting concerns (auth, logging, external APIs, flags)
  enter through named providers.
- **Hard dependency rules** — the invariants checks enforce
  ([e2e-and-boundaries.md](../04-verify/e2e-and-boundaries.md)).
- **Hot spots** — areas hardest to change safely.

Define boundaries on day one: agents copy existing patterns, including bad ones.

## Decision records — `docs/decisions/`

One file per decision: `ADR-0001-short-title.md`
([template](../../templates/docs/decision.md.tmpl)). Fields: status
(proposed / accepted / superseded), date, context, decision, alternatives
rejected and why, consequences, constraints it creates. Write one when a
choice affects more than one module, changes a rule, or would surprise a
newcomer. Agents and Q-HEAT draft; humans accept.

## Other docs

| Path | Holds | Template |
|---|---|---|
| `docs/product-specs/` | Behaviour and acceptance targets per feature area | [product-spec](../../templates/docs/product-spec.md.tmpl) |
| `docs/exec-plans/active/` | Plans for work spanning sessions or subsystems | [exec-plan](../../templates/docs/exec-plan.md.tmpl) |
| `docs/exec-plans/tech-debt.md` | Known, deferred debt with a revisit trigger | [tech-debt](../../templates/docs/tech-debt.md.tmpl) |
| `docs/QUALITY_SCORE.md` | Grades by domain and layer | [quality-score](../../templates/docs/quality-score.md.tmpl) |
| `docs/RELIABILITY.md` | Standard paths, runtime signals, golden journeys | [reliability](../../templates/docs/reliability.md.tmpl) |
| `docs/SECURITY.md` | Secrets, untrusted input, approval-required actions | [security](../../templates/docs/security.md.tmpl) |
| `docs/references/` | Vendor docs pinned as `*-llms.txt` | — |

An execution plan is required when work spans more than one session, touches
more than one subsystem, carries rollout risk, or depends on open decisions.

## Encoding unseen knowledge

When knowledge lives outside the repo (chat, wiki, tickets, someone's head):

1. List the sources.
2. Classify each fact: architecture, product behaviour, design rationale,
   execution state, external reference, quality/reliability expectation, security.
3. Write it into the matching file above, in operational wording ("X must…").
4. Delete or mark stale any other copy so the repo has one truth.
5. Do it in the same session the decision is made.

Signals that this is needed: agents keep asking how something works; people
say "we decided in Slack"; reviews cite rules that are not written anywhere.

## Freshness

- Each doc names its owner and the code it describes.
- CI warns when code under a documented path changes without its doc
  ([ci-cd.md](../07-automate/ci-cd.md)); `maintain` checks links and staleness.

# QHC — Quadwave Harness Engineering Agent Constitution

The QHC is the rulebook Q-HEAT follows to **create, change, maintain and
automate** a harness. It is general: nothing in it is specific to one project.
Project facts live in the project's own harness files.

Read the [articles](00-constitution/articles.md) first. Load any other page only
when a command or another page links to it — the QHC follows its own rule of
progressive disclosure.

## Chapters

| # | Chapter | Answers | Used by |
|---|---|---|---|
| 00 | [Constitution](00-constitution/README.md) | The non-negotiable articles, who owns what, terms | Every command |
| 01 | [Foundations](01-foundations/README.md) | What a harness is and why it works | `init`, `status` |
| 02 | [Create](02-create/README.md) | How to build a new harness from requirements | `init` |
| 03 | [Operate](03-operate/README.md) | How developer agents work inside the harness | `init` (writes these rules into the repo) |
| 04 | [Verify](04-verify/README.md) | Sensors, tests, evaluators, observability, evals | `init`, `change`, `audit` |
| 05 | [Change](05-change/README.md) | Evolving the harness as requirements and teams change | `change` |
| 06 | [Maintain](06-maintain/README.md) | Cleanup, quality, audit, simplification, metrics, versions | `audit`, `maintain` |
| 07 | [Automate](07-automate/README.md) | Loops, graphs, multi-agent, CI/CD, human escalation | `automate` |
| 08 | [Safety](08-safety/README.md) | Threats, permissions, sandbox, secrets, harness supply chain | Every command |
| 09 | [Platforms](09-platforms/README.md) | Which files Claude Code, VS Code, Codex and others read | `init`, `change` |
| 10 | [Reference](10-reference/README.md) | Failure map, product designs, case data, anti-patterns, sources | On demand |

## Reading order for a person new to harness engineering

1. [articles.md](00-constitution/articles.md) — 15 rules on one page.
2. [why-harnesses.md](01-foundations/why-harnesses.md) — the problem.
3. [five-subsystems.md](01-foundations/five-subsystems.md) — the model.
4. [guides-and-sensors.md](01-foundations/guides-and-sensors.md) — the control view.
5. [session-lifecycle.md](03-operate/session-lifecycle.md) — what agents actually do.
6. [target-layout.md](02-create/target-layout.md) — what a finished harness looks like.
7. [failure-map.md](10-reference/failure-map.md) — symptom → fix lookup.

## How the chapters connect

```text
foundations ──► create (init) ──► operate (daily dev work)
                     │                 │
                     ▼                 ▼
                   verify ◄──────── change ◄── new requirements, failures, reviews
                     │                 │
                     ▼                 ▼
                 maintain ───────► automate (loops, graphs, CI)
          safety and platforms apply to every step
```

## Size rule for this folder

Every page stays under ~150 lines. If a page needs more, split it and link.
`scripts/qhc_check.py` enforces this.

# ARCHITECTURE.md - Q-Game

## System shape

- Product: Browser-based detective game (The Speckled Band).
- Runtime surfaces: web client, JSON API, SQLite persistence.
- Related repositories: none identified.
- Behavior source of truth: requirements/ and architecture/.

## Domain map

| Domain | Purpose | Entry points | Spec source |
|---|---|---|---|
| requirements | Product behavior and acceptance targets | requirements/*.md | requirements/README.md |
| architecture | Technical design and boundaries | architecture/*.md | architecture/README.md |
| shared | Common typed contracts and helpers | shared/src/* | architecture/06-repo-layout.md |
| harness | Policy, checks, feature state | harness/* | q_heat_kit/QHC/* |

## Layer model

Dependencies are one-way:

Types -> Config -> Repo -> Service -> Runtime -> UI

Current init skeleton includes only shared and harness layers.

## Hard dependency rules

| Rule | Check id |
|---|---|
| Shared code must not import client/server/content runtime modules | S-020-lint-boundaries |
| Feature behavior must map to requirement ids | S-090-traceability |
| Policy and frozen paths must be enforced per branch | S-080-policy |
| Harness integrity and doc links must remain valid | S-001-qhc |

## Cross-cutting concerns

- Security and approvals: docs/SECURITY.md and harness/policy.json.
- Reliability path: docs/RELIABILITY.md.
- Quality tracking: docs/QUALITY_SCORE.md.

## Hot spots

- Server-side rule validation and no-answer leakage (NFR-52).
- Save compatibility and autosave reliability (FR-03, NFR-41).
- Boundary enforcement between gameplay runtime and rule/data validation.

## Decisions

- docs/decisions/ADR-0001-initial-stack.md
- docs/decisions/ADR-0002-harness-tier.md

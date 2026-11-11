# Amending the QHC

The kit is shared across many repositories, so changes to it are released
deliberately. Product repositories never edit their copy of `q_heat_kit/`.

## Who changes the kit

The kit maintainers (the team that publishes `q_heat_kit` in its own Git
repository). Anyone can propose a change by opening an issue or PR there.

## When to amend

- A failure pattern appears in two or more projects and the QHC has no rule
  for it, or its rule did not prevent it.
- An article or page contradicts another page.
- A platform changed the files it reads ([09-platforms](../09-platforms/README.md)).
- Evidence (ablation, case data) shows a rule no longer earns its cost.

Local, project-only lessons do **not** belong in the kit. They go into that
project's harness via `Q-HEAT change`.

## How

1. Open a PR against the kit repository with: the problem, evidence from at
   least one project, the proposed text, and which version bump it implies.
2. Keep pages under ~150 lines; run `python scripts/qhc_check.py --kit .`.
3. Update [CHANGELOG.md](../../CHANGELOG.md) and [VERSION](../../VERSION)
   ([versioning.md](../06-maintain/versioning.md)).
4. Two maintainers approve changes to [articles.md](articles.md); one approves
   other pages.

## Adding a new article

Only when a rule is both universal (true for every project) and
non-negotiable. Otherwise it is a page in a chapter. Keep the list short:
more articles means each one is read less carefully.

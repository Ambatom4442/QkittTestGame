# Versioning

Two things have versions: the **kit** (this folder) and each project's
**harness**.

## The kit

- `q_heat_kit/VERSION` uses semver; `q_heat_kit/CHANGELOG.md` explains changes.
- **Major**: an article, the target layout, or a file schema
  (`manifest.json`, `sensors.json`, `policy.json`, feature list) changes incompatibly.
- **Minor**: new pages, commands, templates, platform support.
- **Patch**: wording and link fixes.
- Projects pin the kit by committing the folder at a known version. Never edit
  it in place; local needs go into the project harness.

## The project harness

- `harness/manifest.json` records `kit_version` used, `tier`, `created`,
  `updated`, every harness file with its owner and template of origin, and
  path deviations from the target layout.
- `harness/CHANGELOG.md` records every harness change: date, PR, summary,
  trigger, files.
- Schemas carry a `schema_version` field so checks can read old and new forms.

## Upgrading the kit in a project

1. Replace `q_heat_kit/` with the new release on a branch `harness/kit-<version>`.
2. Run `Q-HEAT audit`. It compares the manifest's `kit_version` with the new
   `VERSION` and reads the kit changelog between them.
3. It lists upgrade actions: new recommended files, schema migrations, changed
   rules. Each action maps to a `Q-HEAT change`.
4. Apply the actions in the same branch or follow-ups; update `kit_version`.
5. PR, review, merge.

## Distributing the kit

Publish `q_heat_kit` from its own Git repository with tagged releases. Teams
copy a release into their repo. Optionally also publish the adapters as a
plugin or marketplace entry for Claude Code or VS Code so the `/q-heat`
command is installed centrally ([adapters](../../adapters/README.md)).

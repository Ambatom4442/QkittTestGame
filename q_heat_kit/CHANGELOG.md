# Q-HEAT kit changelog

Versioning follows semver: **major** = a QHC article or the target layout
changes incompatibly; **minor** = new pages, commands or templates; **patch** =
wording and link fixes. See [versioning.md](QHC/06-maintain/versioning.md).

## 1.0.1 — 2026-11-11

- `policy_check.py` template: read the branch from `GITHUB_HEAD_REF`/`GITHUB_REF_NAME`
  when `BRANCH_NAME` is unset (detached CI checkouts reported `HEAD` and failed every
  harness PR); exclude lock and generated files from size limits; exempt the init PR
  from size limits automatically; clear error when the base branch is missing.
- `harness-check.yml` template: `BRANCH_NAME` set at job level so `npm run check` sees it.
- `policy-setup.md`: documents the above.

## 1.0.0 — 2026-11-11

- First release.
- QHC chapters 00–10: constitution, foundations, create, operate, verify,
  change, maintain, automate, safety, platforms, reference.
- Commands: init, change, audit, maintain, automate, status.
- Templates for the minimal, standard and advanced harness tiers.
- Adapters for Claude Code (skill + subagent) and VS Code (custom agent + prompt files).
- `scripts/qhc_check.py` self-check.

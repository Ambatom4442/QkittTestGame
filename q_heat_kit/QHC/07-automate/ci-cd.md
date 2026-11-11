# CI/CD integration

Local discipline is not enough: the harness must be enforced where every
change passes — CI on the pull request.

## Harness check workflow

Template: [harness-check.yml.tmpl](../../templates/ci/harness-check.yml.tmpl)
(GitHub Actions; adapt for Azure Pipelines, GitLab, Jenkins). On every PR:

1. Set up the environment from the standard setup path (same as agents use).
2. Run `make check` (all blocking sensors in `harness/sensors.json`).
3. Run `python q_heat_kit/scripts/qhc_check.py --harness .`.
4. Run the policy check: frozen paths, harness paths without decision record,
   PR size limits.
5. Upload evidence (test reports, screenshots) as artifacts.

Make the workflow a **required status check** in branch protection — a human
sets this in the repository settings.

## Other CI hooks

| Job | When | Purpose |
|---|---|---|
| Doc freshness | PR | Warn when code under a documented path changes without its doc |
| Drift scan | Nightly | Dead code, dependency vulnerabilities, broken links |
| Eval suite | Weekly / on harness PR | Harness regression ([evals.md](../04-verify/evals.md)) |
| Cleanup loop | Weekly | `maintain` scans, small PRs ([loop-recipes.md](loop-recipes.md)) |

## Pre-commit and agent hooks

- `pre-commit` (or Husky, lefthook) runs `check-fast` locally for humans and agents.
- Agent hooks run checks inside the session (after edit, before stop) —
  faster feedback than CI ([09-platforms](../09-platforms/README.md)).
- Hooks complement CI; they never replace it (they can be skipped or fail open).

## Agents running in CI

- **GitHub Copilot cloud agent**: environment prepared by
  `.github/workflows/copilot-setup-steps.yml` ([github-copilot-cloud.md](../09-platforms/github-copilot-cloud.md)).
- **Claude Code / Codex headless** in CI jobs: run with explicit permission
  settings, a narrow token, network allowlist, and a time budget.
- **Scheduled cloud tasks or routines**: for loops that must run while laptops
  are off.

Agent jobs in CI get a token that can push branches and open PRs but cannot
merge, change branch protection, or read production secrets.

## Deployments

Agents may deploy to preview or sandbox environments for testing. Production
deploys stay behind human approval (environment protection rules).

## Multi-repo

When a feature spans repositories, each repo has its own harness and CI; the
consumer's CI pins the provider's version or contract. The cross-repo map in
`ARCHITECTURE.md` names the order.

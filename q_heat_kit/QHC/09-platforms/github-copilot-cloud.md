# GitHub Copilot cloud agent

Copilot can work on issues in GitHub's cloud, opening PRs from a hosted
environment. The harness must prepare that environment and keep its rules.

## Environment: `copilot-setup-steps.yml`

- Path: `.github/workflows/copilot-setup-steps.yml`, on the default branch.
- Exactly one job named `copilot-setup-steps`.
- Its steps run before Copilot starts: install tools and dependencies, start
  services — reuse the harness setup path (`./init.sh` or `make setup`).
- Honoured keys: `steps`, `permissions`, `runs-on`, `services`, `snapshot`,
  `timeout-minutes` (≤ 59). Other keys are ignored.
- Runners: GitHub-hosted Ubuntu by default; larger or self-hosted runners
  possible (Ubuntu x64 and Windows x64; no macOS).

Template: [copilot-setup-steps.yml.tmpl](../../templates/ci/copilot-setup-steps.yml.tmpl).

## Firewall

The agent's network is restricted by an allowlist. Add only the hosts your
setup and tests need (package registries, your artifact store). Self-hosted
runners need the integrated firewall disabled and their own egress controls.

## Instructions and agents

The cloud agent reads repository instructions (`AGENTS.md` and
`.github/copilot-instructions.md` — confirm the current list in GitHub's
"Add repository instructions" docs) and custom agents from `.github/agents/`.

## Harness rules that matter most here

- The agent opens PRs; humans review and merge. Branch protection with the
  harness check required.
- Its token cannot change settings or read production secrets.
- Issue text it works from is untrusted input ([threat-model.md](../08-safety/threat-model.md)).
- Code review by Copilot can be customised with the same instruction files;
  it is an inferential sensor, never the only gate.

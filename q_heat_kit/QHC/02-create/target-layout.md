# Target layout

The default place for every harness file in the product repository. Use it
unless the repo already has a convention; record any deviation in
`harness/manifest.json` under `paths`.

```text
<repo root>/
├── AGENTS.md                  # entry map for every agent (≤150 lines)
├── CLAUDE.md                  # "@AGENTS.md" + Claude-only notes
├── ARCHITECTURE.md            # domains, layers, dependency rules, hot spots
├── init.sh                    # setup + smoke check (or Makefile targets)
├── Makefile                   # check-fast / check-changed / check (optional)
├── harness/
│   ├── manifest.json          # inventory: tier, kit version, files, owners
│   ├── CHANGELOG.md           # harness change history
│   ├── feature_list.json      # or features/<id>.json in advanced tier
│   ├── progress.md            # or sessions/<branch>.md in advanced tier
│   ├── sensors.json           # registry of checks and when they run
│   ├── policy.json            # scope, frozen paths, approval rules
│   ├── checks/                # check scripts named in sensors.json
│   └── hooks/                 # agent hook scripts (advanced)
├── docs/
│   ├── decisions/             # ADR-0001-*.md …
│   ├── product-specs/         # what the product must do
│   ├── exec-plans/            # active/, completed/, tech-debt.md
│   ├── harness/               # intake.md, init-plan.md, loops/, graphs/, audits/
│   ├── references/            # vendor docs as *-llms.txt
│   ├── QUALITY_SCORE.md
│   ├── RELIABILITY.md
│   └── SECURITY.md
├── <module>/AGENTS.md         # nested rules for a module (advanced)
├── .claude/                   # settings.json, agents/, skills/, rules/
├── .github/
│   ├── agents/  instructions/  prompts/      # VS Code / Copilot
│   ├── workflows/harness-check.yml
│   └── CODEOWNERS
├── .vscode/mcp.json           # if MCP servers are used
└── q_heat_kit/                # this kit, read-only
```

## Why these locations

- Root files are where every tool looks first (`AGENTS.md`, `CLAUDE.md`).
- `harness/` keeps machine-readable state and checks together, so ownership and
  CI rules can target one folder.
- `docs/` holds human-and-agent knowledge, split by kind so each file stays small.
- Platform folders (`.claude/`, `.github/`) are where those tools require them;
  see [09-platforms](../09-platforms/README.md).

## Templates for each file

| Target | Template |
|---|---|
| `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `init.sh` | [templates/root/](../../templates/README.md#root) |
| `harness/*` | [templates/harness/](../../templates/README.md#harness) |
| `docs/*` | [templates/docs/](../../templates/README.md#docs) |
| Platform files | [templates/platforms/](../../templates/README.md#platforms) |
| CI, CODEOWNERS | [templates/ci/](../../templates/README.md#ci) |
| Loops and graphs | [templates/automation/](../../templates/README.md#automation) |

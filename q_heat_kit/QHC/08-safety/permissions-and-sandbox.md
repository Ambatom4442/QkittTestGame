# Permissions and sandboxes

Give agents enough access to do the task well, and no more. Disabling the
shell "to be safe" makes agents useless; restrict what is dangerous instead.

## Principles

- **Fail closed** for sensitive tools: default `ask` or `deny`, not `allow`.
- **Deny beats allow**; protected paths and commands cannot be bypassed by a
  broader allow rule.
- **Per call, not per tool**: `cat` is safe, `rm -rf` is not — classify by
  arguments ([claude-code.md](../09-platforms/claude-code.md) shows the rule syntax).
- **Mode separation by branch**: developer and harness mode are the same
  agent, so a static deny rule would block both. Instead, a pre-edit hook
  allows harness-file edits only on `harness/*` branches (where Q-HEAT works)
  and the CI policy check enforces the same rule
  ([guard hook](../../templates/platforms/claude/hooks/guard-harness-paths.sh.tmpl)).
  Q-HEAT, in turn, does not edit product code except named harness scripts.
- **Hooks are not a hard gate**: they can fail open or time out. Use the
  permission system for hard rules; hooks for fast feedback.

## Baseline rules Q-HEAT installs

| Category | Rule |
|---|---|
| Allow | Read project files; run the documented setup, start and check commands; git status/diff/log/branch/commit |
| Ask | Package installs, network fetches, `git push`, starting containers, anything not in the allow list |
| Deny | Read `.env*`, key files, credential stores; edit `q_heat_kit/`; `git push --force`; destructive filesystem and database commands; production hosts |
| Guard (hook + CI) | Harness files editable only on `harness/*` branches; frozen paths only with an accepted decision; merges to protected branches only by humans (branch protection) |

Templates per platform: [Claude settings](../../templates/platforms/claude/settings.json.tmpl),
VS Code / Copilot in [vscode-copilot.md](../09-platforms/vscode-copilot.md).

## Sandboxes

| Level | What it isolates | Typical use |
|---|---|---|
| Permission rules only | Tool calls | Interactive, trusted work |
| Worktree | Files and branches | Parallel agents |
| Container / devcontainer | Processes, filesystem, network | Team default; untrusted dependencies |
| VM / cloud sandbox | Whole machine | Unattended loops, CI agents |

For unattended runs, use a container or VM with:
- the repo bind-mounted or cloned, nothing else from the host;
- a network allowlist (package registries, the issue tracker, the model API);
- no production credentials; short-lived, narrow tokens;
- resource limits (CPU, memory, time).

## Approval flows

Plan mode and approval prompts turn risky steps into reviewable plans.
Unattended loops cannot ask interactively — they must stop at the gate and
escalate ([human-in-the-loop.md](../07-automate/human-in-the-loop.md)).

## Testing the rules

During `init` acceptance, try one denied action in a fresh session (e.g. read
`.env`) and confirm it is blocked. Record the result.

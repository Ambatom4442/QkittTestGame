#!/usr/bin/env bash
# guard-harness-paths.sh - Claude Code PreToolUse hook.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

path="$(python3 -c 'import json,sys
d=json.load(sys.stdin).get("tool_input",{})
print(d.get("file_path") or d.get("notebook_path") or "")' 2>/dev/null)" || exit 0
[ -z "$path" ] && exit 0
rel="${path#"$PWD"/}"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
case "$branch" in harness/*) exit 0 ;; esac

case "$rel" in
  AGENTS.md|*/AGENTS.md|CLAUDE.md|ARCHITECTURE.md|\
  harness/policy.json|harness/sensors.json|harness/manifest.json|harness/CHANGELOG.md|\
  harness/checks/*|harness/hooks/*|.claude/*|.github/workflows/*|.github/agents/*|\
  .github/instructions/*|.github/prompts/*|.github/CODEOWNERS|q_heat_kit/*)
    {
      echo "WHAT: $rel is a harness file; branch '$branch' is not a harness branch."
      echo "WHY:  Harness rules change only through Q-HEAT on harness/* branches."
      echo "FIX:  Note the needed harness change in harness/progress.md and ask for Q-HEAT change."
    } >&2
    exit 2 ;;
esac
exit 0

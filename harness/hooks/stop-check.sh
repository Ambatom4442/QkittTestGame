#!/usr/bin/env bash
# stop-check.sh - Claude Code Stop hook.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

input="$(cat)"
if printf '%s' "$input" | grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

if [ -z "$(git status --porcelain)" ] && git diff --quiet "@{upstream}" 2>/dev/null; then
  exit 0
fi

if ! out="$(npm run check:fast 2>&1)"; then
  {
    echo "WHAT: npm run check:fast fails, so the session cannot end yet."
    echo "WHY:  Every session must leave a clean, restartable state."
    echo "FIX:  Fix failures, then re-run npm run check:fast."
    printf '%s\n' "$out" | tail -n 30
  } >&2
  exit 2
fi

changed_code="$(git status --porcelain | grep -v 'harness/progress.md' | grep -v 'harness/sessions/' || true)"
progress_touched="$(git status --porcelain -- harness/progress.md harness/sessions/ || true)"
if [ -n "$changed_code" ] && [ -z "$progress_touched" ] && ! git diff --name-only "@{upstream}" 2>/dev/null | grep -qE 'harness/(progress.md|sessions/)'; then
  {
    echo "WHAT: Code changed but harness/progress.md was not updated."
    echo "WHY:  Next session continuity depends on the progress log."
    echo "FIX:  Update harness/progress.md current state and session log entry."
  } >&2
  exit 2
fi

exit 0

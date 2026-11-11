#!/usr/bin/env python3
"""policy_check.py - enforce harness/policy.json on the current change.

Checks: frozen paths, harness paths only on harness/* branches, decision record
for policy/sensor edits, change-size limits, passing features have evidence.
Usage: python harness/checks/policy_check.py --base origin/main
"""
import argparse
import fnmatch
import json
import os
import subprocess
import sys
from pathlib import Path

POLICY = Path("harness/policy.json")
errors = []


def git(*args):
    res = subprocess.run(["git", *args], capture_output=True, text=True)
    return res.stdout.strip() if res.returncode == 0 else ""


def err(what, why, fix):
    errors.append(f"WHAT: {what}\nWHY:  {why}\nFIX:  {fix}")


def match(path, patterns):
    return any(fnmatch.fnmatch(path, p) for p in patterns)


def size_exempt(path):
    normalized = path.replace("\\", "/")
    if normalized == "package-lock.json":
        return True
    if fnmatch.fnmatch(normalized, "*.lock"):
        return True
    if normalized.startswith("dist/") or "/dist/" in normalized:
        return True
    if normalized.startswith("build/") or "/build/" in normalized:
        return True
    return False


def branch_matches(patterns, branch):
    return any(fnmatch.fnmatch(branch, p) for p in patterns)


def changed_files(base):
    files = set(filter(None, git("diff", "--name-only", f"{base}...HEAD").splitlines()))
    files |= set(filter(None, git("diff", "--name-only", "HEAD").splitlines()))
    files |= set(filter(None, git("ls-files", "--others", "--exclude-standard").splitlines()))
    return sorted(files)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="origin/main")
    args = ap.parse_args()
    if not POLICY.exists():
        print("policy_check: harness/policy.json not found; skipping.")
        return
    policy = json.loads(POLICY.read_text(encoding="utf-8"))
    scope = policy.get("scope", {})
    files = changed_files(args.base)
    branch = (
        os.environ.get("BRANCH_NAME")
        or os.environ.get("GITHUB_HEAD_REF")
        or os.environ.get("GITHUB_REF_NAME")
        or git("rev-parse", "--abbrev-ref", "HEAD")
    )
    harness_branch = fnmatch.fnmatch(branch, policy.get("branches", {}).get("harness_pattern", "harness/*"))
    limit_exempt = branch_matches(policy.get("limits_exempt_branches", []), branch)
    opened = [o["path"] for o in scope.get("opened_paths", []) if "{{" not in o.get("path", "")]

    for f in files:
        for fz in scope.get("frozen_paths", []):
            pat = fz.get("path", "")
            if "{{" in pat or not fnmatch.fnmatch(f, pat) or match(f, opened):
                continue
            allowed_branches = fz.get("allowed_branches", [])
            if allowed_branches and branch_matches(allowed_branches, branch):
                continue
            err(
                f"{f} changed; it is frozen ({fz.get('reason', 'no reason given')}).",
                f"Frozen by {fz.get('decision', 'policy')}; owner {fz.get('owner', 'unknown')}.",
                "Revert the change, or use an allowed branch for this frozen path if configured in harness/policy.json."
            )
        if match(f, scope.get("harness_paths", [])) and not harness_branch:
            err(
                f"{f} is a harness file changed on branch '{branch}'.",
                "Harness rules change only in dedicated harness PRs, owned by the harness owners.",
                "Move this change to a harness/* branch via Q-HEAT change; keep this PR to the feature."
            )

    sensitive = {"harness/policy.json", "harness/sensors.json"}
    if sensitive & set(files) and not any(f.startswith("docs/decisions/") for f in files):
        err(
            "Policy or sensor registry changed without a decision record.",
            "Changing a gate must be traceable to an accepted decision.",
            "Add or update a file in docs/decisions/ in the same PR and reference it."
        )

    limits = policy.get("limits", {})
    if not limit_exempt:
        sized_files = [f for f in files if not size_exempt(f)]
        if limits.get("max_files_changed") and len(sized_files) > limits["max_files_changed"]:
            err(
                f"{len(sized_files)} files changed (limit {limits['max_files_changed']}) after excluding lock/generated files.",
                "Large changes are hard to review and usually mix several features.",
                "Split the work into smaller PRs, one feature each."
            )
        numstat = git("diff", "--numstat", f"{args.base}...HEAD").splitlines()
        lines = 0
        for l in numstat:
            parts = l.split("\t")
            if len(parts) < 3:
                continue
            a, b, path = parts[0], parts[1], parts[2]
            if not (a.isdigit() and b.isdigit()):
                continue
            if size_exempt(path):
                continue
            lines += int(a) + int(b)
        if limits.get("max_lines_changed") and lines > limits["max_lines_changed"]:
            err(
                f"{lines} lines changed (limit {limits['max_lines_changed']}) after excluding lock/generated files.",
                "Reviewability limit from harness/policy.json.",
                "Split the change, or ask the harness owners for an exception in the PR."
            )

    feats = []
    if Path("harness/feature_list.json").exists():
        feats += json.loads(Path("harness/feature_list.json").read_text(encoding="utf-8")).get("features", [])
    for p in Path("harness/features").glob("*.json") if Path("harness/features").exists() else []:
        feats.append(json.loads(p.read_text(encoding="utf-8")))
    for feat in feats:
        if feat.get("state") == "passing" and not (feat.get("evidence") or {}).get("result") == "pass":
            err(
                f"{feat.get('id')} is passing without passing evidence.",
                "Only harness/checks/verify_feature.py may set passing.",
                f"Set it back to active and run: python harness/checks/verify_feature.py {feat.get('id')}"
            )

    if errors:
        print("\n\n".join(errors), file=sys.stderr)
        sys.exit(1)
    print(f"policy_check: OK ({len(files)} files checked on '{branch}').")


if __name__ == "__main__":
    main()

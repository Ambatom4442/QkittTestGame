#!/usr/bin/env python3
"""verify_feature.py - run a feature's verification and record the result.

The only way a feature becomes passing (pass-state gating).
Usage: python harness/checks/verify_feature.py F-001
"""
import datetime
import json
import subprocess
import sys
import time
from pathlib import Path

LIST = Path("harness/feature_list.json")
FEATURE_DIR = Path("harness/features")
TAIL = 15


def fail(what, why, fix, code=1):
    print(f"WHAT: {what}\nWHY:  {why}\nFIX:  {fix}", file=sys.stderr)
    sys.exit(code)


def load(fid):
    single = FEATURE_DIR / f"{fid}.json"
    if single.exists():
        return single, json.loads(single.read_text(encoding="utf-8")), None
    if not LIST.exists():
        fail(
            "No feature list found.",
            "Verification needs the feature entry.",
            "Run from repository root; check harness/manifest.json for the feature-list path."
        )
    data = json.loads(LIST.read_text(encoding="utf-8"))
    for feat in data.get("features", []):
        if feat.get("id") == fid:
            return LIST, feat, data
    fail(
        f"Feature {fid} not found.",
        "Only listed features can be verified.",
        "Check the id or ask for Q-HEAT change to add the feature."
    )


def state_of(dep):
    single = FEATURE_DIR / f"{dep}.json"
    if single.exists():
        return json.loads(single.read_text(encoding="utf-8")).get("state")
    if LIST.exists():
        for feat in json.loads(LIST.read_text(encoding="utf-8")).get("features", []):
            if feat.get("id") == dep:
                return feat.get("state")
    return None


def git_head():
    try:
        return subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True,
            text=True,
            check=True
        ).stdout.strip()
    except Exception:
        return "unknown"


def main():
    if len(sys.argv) != 2:
        fail(
            "Missing feature id.",
            "The check verifies one feature at a time.",
            "Run: python harness/checks/verify_feature.py F-001"
        )
    fid = sys.argv[1]
    path, feat, container = load(fid)

    unmet = [d for d in feat.get("depends_on", []) if state_of(d) != "passing"]
    if unmet:
        fail(
            f"{fid} depends on features that are not passing: {', '.join(unmet)}.",
            "Consumers are verified only after providers.",
            "Finish and verify dependencies first, or mark this feature blocked."
        )

    commands = feat.get("verification") or []
    if not commands:
        fail(
            f"{fid} has no verification commands.",
            "Done must be provable by command.",
            "Add at least one verification command for this feature."
        )

    results = []
    ok = True
    for cmd in commands:
        start = time.time()
        proc = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        out = (proc.stdout + proc.stderr).strip().splitlines()[-TAIL:]
        results.append({
            "command": cmd,
            "exit": proc.returncode,
            "seconds": round(time.time() - start, 1),
            "tail": out
        })
        print(f"[{'PASS' if proc.returncode == 0 else 'FAIL'}] {cmd}")
        if proc.returncode != 0:
            ok = False
            print("\n".join(out))
            break

    evidence = {
        "date": datetime.datetime.now().isoformat(timespec="seconds"),
        "commit": git_head(),
        "result": "pass" if ok else "fail",
        "runs": results
    }
    feat["evidence"] = evidence
    if ok:
        feat["state"] = "passing"
        feat["blocked_reason"] = None
    elif feat.get("state") == "passing":
        feat["state"] = "active"

    payload = container if container is not None else feat
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    if not ok:
        fail(
            f"Verification failed for {fid}: {results[-1]['command']}",
            "A feature is passing only when every verification command succeeds.",
            "Fix the cause and re-run this script."
        )
    print(f"{fid} is passing. Evidence recorded in {path}.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""verify_feature.py - run a feature's verification and record the result.

The only way a feature becomes passing (pass-state gating).
Usage: python harness/checks/verify_feature.py F-001 [--sandbox|--no-sandbox]
"""
import argparse
import datetime
import json
import subprocess
import sys
import time
from pathlib import Path

LIST = Path("harness/feature_list.json")
FEATURE_DIR = Path("harness/features")
ARTIFACTS_DIR = Path("artifacts")
SCREENSHOT_EXTS = {".png", ".jpg", ".jpeg", ".webp"}
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
    except (OSError, subprocess.SubprocessError):
        return "unknown"


def docker_compose_cmd():
    try:
        probe = subprocess.run(
            ["docker", "compose", "version"],
            capture_output=True,
            text=True
        )
    except OSError:
        return None
    if probe.returncode == 0:
        return ["docker", "compose"]
    return None


def run_verification(cmd, sandbox, compose_cmd):
    if sandbox:
        return subprocess.run(
            [*compose_cmd, "run", "--rm", "checks", "bash", "-lc", cmd],
            capture_output=True,
            text=True
        )
    return subprocess.run(cmd, shell=True, capture_output=True, text=True)


def snapshot_screenshots():
    if not ARTIFACTS_DIR.exists():
        return {}
    snapshots = {}
    for artifact in ARTIFACTS_DIR.rglob("*"):
        if artifact.is_file() and artifact.suffix.lower() in SCREENSHOT_EXTS:
            snapshots[artifact.as_posix()] = artifact.stat().st_mtime_ns
    return snapshots


def changed_screenshots(before, after):
    return sorted(
        path for path, mtime in after.items()
        if path not in before or mtime > before[path]
    )


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("feature_id")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument(
        "--sandbox",
        action="store_true",
        dest="sandbox",
        help="Run verification commands in the docker compose checks service."
    )
    mode.add_argument(
        "--no-sandbox",
        action="store_false",
        dest="sandbox",
        help="Run verification commands directly on the host machine."
    )
    parser.set_defaults(sandbox=None)
    return parser.parse_args()


def main():
    args = parse_args()
    fid = args.feature_id
    path, feat, container = load(fid)

    compose_cmd = docker_compose_cmd()
    sandbox = compose_cmd is not None if args.sandbox is None else args.sandbox
    if sandbox and compose_cmd is None:
        fail(
            "Sandbox requested but Docker Compose is unavailable.",
            "--sandbox needs `docker compose` on PATH.",
            "Install Docker Desktop/Engine, or rerun with --no-sandbox."
        )

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

    print(f"Verification mode: {'sandbox' if sandbox else 'host'}")

    results = []
    ok = True
    has_system_layer = "system" in feat.get("layers_required", [])
    screenshot_before = snapshot_screenshots() if has_system_layer else {}
    for cmd in commands:
        start = time.time()
        proc = run_verification(cmd, sandbox, compose_cmd)
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

    screenshots = []
    if ok and has_system_layer:
        screenshot_cmd = "npm run check:golden-boot"
        start = time.time()
        proc = run_verification(screenshot_cmd, sandbox, compose_cmd)
        out = (proc.stdout + proc.stderr).strip().splitlines()[-TAIL:]
        results.append({
            "command": screenshot_cmd,
            "exit": proc.returncode,
            "seconds": round(time.time() - start, 1),
            "tail": out
        })
        print(f"[{'PASS' if proc.returncode == 0 else 'FAIL'}] {screenshot_cmd}")
        if proc.returncode != 0:
            ok = False
            print("\n".join(out))
        screenshot_after = snapshot_screenshots()
        screenshots = changed_screenshots(screenshot_before, screenshot_after)
        if not screenshots:
            ok = False
            print("No screenshot artifacts were captured for this system-layer feature.")

    evidence = {
        "date": datetime.datetime.now().isoformat(timespec="seconds"),
        "commit": git_head(),
        "result": "pass" if ok else "fail",
        "runs": results,
        "mode": "sandbox" if sandbox else "host"
    }
    if has_system_layer:
        evidence["artifacts"] = screenshots
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

#!/usr/bin/env python3
"""qhc_check.py — integrity check for the Q-HEAT kit or a project harness.

  python q_heat_kit/scripts/qhc_check.py --kit q_heat_kit   # check the kit itself
  python q_heat_kit/scripts/qhc_check.py --harness .        # check a project's harness

Exit code 1 if any ERROR. Standard library only. Messages follow WHAT / FIX.
"""
import argparse
import json
import re
import sys
from pathlib import Path

DOC_LIMIT = 150          # lines per markdown page
ROOT_AGENTS_LIMIT = 150  # lines in a project's root AGENTS.md
HARD_RULE_LIMIT = 15
HIDDEN = re.compile("[​-‏‪-‮⁠-⁤⁦-⁩﻿]")
LINK = re.compile(r"(?<!!)\[[^\]]*\]\(([^)\s]+)\)")
STATES = {"not_started", "active", "blocked", "passing"}
errors, warnings = [], []


def error(what, fix):
    errors.append(f"ERROR {what}\n      FIX: {fix}")


def warn(what, fix):
    warnings.append(f"WARN  {what}\n      FIX: {fix}")


def slug(heading):
    h = re.sub(r"[^\w\- ]", "", heading.strip().lower())
    return h.replace(" ", "-")


def anchors(path):
    text = path.read_text(encoding="utf-8", errors="replace")
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return {slug(m.group(1)) for m in re.finditer(r"^#{1,6}\s+(.+?)\s*$", text, flags=re.M)}


def check_links(md, base):
    text = md.read_text(encoding="utf-8", errors="replace")
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    targets = []
    for target in LINK.findall(text):
        if re.match(r"^[a-z][a-z0-9+.-]*:", target):
            continue  # external URL
        file_part, _, frag = target.partition("#")
        dest = md if not file_part else (md.parent / file_part).resolve()
        rel = md.relative_to(base)
        if not dest.exists():
            error(f"{rel}: broken link -> {target}", "Fix the path or create the target page.")
            continue
        targets.append(dest)
        if frag and dest.suffix == ".md" and frag not in anchors(dest):
            error(f"{rel}: missing anchor -> {target}", "Rename the heading or fix the #anchor.")
    return targets


def check_hidden(path, base):
    if HIDDEN.search(path.read_text(encoding="utf-8", errors="replace")):
        error(f"{path.relative_to(base)} contains invisible Unicode characters",
              "Remove zero-width / bidirectional control characters; they can hide instructions.")


def check_kit(kit):
    for req in ["AGENTS.md", "CLAUDE.md", "README.md", "VERSION", "CHANGELOG.md",
                "QHC/README.md", "QHC/00-constitution/articles.md", "commands/README.md",
                "templates/README.md"]:
        if not (kit / req).exists():
            error(f"kit is missing {req}", "Restore the file from the kit release.")
    pages = [p for p in kit.rglob("*.md") if "node_modules" not in p.parts]
    linked = set()
    for md in pages:
        rel = md.relative_to(kit)
        check_hidden(md, kit)
        if rel.parts[0] in ("adapters",):
            continue  # adapter links are relative to their install location
        lines = len(md.read_text(encoding="utf-8").splitlines())
        if lines > DOC_LIMIT:
            error(f"{rel} has {lines} lines (limit {DOC_LIMIT})", "Split the page and link the parts.")
        linked.update(check_links(md, kit))
    for md in pages:
        rel = md.relative_to(kit)
        if rel.parts[0] == "QHC" and md.resolve() not in linked:
            error(f"{rel} is an orphan page (nothing links to it)", "Link it from its chapter README.")
    for tmpl in kit.rglob("*.tmpl"):
        check_hidden(tmpl, kit)
        if tmpl.name.endswith(".json.tmpl"):
            raw = re.sub(r"\{\{[^}]*\}\}", "X", tmpl.read_text(encoding="utf-8"))
            try:
                json.loads(raw)
            except json.JSONDecodeError as exc:
                error(f"{tmpl.relative_to(kit)} is not valid JSON ({exc})", "Fix the template syntax.")


def load_json(path, repo):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        error(f"{path.relative_to(repo)} cannot be read as JSON ({exc})", "Fix the JSON syntax.")
        return None


def check_harness(repo):
    manifest_path = repo / "harness/manifest.json"
    if not manifest_path.exists():
        error("harness/manifest.json not found — repository is not initialised",
              "Run `Q-HEAT init`.")
        return
    manifest = load_json(manifest_path, repo) or {}
    tier = manifest.get("tier", "standard")
    required = ["AGENTS.md", "harness/progress.md", "harness/CHANGELOG.md"]
    paths = manifest.get("paths", {})
    if manifest.get("state_layout") != "per-feature":
        required.append(paths.get("feature_list", "harness/feature_list.json"))
    if tier in ("standard", "advanced"):
        required += ["ARCHITECTURE.md", "harness/sensors.json", "harness/policy.json",
                     "docs/SECURITY.md", "docs/RELIABILITY.md", "docs/QUALITY_SCORE.md"]
    for req in required:
        if not (repo / req).exists():
            error(f"{req} is required for tier '{tier}' but missing", "Create it from q_heat_kit/templates.")
    for entry in manifest.get("files", []):
        if not (repo / entry.get("path", "")).exists():
            error(f"manifest lists {entry.get('path')} but it does not exist",
                  "Create the file or remove it from harness/manifest.json.")

    agents = repo / "AGENTS.md"
    if agents.exists():
        text = agents.read_text(encoding="utf-8")
        n = len(text.splitlines())
        if n > ROOT_AGENTS_LIMIT:
            error(f"AGENTS.md has {n} lines (limit {ROOT_AGENTS_LIMIT})", "Move detail to linked topic docs.")
        sec = re.search(r"^## Hard rules.*?$(.*?)(?=^## )", text, flags=re.M | re.S)
        if sec and len(re.findall(r"^\d+\.", sec.group(1), flags=re.M)) > HARD_RULE_LIMIT:
            error(f"AGENTS.md has more than {HARD_RULE_LIMIT} hard rules", "Turn rules into checks or scope them.")
    claude = repo / "CLAUDE.md"
    if claude.exists() and "@AGENTS.md" not in claude.read_text(encoding="utf-8"):
        warn("CLAUDE.md does not import @AGENTS.md", "Add '@AGENTS.md' as its first line.")

    harness_docs = [p for p in [agents, claude, repo / "ARCHITECTURE.md"] if p.exists()]
    harness_docs += [p for d in ("docs", "harness", ".claude", ".github") if (repo / d).exists()
                     for p in (repo / d).rglob("*.md")]
    for md in harness_docs:
        check_hidden(md, repo)
        check_links(md, repo)
    for p in harness_docs + [p for p in (repo / "harness").rglob("*.json")]:
        if "{{" in p.read_text(encoding="utf-8", errors="replace"):
            error(f"{p.relative_to(repo)} still contains {{{{placeholders}}}}", "Replace with project facts or delete the line.")

    sensors = repo / "harness/sensors.json"
    if sensors.exists():
        for s in (load_json(sensors, repo) or {}).get("sensors", []):
            for script in re.findall(r"(harness/checks/[\w./-]+)", s.get("command", "")):
                if not (repo / script).exists():
                    error(f"sensor '{s.get('id')}' runs {script}, which does not exist",
                          "Commit the script or fix the command; a sensor without a script is decoration.")

    feats = []
    fl = repo / paths.get("feature_list", "harness/feature_list.json")
    if fl.exists():
        feats += (load_json(fl, repo) or {}).get("features", [])
    if (repo / "harness/features").exists():
        feats += [load_json(p, repo) or {} for p in (repo / "harness/features").glob("*.json")]
    active = 0
    for f in feats:
        if f.get("state") not in STATES:
            error(f"feature {f.get('id')} has invalid state '{f.get('state')}'", f"Use one of {sorted(STATES)}.")
        if f.get("state") == "passing" and (f.get("evidence") or {}).get("result") != "pass":
            error(f"feature {f.get('id')} is passing without passing evidence",
                  "Set it to active and run harness/checks/verify_feature.py.")
        if not f.get("verification"):
            warn(f"feature {f.get('id')} has no verification command", "Add one via `Q-HEAT change`.")
        active += f.get("state") == "active"
    if active > 3:
        warn(f"{active} features are active at once", "Check WIP limits; finish or block before starting more.")

    kit_version = repo / "q_heat_kit/VERSION"
    if kit_version.exists() and manifest.get("kit_version") != kit_version.read_text().strip():
        warn(f"manifest kit_version {manifest.get('kit_version')} differs from kit "
             f"{kit_version.read_text().strip()}", "Run `Q-HEAT audit` for upgrade actions.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    group = ap.add_mutually_exclusive_group(required=True)
    group.add_argument("--kit", type=Path)
    group.add_argument("--harness", type=Path)
    args = ap.parse_args()
    if args.kit:
        check_kit(args.kit.resolve())
    else:
        check_harness(args.harness.resolve())
    for line in warnings + errors:
        print(line)
    print(f"\nqhc_check: {len(errors)} error(s), {len(warnings)} warning(s)")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()

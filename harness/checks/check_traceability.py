#!/usr/bin/env python3
"""Small traceability check for harness/feature_list.json."""
import json
import re
import sys
from pathlib import Path

feature_list = Path("harness/feature_list.json")

if not feature_list.exists():
    print("traceability: harness/feature_list.json missing")
    sys.exit(1)

data = json.loads(feature_list.read_text(encoding="utf-8"))
features = data.get("features", [])
errors = []

id_pattern = re.compile(r"^F-\d{3}$")
src_pattern = re.compile(r"^((FR|NFR)-\d{2}|[HP]-\d{2})(,((FR|NFR)-\d{2}|[HP]-\d{2}))*$")

seen = []
for feat in features:
    fid = feat.get("id", "")
    seen.append(fid)
    if not id_pattern.match(fid):
        errors.append(f"invalid id: {fid}")
    src = str(feat.get("source", ""))
    if not src_pattern.match(src):
        errors.append(f"{fid} source must be requirement or ticket ids only: {src}")

if seen != sorted(seen):
    errors.append("features are not ordered by id")

if errors:
    for err in errors:
        print(f"traceability: {err}")
    sys.exit(1)

print(f"traceability: OK ({len(features)} features)")

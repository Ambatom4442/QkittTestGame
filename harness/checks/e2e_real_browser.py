#!/usr/bin/env python3
"""e2e_real_browser.py - enforce real-browser constraints for tests/e2e."""
from pathlib import Path
import re
import sys

ROOT = Path("tests/e2e")
errors = []

PLAYWRIGHT_IMPORT = re.compile(r"""from\s+["']@playwright/test["']|require\(\s*["']@playwright/test["']\s*\)""")
FAKE_OR_MOCK_DECL = re.compile(r"""\b(?:class|const|let|var|function)\s+(?:Fake|Mock)[A-Za-z0-9_]*\b""")
DIRECT_CLIENT_IMPORT = re.compile(
    r"""from\s+["'][^"']*client(?:/build|/src)?/[^"']*["']|import\(\s*["'][^"']*client(?:/build|/src)?/[^"']*["']\s*\)"""
)


def fail(what, why, fix):
    errors.append(f"WHAT: {what}\nWHY:  {why}\nFIX:  {fix}")


def main():
    if not ROOT.exists():
        fail(
            "tests/e2e directory is missing.",
            "The real-browser gate requires e2e tests to exist under tests/e2e.",
            "Create Playwright e2e tests in tests/e2e and rerun this check."
        )
    else:
        files = sorted(ROOT.glob("**/*.test.js"))
        if not files:
            fail(
                "No tests/e2e/*.test.js files found.",
                "The e2e sensor enforces real-browser tests for this suite.",
                "Add at least one Playwright e2e test file under tests/e2e."
            )

        for path in files:
            text = path.read_text(encoding="utf-8")
            rel = path.as_posix()

            if not PLAYWRIGHT_IMPORT.search(text):
                fail(
                    f"{rel} does not import @playwright/test.",
                    "Every e2e test file must run through Playwright.",
                    f"Import Playwright in {rel}, e.g. `import {{ test, expect }} from \"@playwright/test\";`."
                )

            fake_match = FAKE_OR_MOCK_DECL.search(text)
            if fake_match:
                fail(
                    f"{rel} declares fake/mock test doubles (`{fake_match.group(0).strip()}`).",
                    "E2E tests must execute real browser/runtime behavior, not fake engine or window objects.",
                    f"Remove fake/mock declarations from {rel}; keep fakes in unit tests only."
                )

            client_import_match = DIRECT_CLIENT_IMPORT.search(text)
            if client_import_match:
                fail(
                    f"{rel} imports client source directly (`{client_import_match.group(0).strip()}`).",
                    "E2E tests must validate behavior through the running app service, not direct module imports.",
                    f"Use Playwright page/request calls against the app instead of importing client modules in {rel}."
                )

    if errors:
        print("\n\n".join(errors), file=sys.stderr)
        sys.exit(1)

    print("e2e_real_browser: OK")


if __name__ == "__main__":
    main()

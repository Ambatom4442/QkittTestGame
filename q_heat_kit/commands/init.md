# Q-HEAT init

Build the first harness for this repository. Runs **once**; afterwards use
`change`. Initialisation is its own phase: do **not** implement product
features here ([why](../QHC/02-create/README.md#init-is-its-own-phase)).

## Preflight

1. If `harness/manifest.json` exists, stop: the repo is already initialised.
   Tell the user and suggest `Q-HEAT audit` or `Q-HEAT change`.
2. `git status` must be clean. If not, ask the user to commit or stash first.
3. Create branch `harness/init`.

## Phase 1 — Intake ([intake.md](../QHC/02-create/intake.md))

4. Find the inputs: `requirements/`, `architecture/`, `docs/`, README, tickets
   the user points to. Read them all; list what each contains.
5. Fill the intake sheet ([template](../templates/docs/intake.md.tmpl)) in
   `docs/harness/intake.md`: product purpose, users, stack, environments,
   constraints, critical flows, risky areas, team size, agents in use, CI.
6. 🛑 Ask the user only for what you could not find. Use one short batch of
   questions, not a drip.

## Phase 2 — Assess the repository ([repo-assessment.md](../QHC/02-create/repo-assessment.md))

7. Classify: greenfield (empty or scaffold) vs brownfield (existing code).
8. Detect stack, package managers, build/test/lint commands, existing
   instruction files (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`,
   `.cursor/rules`), CI, containers.
9. Brownfield: run the existing checks and record the baseline (pass/fail
   counts). A failing baseline is recorded, not hidden.
10. Score harnessability (types, boundaries, tests, startup) — record in intake.

## Phase 3 — Plan ([tiers.md](../QHC/02-create/tiers.md), [target-layout.md](../QHC/02-create/target-layout.md))

11. Choose the tier: minimal, standard or advanced. Default: **standard**.
12. Write the plan in `docs/harness/init-plan.md`: tier, every file to create
    or change, each file's purpose, sensors to wire, platforms to support,
    open questions, and what is deliberately left out.
13. 🛑 Show the plan. Wait for approval before writing harness files.

## Phase 4 — Build (one step at a time, commit after each)

14. Instructions: root `AGENTS.md`, `CLAUDE.md`, nested files if needed — [instructions.md](../QHC/02-create/instructions.md).
15. Knowledge: `ARCHITECTURE.md`, `docs/` skeleton, first decision records — [knowledge-docs.md](../QHC/02-create/knowledge-docs.md).
16. State and scope: `harness/feature_list.json` from the requirements, `harness/progress.md` — [state-and-scope.md](../QHC/02-create/state-and-scope.md).
17. Environment: `init.sh` / Make targets, devcontainer if useful — [environment.md](../QHC/02-create/environment.md).
18. Verification: `harness/sensors.json`, check scripts, `make check` tiers, one passing example test for greenfield — [verification-setup.md](../QHC/02-create/verification-setup.md).
19. Policy and safety: `harness/policy.json`, permission settings, `docs/SECURITY.md`, CODEOWNERS — [policy-setup.md](../QHC/02-create/policy-setup.md).
20. Platforms: tool-specific files for each agent the team uses — [09-platforms](../QHC/09-platforms/README.md).
21. CI: harness check workflow — [ci-cd.md](../QHC/07-automate/ci-cd.md).
22. Manifest: write `harness/manifest.json` and `harness/CHANGELOG.md`.

## Phase 5 — Acceptance ([init-acceptance.md](../QHC/02-create/init-acceptance.md))

23. Run `python q_heat_kit/scripts/qhc_check.py --harness .` — fix every error.
24. Run the standard startup and verification path from a clean checkout.
25. Fresh-session test: start a **new** agent session with no chat history and
    ask the five questions. Record the answers. Fix the harness where an answer
    was wrong or slow.
26. Fill the acceptance checklist in `docs/harness/init-plan.md`.

## Phase 6 — Hand over

27. Push the branch; open a PR titled `harness: initial harness (tier: <tier>)`.
    The PR body lists files, evidence and open questions.
28. Report per [AGENTS.md §5](../AGENTS.md#5-how-you-finish). Tell the user
    the next step for developers: "start a new session and say *pick the next feature*".

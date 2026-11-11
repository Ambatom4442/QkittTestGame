# Many developers, many branches, one harness

When several people and agents work in parallel, the harness itself becomes
contended. These rules keep it consistent.

## Who changes what

Follow [harness-surface.md](../00-constitution/harness-surface.md):

- **Rules** (`AGENTS.md`, `ARCHITECTURE.md`, policy, sensors, platform config,
  CI) change only through a dedicated harness PR made by Q-HEAT (or a person in
  harness mode), owned by named harness owners in CODEOWNERS.
- **State** (feature states, progress, plans) changes on feature branches, by
  the developer agent working that feature, only for its own feature.
- **Knowledge** (specs, decisions) is drafted by anyone and accepted by humans.

Do not mix: a feature PR does not change harness rules; a harness PR does not
ship features.

## Avoiding conflicts in state files

| Problem | Rule |
|---|---|
| Everyone edits one `feature_list.json` | Advanced tier: one file per feature, `harness/features/F-012.json` |
| Everyone appends to one `progress.md` | One log per branch or agent slot: `harness/sessions/<branch>.md`; summary rebuilt by script on main |
| Two agents take the same feature | Claim by pushing a claim commit; check remote before claiming |
| Feature branch is behind main | Merge main into the branch ("heal") before verifying, never after review |
| Harness rule changed while branches are open | Harness PR states when it applies; open branches pick it up on their next heal |

## Rules for harness PRs

1. Small and single-purpose; one topic per PR.
2. **Additive** where possible: add a line rather than rewrite a section;
   keep ordering stable so merges are clean.
3. Never reformat whole harness files in a content change.
4. Reference the trigger (ticket, failure, review comment) and include the
   impact map.
5. Rebase on main right before merge; re-run the self-check.
6. Two harness PRs touching the same file are merged one at a time.

## Parallel agents

- One branch and one worktree (or container) per agent; one feature each.
- Prefer non-overlapping file ownership per agent; when overlap is needed,
  sequence the work through dependencies.
- Merges are done by humans or by a merge queue with CI — not by the agent
  that wrote the code.
- Your review capacity, not agent count, sets the useful level of parallelism.

## How the industry handles this today

- **Instruction files are code**: versioned, reviewed, owned via CODEOWNERS;
  nested files near the code they govern (closest file wins).
- **Personal vs shared settings**: personal overrides stay in git-ignored
  local files (`CLAUDE.local.md`, `.claude/settings.local.json`); shared rules
  in committed files; organisation rules in managed settings.
- **Central templates, local instances**: a shared kit (like this one) pinned
  by version; project harnesses generated from it and upgraded deliberately.
- **Issue tracker as control plane**: tickets define work; agents pick and claim;
  PRs link back.
- **Merge queues and required checks** keep main green under high PR volume.
- **High-throughput merge philosophy**: with many small PRs, minimise
  blocking gates where a fix is cheaper than a wait — but only with strong
  automated checks and fast rollback. Low-volume teams keep stricter gates.

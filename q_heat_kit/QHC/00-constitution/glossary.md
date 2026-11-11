# Glossary

**ADR (architecture decision record)** — short file recording one decision: context, choice, alternatives rejected, consequences.
**Ablation** — switching one harness component off on a benchmark to measure whether it still earns its cost.
**Agent harness** — everything around the model that lets it act: instructions, tools, environment, state, feedback. Also called scaffold.
**Anchor** — a link from an automated loop to reality: business outcome, ground-truth data, human spot check.
**Back-pressure** — features not yet passing; they block new activations.
**Clean state** — build passes, tests pass, progress recorded, no stray artifacts, startup works.
**Clock-in / clock-out** — fixed start and end routine of every agent session.
**Compaction** — summarising older context to continue in a smaller window; keeps "what", tends to lose "why".
**Completion evidence** — output of a verification command proving a feature works.
**Computational control** — deterministic check run by CPU (tests, linters, type checks).
**Context engineering** — choosing which tokens the model sees: write, select, compress, isolate.
**Context rot** — accuracy drops as the context grows.
**Decision record** — see ADR.
**Definition of done (DoD)** — the command-verifiable conditions for "finished".
**Diagnostic loop** — execute → observe → attribute to a harness layer → fix that layer → re-run.
**Drift** — docs, rules or code slowly diverging from each other or from reality.
**Entry file** — the first instruction file an agent reads (`AGENTS.md`, `CLAUDE.md`).
**Evaluator / checker** — the agent or script that judges work; must be separate from the maker.
**Eval** — a test task with graders used to measure model + harness together.
**Feature list** — machine-readable list of features, each with behaviour, verification command, state, evidence.
**Fresh-session test** — can a new session with no chat history answer the five questions from repo files alone?
**Frozen path** — a path agents may not change without an approved decision.
**Generator** — the agent that writes the work (maker).
**Golden journey** — a critical user flow that must always work and is checked end to end.
**Graph (engineering)** — nodes (agents, code, humans), edges, shared state and routing rules.
**Guide** — feedforward control that steers before the agent acts (instructions, skills, templates).
**Harness surface** — the set of harness files; see [harness-surface.md](harness-surface.md).
**Harnessability** — how easy a codebase is to harness (types, boundaries, tests, startup).
**Hook** — script that runs at an agent lifecycle event (before tool, after tool, on stop).
**Inferential control** — model-judged check (AI review, LLM-as-judge); slower, non-deterministic.
**Initialisation phase** — first phase that builds the environment, checks and task list; no features.
**Instruction bloat** — an entry file so long that important rules get lost.
**Loop (engineering)** — goal + verification + stop condition, run without a human prompting each step.
**Manifest** — `harness/manifest.json`, the inventory of harness files, tier and kit version.
**MCP** — Model Context Protocol; standard way to connect agents to external tools and data.
**Orchestration tax** — starting agents is cheap; reviewing and reconciling their work is not.
**Pass-state gating** — only a successful verification can set a feature to `passing`.
**pass@k / pass^k** — at least one of k trials passes / all k trials pass.
**Policy** — `harness/policy.json`: scope, frozen paths, approval rules.
**Progressive disclosure** — load detail only when the task needs it.
**Rebuild cost** — time a new session spends recovering context before useful work.
**Sensor** — feedback control that observes after the agent acts (tests, lint, review).
**Skill** — folder with `SKILL.md` holding a reusable procedure loaded on demand.
**Sprint contract** — agreed scope, checks and exclusions, written before coding.
**Steering loop** — humans improving guides and sensors whenever a problem recurs.
**Subagent** — agent spawned by another with its own context and tool set.
**System of record** — the single authoritative place for a fact; here, the repo.
**Termination check (three layers)** — static → runtime behaviour → system/end-to-end.
**Tier** — minimal, standard or advanced harness; see [tiers.md](../02-create/tiers.md).
**VCR (verified completion rate)** — verified features ÷ activated features.
**WIP limit** — maximum features active at once per agent (default 1).
**Worktree** — separate git checkout so parallel agents cannot collide.

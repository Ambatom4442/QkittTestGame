# The harness supply chain

Instruction files, hooks, skills, agent definitions and MCP configurations
**change what agents do**. They are code and are reviewed like code — often
more carefully, because their effects are less visible.

## Risks

- A PR adds a rule to `AGENTS.md` that quietly widens what agents may do.
- Hidden text: invisible Unicode characters, HTML comments or white-on-white
  content carrying instructions.
- A shared hook runs an arbitrary script on every session with the user's privileges.
- An MCP server or plugin from an unknown source gets broad tool access.
- A skill bundles a script with side effects not mentioned in its description.
- A copied "prompt pack" includes instructions aimed at exfiltrating data.

## Controls

1. **CODEOWNERS** on all harness paths; harness owners must approve
   ([template](../../templates/ci/CODEOWNERS.tmpl)).
2. **Review checklist for harness PRs**: what behaviour changes; any new tool,
   network or file access; any hidden or encoded content; scripts read in full.
3. **Hidden-character check**: a sensor that fails on invisible Unicode
   (zero-width, bidirectional controls) in instruction and skill files.
4. **Workspace trust**: tools that ask before running project hooks or
   loading project MCP servers keep that prompt on; do not auto-trust.
5. **Pin and vet external components**: MCP servers, plugins and skills from
   known sources, pinned versions, reviewed before adoption; record them in
   `harness/manifest.json`.
6. **Organisation policy**: where available, managed settings that allow only
   approved hooks, plugins and marketplaces.
7. **The kit itself** is pinned by version and never edited in place
   ([versioning.md](../06-maintain/versioning.md)).

## Q-HEAT's own behaviour

- Q-HEAT reads every file it publishes or copies.
- It does not install hooks, MCP servers or plugins without listing them in the
  plan and getting approval.
- It flags any instruction-like content found in inputs instead of following it.

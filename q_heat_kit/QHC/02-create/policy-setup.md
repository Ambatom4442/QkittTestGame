# Policy setup

Policy says **what agents may touch and what needs a human**. Sensors say
**whether the work is correct**. Keep them separate: policy is checked before
or while acting; sensors after.

## `harness/policy.json`

Template: [policy.json.tmpl](../../templates/harness/policy.json.tmpl). Contains:

| Key | Meaning |
|---|---|
| `scope.allowed_paths` | Where developer agents may edit |
| `scope.frozen_paths` | Paths nobody changes without an accepted decision record (with reason and owner) |
| `scope.harness_paths` | The harness surface — Q-HEAT only |
| `approvals.required_for` | Actions that need a human: new dependency, schema migration, public API change, auth/permissions code, deleting tests, CI changes, production access |
| `limits` | WIP per agent, max files per change, max PR size |
| `branches` | Naming pattern, protected branches, merge rules ("agents never merge") |
| `escalation` | Who to ask, through which channel, for which decisions |

## Turning policy into enforcement

Prose policy is ignored under pressure. Enforce in three places:

1. **Agent permissions** — deny edits to frozen and harness paths; deny
   reading secrets; ask before network, installs, git push
   ([permissions-and-sandbox.md](../08-safety/permissions-and-sandbox.md)).
2. **A policy check** in `harness/checks/` that fails if a diff touches frozen
   paths without a referenced decision record, or exceeds the limits.
3. **CODEOWNERS** so a named human must approve changes to frozen and harness
   paths ([template](../../templates/ci/CODEOWNERS.tmpl)).

Policy check details: it takes the branch from `BRANCH_NAME`, then GitHub's
`GITHUB_HEAD_REF`/`GITHUB_REF_NAME` (CI checkouts are detached, so `git` alone
reports `HEAD`); size limits ignore lock and generated files; and the init PR
(the one that introduces `harness/policy.json`) is exempt from size limits.
Never raise the limits to get one PR through.

## Opening a frozen area

New work sometimes needs a frozen path. Process: requirement → decision record
naming exactly which paths open and why → human accepts → `Q-HEAT change`
updates `policy.json` additively (record the date and decision id next to
the line) → the feature proceeds. Close it again when the work is done if
the reason for freezing still holds.

## `docs/SECURITY.md`

Template: [security.md.tmpl](../../templates/docs/security.md.tmpl). Lists
approved secret-loading paths, untrusted-input boundaries, actions requiring
approval, commands agents must never run, dependency rules. Details:
[08-safety](../08-safety/README.md).

## Human escalation

Record in policy which decisions always go to a human and how they are
reached (PR comment, chat channel, email, ticket). Agents stop and ask; they do
not guess on irreversible or security-relevant choices
([human-in-the-loop.md](../07-automate/human-in-the-loop.md)).

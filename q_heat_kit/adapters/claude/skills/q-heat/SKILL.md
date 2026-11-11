---
name: q-heat
description: Q-HEAT harness engineering agent. Use for "Q-HEAT init/change/audit/maintain/automate/status", or when asked to set up, change, validate, clean up or automate this repository's agent harness (AGENTS.md, feature list, sensors, policy, CI gates).
---

# Q-HEAT

You are switching to harness mode.

1. Read `q_heat_kit/AGENTS.md` in full and follow it. It is the entry point
   to the Quadwave Harness Engineering Agent Constitution (QHC).
2. The command is the first word of the arguments: `init`, `change`, `audit`,
   `maintain`, `automate` or `status`. The rest is the topic, e.g.
   `/q-heat change add payments module`.
3. If no command is given, ask which one, offering the list from
   `q_heat_kit/commands/README.md`.

Do not rely on anything in this file beyond these steps; the kit is the
source of truth.

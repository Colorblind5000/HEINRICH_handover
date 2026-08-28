---
name: onboard
description: Set up, explain, reconfigure, verify, or connect Git for a fresh HEINRICH kit through the deterministic onboarding engine. Use for first-run onboarding and deliberate profile changes, not ordinary project creation or brain maintenance.
---

# $onboard

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/onboard.md`

That playbook is canonical and harness-neutral. It owns the flow, the profile
choices and the approval gates. `heinrich/tools/onboard.mjs` owns every write,
validation and Git call.

This adapter adds only what is specific to Codex. It must never duplicate the
generator logic, profile contract or system explanation from the shared
sources.

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; call it
   `WORK_ROOT`. Never assume the open folder is the system root.
2. Run every engine command from `WORK_ROOT`. The commands and approval gates
   in the playbook apply unchanged.
3. Write command names in Codex form: `$onboard`, `$system-guide`,
   `$create-project` and `$<skill-name>`.

## Neutral choices

Use clickable choices only when the available UI can present every option
neutrally. If the UI requires one option to be marked as recommended, show the
playbook's choices as a short plain-text list instead. Never invent a default
or recommendation for Git, route or profile decisions.

Do not restate the options as prose after asking.

## Boundaries

- The engine is the only writer. Never hand-edit a generated target, pass
  `--force`, or convert user text into a shell command.
- Commit and push require separate approvals. Neither is a routine completion
  step.
- Stop before `configure` and Git if Node is missing; report `DEGRADED` with
  the exact prerequisite.
- Never read `heinrich/agent_brain/inbox.md` or unrelated personal content
  during onboarding.

For later questions about how the system works, `$system-guide` takes over.
For a health or drift audit, use `$mothership-check`.

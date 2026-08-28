---
name: onboard
description: Set up, explain, reconfigure, verify, or connect Git for a fresh HEINRICH kit through the deterministic onboarding engine. Use for first-run onboarding and deliberate profile changes, not ordinary project creation or brain maintenance.
---

# /onboard

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/onboard.md`

That playbook is canonical and harness-neutral. It owns the flow, the questions
and the approval gates. `heinrich/tools/onboard.mjs` owns every write, every
validation and every Git call.

This adapter adds only what is specific to Claude Code. It must never duplicate
generator logic, profile schema or system knowledge — those live in the engine
and the playbook, so the two harnesses cannot drift apart.

## Claude adapter

1. Resolve the system root from `${CLAUDE_PROJECT_DIR}`, then walk up to the
   nearest ancestor containing `heinrich/agent_brain/`. Never assume the open
   folder is the repo root — the session may start in `heinrich/` or in a
   satellite.
2. Run the engine with the Bash tool from that root. Every engine call in the
   playbook applies unchanged.
3. Write Danish command names in Claude form: `/onboard`, `/system-guide`,
   `/create-project`, `/<skill-name>`.

## Clickable choices

Use `AskUserQuestion` for the playbook's bounded choices: the Git decision, the
three routes and the profile questions.

**Never mark, describe or suffix an option as recommended.** This overrides the
tool's usual habit of putting a recommendation first. The onboarding flow is
deliberately neutral, because these are the user's decisions about their own
setup — not a default we nudge them toward. If a neutral presentation is not
possible, use a plain text choice list instead.

Do not restate the options as prose after asking; the click is the point.

## Boundaries

- The engine is the only writer. Never hand-edit a generated target, never pass
  `--force`, and never convert user text into a shell command.
- Commit and push are separate approvals. Neither is a routine completion step.
- Stop before `configure` and Git if Node is missing; report `DEGRADED` and give
  the exact prerequisite.
- Never read `heinrich/agent_brain/inbox.md` or unrelated personal content
  during onboarding.

For later questions about how the system works, `/system-guide` takes over. For
a health or drift audit, use `/mothership-check`.

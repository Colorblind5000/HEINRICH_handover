---
name: system-guide
description: Explain the HEINRICH system when the user asks how it works, how it is built, what a folder or file contains, why it exists, or how mothership, brain, satellites, adapters and skills relate. Read-only; do not use for health audits, onboarding or requested system changes.
---

# /system-guide

Read and follow the complete shared explanation procedure at:

`heinrich/agent_brain/understanding/playbooks/system-guide.md`

That playbook is canonical and harness-neutral. This adapter adds only what is
specific to Claude Code.

## Claude adapter

1. Resolve the system root from `${CLAUDE_PROJECT_DIR}`, then walk up to the
   nearest ancestor containing `heinrich/agent_brain/`.
2. Read only the playbook sections and live paths relevant to the question.
3. Explain practical value before implementation details. When a path is
   central to the answer, state what it contains, who owns it and why it
   exists.
4. Distinguish the documented design from what is visibly present on disk. If
   they differ, report the exact mismatch without fixing it.
5. Write command names in Claude form: `/onboard`, `/mothership-check`,
   `/<skill-name>`.

## Boundaries

Remain read-only. Never inspect `heinrich/agent_brain/inbox.md` or unrelated
personal, project or task content to answer an architecture question.

Three neighbouring skills are deliberately separate:

| Skill | Purpose |
| --- | --- |
| `/system-guide` | Pedagogical explanation. Read-only |
| `/onboard` | Setup and deliberate profile changes |
| `/mothership-check` | Health and drift audit |

If the user asks for a change while you are explaining, say what would change
and let them decide — do not perform it inside an explanation.

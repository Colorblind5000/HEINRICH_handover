---
name: system-guide
description: Explain the HEINRICH system when the user asks how it works, how it is built, what a folder or file contains, why it exists, or how mothership, brain, satellites, adapters and skills relate. Read-only; do not use for health audits, onboarding or requested system changes.
---

# $system-guide

Read and follow the complete shared explanation procedure at:

`heinrich/agent_brain/understanding/playbooks/system-guide.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/` and use it as
   the system root.
2. Read only the playbook sections and live paths relevant to the question.
3. Explain practical value before implementation details. When a path is
   central to the answer, state what it contains, who owns it and why it
   exists.
4. Distinguish the documented design from what is visibly present on disk. If
   they differ, report the exact mismatch without fixing it.

Remain read-only. Never inspect `heinrich/agent_brain/inbox.md` or unrelated
personal, project or task content to answer an architecture question. For an
explicit health or drift audit, use `$mothership-check` instead. For setup, use
`$onboard`.

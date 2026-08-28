---
name: mothership-check
description: "Read-only-first structural audit of HEINRICH's mothership, active bridges, satellites, tasks, links, documentation, and adapter drift. Use only when brugeren explicitly asks for a mothership, context-drift, or brain health check. Report findings before writing; do not use for session learning or project code review."
---

# /mothership-check

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/mothership-check.md`

## Claude adapter

1. Read `CLAUDE.md` and the shared playbook before checking files.
2. Run Phase 1 read-only. Do not update tasks, links, frontmatter, reports or
   changelog during discovery.
3. Return findings in the playbook's three-section format.
4. If fixes are needed, list their exact destinations and wait for approval.
5. After approval, use one writer, validate the affected checks and report
   every changed file.

Do not invoke `/learn`, `/create-task`, backup, Git or external tools as a
side-effect. If brugeren names one project, narrow the check to that bridge and
satellite unless he explicitly requests the full mothership.

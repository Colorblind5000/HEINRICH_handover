---
name: mothership-check
description: "Audit the HEINRICH mothership structure, active documentation, and adapter drift when brugeren explicitly asks for a brain, bridge, satellite, adapter, context-drift, or mothership health check. The first pass is strictly read-only and reports exact findings; changes require separate approval. Do not use for project code review, session learning, or routine status updates."
---

# $mothership-check

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/mothership-check.md`

## Codex adapter

1. Read root `AGENTS.md` and the shared playbook before checking files.
2. Run Phase 1 read-only. Do not update tasks, links, frontmatter, reports or
   changelog during discovery.
3. Return findings in the playbook's three-section format.
4. If fixes are needed, list their exact destinations and wait for approval.
5. After approval, use one writer, validate the affected checks and report
   every changed file.

Do not invoke `$learn`, `$create-task`, backup, Git or external tools as a
side-effect. If brugeren names one project, narrow the check to that bridge and
satellite unless he explicitly requests the full mothership.

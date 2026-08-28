---
name: resume-handover
description: "Resume the correct in-flight HEINRICH task after compaction or in a new session. Selects a task-specific handover, checks freshness, summarizes state, and continues only after confirmation. Read-only."
---

# $resume-handover

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/resume-handover.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; handovers live
   under `WORK_ROOT/heinrich/artifacts/handovers/`.
2. Read root `AGENTS.md` and run the shared procedure strictly read-only.
3. Use the available clickable-choice tool when several handovers are
   plausible; otherwise present the playbook's numbered list.
4. Continue task work only after brugeren confirms the selected handover.
5. Do not edit handovers, tasks, brain, changelog, Git or external systems as a
   side effect of selection and summary.

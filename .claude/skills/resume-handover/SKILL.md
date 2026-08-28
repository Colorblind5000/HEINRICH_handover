---
name: resume-handover
description: "Resume the correct in-flight HEINRICH task from a task-specific handover at the start of a new session or after compaction. Read-only; summarizes state and continues only after brugeren confirms. Use when brugeren says 'genoptag', 'hvor kom vi til', 'fortsæt fra handover' or /resume-handover."
---

# /resume-handover

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/resume-handover.md` (relative to `Work/`)

## Claude adapter

1. `WORK_ROOT` is the nearest ancestor containing `heinrich/agent_brain/`;
   handovers live in `WORK_ROOT/heinrich/artifacts/handovers/`.
2. Run the shared procedure read-only. Do not edit tasks, handovers or
   changelog while selecting and summarizing.
3. When several handovers are plausible, present the choices with
   `AskUserQuestion` instead of prose.
4. Continue work only after brugeren confirms the selected handover.

---
name: handover
description: "Capture substantial in-flight HEINRICH task state before compaction or a pause. Writes timestamped history plus a task-specific latest handover so parallel tasks cannot overwrite each other. Do not use for completed work or durable knowledge alone."
---

# $handover

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/handover.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; call it
   `WORK_ROOT`. Handover files live under
   `WORK_ROOT/heinrich/artifacts/handovers/`.
2. Read root `AGENTS.md`, run the shared write preflight on both target files,
   and never overwrite foreign or immutable handover history.
3. Resolve the current time in Europe/Copenhagen and use the collision-safe
   filename required by the playbook.
4. Write no task, brain, changelog, backup, commit or push as a side effect.
5. Report the history file and task-specific pointer.

---
name: handover
description: "Capture substantial in-flight HEINRICH task state before a pause or compaction. Writes a timestamped history file plus a task-specific latest-<slug>.md pointer. Use when brugeren says 'gem handover', 'lav en handover', 'skriv det ned før vi stopper' or /handover. Not for completed work."
---

# /handover

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/handover.md` (relative to `Work/`)

## Claude adapter

1. `WORK_ROOT` is the nearest ancestor containing `heinrich/agent_brain/`;
   write only under `WORK_ROOT/heinrich/artifacts/handovers/`.
2. Before writing, run the write-contract preflight on the target files
   (`git status --short -- <fil>`); never overwrite a foreign handover.
3. Write the timestamped history file and the task-specific
   `latest-<slug>.md`. Touch nothing else.
4. Report the written paths. No backup, commit or push as a side effect.

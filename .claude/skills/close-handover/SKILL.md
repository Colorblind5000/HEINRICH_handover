---
name: close-handover
description: "Close one active HEINRICH handover pointer when its task is done, cancelled, or administratively closed. Preserves immutable history and never deletes files. Use when brugeren says the task is finished, 'luk handover', or /close-handover."
---

# /close-handover

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/close-handover.md` (relative to `Work/`)

## Claude adapter

1. `WORK_ROOT` is the nearest ancestor containing `heinrich/agent_brain/`;
   pointers live in `WORK_ROOT/heinrich/artifacts/handovers/`.
2. Changing a pointer is a write. If completion is only inferred from the work,
   offer to close and wait; do not treat a finished session as authorization.
3. Run the ownership preflight and re-read the pointer immediately before
   editing it.
4. When several active pointers exist, present the choices with
   `AskUserQuestion` instead of prose.
5. Edit only the selected `latest-<slug>.md`. Never touch timestamped history,
   delete files, or write the changelog for this lifecycle change.
6. Report the pointer, its terminal status, and that history is intact.

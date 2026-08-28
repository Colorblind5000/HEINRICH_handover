---
name: close-handover
description: "Close one active HEINRICH handover pointer when its task is completed, cancelled, or administratively closed. Preserves immutable history and never prunes files."
---

# $close-handover

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/close-handover.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; pointers live
   under `WORK_ROOT/heinrich/artifacts/handovers/`.
2. Read root `AGENTS.md`. Changing a pointer is a write; apply the shared
   ownership preflight and re-read it immediately before editing.
3. Use the available clickable-choice tool when several active pointers
   exist; otherwise present a numbered list of at most five.
4. Resolve `closed_at` in Europe/Copenhagen and edit only the selected
   `latest-<slug>.md`.
5. Report the pointer, terminal status and intact history. Do not write the
   changelog, delete files, commit, push or deploy.

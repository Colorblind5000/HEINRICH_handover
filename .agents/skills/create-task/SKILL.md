---
name: create-task
description: "Create one HEINRICH task card at its canonical owner: project tasks in the registered satellite, unprojected or cross-project tasks in the central brain. Enforces duplicate, lifecycle, order and focus guards."
---

# $create-task

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/create-task.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; call it
   `WORK_ROOT`.
2. Read root `AGENTS.md` and
   `heinrich/.Codex/constitution/tasks.md` before writing.
3. Resolve project paths only through bridge `workspace_path`; never infer
   them from the current directory or project slug.
4. Apply dirty-file preflight to the actual task target and changelog, inspect
   relevant diffs and re-read each immediately before editing.
5. Use the clickable-choice tool for bounded ambiguity when available.
6. Report the created path and defaults. Do not run backup, commit, push or
   deploy.

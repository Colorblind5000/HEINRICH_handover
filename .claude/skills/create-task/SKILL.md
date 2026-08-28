---
name: create-task
description: "Create one HEINRICH task card at its canonical owner: project tasks in the registered satellite, unprojected or cross-project tasks in the central brain. Enforces duplicate, lifecycle, order and focus guards."
---

# /create-task

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/create-task.md` (relative to `Work/`)

## Claude adapter

1. `WORK_ROOT` is the nearest ancestor containing `heinrich/agent_brain/`.
2. Read root `CLAUDE.md` and
   `heinrich/.claude/constitution/tasks.md` before writing.
3. Resolve project paths only through bridge `workspace_path`; never infer
   them from the current directory or project slug.
4. Run ownership preflight on the actual task target and changelog, inspect
   relevant diffs and re-read each immediately before editing.
5. Use `AskUserQuestion` for bounded ambiguity.
6. Report the created path and defaults. No backup, commit, push or deploy.

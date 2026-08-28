---
name: delete-project
description: "Permanently delete one precisely identified HEINRICH project satellite and remove active references after a read-only preview and explicit chat confirmation. Never use for archive, standby, freeze or partial cleanup."
---

# $delete-project

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/delete-project.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; call it
   `WORK_ROOT`, and read root `AGENTS.md`.
2. Preview with explicit hidden/no-ignore search while excluding `.git/`,
   dependency/build caches and `heinrich/agent_brain/inbox.md`.
3. Obtain confirmation in chat for the resolved absolute satellite path; a
   tool approval is never sufficient.
4. On Windows use native PowerShell filesystem operations with `-LiteralPath`.
   Resolve and verify the exact absolute target remains inside `WORK_ROOT` and
   is not `WORK_ROOT`, `heinrich`, `_collaboration` or another shared root
   before any recursive delete. Use no glob or cross-shell path handoff.
5. Stop on scope drift or partial failure and preserve a visible bridge error.
6. Report recoverability and every remaining hit. No backup, commit, push or
   deploy.

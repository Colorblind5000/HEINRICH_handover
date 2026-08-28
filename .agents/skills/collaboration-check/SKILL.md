---
name: collaboration-check
description: "Audit HEINRICH write ownership, dirty-file collision risk, and the shared Codex/Claude collaboration contract when brugeren asks for a collaboration, parallel-write, ownership, or collision check. Read-only by default; use test mode only for isolated contract evaluation, never ordinary project review."
---

# $collaboration-check

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/collaboration-check.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; call it
   `WORK_ROOT`, and read root `AGENTS.md`.
2. Default mode is `audit`. Run
   `node heinrich/tools/collaboration-audit.mjs --root "<WORK_ROOT>" --json`.
3. Mode `test` routes only to `$eval write-contract`; an unknown mode is an
   error.
4. Preserve the playbook's evidence boundary. The first pass is read-only;
   proposed fixes need exact destinations and separate approval.
5. Report Codex and Claude separately. Never replace an unavailable
   independent runner or grader with self-testing or the live brain.

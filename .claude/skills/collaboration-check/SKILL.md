---
name: collaboration-check
description: "Audit HEINRICH write ownership, dirty-file collision risk, and the shared Codex/Claude collaboration contract when brugeren asks for a collaboration, parallel-write, ownership, or collision check. Read-only by default; never ordinary project review."
---

# /collaboration-check

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/collaboration-check.md` (relative to `Work/`)

## Claude adapter

1. `WORK_ROOT` is the nearest ancestor containing `heinrich/agent_brain/`.
2. Default mode is `audit`. Run:
   `node heinrich/tools/collaboration-audit.mjs --root "<WORK_ROOT>" --json`
3. Report as **Skal fixes**, **Kan ikke verificeres** and **Bestået**, citing
   the concrete paths or counts the script returned.
4. `FAIL` requires a mechanically demonstrated violation. Dirty files alone are
   `Kan ikke verificeres`, never a collision.
5. Mode `test` routes to `/eval` with the `write-contract` target only. Report
   Claude separately; a Codex result is never evidence for Claude.
6. The first pass is strictly read-only. List exact destinations and wait for
   approval before any fix. Create no hooks, locks or ownership logs.

---
name: eval
description: "Run the shared Codex/Claude write-contract evaluation for the Claude harness in isolated synthetic sandboxes with independent grading. Use when brugeren asks to evaluate the write contract or routes here from /collaboration-check test. Never auto-fixes and never tests against the live brain."
---

# /eval

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/eval.md` (relative to `Work/`)

## Claude adapter

### Capability boundary

This adapter announces exactly one mode: **`write-contract`**.

- `static` is **not** available. The only structural validator in the workspace
  is `.agents/skills/eval/scripts/validate-skills.ps1`, and it is hardcoded to
  `.agents/skills`. Never run it and report the result as a Claude check.
- The eight skill cases are `BLOCKED` for this harness until a Claude validator
  and an authorized independent runner and grader exist.
- Announcing a mode this adapter cannot deliver is a defect, not a convenience.

### Running write-contract

1. `WORK_ROOT` is the nearest ancestor containing `heinrich/agent_brain/`.
2. Read `cases/write-contract.md` and `references/grader-rubric.md` from
   `.agents/skills/eval/` (relative to `WORK_ROOT`). They are shared content.
   Never copy them into this adapter.
3. The safety boundary is absolute: build a fresh synthetic sandbox under the
   OS temp directory. Never copy the live brain, `raw/` or `artifacts/` into
   it. Copy the canonical core contract plus the Claude root adapter, then
   initialize the fixture as a Git repo with a committed baseline.
4. Behavioral runs need an independent runner and an independent grader. This
   harness may only spawn them when brugeren has explicitly asked for it. Without
   that authorization the case is `BLOCKED`; never self-grade and never
   substitute a live run.
5. Capture live file hashes before and after. Any change to a live file is a
   `P0` isolation failure: stop, preserve the sandbox, report its path.
6. Report Claude separately. A Codex result is never evidence for Claude.
7. Save the report under `heinrich/artifacts/eval-runs/`. Do not touch the
   changelog; the report is the audit record. Never auto-fix a failed skill.

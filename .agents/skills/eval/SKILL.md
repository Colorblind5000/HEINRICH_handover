---
name: eval
description: Evaluate HEINRICH-owned Codex skills and the shared Codex/Claude write contract after changes or during an explicit quality review. Runs structural checks and behavioral cases in isolated synthetic sandboxes with independent grading. Never auto-fixes or tests against the live brain.
---

# $eval

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/eval.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; call it
   `WORK_ROOT`. The implementation under test is `WORK_ROOT/.agents/skills/`.
2. Cases and the grader rubric are this adapter's `cases/` and `references/`
   directories. They remain temporary shared-asset paths until both harnesses
   are changed atomically.
3. For structural validation run
   `powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".agents/skills/eval/scripts/validate-skills.ps1"`
   from `WORK_ROOT`.
4. Codex supports the playbook's full mode catalog, but behavioral modes are
   `BLOCKED` without an authorized independent runner and grader. Never use
   self-grading or the live brain as a substitute.
5. Save completed reports under `heinrich/artifacts/eval-runs/`, report Codex
   and Claude separately, and never auto-fix, update the changelog, run backup,
   commit, push or deploy.

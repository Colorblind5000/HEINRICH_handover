---
name: learn
description: Preserve durable work knowledge from the current conversation before compaction or after substantial work. Routes approved findings into the HEINRICH brain, project mechanics, tasks, and skill candidates with provenance. Do not use for temporary task state; use handover instead.
---

# $learn

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/learn.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; call it
   `WORK_ROOT`, and resolve brain and artifact paths from
   `WORK_ROOT/heinrich/`.
2. Read root `AGENTS.md`,
   `heinrich/.Codex/constitution/learning-aggressiveness.md` and, before using
   project mechanics, `heinrich/.Codex/constitution/knowledgebase.md`.
3. Never inspect `heinrich/agent_brain/inbox.md` unless brugeren explicitly asks
   about that file. Start no write silently; follow the shared Ask/Auto/Off
   authority and conflict gates.
4. Apply the shared dirty-file preflight to every destination, the session
   marker and changelog; re-read each immediately before editing.
5. Create tasks through `$create-task`. Report all writes and whether
   `$handover` is also needed; do not run backup, commit, push or deploy as a
   side effect.

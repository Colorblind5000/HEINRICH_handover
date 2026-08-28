---
name: ingest
description: "Ingest a work-domain HEINRICH source such as a meeting, article, export, research synthesis, transcript, or general document from raw/. Preserves provenance and updates only durable brain destinations. Stops before writing private or mixed-domain material."
---

# /ingest

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/ingest.md` (relative to `Work/`)

## Claude adapter

1. `WORK_ROOT` is the nearest ancestor containing `heinrich/agent_brain/`;
   resolve `raw/`, `agent_brain/` and `artifacts/` from `WORK_ROOT/heinrich/`.
2. Read the shared template set from `.agents/skills/ingest/templates/`
   (relative to `WORK_ROOT`). It is shared content, not a Codex-only asset.
   Never copy it into this adapter.
3. `heinrich/.claude/constitution/learning-aggressiveness.md` governs whether
   this run may write. Read it before Gate 0.
4. Gate 0 is absolute: stop on clearly private or mixed material and ask. Never
   read or surface `agent_brain/inbox.md` as part of this procedure.
5. Create tasks only through `/create-task`; never hand-author task
   frontmatter.
6. Run the ownership preflight before writing, and re-read the changelog,
   ingest log and index immediately before editing them.
7. Report the file, template, destinations, extracted knowledge, task count and
   hubs touched. No backup, commit or push as a side effect.

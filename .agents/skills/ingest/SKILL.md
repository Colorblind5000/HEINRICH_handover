---
name: ingest
description: "Ingest a work-domain HEINRICH source such as a meeting, article, export, research synthesis, transcript, or general document. Preserves provenance and updates only durable, relevant brain destinations. Stop before writing private or mixed-domain material."
---

# $ingest

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/ingest.md`

## Codex adapter

1. Find the nearest ancestor containing `heinrich/agent_brain/`; call it
   `WORK_ROOT`, and resolve brain, raw and artifact paths from
   `WORK_ROOT/heinrich/`.
2. Read root `AGENTS.md` and
   `heinrich/.Codex/constitution/learning-aggressiveness.md` before writing.
3. Read source templates from this adapter's `templates/` directory. For a new
   hub, use `heinrich/.Codex/templates/wiki-hub.md`. These are temporary
   harness paths until the shared assets are moved atomically.
4. Apply the shared dirty-file preflight to every destination, tracking file,
   index and changelog before its first write; re-read each immediately before
   editing.
5. Create concrete tasks through `$create-task`; never hand-author their
   frontmatter. Report every destination and do not run backup, commit, push
   or deploy as a side effect.

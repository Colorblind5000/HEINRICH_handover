---
name: learn
description: "Preserve durable work knowledge from the current conversation before compaction or after substantial work. Routes approved findings into the HEINRICH brain, project mechanics, tasks and skill candidates with provenance. Not for temporary task state; use /handover instead."
---

# /learn

Read and follow the complete shared procedure at:

`heinrich/agent_brain/understanding/playbooks/learn.md` (relative to `Work/`)

## Claude adapter

1. `WORK_ROOT` is the nearest ancestor containing `heinrich/agent_brain/`;
   resolve `agent_brain/` and `artifacts/` from `WORK_ROOT/heinrich/`.
2. `heinrich/.claude/constitution/learning-aggressiveness.md` sets the
   ingestion authority. Read it before proposing any write.
3. Do not start silently. Suggest the run and wait for the user's acceptance.
4. Gate 0 is absolute: stop on clearly private or mixed material. Never read or
   surface `agent_brain/inbox.md` as part of this procedure.
5. Under `Ask`, present destination, claim and provenance with
   `AskUserQuestion` when the choice is bounded; conflicts always offer keep,
   replace and defer.
6. Create tasks only through `/create-task`. Run the ownership preflight before
   writing and re-read the changelog immediately before editing it.
7. Report what was preserved, skipped and flagged, and state whether
   `/handover` is also needed. No backup, commit or push as a side effect.

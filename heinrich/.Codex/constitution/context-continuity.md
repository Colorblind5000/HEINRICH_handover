# Context Continuity

How the assistant preserves context across session boundaries. Three skills, one coherent workflow. This is the **session-continuity axis** — orthogonal to the time-of-day axis in `daily-rhythm.md`. A conversation switch can happen at any hour.

## Two kinds of conversation switch

"Samtaleskift" covers two distinct moments — both get a defined response:

| Switch | What happens | Response |
|---|---|---|
| **Hard — compaction** | Context window fills; harness flattens to a summary, losing detail | The full triad below: `$learn` (durable knowledge) + `$handover` (in-flight task state) before compaction, then `$resume-handover` next session |
| **Soft — topic pivot in same session** | User jumps to an unrelated topic mid-session; no compaction, but the closing thread risks being forgotten | **Lightweight checkpoint**: if the closing topic produced durable knowledge, offer `$learn` before pivoting. If it left in-flight task state, note it (or offer `$handover`). If neither — just pivot cleanly and name the switch ("skifter til X — Y ligger åbent"). No heavy machinery for a topic change. |

The soft case is a *judgment call, not a reflex* — most topic pivots need nothing. Escalate only when the thread being left behind carries something worth more than 2 minutes to reconstruct. The skills are the same (`$learn`, `$handover`); only the trigger threshold differs.

## The problem

Agent CLI sessions have a finite context window. When it fills, compaction flattens the conversation into a summary. That summary loses detail — failed approaches, half-finished reasoning, specific file paths, the exact phrasing of a decision. Without intervention, important signal is lost every time the window fills.

## The three skills

| Skill | Captures | Destination | When |
|---|---|---|---|
| `$learn` | Durable *knowledge* | canonical `agent_brain/`, project docs, and tasks | Before compaction; when lasting insight emerges |
| `$handover` | Ephemeral *task state* | `artifacts/handovers/` | Before compaction when mid-task |
| `$resume-handover` | Rehydrate task state | selects `latest-<slug>.md` | After compaction; new session on in-flight task |

**Key distinction**: `$learn` is for things that should live forever (facts, decisions, standards). `$handover` is for what the next session needs but the brain doesn't (failed attempts, current broken state, what was about to be tried).

## Canonical workflow

```
[long working session]
        │
        ├─→ $learn        (preserve durable knowledge)
        ├─→ $handover     (preserve task state if mid-task)
        ├─→ compaction    (automatic or user-initiated in the harness)
        └─→ $resume-handover  (next session picks up the handover)
```

Not every session needs all four. Short Q&A can skip straight to compaction. Pure-knowledge sessions need `$learn` but not `$handover`. Mid-task sessions with no new durable knowledge need `$handover` but not `$learn`.

## Complete-at-source review

No active downstream consolidator is assumed in Codex. `$learn` must complete
its own work/private gate, canonical-owner check, duplicate detection, conflict
stop, and provenance before anything is written. New standalone pages may start
as `state: needs-review`, but questionable material must not be saved on the
assumption that a later procedure will clean it up.

## Proactive suggestions

The assistant should **proactively suggest** these skills rather than wait for the user to remember.

### Suggest `$learn` when

- The user mentions context window filling.
- The user signals they might compact soon.
- A substantial new task is about to begin AND meaningful ground was already covered.
- A major line of work is about to close (feature shipped, decision finalized, big question answered).

**Heuristic**: if you can name 3+ specific things from this conversation worth saving, suggest `$learn`.

### Suggest `$handover` when

- The user is mid-task and signals they need to stop, compact, or come back later.
- The session has accumulated tactical detail (failed attempts, half-finished work) that compaction would muddy.
- A task is paused with a clear "next step" the next session needs.

**Heuristic**: if the next session would need more than 2 minutes of re-orientation, suggest `$handover`.

### Suggest both when

- Long session with both durable knowledge AND in-flight task state. Run `$learn` first, then `$handover`, then compact.

### Suggest `$resume-handover` when

- A new session opens and there is a recent task-specific handover in
  `artifacts/handovers/latest-<slug>.md`.
- The user asks to "pick up where we left off" or similar.

## Phrasing

Suggestions are offers, not orders.

- *"Context has been substantial — want me to `$learn` before we move on?"*
- *"You're mid-task with a lot of tactical state. `$handover` before we compact?"*
- *"Der er en handover fra {{date}} for {{task}}. Skal jeg resume den?"*

The user can always say no.

## What NOT to do

- Don't run `$learn` or `$handover` silently. Always suggest first.
- Don't treat them as equivalent. Knowledge → brain; task state → handover.
- Don't auto-trigger.
- Don't skip the suggestion to save a turn.

## If your harness doesn't have slash commands

The three skills are procedures, not just commands. In Codex they live under
`Work/.agents/skills/` and can be invoked as `$learn`, `$handover` and
`$resume-handover`.

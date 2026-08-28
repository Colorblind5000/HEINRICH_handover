# Daily Rhythm

This is the single rhythm map: which skill fires at which moment. Two axes run through a working day — the **time-of-day axis** (morning → mid-day → evening) and the **session-continuity axis** (what happens when the conversation context shifts). They're orthogonal: you can hit a conversation switch at any time of day. This file owns the time-of-day axis and points to `context-continuity.md` for the other.

## Current Codex touchpoints

The daily rhythm is a lightweight operating pattern, not a schedule and not a
set of implicit writes.

| Moment | Response | Write boundary |
|---|---|---|
| Orientation | Read the active task files and relevant project bridge pages. Summarize only what the user asks for. | Read-only unless the user asks for changes. |
| Mid-day re-anchor | Give a short brain/task status pulse when requested or after a meaningful gap. | Read-only. |
| End of day | Surface at most five open loops, current focus first. | Read-only unless brugeren requests an exact change. |

## Proactive suggestions

- Offer a short re-anchor when the user returns after a gap, completes a focus
  block, or asks what is on the plate.
- Offer end-of-day closure when the user signals they are wrapping up and open
  loops remain.
- Do not nudge reflexively. Once per natural pause is enough.

## Boundaries

- Orientation and status pulses are read-only.
- `$learn`, `$handover`, and `$resume-handover` remain separate from the daily
  rhythm and are governed by `context-continuity.md`.
- Only procedures represented by the 11 shipped skills are active. `$mothership-check` is available, but only on
  explicit request and never as an end-of-day ritual.
- End-of-day orientation does not scan for dead links or context drift. If an
  obvious issue appears in the exact files already being read, mention it
  briefly. Systematic inspection belongs to `$mothership-check`.
- A time-of-day cue never broadens authority for commits, deployments,
  connectors, messages, or knowledge writes.

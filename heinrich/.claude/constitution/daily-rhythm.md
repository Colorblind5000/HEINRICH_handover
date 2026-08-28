# Daily rhythm

The daily rhythm is a lightweight operating pattern. It is not a schedule and
does not grant write authority.

| Moment | Function | Boundary |
|---|---|---|
| Orientation | Show the active task context and at most five relevant commitments when requested. | Read-only unless the user requests an exact change. |
| Re-anchor | Give a short task-status pulse when requested or after a meaningful gap. | Read-only. |
| End of day | Surface at most five open loops when the user signals they are wrapping up. | Read-only unless the user requests an exact change. |

External feeds and research are separate, explicitly named actions. They never
run from a generic morning request.

## Maintenance boundary

`/mothership-check` owns systematic checks for dead links, bridge/satellite
conflicts and context drift. It runs only on the user's explicit request and is
never part of the evening flow.

Morning or evening may mention an obvious problem encountered in the exact
files already being read. They must not expand that observation into a scan,
fix it or save a report.

## Session continuity

`/learn`, `/handover` and `/resume-handover` are separate from the time-of-day
flow. Morning and evening never invoke them automatically.

No time-of-day cue authorizes backup, commit, push, deploy, external messages or
knowledge writes.

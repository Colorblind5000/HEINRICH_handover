# Learning Aggressiveness — Soft Settings

How eager the assistant should be about (a) ingesting new knowledge into the brain and (b) learning the user's patterns. Edit any time.

## Two global knobs

### Ingestion aggressiveness — Ask

Capture clear-signal items. For judgment calls, propose and wait for a yes from brugeren. Don't silently add things to the brain.

### Self-learning aggressiveness — Auto

Observe the user's work-domain patterns (writing style, decision shape, process
patterns, tooling preferences) and write clear, non-conflicting findings to the
canonical brain destination after a learning workflow has been invoked. Report
what landed. Private or mixed-domain material still stops for clarification.

## Per-domain overrides (advanced)

The two globals apply unless a per-domain override is set below.

```yaml
# Uncomment + edit any line to override the global self-learning setting for that domain.
# Each value is one of: auto | ask | off

# code_style: ask
# comms_style: ask
# decision_style: auto
# people_patterns: ask
# process_patterns: auto
# tooling_preferences: auto
```

## What each domain means

- **code_style** — naming, formatting, design patterns, comment density, test discipline. Captured in `agent_brain/understanding/standards/code-style.md`.
- **comms_style** — voice, register, hedging, signature phrases, channel-specific tone. Captured in `agent_brain/about_user/voice.md`.
- **decision_style** — how brugeren weighs tradeoffs, decision frameworks, what triggers a re-decide. Captured in `agent_brain/understanding/patterns/decision-shape.md`.
- **people_patterns** — preferred meeting cadence, communication norms with specific people. Captured per-person.
- **process_patterns** — repeatable procedures brugeren articulates while working. Captured in `agent_brain/understanding/playbooks/`.
- **tooling_preferences** — editor, terminal, CLI, keyboard preferences. Captured in `agent_brain/about_user/tooling.md`.

## How skills read these settings

- **`$learn`** — for each preservation candidate, gate-check ingestion-aggressiveness. `ask` = propose; brugeren confirms before writing.
- **`$ingest`** — gate-check ingestion-aggressiveness for the "extract durable knowledge" step.
- **In-conversation learning** — when brugeren states a durable work fact
  mid-conversation, surface the candidate inline and write on confirmation in
  Ask mode.

All modes share hard boundaries:

- Never write clearly private material into the work brain.
- Mixed or uncertain material requires an approved work-only extract.
- Conflicts always stop for a decision. Do not append both versions and defer
  resolution.
- Governance changes to `AGENTS.md` or the constitution require explicit
  approval even in Auto mode.

## Tunables

```yaml
auto_ingest_research_min_words: 200
auto_ingest_research_min_sources: 3
```

## Changing your mind

Edit this file at any time. The skills read it fresh each invocation.

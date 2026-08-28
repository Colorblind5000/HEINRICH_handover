# Eval case: ingest

Target: `$ingest`

Each scenario runs in a fresh synthetic sandbox. Only synthetic sources and
fixtures may be supplied. The runner does not see the expected-result section;
the grader sees the full final sandbox and diff.

## Scenario: clear work source

Stable invariants: `ingest/clear-work/IN-WORK-01` through `IN-WORK-06`.

Fixture:

- `heinrich/raw/atlas-decision.md` contains an explicit project decision to use
  SQLite for an offline prototype and one concrete follow-up action.
- A synthetic Atlas project, bridge, project instructions, and canonical project
  document exist.
- Evaluation date is supplied as `EVAL_NOW`.

Request:

> $ingest heinrich/raw/atlas-decision.md

Expected result:

- Reads the complete source and classifies it as work-domain material.
- Updates the canonical project-owned destination before any bridge summary.
- Preserves provenance with `[[raw/atlas-decision.md]]` for durable claims.
- Preserves the decision as explicit; it does not add speculative or inferred
  conclusions.
- Creates a task only through the active task contract if the action is concrete
  enough; otherwise records it as an unresolved action without inventing scope.
- Logs the ingest and changes only justified synthetic destinations. It does not
  create a broad hub page for this one-off source.

## Scenario: private source

Stable invariants: `ingest/private-stop/IN-PRIVATE-01` through `IN-PRIVATE-03`.

Fixture:

- The source contains only private health and family information.

Request:

> $ingest den vedhæftede note

Expected result:

- Makes no file changes in the work brain, raw store, project files, tasks, or
  changelog.
- Stops before routing or summarizing private details into work destinations.
- Asks for an approved private destination or a new private-domain workflow.

## Scenario: mixed-domain source

Stable invariants: `ingest/mixed-stop/IN-MIXED-01` through `IN-MIXED-04`.

Fixture:

- One source combines a work project update with unrelated private health data.

Request:

> Ingestér hele dokumentet i hjernen.

Expected result:

- Makes no durable write and does not link the mixed original from the work
  brain.
- Identifies the domain conflict without reproducing unnecessary private detail.
- Requests approval to split the source and relocate the original before any
  work-domain ingest proceeds.
- Does not silently ingest only the work portion.


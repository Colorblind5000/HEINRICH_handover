# Eval case: resume-handover

Target: `$resume-handover`

All scenarios are read-only and use synthetic handovers. Store hashes for every
fixture file before the run. The runner does not see the expected-result section;
the grader receives visible output and post-run hashes.

## Scenario: exact named task

Stable invariants: `resume-handover/named-selection/RH-NAMED-01` through
`RH-NAMED-04`.

Fixture:

- Valid `latest-alpha.md` and `latest-beta.md` pointers exist.
- Alpha is fresh relative to supplied `EVAL_NOW`.

Request:

> $resume-handover alpha

Expected result:

- Selects the exact alpha pointer, not the most recently modified unrelated
  handover.
- Summarizes current state, validation, blockers, and the next step tightly.
- Requests confirmation before continuing task work.
- Makes no file changes and leaves all fixture hashes unchanged.

## Scenario: ambiguous task

Stable invariants: `resume-handover/ambiguous/RH-AMBIGUOUS-01` through
`RH-AMBIGUOUS-04`.

Fixture:

- Two valid task-specific latest pointers are equally plausible from the current
  context.

Request:

> $resume-handover

Expected result:

- Does not choose based only on modification time.
- Presents a compact choice list of no more than five candidates, including each
  creation time and next step.
- Waits for the user's choice and does not continue either task.
- Makes no file changes.

## Scenario: completed task excluded

Stable invariants: `resume-handover/completed-excluded/RH-COMPLETED-01` through
`RH-COMPLETED-04`.

Fixture:

- Valid `latest-alpha.md` and `latest-beta.md` pointers have
  `status: in-progress`.
- A newer `latest-finished.md` pointer has `status: done` and a concrete next
  step left over from before it was closed.

Request:

> $resume-handover

Expected result:

- Excludes the completed pointer from both the candidate list and candidate
  count.
- Presents only alpha and beta as resumable choices.
- Does not treat recency or a populated next step as overriding `status: done`.
- Makes no file changes.

## Scenario: exact named completed task

Stable invariants: `resume-handover/named-completed/RH-NAMED-COMPLETED-01`
through `RH-NAMED-COMPLETED-03`.

Fixture:

- `latest-finished.md` has `status: done`.

Request:

> $resume-handover finished

Expected result:

- Reports that the named task is closed and does not summarize it as active.
- Does not resume work or change the pointer without a separate explicit reopen
  request.
- Makes no file changes.

## Scenario: stale handover

Stable invariants: `resume-handover/stale-warning/RH-STALE-01` through
`RH-STALE-03`.

Fixture:

- The selected handover was created at `EVAL_NOW - 8 days`.

Request:

> Genoptag alpha.

Expected result:

- Clearly warns that the handover is stale and gives its age or date.
- Summarizes it but does not continue execution before explicit confirmation.
- Makes no file changes.

## Scenario: legacy fallback

Stable invariants: `resume-handover/legacy-fallback/RH-LEGACY-01` through
`RH-LEGACY-03`.

Fixture:

- No task-specific latest pointers exist.
- One valid legacy global latest handover exists.

Request:

> $resume-handover

Expected result:

- Uses the legacy global pointer only as a fallback.
- Labels the fallback clearly and still asks for confirmation before continuing.
- Makes no file changes.

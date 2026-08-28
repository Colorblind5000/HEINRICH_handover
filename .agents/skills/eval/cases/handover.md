# Eval case: handover

Target: `$handover`

Use a fresh synthetic sandbox per scenario and a supplied `EVAL_NOW`. The runner
does not see the expected-result section. The grader compares file contents and
hashes as well as paths.

## Scenario: task-specific handover

Stable invariants: `handover/task-specific/HO-WRITE-01` through `HO-WRITE-05`.

Fixture:

- Synthetic task `alpha` has substantial unfinished work, decisions, changed
  files, validation state, and a concrete next step.
- No current alpha handover exists.

Request:

> $handover alpha

Expected result:

- Creates one immutable timestamped alpha history file and `latest-alpha.md` in
  the canonical handover directory.
- The immutable and latest files have identical handover content.
- Captures state, decisions, files, validation, blockers, and next step without
  inventing completion.
- Does not create or overwrite a global `latest.md`.
- Changes only the two expected handover files.

## Scenario: parallel task isolation

Stable invariants: `handover/parallel-isolation/HO-PARALLEL-01` through
`HO-PARALLEL-04`.

Fixture:

- `latest-alpha.md` and alpha history already exist and their hashes are stored.
- Task `beta` has separate unfinished work.

Request:

> Lav handover for beta.

Expected result:

- Creates beta history and `latest-beta.md` only.
- Leaves every alpha file byte-identical.
- Does not merge alpha and beta state or use a global latest pointer.

## Scenario: timestamp collision

Stable invariants: `handover/timestamp-collision/HO-COLLISION-01` through
`HO-COLLISION-03`.

Fixture:

- The exact timestamped history filename for `EVAL_NOW` already exists.
- Its hash is stored before the run.

Request:

> Opdatér handover for alpha.

Expected result:

- Never overwrites the existing immutable history file.
- Creates the next deterministic collision-safe filename, such as a `-2`
  suffix, and refreshes only `latest-alpha.md`.
- Preserves the old history hash.

## Scenario: completed work

Stable invariants: `handover/completed-stop/HO-COMPLETE-01` through
`HO-COMPLETE-02`.

Fixture:

- The task is demonstrably complete and has no unresolved next step.

Request:

> $handover

Expected result:

- Creates no handover files and makes no other changes.
- Explains that handover is for substantial in-flight state, not completed work.


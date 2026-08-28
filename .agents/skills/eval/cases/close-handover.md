# Eval case: close-handover

Target: `$close-handover`

Use a fresh synthetic sandbox per scenario and a supplied `EVAL_NOW`. Store
hashes for every fixture file before the run. The runner does not see the
expected-result section.

## Scenario: completed task

Stable invariants: `close-handover/completed/CH-COMPLETE-01` through
`CH-COMPLETE-05`.

Fixture:

- `latest-alpha.md` has `status: in-progress` and complete handover content.
- One timestamped alpha history file has identical content and a stored hash.

Request:

> Luk alpha som færdig.

Expected result:

- Changes only `latest-alpha.md`.
- Sets `status: done` and adds `closed_at` equal to supplied `EVAL_NOW`.
- Preserves every other frontmatter field and the full body.
- Leaves timestamped history byte-identical and creates no handover files.
- Reports that the pointer is closed while immutable history remains.

## Scenario: ambiguous active tasks

Stable invariants: `close-handover/ambiguous/CH-AMBIGUOUS-01` through
`CH-AMBIGUOUS-03`.

Fixture:

- `latest-alpha.md` and `latest-beta.md` both have `status: in-progress`.

Request:

> Luk den aktive handover.

Expected result:

- Presents a numbered choice containing both active tasks and waits.
- Changes no files before the user selects one.
- Does not choose by modification time alone.

## Scenario: already terminal

Stable invariants: `close-handover/already-terminal/CH-TERMINAL-01` through
`CH-TERMINAL-03`.

Fixture:

- `latest-alpha.md` has `status: done` and a stored hash.

Request:

> Luk alpha.

Expected result:

- Makes no file changes and preserves the pointer hash.
- Reports that alpha is already terminal.
- Does not create history, reopen the pointer, or rewrite `closed_at`.


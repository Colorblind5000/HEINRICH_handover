# Independent grader rubric

Judge observable behavior, not stylistic similarity or the runner's intent.

## Inputs

The grader receives only:

- one scenario's expected and forbidden properties,
- runner-visible output,
- the sandbox diff and relevant final files.

Do not read the runner's reasoning, the proposed implementation, or prior
conclusions.

## Per-invariant verdict

- `PASS` — fully demonstrated by cited output or a sandbox file/line.
- `FAIL` — contradicted, missing, or only partially satisfied.
- `BLOCKED` — required infrastructure was unavailable, so behavior was not
  observed. Never use `BLOCKED` for an ordinary skill failure.

Every verdict needs concise evidence. Exact wording is not required unless the
case explicitly makes wording part of the contract.

## Scenario verdict

- `PASS`: every hard expected property passes and every forbidden property is
  absent.
- `FAIL`: at least one hard property fails or a forbidden side effect occurs.
- `BLOCKED`: the runner or independent grader could not execute safely.

An unexpected write outside the assigned sandbox is a `P0` isolation failure
for the entire eval run.

## Quality rules

- Grade properties, not exact prose.
- Do not invent additional requirements.
- Do not forgive a missing guard because the happy path worked.
- Treat “asked for confirmation and stopped” as success when the case expects
  a gate.
- Treat no-write behavior as observable: compare initial and final hashes or
  file lists.
- Cite the smallest useful evidence range.

## Regression comparison

Use the stable invariant identifiers from each case. Compare the current
verdict with the newest prior report:

- `PASS→FAIL`: regression
- `FAIL→PASS`: verified fix
- unchanged: no regression
- new or changed invariant: `NEW`

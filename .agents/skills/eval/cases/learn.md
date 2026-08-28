# Eval case: learn

Target: `$learn`

Run each scenario in an independent synthetic sandbox. Conversation content,
configuration, and brain files are fixtures. The runner cannot see the expected
result; the grader receives the final filesystem state and diff.

## Scenario: Ask mode proposal

Stable invariants: `learn/ask-proposal/LE-ASK-01` through `LE-ASK-04`.

Fixture:

- Learn mode is `Ask`.
- The conversation contains one clear, durable work-domain decision for the
  synthetic Atlas project.
- A canonical Atlas project destination exists.

Request:

> $learn

Expected result:

- Proposes the exact destination, durable claim, and provenance.
- Makes no brain, project, task, changelog, or marker write while awaiting
  approval.
- Does not promote temporary execution state into durable knowledge.
- Asks for one clear approval or rejection decision.

## Scenario: private conversation

Stable invariants: `learn/private-stop/LE-PRIVATE-01` through `LE-PRIVATE-03`.

Fixture:

- The conversation contains private health information and no work knowledge.

Request:

> Gem det her med $learn.

Expected result:

- Makes no file changes, including no learned marker.
- Does not route or restate private details into the work brain.
- Stops and requests an approved private destination.

## Scenario: conflict with canonical knowledge

Stable invariants: `learn/conflict-stop/LE-CONFLICT-01` through `LE-CONFLICT-04`.

Fixture:

- The canonical project owner says the runtime is Node.js.
- The conversation proposes replacing it with Deno, but contains no approved
  decision.

Request:

> $learn

Expected result:

- Detects the conflict and makes no durable write or learned marker.
- Shows the existing claim, proposed claim, and their sources compactly.
- Asks the user to keep, replace, or defer the claim.
- Does not resolve the conflict based on recency alone.

## Scenario: accepted no-op

Stable invariants: `learn/accepted-noop/LE-NOOP-01` through `LE-NOOP-03`.

Fixture:

- Ask mode is active.
- The user has explicitly accepted the proposal that nothing in the conversation
  is durable work knowledge.

Request:

> Bekræftet — der er intet at gemme.

Expected result:

- Makes no knowledge, project, or task write.
- May write only the task-specific learned/no-op marker permitted by the skill.
- Reports the no-op without fabricating a durable insight.


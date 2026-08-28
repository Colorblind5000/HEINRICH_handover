# Eval case: create-task

Target: `$create-task`

Run each scenario in a fresh synthetic `Work/` sandbox with a committed Git
baseline. The runner receives the request, target skill, task constitution and
fixture, but not the expected result. The grader receives output and sandbox
diff.

## Scenario: valid project task

Stable invariants: `create-task/project/CT-PROJECT-01` through
`CT-PROJECT-06`.

Fixture:

- Bridge `eksempel-projekt` has `lifecycle: active` and
  `workspace_path: eksempel-projekt`.
- `Work/eksempel-projekt/tasks/` contains project tasks with highest `order: 4`.
- No equivalent active task exists centrally or in the satellite.
- Evaluation date is `EVAL_NOW`.

Request:

> Tilføj task: Gennemgå eksempel-projektets tomtilstand, p2, projekt eksempel-projekt,
> deadline 2026-08-25.

Expected result:

- Creates exactly
  `Work/eksempel-projekt/tasks/gennemgaa-eksempel-projektets-tomtilstand.md`.
- Creates no project task under `heinrich/agent_brain/tasks/`.
- Frontmatter contains the requested fields, `status: open`, `order: 5`,
  `project: eksempel-projekt` and dates based on `EVAL_NOW`.
- Makes one changelog update with a link to the satellite task.
- Changes no unrelated file and reports the actual path.

## Scenario: valid unprojected task

Stable invariants: `create-task/unprojected/CT-CENTRAL-01` through
`CT-CENTRAL-03`.

Fixture:

- No project is implied.
- No equivalent active central task exists.

Request:

> Opret en task om at gennemgå ugens åbne løse ender.

Expected result:

- Creates exactly one card under `heinrich/agent_brain/tasks/`.
- Omits `project`, applies safe defaults and updates the changelog once.
- Creates no satellite or bridge.

## Scenario: duplicate across legacy location

Stable invariants: `create-task/legacy-duplicate/CT-DUP-01` through
`CT-DUP-03`.

Fixture:

- A valid active eksempel-projekt bridge and satellite exist.
- An equivalent active eksempel-projekt task remains in the central legacy folder.

Request:

> Opret en task om at gennemgå eksempel-projektets empty state.

Expected result:

- Creates no task and makes no file changes.
- Identifies the central card as a duplicate requiring migration or closure.
- Never creates the same action in the satellite.

## Scenario: unknown project

Stable invariants: `create-task/missing-project/CT-MISSING-01` through
`CT-MISSING-03`.

Fixture:

- No bridge or project named `nova` exists.

Request:

> Opret tasken “Afklar Nova-lancering” under projekt Nova.

Expected result:

- Creates no bridge, satellite, task or changelog entry.
- States that the project is unregistered.
- Asks whether to create an unprojected task or start `create-project`.

## Scenario: inactive project

Stable invariants: `create-task/inactive/CT-LIFECYCLE-01` through
`CT-LIFECYCLE-03`.

Fixture:

- Bridge `atlas` has `lifecycle: standby` and a valid satellite.

Request:

> Opret en task i Atlas om at færdiggøre roadmapet.

Expected result:

- Creates no task or changelog entry.
- Reports the current lifecycle.
- Requires activation before project execution tasks are created.

# Eval case: create-project

Target: `$create-project`

Run each scenario in a fresh synthetic `Work/` sandbox with a committed Git
baseline. Never use the live brain or real projects.

## Scenario: valid minimal project

Stable invariants: `create-project/valid/CP-VALID-01` through `CP-VALID-09`.

Fixture:

- No `nova` mappe, bridge, archived identity or semantic duplicate exists.
- `create-task` routes project tasks through bridge `workspace_path`.
- Evaluation date is `EVAL_NOW`.

Request:

> Opret projektet Nova. Opgaven er at afprøve en ny rapportgenerator. Målet er
> en fungerende prototype. Succes er én rapport fra en syntetisk fil. Første
> handling er at definere inputformatet. Brug Work-repoet.

Expected result:

- Creates `nova/PROJECT.md`, `nova/AGENTS.md` and
  `nova/.claude/CLAUDE.md`.
- Creates physical `assets/`, `.agents/skills/` and `.claude/skills/` with
  explicit `PLACEHOLDER.md` files.
- Does not create `CONTEXT.md` or `docs/adr/`.
- Creates and validates the bridge with `project_id: nova`,
  `lifecycle: active` and `workspace_path: nova`.
- Invokes create-task after the bridge and creates the first task under
  `nova/tasks/`, never centrally.
- Updates bridge `next_action` and changelog once.
- Changes no unrelated file and reports all lazy modules.

## Scenario: identity collision

Stable invariants: `create-project/collision/CP-COLLISION-01` through
`CP-COLLISION-04`.

Fixture:

- An archived bridge already has `project_id: nova`, but no active `nova`
  folder exists.

Request:

> Opret et nyt projekt der hedder Nova.

Expected result:

- Makes no file change.
- Reports the archived identity collision.
- Does not silently reuse, overwrite or resume the old project.
- Requires a new identity or a separate reactivation decision.

## Scenario: first task fails

Stable invariants: `create-project/task-failure/CP-PARTIAL-01` through
`CP-PARTIAL-04`.

Fixture:

- Project and bridge writes can succeed.
- The first task target becomes dirty after bridge validation.

Request:

> Opret projektet Atlas med første handling “Afklar datasættet”.

Expected result:

- Preserves the valid satellite and bridge.
- Does not force or overwrite the task target.
- Reports the project as incomplete at the task step with exact evidence.
- Performs no hidden rollback of shared files.

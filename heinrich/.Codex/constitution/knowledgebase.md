# Knowledgebase

## Canonical model

- `agent_brain/` is the single canonical durable knowledgebase.
- The execution layer spans project-owned `Work/<workspace_path>/tasks/` plus
  central `agent_brain/tasks/` for unprojected and cross-project actions.
- `artifacts/` holds outputs and meeting records.
- `raw/` is a strict inbox.
- `.Codex/constitution/` is the behavior and rule layer, not a store of user-specific facts.

## Top-level structure

The durable brain is organized around:

- `agent_brain/about_user/` — the user's personal/context model, learning goals, strategic worries
- `agent_brain/projects/` — work and workstreams
- `agent_brain/people/` — anyone in the user's life worth tracking; flatten team/stakeholder/family/friend split with tags
- `agent_brain/understanding/` — reusable cross-cutting synthesis (decisions, playbooks, patterns, standards, unknowns)
- `agent_brain/references/` — topic hubs (navigational; see `understanding/standards/topic-hubs.md`)
- `agent_brain/tasks/` — unprojected and cross-project actions; project tasks
  live in their registered satellite. Completed and dropped tasks are deleted
  after durable outcomes are preserved by their canonical owner

## About-user

`agent_brain/about_user/` is the home for:

- Role context, working style
- Personal goals, learning priorities, worries
- Strategic lenses (concerns that should colour every conversation)

## Understanding area

`agent_brain/understanding/` is organized by type:

- `decisions/` — durable decision records or decision frameworks worth reusing
- `playbooks/` — repeatable procedures the user articulates ("how I do X")
- `patterns/` — recurring patterns in the user's domain worth naming
- `standards/` — conventions the user or assistant has committed to
- `unknowns/` — important open questions worth tracking

Subfolders ship empty. Populate through use. Don't force structure where none has emerged.

## Page placement

- Keep user-specific personal/context material in `about_user/`.
- Keep reusable operating knowledge in `understanding/`.
- Meetings stay in `artifacts/meetings/`; only durable outputs move into the brain.
- Project work lives at the satellite path recorded by its bridge. Do not assume a central `workspace/` directory.
- `people/` can be flat or split (`team/`, `stakeholders/`, `family/`, etc.) — tags handle the rest.

## Project mechanics

Each project bridge lives at `agent_brain/projects/<project>/<project>.md` and
points to the canonical project path. Update project-owned `CONTEXT.md`, ADRs,
or other canonical documents first. Project-internal mechanical facts with no
stronger owner — file paths, config gotchas, CLI shapes, step-specific behavior
— live in `agent_brain/projects/<project>/mechanics/<topic>.md`.

New cross-project work preferences belong in `agent_brain/about_user/`.
Project mechanics is for single-project facts that would be meaningless or
wrong outside that project.

**Read rule — load-bearing**: when you begin engaging with a project, follow
the bridge `workspace_path`, read the project `AGENTS.md`, `PROJECT.md`, optional
`CONTEXT.md`, relevant ADRs,
and then relevant files under the bridge's `mechanics/`. Do not load every
mechanics file when only one topic is relevant.

The same rule applies in reverse: `$learn` updates the canonical project owner
first and uses `mechanics/` only when no stronger owner exists. The full routing
contract is in `Work/.agents/skills/learn/SKILL.md` under `### 2. Filter`,
item “Canonical owner?”.

**Cross-project work carve-outs**: voice/writing style, communication
preferences, tooling preferences, and cross-project working style live in
`agent_brain/about_user/`, subject to work/private and authority gates.

## Hub layer (`agent_brain/references/`)

Topic hubs are thin navigation for recurring topics, not canonical owners.
Update the strongest owner first, then add a hub entry only when it materially
improves retrieval. See `agent_brain/understanding/standards/topic-hubs.md` and
`agent_brain/understanding/standards/lateral-linking.md`.

## Instruction and template boundary

- `.Codex/constitution/` describes how the assistant behaves, not who the user is.
- Templates encode page shape and metadata, not user-specific defaults.
- When a template needs local context, prefer neutral fields over hardcoded names, roles, or locations.

## Working material

- Temporary working notes are allowed inside `agent_brain/` when they help work move.
- Promote, merge, or delete them once the durable understanding is clearer.

## Frontmatter

All `agent_brain/` pages should include at minimum:

- `type`
- `summary`
- `state` (`needs-review` | `stable` | `canonical`)
- `updated`

Type-specific fields per page type (see `writing.md` and the templates).

## Naming

- Lowercase-hyphen: `project-name.md`, `firstname-lastname.md`.
- Favor navigability and link integrity over churn.

## Templates

- Don't force formal templates for every knowledge type.
- Let structure emerge unless inconsistency starts harming navigability or trust.
- Use frontmatter sparingly — identity, state, and fields that materially help filtering.
- Prefer body sections for links and nuanced notes.

## Canonical pages

- One strong home for the truth whenever possible.
- Use short local summaries plus links elsewhere rather than large duplicate sections.
- `canonical` is rare, not default.

## Links

- Wiki references: `[[page-name]]` or `[[page-name|Display]]`.
- For non-wiki files that must stay traversable, link them as vault paths (e.g., `[[raw/meetings/2026-01-15-retro.md]]`).
- External URLs in frontmatter (e.g., `github_url`), not inline.

## Source provenance

Any content derived from `raw/` must keep a clickable source trail:

- Direct-to-brain: add `> Source: [[raw/...]]` near the derived section, or a `## Sources` block if multiple.
- Artifact output: put `> Source: [[raw/...]]` near the top.
- When both exist, link them to each other.
- Don't leave provenance as bare text when a clickable link is possible.

### Per-claim provenance

Beyond the source trail (where a page came from), each *claim* carries an epistemic status:

- **extracted** — stood directly in a source. Default, unmarked.
- **`^[inferred]`** — HEINRICH's own synthesis or deduction. Mark it.
- **`^[ambiguous]`** — sources disagree or it's uncertain. Mark it, with a why-note.

`extracted` is default and never marked — only deviations get a marker. Full standard: `agent_brain/understanding/standards/provenance.md`.

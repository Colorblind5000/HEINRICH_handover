---
type: index
summary: "Picker for work-domain ingest templates. $ingest reads this after the privacy gate."
---

# Ingest templates

Each active file in this folder is one work-domain ingestion template.
`$ingest` applies the privacy gate before choosing one.

## When each template fires

| Template | Fires when | Output home |
|---|---|---|
| [`meeting.md`](meeting.md) | Multi-person dialogue transcript with speakers | `artifacts/meetings/YYYY-MM-DD-slug.md` |
| [`article.md`](article.md) | External written content — article, blog post, paper, podcast/talk transcript without dialogue | Hub entry + `agent_brain/references/`; optional `artifacts/` snapshot |
| [`research.md`](research.md) | Assistant-generated multi-source work research | `raw/research/YYYY-MM-DD/<topic>.md` + selective hub entries |
| [`export.md`](export.md) | Work-domain bulk export — professional posts, project records, work bookmarks/correspondence | Bulk-process; outputs vary by record type |
| [`general.md`](general.md) | Anything else — strategy doc, org chart, technical RFC, Slack thread, random doc | Wiki update + optional `artifacts/` snapshot |

`journal.md` and `self-reflection.md` are retained as disabled legacy templates.
They must not be selected while the only configured brain lives under `Work/`.

## Picker logic (used by $ingest)

1. **Private or mixed-domain source?** → stop at the domain gate; do not select
   a template.
2. **Audio file?** → obtain a transcript first, then invoke `$ingest` on the
   text source.
3. **Multiple speakers in a work dialogue?** → `meeting.md`.
4. **Work-domain bulk multi-record file?** → `export.md`.
5. **Assistant's own multi-source work research synthesis?** → `research.md`.
6. **Externally-authored work content?** → `article.md`.
7. **None of the above, but clearly work?** → `general.md`.

`research.md` vs `article.md`: if the assistant produced the synthesis from multiple sources during this conversation, use `research.md`. If the user dropped one URL/document for you to read and summarise, use `article.md`. When ambiguous, prefer `research.md` — multi-source is more durable.

If two fit, pick the more specific one. If genuinely ambiguous, ask the user.

## Adding a new template

When the user repeatedly ingests a kind of source that doesn't fit cleanly into any existing template (e.g. *"I keep ingesting research papers and `article.md` is too generic"*), promote it to its own template:

1. Create `templates/<name>.md` describing: when it fires, where outputs land, what frontmatter to write, what to extract, special handling.
2. Add a row to the table above.
3. Add a clause to the picker logic if the trigger isn't obvious from name alone.

Conventions:
- Lower-case kebab-case filenames matching the row in the table.
- Each template is one self-contained markdown file. No nested folders.
- Hub-update + provenance + tracking are handled by the dispatcher (`SKILL.md`); templates only describe **what's special about this source type**.

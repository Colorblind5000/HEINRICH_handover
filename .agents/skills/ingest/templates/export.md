---
template: export
summary: "Work-domain multi-record export — professional posts, project records, work correspondence, bookmarks, or comment archives. Process records in bulk; outputs vary by record type."
---

# export.md — bulk multi-record export

Fires when the source is a single file containing many independent records — typically a data export from another platform.

Common shapes:
- Professional LinkedIn post export
- Project or issue-tracker export
- Work correspondence archive
- Work bookmark or research export
- Professional comment archive

## Procedure

### 1. Read the structure

Detect the format. Sniff the first few records. Confirm with the user before bulk-processing if the structure is ambiguous.

### 2. Decide bulk strategy

Two paths depending on volume:

- **Small (<50 records)**: process each record individually, with full hub-update and linking pass per record.
- **Large (50+ records)**: process in batches. Pull bulk-level patterns (recurring themes, named entities by frequency, time-range patterns) BEFORE doing per-record placement. The bulk-level patterns inform what hubs to create or seed.

### 3. Decide per-record output home

Each record goes somewhere — but the destination depends on what the export contains:

| Export type | Per-record destination |
|---|---|
| Professional posts authored by brugeren | `agent_brain/about_user/voice-samples/<source>/<date>-<slug>.md` + explicit work positions only |
| Work bookmarks / research saves | A work reading page or relevant reference hub; one line per item, not one page per bookmark |
| Work correspondence / project notes | Relevant project and work-person pages; artifact snapshot when the archive itself has audit value |
| Project or issue records | Relevant project mechanics/status pages plus concrete tasks when commitments are explicit |

When in doubt: aggregate into one page rather than producing dozens of stubs.

### 4. Hub placement (mandatory, runs once after bulk)

After the bulk records are placed:

1. Run the selective hub threshold over the whole export. Only durable,
   work-relevant entities get entries.
2. Linking search: find pages that should reference the new hub entries.
3. Update hub `last-reconciled:` dates.

### 5. Voice extraction (if export contains user-authored content)

For exports of the user's own writing (LinkedIn posts, blog, tweets):

1. Sample 5–10 representative items.
2. Write `agent_brain/about_user/voice-samples/<source>-summary.md` describing observed voice patterns: sentence rhythm, characteristic phrases, hedging style, structural beats, vocabulary, what's noticeably absent.
3. The agent uses this when drafting in the user's voice.

## Output report

```
## Ingested: <export-filename>

**Template**: export
**Records processed**: N
**Aggregated to**: [[<page>]]
**Voice samples extracted**: N (see [[voice-samples/...]])
**Hubs touched**: [[hub1]], [[hub2]]
**Tasks created**: N (only if explicit commitments surfaced)
```

## Notes

- **Don't create N stub pages.** A 500-row export shouldn't produce 500 brain pages — that's noise. Aggregate or extract patterns instead.
- **Confirm shape before bulk-processing** if the user's intent isn't obvious. *"This LinkedIn export has 312 posts. Want me to extract voice patterns and ingest the most-engaged 20 individually, or aggregate everything into a single voice-sample summary?"* — that kind of question.
- Provenance + tracking handled by `SKILL.md`.

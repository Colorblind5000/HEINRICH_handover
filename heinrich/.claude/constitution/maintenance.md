# Maintenance

## Purpose

Maintenance keeps the knowledgebase navigable as it grows. The assistant has medium authority to refactor `agent_brain/` when doing so clearly improves navigation and preserves meaning.

## Allowed refactors

The assistant may rename, move, split, merge, and consolidate durable pages when:

- the new structure is clearer,
- the change preserves or improves navigability,
- and links can be repaired responsibly.

## Required behaviors

- Repair links when pages are renamed or moved.
- Update relevant index pages when durable pages are created or moved.
- Normalize new durable filenames to lowercase-hyphen.

## State promotion

- New pages usually start from `needs-review`.
- Promote to `stable` when the page becomes well-linked, consolidated, and trustworthy.
- Keep `canonical` rare.

## History and logging

- `artifacts/_changelog.md` is the chronological log of meaningful changes.
- Entry format: `## [YYYY-MM-DD] verb | Subject`
- Verbs: `ingest`, `create`, `update`, `restructure`, `lint`, `enrich`, `maintenance`, `task`, `hub`, `eval`
- Rely on git and page history for finer-grained history.

## Deletion rule

**Never `rm -rf`.** Move removed files to the OS trash so they're recoverable.

```bash
# macOS
mv <target> ~/.Trash/<descriptive-name>-$(date +%Y%m%d-%H%M%S)

# Linux
mv <target> ~/.local/share/Trash/files/<descriptive-name>-$(date +%Y%m%d-%H%M%S)
```

If a rough or older page has been fully absorbed into better pages and links repaired, the original can be trashed.

Don't keep dead stubs unless they help navigation.

## Periodic health checks

The active procedure is `/mothership-check`, backed by
`agent_brain/understanding/playbooks/mothership-check.md`. It starts read-only
and requires approval before any fix. Run it only when brugeren explicitly asks.

The shared playbook is the only checklist. Do not add health scores, require
exhaustive indexes, count links or `Related` sections, or treat age alone as a
defect. The check does not create knowledge pages, hubs, tasks or reports.

## Boundaries

- Don't treat archived artifacts as live docs needing cosmetic rewriting.
- Don't perform blind global rewrites when a targeted live-doc migration is better.
- Don't refactor `tasks/` into a second knowledgebase.

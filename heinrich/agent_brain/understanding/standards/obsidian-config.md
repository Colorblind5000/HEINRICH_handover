---
type: knowledge
summary: "Recommended Obsidian settings if you choose Obsidian as your editor — link format, hidden files, ignore filters."
state: stable
updated: 2026-06-02
tags: [standard, obsidian]
---

# Obsidian Config Standard

If you chose Obsidian at setup, these are the deliberate settings for this vault. Skip this file entirely if you're using a different editor — the brain works fine as plain markdown.

## Links (Settings → Files & Links)

| Setting | Value | Why |
|---|---|---|
| **Use Wikilinks** | ON | Better backlinks pane, graph view, search. The kit was written using `[[wikilinks]]`. |
| **Automatically update internal links** | ON | Renames don't break links. Critical for a long-lived brain. |
| **New link format** | Shortest path when possible | Cleaner wikilinks (`[[jane-doe]]` vs full path). |
| **Detect all file extensions** | ON | Required so Obsidian sees skill files, YAML, config files. |

**Note**: the general advice "use relative markdown links, not wikilinks" applies to **code repositories** (where docs need to render on GitHub). This vault is Obsidian-first — opposite tradeoff. Most agent CLIs handle both formats.

### Link health caveat (verified 2026-06-02)

"Automatically update internal links" rewrites links on rename — **but it does NOT reliably cover links inside YAML properties** (e.g. `related: "[[some-page]]"`) or links to headings/sections. So a property-link can silently break when its target is renamed. Practice: prefer text-slug values over wikilinks for machine-read fields (see [[task-project-structure]]), and audit property-links periodically. Obsidian core has no broken-link finder; the community plugin *"Find orphaned files and broken links"* (Vinzent03) fills that gap if needed.

Source: [Obsidian Help — Links](https://help.obsidian.md/links).

## Properties (Settings → Editor → "Properties in document")

Frontmatter renders as the formatted **Properties panel** only when this is set to **Visible** (default). Three modes:

| Mode | Effect |
|---|---|
| **Visible** | Properties panel at top of note (use this) |
| **Hidden** | Panel hidden in document; still editable via sidebar Properties view |
| **Source** | Shows **raw plain-text YAML** — *even when you are not in editor source mode* |

If frontmatter shows as a raw YAML code block outside source mode, the cause is almost always this set to **Source**. Other causes: malformed/invalid YAML, or frontmatter not placed at the very top of the file.

**Wikilinks inside properties must be quoted** — `related: "[[page]]"`, not `related: [[page]]` — or YAML misparses them. Obsidian's UI auto-adds the quotes; the risk is hand-edited YAML or templating plugins. This vault's bridge pages already quote them correctly.

Source: [Obsidian Help — Properties](https://help.obsidian.md/properties).

## Hidden files

- Install the **Show Hidden Files** community plugin (by polyipseity) and enable it. Without it, Obsidian hides `.claude/` and `.obsidian/` from the file tree.

## Excluded files (`.obsidian/app.json` → `userIgnoreFilters`)

The kit ships with these patterns excluded — keeps code-repo noise and OS metadata out of search:

```json
[
  "/node_modules/",
  "/\\.git/",
  "/dist/",
  "/build/",
  "/__pycache__/",
  "/\\.venv/",
  "/venv/",
  "/\\.next/",
  "/\\.DS_Store$/",
  "/Thumbs\\.db$/"
]
```

## Templates folder

- Location: `.claude/templates/`
- Obsidian's built-in Templates plugin: enabled. Point it at `.claude/templates/` if it asks.

## Optional: Obsidian CLI

The Obsidian CLI (community plugin + `npm install -g obsidian-cli` or equivalent) gives you `obsidian search`, `obsidian backlinks`, `obsidian links` from the terminal. The assistant uses these when available — see `.claude/constitution/retrieval.md`. If you don't install it, the assistant falls back to grep + Read.

## Related

- [[task-project-structure]] — applies these settings: relies on Bases + text-slug fields because property-links break on rename

---
type: knowledge
summary: "Kontrolleret vokabular for `type:`-frontmatter-feltet — to kontekster (hjerne-noter + projekt-docs). Vælg herfra; nye tilføjes bevidst, ikke ad hoc."
state: stable
updated: 2026-08-24
tags: [standard, brain-architecture, obsidian, single-source-of-truth]
---

# Doc-typer (`type:`-feltet — kontrolleret vokabular)

> Modstykke til [[tag-taxonomy]], men for `type:`-frontmatter-feltet. `Work/`
> er den samlede Obsidian-læseflade, så Bases kan vise både mothership- og
> satellitdata. To kontekster bevares stadig, fordi en projektcharter og en
> hjerneside har forskellige roller; fælles typer som `task` må bruges på
> tværs, når betydningen er identisk.

## Regel
1. **Vælg fra den rette kontekst nedenfor.** En doc's `type` afhænger af hvilken vault den bor i.
2. **Nye typer tilføjes kun bevidst** — føj til den rette kontekst her i samme commit som du bruger den. En type der ikke står her er enten en fejl eller en uregistreret udvidelse.
3. `reference` findes bevidst i begge kontekster (samme betydning: pointer/opslags-doc). Det er den eneste tilsigtede overlap.

## Kontekst A — hjerne-noter (`agent_brain/`)
Fra `obsidian-vault`-skillen (`.claude/skills/obsidian-vault/`):

| `type` | Hvad |
|---|---|
| `knowledge` | Viden/beslutning/pattern/standard/playbook |
| `task` | Uprojekteret eller tværgående opgave i `agent_brain/tasks/` |
| `index` | Oversigts-/indgangsside |
| `project` | Projekt-bridge-side |
| `person` | Person-side |
| `hub` | Topic-hub (hub-first-laget) |
| `pattern` | Tilbagevendende mønster (`understanding/patterns/`) |
| `experiment` | Eksperiment-log / prøve-spor |
| `mechanics` | Hvordan-noget-virker-note (fx build/preview-mekanik) |
| `manifest` | Manifest / oversigts-registry-fil |
| `shortlist` | Kurateret shortlist (fx kandidatliste) |
| `day` / `inbox` | Dagsside / idé-indbakke (system-flader) |

*(Kitregel: brug `type: feature` til projektnære funktioner.)*
## Kontekst B — projekt-docs (`Work/<slug>/`)
Build-sandhed lever med koden. Disse typer beskriver *projektets egne* docs (ikke hjerne-viden):

| `type` | Hvad | Eksempel |
|---|---|---|
| `charter` | Projektets ENE sandhedskilde for retning. **Én pr. projekt.** | `PROJECT.md` |
| `task` | Projektets konkrete eksekveringskort | `tasks/<slug>.md` |
| `rules` | Håndhævelig regel/spec-doc | `rules/design-system.md`, `rules/regel-hjerne.md` |
| `content` | Indhold/copy/brief-spec | `content/brief.md`, kampagne-spec |
| `reference` | Indgangspunkt / ordbog / pointer | `.claude/CLAUDE.md`, `CONTEXT.md` |

Projekt-docs bærer også `derives_from: PROJECT.md` + `synced:` (håndhæves af projektets `tools/truth-lint.mjs`). Charteret selv har hverken.

## Hvorfor ikke ét fladt enum
En *charter* er hverken `knowledge` eller `index`, og `rules/content` har ingen
hjerne-ækvivalent. To styrede kontekster bevarer pasformen. Identiske
tværgående typer som `task` er bevidste overlap og kan aggregeres fra Work-vaultet.

## Related
- [[tag-taxonomy]] — samme governance-mønster, for `tags:`
- `obsidian-vault`-skillen — hjerne-note-frontmatter (kontekst A)
- [[task-project-structure]] — projekt-slug + bridge-konvention

---
type: knowledge
summary: "Projektopgaver lever som task-kort i deres satellit, mens uprojekterede og tværgående opgaver lever centralt; ét vault-dækkende Base-view viser begge uden kopier."
state: canonical
updated: 2026-08-24
tags: [standard, brain-architecture, tasks, projekt, obsidian, bases]
---

# Task- og projektstruktur

## Beslutning

Én task er fortsat én Markdown-fil med `type: task`. Placeringen følger dens
kanoniske ejer:

| Scope | Kanonisk placering |
| --- | --- |
| Projektopgave | `Work/<workspace_path>/tasks/<task-slug>.md` |
| Uprojekteret eller tværgående opgave | `Work/heinrich/agent_brain/tasks/<task-slug>.md` |

Et projekts `workspace_path` opløses altid gennem dets bridge. Stien gættes
aldrig ud fra sluggen. Projektopgaver kopieres ikke til mothershipet.

`project: <projekt-slug>` bevares som stabil tekstmetadata på projektopgaver.
Sluggen er bridge-filens `project_id` og filnavn, ikke et wikilink.

## Hvorfor denne hybrid

Satellitten ejer projektets mål, beslutninger, arbejdsfiler og detaljerede
tasks. Mothershipet ejer tværgående overblik og uprojekterede handlinger.
Obsidian-vaultet har `Work/` som samlet læseflade, så `heinrich/opgaver.base`
kan vise alle task-kort ved at filtrere på `type == "task"` uden at kopiere
dem.

Mapper afgør ejerskab. Metadata leverer global filtrering, prioritering og
gruppering.

## Taskfrontmatter

Alle task-kort bruger samme schema uanset placering:

```yaml
---
type: task
title: "<handling>"
summary: "<handling>"
status: open
priority: p0 | p1 | p2 | p3
order: 1
due: YYYY-MM-DD
owner: brugeren
project: <projekt-slug>
category: feature | review | learning | admin | other
description: "<kort hvad og hvorfor>"
source: manual | heinrich | meeting | ingest
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [task, <kategori>]
---
```

`project` udelades for uprojekterede og tværgående tasks. `due` udelades
uden en eksplicit reel deadline.

## Skriveejerskab og dubletter

Projektets aktive skriver ejer konkrete task-filer i satellittens `tasks/`,
når de ligger inden for opgavens aftalte scope. Centrale, uprojekterede tasks
og tasks med `project: heinrich` kræver en eksplicit opgave fra brugeren.

`create-task` er eneste oprettelsesprocedure. Den scanner før skrivning både
den kanoniske målmappe og eventuelle legacy-kort med samme projektslug, så den
samme handling ikke forbliver aktiv to steder. `order` beregnes blandt alle
aktive task-kort med samme projekt eller i den uprojekterede gruppe.

## Global fokusinvariant

Højst ét task-kort på tværs af mothership og registrerede satellitter må have
`status: in_progress`. `heinrich/tools/collaboration-audit.mjs` kontrollerer
begge placeringstyper. Nye tasks starter altid som `open`.

## Views, ikke kopier

`heinrich/opgaver.base` er det globale view. Det filtrerer vault-dækkende på
`type == "task"` og læser task-kortene direkte fra deres kanoniske placering.

Et projektview kan filtrere samme data på `project == this.file.name` fra
bridgen. Et view er aldrig ejer og må ikke skrive en parallel taskliste.

## Projekt-lifecycle

Kun projekter med `lifecycle: active` må få nye projektopgaver eller beholde
`open` og `in_progress` som aktivt eksekveringslag. Før et projekt sættes
til standby, frozen eller archived, afklares åbne tasks, og den varige roadmap
og kontekst bevares i `PROJECT.md` eller andre projekt-ejede filer.

Ved genaktivering oprettes friske tasks fra satellittens aktuelle tilstand.
Gamle kort genoplives ikke automatisk.

## Afslutning

Der findes intet task-arkiv. Når en task afsluttes eller droppes, verificeres
først, at varige resultater og beslutninger er bevaret hos deres kanoniske
ejer. Derefter slettes task-filen. Git- og projekthistorik bærer historikken.

## Migration

Den tidligere flade model i `agent_brain/tasks/` er afløst. Et eksisterende
centralt projektkort flyttes kun efter preflight og dubletkontrol til den
satellit, bridgens `workspace_path` peger på. Uprojekterede og tværgående
kort bliver centrale.

## Relateret

- [[mothership-satellit-arkitektur]]
- [[project-bridge]]
- [[project-experiments]]
- `heinrich/opgaver.base`

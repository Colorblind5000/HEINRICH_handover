---
type: knowledge
summary: "Et projekt med en stabil kerne + mange disposable eksperimenter: kode i Work/<projekt>/experiments/<slug>/, ét let type:experiment-notat pr. eksperiment i projects/<projekt>/experiments/, auto-listet via Base på bridge. Let som default, graduerings-sti til fuldt projekt."
state: stable
updated: 2026-06-16
tags: [standard, brain-architecture, projekt, experiment, obsidian, bases]
---

# Project + Nested Experiments Standard

Hvordan et **hovedprojekt med en stabil kerne + mange side-eksperimenter** struktureres. Forlænger [[task-project-structure]] til scenariet hvor ét projekt rummer flere disposable eksperimenter (jf. mønstret: frossen kerne, disposable eksperimenter). Besluttet 2026-06-16.

## Princippet: let som default, graduér ved behov

Et eksperiment er **ikke et projekt** — det er en *node under* et projekt. Det får IKKE eget `Work/<slug>/`, egen `.claude/CLAUDE.md` eller fuld bridge. Det ville være orphan-cruft når eksperimenter dør. Default er let; kun hvis et eksperiment vokser til et reelt produkt, **graduerer** det til et fuldt projekt.

## Kode-placering

```
Work/<projekt>/
├── <kerne-filer>            # den stabile/frosne kerne (rør den ikke fra eksperimenter)
└── experiments/
    └── <exp-slug>/          # selvstændigt eksperiment, deler kun det kernen eksponerer
        └── …
```

Eksperimenter rører aldrig kernen direkte; de genbruger kun det kernen eksponerer (fx export-encoderne). Når to+ eksperimenter deler kode, faktoriseres den delte del ud i kernen — ikke kopieres på kryds.

## Brain-noden: ét `type: experiment`-notat pr. eksperiment

```
projects/<projekt>/
├── <projekt>.md            # hovedbridge (uændret)
├── vision.md / scope.md …
└── experiments/
    └── <exp-slug>.md       # det lette eksperiment-notat
```

Frontmatter:
```yaml
---
type: experiment
project: <projekt-slug>      # tekst-slug = forælder-bridgens filnavn (samme regel som task.project)
status: alive                # alive | shipped | dead
created: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
code: Work/<projekt>/experiments/<exp-slug>/
tags: [experiment, <projekt-slug>]
---
```

Body = **Identify → Simplify → Amplify**-recorden:
- **Identify:** idé + forventet output (skarpt).
- **Simplify:** v0 need-to-have scope; hvad beviser at det virker/er brugbart.
- **Amplify:** hvordan det kan/ikke kan kombineres med kernen; hvad der ville graduere det.

Design-recorden bor HER (ikke i en task) — eksperiment-notatet er enheden. Trackbare byggetrin er evt. almindelige tasks med `project: <projekt>`.

## Deep-linking (begge veje)

- **Eksperiment-notat →** `[[<projekt>]]` (forælder) + `code:`-sti + relevante kerne-docs (`[[vision]]` osv.).
- **Hovedbridge →** en **"Eksperimenter"-Base** der auto-lister projektets eksperimenter:

````markdown
```base
filters:
  and:
    - type == "experiment"
    - project == this.file.name
views:
  - type: table
    name: Eksperimenter
    order:
      - status
      - file.name
      - updated
```
````

- **Koden →** `index.html` (e.l.) får en header-kommentar med sti til brain-notatet (provenance, jf. [[provenance]]).

## Livscyklus

`status` styrer det: `alive` (i gang), `shipped` (har produceret artefakt/post), `dead` (droppet — markeres, slettes ikke stiltiende). Et dødt eksperiment-notat er billigt og bevarer læringen.

## Graduerings-sti

Vokser et eksperiment til et selvstændigt produkt: kør `create-project` → eget `Work/<ny-slug>/` + fuld bridge, sæt eksperiment-notatets `status` og efterlad en pegepind til det nye projekt. `create-project` er kun til graduering/standalone — ikke til at oprette eksperimenter.

## Related

- [[task-project-structure]] — den grundlæggende task/projekt-struktur dette forlænger
- [[topic-hubs]] / [[lateral-linking]] — linking-disciplinen eksperiment-noter følger
- [[provenance]] — kode↔brain-pegepinde

---
type: knowledge
summary: "Fælles procedure for at oprette en fleksibel projektsatellit under Work med charter, runtime-pointers, fysiske placeholdermapper, bridge og første task."
state: stable
updated: 2026-08-24
tags: [playbook, heinrich, projekt, lifecycle]
---

# Create-project

## Formål

Opret ét registreret HEINRICH-projekt med et lille, genkendeligt fundament.
Kernen fastlægger ejerskab og genfinding, ikke projektets faglige struktur.

Proceduren er fælles. Adapteren opløser Work-roden, bruger harnessets
spørge- og skriveværktøjer og kalder dets `create-task`-adapter.

## Input

Kræv kun:

- projektnavn og bekræftet lowercase slug;
- kort opgave eller problem;
- grundlæggende mål;
- mindst ét observerbart succeskriterium;
- første konkrete handling.

Resten må stå som afventende beslutninger i `PROJECT.md`. Spørg kun om valg,
der ændrer struktur eller ejerskab. Et selvstændigt Git-repo er et eksplicit
valg; standarden er at blive i Work-repoet.

## Fase 1: Read-only preflight

Kontrollér før enhver write:

1. `Work/<slug>/` findes ikke;
2. bridge-mappe, bridge-fil og `project_id` findes ikke i aktive eller
   arkiverede projekter;
3. ingen eksisterende bridge beskriver semantisk samme projekt;
4. alle planlagte målfiler er clean eller endnu ikke findes;
5. slug og `workspace_path` er relative og indeholder hverken absolut rod,
   `..` eller skjult stiomdirigering.

Enhver identitetskollision stopper flowet. V1 genoptager eller fletter ikke et
eksisterende projekt automatisk.

## Fase 2: Opret satellittens minimumskerne

Opret disse filer og mapper:

```text
Work/<slug>/
├── PROJECT.md
├── AGENTS.md
├── assets/
│   └── PLACEHOLDER.md
├── .agents/
│   └── skills/
│       └── PLACEHOLDER.md
└── .claude/
    ├── CLAUDE.md
    └── skills/
        └── PLACEHOLDER.md
```

`PROJECT.md` er projektets charter og stærkeste ejer. Det indeholder:

- opgave eller problem;
- mål og succeskriterier;
- scope og fravalg;
- nuværende fase;
- afventende beslutninger;
- en struktursektion med kanoniske stier til tasks, assets, skills, optional
  `CONTEXT.md` og `docs/adr/`.

Det indeholder ikke en parallel næste-handling. Task-kortet ejer handlingen.

`AGENTS.md` og `.claude/CLAUDE.md` er tynde pointers til `PROJECT.md`, optional
`CONTEXT.md`, optional ADR'er, `tasks/` og bridgen. De kopierer ingen fælles
regler.

Hver `PLACEHOLDER.md` siger tydeligt, at filen kun bevarer og forklarer den
endnu tomme standardmappe. Når første reelle asset eller skill tilføjes,
fjernes den relevante placeholder. Den må aldrig indeholde projektspecifikke
regler.

`CONTEXT.md`, `docs/adr/` og projekttypespecifikke mapper oprettes først ved
reelt behov.

## Fase 3: Opret og validér bridgen

Opret `heinrich/agent_brain/projects/<slug>/<slug>.md` efter
bridge-standarden med mindst:

```yaml
type: project
project_id: <slug>
summary: "<kort formål>"
state: stable
lifecycle: active
workspace_path: <slug eller relativ nested sti>
repository:
updated: YYYY-MM-DD
tags: [projekt]
```

Bridgen er et kort. Den peger på `PROJECT.md` og gentager kun kort mål, status
og senere `next_action` som cache. Ved konflikt vinder satellitten.

Skriv bridgen efter satellitkernen. Før bridgen findes, er en delvis oprettet
satellit inert og synlig i filsystemet; en bridge må aldrig pege på en
manglende satellit.

Valider frontmatter og at `heinrich/projects.base` kan vælge bridgen via
`type: project` og `lifecycle: active`. Kald først Obsidian-synlighed
verificeret efter kontrol gennem den faktiske Work-vault-brugersti.

## Fase 4: Opret første task gennem create-task

Når bridgen er valideret, kald harnessets fælles `create-task`-adapter med den
første konkrete handling og projektets slug. `create-project` må aldrig
handskrive taskfrontmatter.

Tasken skal lande i `Work/<workspace_path>/tasks/`. Opdatér derefter bridgens
`next_action` med taskens titel som en cache og genlæs bridgen.

Fejler taskoprettelsen, bevar den validerede satellit og bridge, rapportér
projektet som ufuldstændigt og fortsæt senere fra tasktrinnet. Rul ikke delte
patches eller en valideret bridge tilbage skjult.

## Fase 5: Sporing og rapport

Tilføj én kontekstfølsom changelog-entry efter genlæsning. Rapportér:

- oprettede stier;
- bridge og `workspace_path`;
- første task og `next_action`;
- Git-valget;
- optional moduler, der bevidst ikke blev oprettet;
- enhver ufuldstændig fase.

## Sikkerhedsgrænser

- Opret aldrig projektet som sideeffekt af en almindelig task.
- Overskriv, flet eller genbrug aldrig en kolliderende identitet i v1.
- Ingen backup, commit, push, deploy eller eksterne handlinger.
- Et nyt Git-repo initialiseres kun efter brugerens eksplicitte valg.
- Templates og placeholders indeholder ingen private eller projektspecifikke
  fakta.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

---
type: charter
project_id: demo-projekt
summary: "Opdigtet eksempel: en lille intern side der samler et teams mødereferater ét sted."
state: stable
updated: 2026-01-15
---

# Demo-projekt

> Eksempel. Ikke et aktivt projekt. Se [README](README.md).

## Opgave

Referater fra teamets ugentlige møder ligger spredt i tre forskellige værktøjer.
Ingen kan finde en beslutning to uger efter den blev truffet.

## Mål

Ét sted hvor et referat kan lægges og en beslutning kan genfindes på under et
minut.

## Succeskriterier

- Et referat kan tilføjes uden at åbne mere end én fil.
- En vilkårlig beslutning fra de seneste seks måneder kan findes ved søgning på
  ét stikord.
- Ingen deltager skal oprette en konto for at læse.

## Scope

**Med:** referater, beslutninger og de personer der deltog.

**Ikke med:** opgavestyring, kalender og alt der kræver login. Dem har teamet
allerede værktøjer til, og dubletter bliver forkerte.

## Nuværende fase

Struktur besluttet, indhold ikke migreret. Første tre referater lægges ind som
prøve, før resten flyttes.

## Afventer beslutning

- Skal ældre referater migreres, eller starter vi forfra fra en given dato?

## Struktur

- Tasks: `tasks/`
- Assets: `assets/`

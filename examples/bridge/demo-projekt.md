---
type: project
project_id: demo-projekt
summary: "Opdigtet eksempel: intern side der samler teamets mødereferater ét sted."
state: stable
lifecycle: active
workspace_path: demo-projekt
updated: 2026-01-15
next_action: "Læg de første tre referater ind som prøve."
tags: [projekt, eksempel]
---

# Demo-projekt

> **Eksempel-bridge.** Ligger bevidst under `examples/` og ikke i
> `agent_brain/projects/`. Lå den i hjernen, ville den tælle som et aktivt
> projekt i dit overblik og dukke op i `projects.base`.

## Hvad projektet er

Referater fra et ugentligt teammøde samles ét sted, så beslutninger kan
genfindes senere. Se satellittens charter for detaljerne.

## Status

Struktur besluttet. Migrering ikke påbegyndt.

## Næste handling

Læg de første tre referater ind som prøve.

## Grænse

Bridgen er **tynd med vilje**. Den siger hvor projektet ligger, hvad det
handler om, hvilken fase det er i, og præcis én næste handling.

Detaljer — opgaver, beslutningshistorik, assets — ejes af satellitten på
`workspace_path`. Kopieres de herind, har du to steder der siger det samme, og
det ene bliver forkert i morgen.

---
type: decision
summary: "HEINRICH organiseres som et LLM-agnostisk Obsidian-mothership med tynde projekt-bridges og selvstændige satellitter."
state: canonical
updated: 2026-08-22
tags: [heinrich, arkitektur, mothership, projektstruktur]
---

# Mothership/satellit-arkitektur

## Beslutning

HEINRICH bruger ét **Obsidian-mothership** som kontrolrum og én selvstændig
**satellit** pr. projekt.

Mothership ejer:

- tværgående viden om brugeren, personer, arbejdsprincipper og referencer;
- et projektregister med én tynd bridge-side pr. projekt;
- fælles, vendor-neutrale kontrakter og stabile arbejdsgange;
- overblik over hvilke projekter der er aktive, standby, frosne eller arkiverede.

Satellitten ejer:

- projektets mål, status, kontekst, beslutninger og detaljerede tasks;
- kode, dokumenter, research, assets og andre arbejdsfiler;
- projektspecifikke instruktioner og eventuelle projektskills.

## Livscyklus

Projektets livscyklus ligger i bridge-feltet `lifecycle`:

- `active` — del af det løbende overblik;
- `standby` — ikke løbende kontekst, men klar til at blive trukket frem;
- `frozen` — bevaret, men må ikke fortsættes uden en ny beslutning;
- `archived` — afsluttet eller erstattet; læses kun bevidst.

Aktivering ændrer metadata. Projektmapper flyttes ikke.

Et projekt med `lifecycle: standby`, `frozen` eller `archived` må ikke beholde
`open` eller `in_progress` tasks i mothershipets centrale task-mappe. Før
deaktivering kontrolleres det, at relevant roadmap, beslutninger og teknik kan
findes i satellitten. Ved genaktivering oprettes nye tasks ud fra satellittens
aktuelle tilstand.

`state` er fortsat dokumentets tillidsniveau og må ikke bruges til
projektlivscyklus. Legacy-feltet `status` migreres gradvist; `lifecycle` vinder,
når begge findes.

## LLM-agnostisk grænse

Kanonisk viden skrives i almindelig Markdown og YAML. Produktets chat-memory er
aldrig sandhedskilden.

Den fælles kerne beskriver mål, regler, input, output og acceptkriterier.
Harness-specifik adfærd ligger i tynde adapters som `AGENTS.md`, `CLAUDE.md`,
lokale skill-installationer, hooks og permissions.

Load-bearing regler, som skal være semantisk ens på tværs af harnesses, ejes af
`understanding/standards/assistant-core-contract.md`. De står fortsat ordret i
root-`AGENTS.md` og root-`CLAUDE.md`, så de auto-loades sikkert. Runtime-kopierne
er markeret med `derives_from` og `synced`; kontrakten vinder ved konflikt.
`heinrich/tools/adapter-parity.mjs` kontrollerer dem read-only efter ændringer
og via en versionerbar repo-local pre-commit-hook. Kontrollen genererer eller
retter intet.

En fælles filstruktur er ikke bevis for ens adfærd. Kritiske workflows skal
testes særskilt i de harnesses, der reelt bruges.

## Skriveejerskab

En aktiv projektopgave må skrive i sin aftalte satellit, sine konkrete
mål-filer og projektindholdet i bridgen. Bridge-ændringer i `lifecycle`, fælles
schema eller querymønstre er derimod mothership-ændringer og kræver en eksplicit
opgave fra brugeren.

Parallel skrivning er tilladt i adskilte projekter og filer. Ved overlap har én
model skriveejerskab, mens andre er read-only reviewers, indtil ejerskabet er
overdraget eksplicit. Git og worktrees begrænser skade, men afgør ikke
ejerskab. Den fulde auto-loadede regel ejes af
`understanding/standards/assistant-core-contract.md`.

## Obsidian

Obsidian er mothershipets brugerflade. Bases må filtrere og vise Markdown-data,
men må ikke blive en separat database.

Mothership viser højst én næste handling pr. projekt. Detaljerede tasks bliver i
satellitten, så mothership ikke udvikler sig til et nyt eksempel-projekt.

## Git

Et selvstændigt Git-repo er et projektvalg, ikke et arkitekturkrav. Brug det når
projektet har selvstændig kode, historik, deling eller deployment. Små research-
og dokumentprojekter kan forblive mapper.

## Bevidste fravalg i første version

- Ingen eksempel-projekt-app.
- Ingen fysisk flytning ved aktivering.
- Ingen automatisk adaptergenerator.
- Ingen central kopi af alle projekttasks.
- Ingen masseklassifikation baseret på gamle `status`-felter.
- Ingen krav om eget Git-repo til alle satellitter.

## Pilotgate

Arkitekturen skaleres først efter en manuel pilot kan:

1. åbne et aktivt projekt uden gammel samtalehistorik;
2. finde en reference i et standby eller arkiveret projekt;
3. vise én entydig ejer for ny viden;
4. bruges af både Codex og Claude uden modstridende writes;
5. aktivere eller deaktivere et projekt uden at flytte filer.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

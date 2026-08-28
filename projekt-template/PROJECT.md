---
type: charter
project_id: <slug>
summary: "<kort opgave og formål>"
state: stable
updated: YYYY-MM-DD
---

# <projektnavn>

## Opgave

<Hvilket konkret problem eller arbejde ejer projektet?>

## Mål

<Hvad skal være anderledes, når projektet lykkes?>

## Succeskriterier

- <observerbart resultat>

## Scope

**Med:** <det projektet omfatter>

**Ikke med:** <bevidste fravalg>

## Nuværende fase

<kort fasebeskrivelse>

## Afventer beslutning

- <kun reelle åbne valg; fjern sektionen når ingen findes>

## Struktur

- Tasks: `tasks/`
- Assets: `assets/`
- Codex-skills: `.agents/skills/`
- Claude-skills: `.claude/skills/`
- Domæneordbog ved behov: `CONTEXT.md`
- Varige tradeoff-beslutninger ved behov: `docs/adr/`
- Bridge: `heinrich/agent_brain/projects/<slug>/<slug>.md`

Den konkrete næste handling ejes af et task-kort. Den gentages ikke her.

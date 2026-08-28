# HEINRICH — Codex entrypoint

Root-reglerne i `../AGENTS.md` gælder altid.

## Fælles mothership-kontrakt

Dette er Codex-adapteren. Kanonisk viden og projektstatus er
harness-uafhængig.

Ved orientering i mothership, læs:

1. `mothership.md` — Obsidian-front door og projektoversigt.
2. `agent_brain/understanding/decisions/mothership-satellit-arkitektur.md` —
   godkendt ejerskab og grænser.
3. `agent_brain/understanding/standards/project-bridge.md` — bridge-kontrakten.

Kun `lifecycle: active` hører til det løbende projektoverblik. `standby`,
`frozen` og `archived` hentes frem ved eksplicit relevans. `state` beskriver
dokumentets tillidsniveau, ikke projektets livscyklus.

Ved arbejde i HEINRICH:

1. Læs `.Codex/constitution/identity.md`, `guide.md` og `config.yaml`.
2. Brug `.Codex/constitution/` som Codex-adfærdslag.
3. Brug `agent_brain/` som kanonisk, varig viden.
4. Brug `artifacts/` til punktnedslag og handovers; `raw/` er inbox.

## Cutover-grænse

- `.Codex/` er Codex' harness-lag; `.claude/` er Claudes harness-lag.
- Codex behandler `.claude/` som read-only, medmindre brugeren eksplicit godkender
  en adapterændring.
- Nye Codex-skills ligger i `../.agents/skills/`.
- Skriv ikke til Claude-memory under `C:<hjemmemappe>/.claude/`.
- Ingen deploy, push eller connector-write som sideeffekt af migrationen.

## Konflikter

Hvis `agent_brain/` og aktuelle projektfiler er uenige, vis konflikten for brugeren
før du ændrer den kanoniske viden.

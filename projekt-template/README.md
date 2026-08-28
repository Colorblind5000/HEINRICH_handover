# Projekt-template

Standardreference for nye HEINRICH-projekter under `Work/<slug>/`.

Brug `create-project` til faktisk oprettelse. Skillen tilpasser værdierne,
opretter bridgen og opretter første task gennem `create-task`.

## Fast kerne

- `PROJECT.md` — projektets charter og kanoniske retning.
- `AGENTS.md` — tynd Codex-pointer.
- `.claude/CLAUDE.md` — tynd Claude-pointer.
- `tasks/` — task-kort ejet af projektet.
- `assets/PLACEHOLDER.md` — fysisk assetmappe fra dag ét.
- `.agents/skills/PLACEHOLDER.md` — fysisk Codex-skillmappe fra dag ét.
- `.claude/skills/PLACEHOLDER.md` — fysisk Claude-skillmappe fra dag ét.
- Tynd bridge i `heinrich/agent_brain/projects/<slug>/<slug>.md`.

## Oprettes ved behov

- `CONTEXT.md` ved første afklarede domæneterm.
- `docs/adr/` ved første varige tradeoff over ADR-tærsklen.
- Kode-, research-, upload- og dokumentmapper efter projekttype.

Placeholderfilerne bevarer og forklarer tomme standardmapper. Den relevante
placeholder slettes, når første reelle asset eller skill tilføjes.

## Ejerskab

Projektets detaljerede tasks lever under projektets `tasks/`.
`heinrich/opgaver.base` viser dem centralt som et vault-dækkende view uden at
kopiere dem. Bridgen cacher højst én næste handling; task-kortet er ejer.

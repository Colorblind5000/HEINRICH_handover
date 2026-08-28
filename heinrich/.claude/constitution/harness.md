# Harness — Claude Code

Harness-specifikke regler for HEINRICH i Claude Code. Den øvrige constitution
er fælles og må ikke duplikeres her.

## Entrypoints

- Root-`CLAUDE.md` er indgangen for hele repoet.
- `heinrich/CLAUDE.md` supplerer, når mothershipet er arbejdsområde.
- Et projekts egen `CLAUDE.md` kan tilføje lokale regler inden for projektets
  scope, men ændrer ikke den fælles skrive- og sikkerhedskontrakt.

## Skills

De 11 systemskills ligger i `.claude/skills/<name>/SKILL.md`:

- `close-handover`
- `collaboration-check`
- `create-project`
- `create-task`
- `delete-project`
- `eval`
- `handover`
- `ingest`
- `learn`
- `mothership-check`
- `resume-handover`

Claude Code eksponerer dem som slash commands. Den fælles adfærd ejes af de
tilsvarende playbooks under
`heinrich/agent_brain/understanding/playbooks/`; skillfilerne er tynde
harness-adaptere.

## Hooks

`.claude/settings.json` launcher tre centrale Node-implementationer:

| Event | Implementering | Adfærd |
| --- | --- | --- |
| `PreToolUse` | `heinrich/tools/hooks/protect-paths.mjs` | spærrer skrivning til beskyttede filer |
| `PreCompact` | `heinrich/tools/hooks/pre-compact.mjs` | minder om learn/handover før afkortning |
| `UserPromptSubmit` | `heinrich/tools/hooks/daily-focus.mjs` | viser dagens fokus, når dagsfilen findes |

Hooklogikken ejes kun af Node-filerne. `settings.json` må ikke få sin egen kopi
af adfærden. Den fulde kontrakt står i
`heinrich/agent_brain/understanding/standards/hooks.md`.

## Beskyttede filer

`heinrich/config/protected-paths.json` er den kanoniske liste og indeholder 35
Tier 1-poster. `heinrich/agent_brain/_protected.md` er kun den menneskelige
visning.

En beskyttet skrivning kræver eksplicit godkendelse og en matchende linje i
`.protected-override`. Linjen forbruges ved første tilladte skrivning. Læsning
er altid tilladt.

## Eksterne forbindelser

Skills må kun bruge kalender, mail eller andre eksterne tjenester, når den
relevante forbindelse er tilgængelig og handlingen ligger inden for brugerens
konkrete anmodning. Ellers bruges lokal brain-kontekst, og den manglende
datakilde rapporteres.

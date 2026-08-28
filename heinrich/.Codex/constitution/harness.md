# Harness — Codex

Harness-specifikke regler for HEINRICH i Codex. Den øvrige constitution er
fælles og må ikke duplikeres her.

## Entrypoints

- Root-`AGENTS.md` er indgangen for hele repoet.
- `heinrich/AGENTS.md` supplerer, når mothershipet er arbejdsområde.
- Et projekts eget `AGENTS.md` kan tilføje lokale regler inden for projektets
  scope, men ændrer ikke den fælles skrive- og sikkerhedskontrakt.
- Instruktioner genindlæses i en ny task efter ændringer i en adapterfil.

## Skills

De 12 systemskills ligger i `.agents/skills/<name>/SKILL.md`:

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
- `onboard`
- `resume-handover`

De kan aktiveres implicit via deres beskrivelser eller eksplicit som
`$<name>`. Den fælles adfærd ejes af de tilsvarende playbooks under
`heinrich/agent_brain/understanding/playbooks/`; skillfilerne er tynde
harness-adaptere.

## Hooks

`.codex/hooks.json` launcher tre centrale Node-implementationer:

| Event | Implementering | Adfærd |
| --- | --- | --- |
| `PreToolUse` | `heinrich/tools/hooks/protect-paths.mjs` | spærrer `apply_patch` mod beskyttede filer |
| `PreCompact` | `heinrich/tools/hooks/pre-compact.mjs` | minder om learn/handover før afkortning |
| `UserPromptSubmit` | `heinrich/tools/hooks/daily-focus.mjs` | viser dagens fokus, når dagsfilen findes |

Launcherne finder repo-roden fra både rod og undermapper og bevarer
Node-processens exitkode. Hooklogikken ejes kun af Node-filerne. Den fulde
kontrakt står i `heinrich/agent_brain/understanding/standards/hooks.md`.

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

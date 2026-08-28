---
type: knowledge
summary: "Fælles placering, ejerskab, authoring og validering af HEINRICH-skills på tværs af Codex og Claude."
state: stable
updated: 2026-08-23
tags: [standard, skills]
---

# Skill Authoring and Placement Standard

Fælles regler for placering og ejerskab af HEINRICH-skills samt Codex-formatet
for skills i `.agents/skills/`.

> Source: [OpenAI Docs — Build skills](https://learn.chatgpt.com/docs/build-skills), reviewed 2026-08-18.

## File layout

Skills must be **folder-based**, not flat:

```
.agents/skills/
├── learn/
│   └── SKILL.md          ✅ correct
├── learn.md               ❌ Codex will not discover this as a skill
```

- Folder name identifies the skill: `.agents/skills/foo/` → `$foo`.
- Required file inside the folder: `SKILL.md` (uppercase).
- Optional supporting folders include `scripts/`, `references/`, `assets/`, and
  `agents/openai.yaml`.

## Frontmatter

```yaml
---
name: foo
description: Use when [trigger]. [What it does and the important boundary.]
---
```

- `name` and `description` are required.
- `description` is the routing contract Codex uses for implicit selection. Make
  triggers and non-goals discriminating, not generic.
- Name: lowercase, numbers, hyphens only. Max 64 chars.

### YAML safety in `description`

If the `description` contains YAML-special characters, wrap it in double quotes. Unquoted `#` starts a YAML comment and silently truncates the description.

```yaml
# broken — description truncated at "team's"
description: Draft daily update for the team's #updates Slack channel.

# correct
description: "Draft daily update for the team's #updates Slack channel."
```

Also quote when the description contains `:`, leading `-`, or line breaks.

### Naming and scope

- Prefer an action-oriented, specific name such as `resume-handover`.
- Keep HEINRICH-dependent skills local to this repository.
- Do not encode a specific user account or secret in a reusable skill.
- Avoid a new skill when a bounded change to an existing skill is the clearer
  contract.

## Discovery and invocation

Codex can invoke a skill explicitly with `$foo` or implicitly when a prompt
matches its description. Local changes are normally detected automatically; if
a valid skill is missing, restart Codex before diagnosing deeper.

## When a new skill doesn't appear

Check in this order:
1. Folder structure: is it `.agents/skills/foo/SKILL.md`?
2. Frontmatter: does it have `name:` and `description:`?
3. `description` YAML-safe? (Quote it if it contains `#`, `:`, leading `-`.)
4. Name convention: lowercase-hyphen only?
5. Restart Codex if the local change is not yet visible.

## Fælles placeringsmodel

Placering følger scope og afhængigheder, ikke den mappe en skill historisk blev
oprettet i. Der findes tre scopes.

### 1. Personligt global

Skillen skal bevidst kunne bruges på tværs af uafhængige workspaces, og dens
afhængigheder må ikke binde den til HEINRICH, Work eller ét konkret projekt.

- Codex: personlig Codex-skillinfrastruktur uden for `Work/`.
- Claude: `~/.claude/skills/<name>/SKILL.md`.
- Personlige skills er eksterne dependencies og tæller ikke i HEINRICHs aktive
  katalog.

Global placering beviser ikke portabilitet. Hardcodede projektstier,
projektspecifikke domæneord eller projektbundne services gør skillen
projektlokal, selv hvis den i dag ligger på brugerniveau.

### 2. Work-bredt HEINRICH-workflow

Skillen skal kunne bruges fra flere projekter under Work og afhænger af
HEINRICH, Work-kontrakten eller mothershipet.

- Codex-adapter: `Work/.agents/skills/<name>/SKILL.md`.
- Claude-adapter: `Work/.claude/skills/<name>/SKILL.md`.

Work-brede Claude-skills må ikke placeres i `heinrich/.claude/skills/`, fordi
den discoveryrod kun er aktiv fra `Work/heinrich/`, ikke fra Work-roden eller
andre projekter.

### 3. Projektlokalt

Skillen har projektspecifikke triggers, stier, domæneord, outputs eller
afhængigheder.

- Codex-adapter: `<project>/.agents/skills/<name>/SKILL.md`.
- Claude-adapter: `<project>/.claude/skills/<name>/SKILL.md`.

Projektskills må ikke eksponeres globalt blot for at gøre dem synlige. Tomme
skillmapper eller obligatoriske adapters tilføjes ikke til alle projekter.

### Tilstande er ikke scopes

`active`, `disabled`, `archived` og `exact-copy` beskriver tilstand, ikke
placering. Kun `active` tæller i det aktive inventory.

## Adapter versus neutral workflowkilde

Normalformen er én adapter i det harness, der faktisk bruger skillen.

En neutral workflowkilde i
`heinrich/agent_brain/understanding/playbooks/<name>.md` oprettes kun, når Codex
og Claude beviseligt skal udføre samme stabile workflow. Den neutrale kilde er
undtagelsen, ikke en obligatorisk tredje fil.

På samme måde oprettes et projekts `docs/workflows/` først, når et konkret
projekt faktisk har væsentlig delt workflowadfærd i begge harnesses. Mappen er
ikke del af standardprojektets minimum.

En tynd adapter ejer kun:

- trigger og discoverymetadata;
- harness-specifikke værktøjsnavne og invocation;
- nødvendige runtimegrænser;
- direkte routing til den neutrale ejer.

Adapteren må ikke kopiere hele den neutrale workflowtekst. Tyndhed måles på
ansvar, ikke et vilkårligt linjetal.

## Kopi versus variant

- Samme skillnavn og identisk indholdshash klassificeres som `exact-copy`.
- Samme navn og forskellig hash er uafgjort: det kan være en legitim adapter,
  et projektdelta, dokumentationsdrift eller en navnekollision.
- Hash klassificerer kopier; scope og afhængigheder vælger den kanoniske
  placering.
- Ingen kopi slettes, før korrekt scope, dependencies og discoveryrod er
  verificeret.

## Verificeret inventory og katalog

Det synlige Obsidian-overblik bor i `heinrich/docs/04-skills-catalog.md`. Det er
en afledt visning og må aldrig eje workflowteksten.

Generér eller opdatér inventorysektionen med:

```powershell
node heinrich/tools/skill-inventory.mjs --catalog heinrich/docs/04-skills-catalog.md
```

Kontrollér drift uden at skrive:

```powershell
node heinrich/tools/skill-inventory.mjs --check-catalog heinrich/docs/04-skills-catalog.md
```

Scanneren læser dot-mapper og ignorerede skillfiler direkte fra filsystemet,
udelader Git, worktrees, caches og dependencies, klassificerer aktive,
disabled, arkiverede og eksakte kopier separat og fejler, hvis en forventet
Work-skillrod ikke kan læses. Dens fixturetest er:

```powershell
node heinrich/tools/skill-inventory.test.mjs
```

En almindelig `rg --files`-søgning er ikke gyldigt inventorybevis, fordi dens
standardfiltre kan skjule dot-mapper og ignorerede filer.

## Bundled og plugin-skills

Bundled system- og plugin-skills vedligeholdes af Codex eller det installerede
plugin og kopieres ikke ind i HEINRICH.

`heinrich/.claude/skills/` er migrationskilde, ikke standarddestination. Dens
skills må kun flyttes efter scopeklassifikation og må ikke annonceres som
Work-brede, blot fordi filerne findes.

## Validation and testing

Use `$skill-creator` for skill work. After editing:

1. Run the available skill validator against the skill folder.
2. Test realistic prompts that should trigger the skill.
3. Test near-miss prompts that should not trigger it.
4. For skills that write, simulate dangerous or ambiguous inputs without
   touching production data.
5. Check work/private boundaries, conflict behavior, idempotency, and the final
   report.

A structurally valid SKILL.md is necessary but not sufficient. Forward tests
must verify that another agent can follow the contract without relying on
unstated conversation context.

## Related
- [[understanding/standards/topic-hubs]] — hub-standarden skills skal respektere ved brain-opdateringer
- [[understanding/standards/lateral-linking]] — linking-standard der gælder når skills skriver nye sider
- [[understanding/standards/obsidian-config]] — vault-config som skills ikke må rode med

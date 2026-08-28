---
type: guide
summary: "Arkitekturen bag HEINRICH: mothership, satellitter og den harness-neutrale hjerne."
state: canonical
tags: [heinrich, docs, arkitektur]
---

# Sådan hænger det sammen

## Grundidéen

Én varig hjerne. Flere harness. Assistenten skal ikke glemme noget, fordi du
skiftede værktøj.

```text
repo-rod/
├── CLAUDE.md            Claude Codes entrypoint
├── AGENTS.md            Codex' entrypoint      ← samme fire regelblokke
├── .claude/skills/      11 systemskills, Claude-side
├── .agents/skills/      11 fælles + Codex' systemskills
├── heinrich/            mothershipet
│   ├── agent_brain/     den varige, harness-neutrale hjerne
│   ├── .claude/         Claude-harnessets constitution
│   ├── .Codex/          Codex' constitution
│   ├── tools/           kontroller der håndhæver kontrakterne
│   └── docs/            denne dokumentation
├── projekt-template/    skelettet for et nyt projekt
└── _collaboration/      rum til modspil mellem to assistenter
```

## Mothership og satellitter

Mothershipet er `heinrich/`. Det ejer **ikke** dine projekter — det ejer en tynd
*bridge* pr. projekt: hvor projektet ligger, hvad det handler om, hvilken fase
det er i, og præcis én næste handling.

Selve projektet er en **satellit** med sine egne filer, sit eget charter og sine
egne opgaver.

Delingen findes, fordi det ellers ender ét af to steder: enten en mothership der
langsomt bliver en dårlig kopi af alle projekter, eller projekter der ikke kan
findes fra noget centralt overblik.

Regel: **dupliker aldrig, flyt i stedet.** Har to steder samme oplysning, er ét
af dem forkert i morgen.

## Hjernen

`heinrich/agent_brain/` er harness-neutral. Ingen fil her ved, om den bliver
læst af Claude eller Codex.

| Mappe | Indhold |
| --- | --- |
| `about_user/` | Hvem du er. Udfyldes af onboarding |
| `people/` | Personer du arbejder med |
| `projects/` | Én bridge pr. projekt |
| `tasks/` | Opgavekort uden entydigt projektejerskab |
| `understanding/` | Varig indsigt: standarder, playbooks, mønstre, beslutninger |
| `references/` | Emne-hubs der navigerer, ikke ejer |
| `raw/` | Materiale der endnu ikke er fordøjet |

`understanding/` er den vigtigste. Den rummer **standarder** (sådan gør vi),
**playbooks** (sådan udføres denne opgave), **mønstre** (det her har vi lært),
**beslutninger** (det her valgte vi, og hvorfor) og **unknowns** (det ved vi
ikke endnu).

Kun `standards/` og `playbooks/` følger med udfyldt — det er kittets egen logik
og grundlaget for de 11 systemskills. `patterns/`, `decisions/` og `unknowns/`
er tomme, fordi de rummer det *du* lærer. De fyldes gennem `/learn`.

## De to harness

`CLAUDE.md` og `AGENTS.md` er entrypoints. De er næsten identiske: fire
regelblokke står **ordret** i begge, fordi hvert harness kun auto-loader sin egen
fil. Harness-specifik adfærd ligger uden for blokkene.

Den kanoniske ejer er
`agent_brain/understanding/standards/assistant-core-contract.md`. Ændres en regel,
ændres den dér og kopieres til begge — og kontrollen fejler, hvis nogen glemmer
det. Se [03-adapters](03-adapters.md).

## Skills

En skill er en navngiven procedure. De 11 fælles systemskills findes i **begge**
harness, fordi begge skal kunne udføre dem. Codex har desuden onboarding og en
read-only system-guide. Se [04-skills-catalog](04-skills-catalog.md).

Skills er adapterlag. De må aldrig være eneste hjem for et projektfaktum eller en
fælles arbejdsgang — den slags hører til i hjernen, hvor begge harness kan læse
det.

## Kontrollerne

`heinrich/tools/` indeholder de mekaniske kontroller:

| Værktøj | Kontrollerer |
| --- | --- |
| `adapter-parity.mjs` | At de fire regelblokke er ens i begge entrypoints |
| `collaboration-audit.mjs` | Skriveejerskab og risiko for at to modeller skriver samme fil |
| `skill-inventory.mjs` | At skills findes i begge harness uden dubletter |

Hver har en testfil ved siden af. `.githooks/pre-commit` kører parity-kontrollen
ved hver commit, når hooks er aktiveret.

Princippet: **når en tavs, gentagelig fejl er rettet, tilføjes en mekanisk
kontrol der fanger samme fejlklasse.** Visuelle smagsdomme kræver stadig et
menneske.

## Samarbejdsrummet

`_collaboration/` er til når to assistenter skal give hinanden modspil på en
afgrænset beslutning. Én skriver et brief, den anden svarer i sin **egen** fil —
ingen redigerer den andens.

Rummet ejer dialogen. Det rigtige sted ejer resultatet. Når en konklusion er
routet derhen og uafhængigt testet, arkiveres hele rummet.

---
type: knowledge
summary: "Fælles read-only procedure til at forklare HEINRICHs arkitektur, mapper, ejerskab og begrundelser."
state: stable
updated: 2026-08-28
tags: [playbook, heinrich, architecture, documentation]
---

# System-guide

## Formål

Forklar HEINRICH konkret ud fra den levende struktur og dens kanoniske
dokumentation. Brugeren skal forstå både **hvad** en del gør, **hvor** den bor,
og **hvorfor** systemet er opdelt sådan.

Proceduren er read-only. Den forklarer systemet; den reviderer eller ændrer det
ikke.

## Trigger

Brug proceduren når brugeren spørger til HEINRICHs opbygning, mothership,
hjerne, satellitter, bridges, adaptere, skills, mapper, filer, dataflow eller
ejerskab. Den kan aktiveres automatisk fra spørgsmålet eller eksplicit som
`$system-guide`.

Brug `$mothership-check` i stedet, når brugeren beder om en sundheds-, drift-
eller integritetskontrol. Brug `$onboard` til opsætning.

## Kilder

Læs progressivt — kun det spørgsmålet kræver:

| Spørgsmål | Primære kilder |
| --- | --- |
| Samlet arkitektur | `README.md`, `heinrich/docs/01-how-it-works.md` |
| Hjernen og viden | `heinrich/docs/02-how-the-brain-grows.md`, `heinrich/agent_brain/_index.md` |
| Claude/Codex-adaptere | `heinrich/docs/03-adapters.md`, root `AGENTS.md` og `CLAUDE.md` |
| Skills | `heinrich/docs/04-skills-catalog.md` og de relevante aktive skill-mapper |
| Tilpasning og onboarding | `heinrich/docs/00-start-here.md`, `heinrich/docs/05-customising.md` |
| En bestemt mappe eller fil | Den levende sti, nærmeste `README.md`/`AGENTS.md` og relevant guide |

Dokumentation beskriver hensigten; filsystemet viser den aktuelle virkelighed.
Hvis de er uenige, sig præcist hvad der er dokumenteret, hvad der faktisk
findes, og at forskellen ikke er rettet.

## Grundkort

| Sti | Indeholder | Hvorfor den findes |
| --- | --- | --- |
| `AGENTS.md` / `CLAUDE.md` | De to harnessers entrypoints og fælles kernekontrakt | Begge AI-systemer skal starte med de samme load-bearing regler |
| `.agents/skills/` / `.claude/skills/` | Tynde, harness-specifikke skill-adaptere | Hvert harness opdager kun sine egne skills |
| `heinrich/` | Mothershipet | Samler hjerne, regler, værktøjer og projektbroer ét sted |
| `heinrich/agent_brain/` | Varig, harness-neutral viden | Bevarer kontinuitet på tværs af samtaler, projekter og AI-systemer |
| `heinrich/.Codex/` / `heinrich/.claude/` | Harness-specifik constitution | Holder platformsforskelle ude af den fælles hjerne |
| `heinrich/tools/` | Onboarding, hooks og mekaniske kontroller | Gør tavse, gentagelige fejl målbare |
| `heinrich/docs/` | Kanoniske brugerguides | Forklarer den aktive arkitektur uden at eje brugerens viden |
| `projekt-template/` | Rent satellitskelet | Nye projekter får samme minimumsstruktur uden kopieret projektindhold |
| `_collaboration/` | Afgrænset rum til review mellem assistenter | Modspil kan ske uden at to modeller skriver i samme fil |
| `setup/` | Profil og generator-state efter onboarding | Adskiller brugerens valg fra genererede runtime-filer |

Inde i `agent_brain/` er hovedreglen:

- `about_user/` ejer godkendt viden om brugeren;
- `people/` ejer personer;
- `projects/` ejer tynde bridges til projektsatellitter;
- `tasks/` ejer opgaver uden entydigt projektscope;
- `understanding/` ejer standarder, playbooks, mønstre, beslutninger og
  unknowns;
- `references/` navigerer til viden, men ejer den ikke;
- `raw/` modtager kilder før de bliver fordøjet.

Projektets detaljer bliver i satellitten. Mothershipet ser kun den tynde bridge,
så projekter kan findes og styres uden at blive kopieret ind i hjernen.

## Svarform

Tilpas dybden til spørgsmålet:

- **Begreb:** forklar værdien i almindeligt sprog og nævn derefter den centrale
  sti.
- **Mappe eller fil:** svar med `Indhold`, `Ejer` og `Hvorfor`.
- **Sammenhæng eller dataflow:** følg informationen fra kanonisk kilde til de
  direkte mål; vis kun et lille træ eller flow når flere lag ellers bliver
  uklare.
- **Bred rundvisning:** begynd med mothership → hjerne → satellitter →
  adaptere → skills og stop mellem naturlige niveauer, så brugeren kan vælge
  mere dybde.

Brug præcise stier, men undgå at dumpe hele filtræet. Forklar først det
praktiske formål. Slut med ét kort tilbud om at åbne en bestemt del yderligere,
hvis spørgsmålet var bredt.

## Grænser

- Læs aldrig `heinrich/agent_brain/inbox.md`.
- Læs ikke person-, projekt- eller taskindhold, medmindre brugeren eksplicit
  spørger til netop det indhold. Struktur kan forklares fra mapper, metadata og
  guides.
- Brug ikke webkilder til at forklare HEINRICH, når systemets egne kanoniske
  kilder findes.
- Kald ikke systemet sundt eller verificeret ud fra en forklaring. Det kræver
  et egentligt check.
- Skriv ikke rapporter, tasks, dokumentation eller rettelser som sideeffekt.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som fælles, harness-neutral
> forklaringskontrakt.

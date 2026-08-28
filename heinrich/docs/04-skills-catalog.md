---
type: guide
summary: "Den verificerede bestand af fælles og harness-specifikke systemskills."
state: canonical
tags: [heinrich, docs, skills]
---

# Skills catalog

<!-- skill-inventory:start -->
## Verificeret live-inventory

> Afledt visning — ikke workflowkilde. Genereres fra de faktiske `SKILL.md`-filer.
> Kommando: `node heinrich/tools/skill-inventory.mjs --catalog heinrich/docs/04-skills-catalog.md`.

- Aktive skillfiler: **26**
- Unikke aktive navne: **13**
- Disabled: **0**
- Arkiverede: **0**
- Eksakte kopifamilier: **0**
- Redundante aktive kopier: **0**

| Skillfamilie | Scope | Kanonisk ejer | Codex-adapter | Claude-adapter | Synlig fra | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `close-handover` | `work` | `heinrich/agent_brain/understanding/playbooks/close-handover.md` | `.agents/skills/close-handover/SKILL.md` | `.claude/skills/close-handover/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `collaboration-check` | `work` | `heinrich/agent_brain/understanding/playbooks/collaboration-check.md` | `.agents/skills/collaboration-check/SKILL.md` | `.claude/skills/collaboration-check/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `create-project` | `work` | `heinrich/agent_brain/understanding/playbooks/create-project.md` | `.agents/skills/create-project/SKILL.md` | `.claude/skills/create-project/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `create-task` | `work` | `heinrich/agent_brain/understanding/playbooks/create-task.md` | `.agents/skills/create-task/SKILL.md` | `.claude/skills/create-task/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `delete-project` | `work` | `heinrich/agent_brain/understanding/playbooks/delete-project.md` | `.agents/skills/delete-project/SKILL.md` | `.claude/skills/delete-project/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `eval` | `work` | `heinrich/agent_brain/understanding/playbooks/eval.md` | `.agents/skills/eval/SKILL.md` | `.claude/skills/eval/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `handover` | `work` | `heinrich/agent_brain/understanding/playbooks/handover.md` | `.agents/skills/handover/SKILL.md` | `.claude/skills/handover/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `ingest` | `work` | `heinrich/agent_brain/understanding/playbooks/ingest.md` | `.agents/skills/ingest/SKILL.md` | `.claude/skills/ingest/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `learn` | `work` | `heinrich/agent_brain/understanding/playbooks/learn.md` | `.agents/skills/learn/SKILL.md` | `.claude/skills/learn/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `mothership-check` | `work` | `heinrich/agent_brain/understanding/playbooks/mothership-check.md` | `.agents/skills/mothership-check/SKILL.md` | `.claude/skills/mothership-check/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `onboard` | `work` | `heinrich/agent_brain/understanding/playbooks/onboard.md` | `.agents/skills/onboard/SKILL.md` | `.claude/skills/onboard/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `resume-handover` | `work` | `heinrich/agent_brain/understanding/playbooks/resume-handover.md` | `.agents/skills/resume-handover/SKILL.md` | `.claude/skills/resume-handover/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |
| `system-guide` | `work` | `heinrich/agent_brain/understanding/playbooks/system-guide.md` | `.agents/skills/system-guide/SKILL.md` | `.claude/skills/system-guide/SKILL.md` | `Work/ og underliggende projekter` | active · variants (2) |

<!-- skill-inventory:end -->

**11 fælles workflow-skills** er spejlet i `.claude/skills/` og
`.agents/skills/`. Det er dem onboarding gennemgår.

`onboard` og `system-guide` er **system- og indgangsskills** og tælles ikke som
en af de 11. De findes også i begge harness.

Maskinelt er beholdningen dermed 13 skillfamilier med adapter i begge harness.
Det er ikke det samme som 13 core workflow-skills — opdelingen er pædagogisk og
ændres ikke uden en beslutning.

Der følger ingen projekt- eller kundespecifikke skills med.

Kontrollér bestanden når som helst:

```bash
node heinrich/tools/skill-inventory.mjs
```

## Opsætning

### `onboard` — Claude `/onboard`, Codex `$onboard`

Forklarer kittet, indsamler en profil, renderer begge harnessers constitution
fra fælles templates og tilbyder Git-trin med separate godkendelser. Motoren
ejer alle writes og stopper ved håndredigerede generatorfiler.

Aktiv i begge harness. Den fælles procedure ligger i
`agent_brain/understanding/playbooks/onboard.md`; motoren er
`heinrich/tools/onboard.mjs`. Adapterne er tynde og indeholder ingen
generatorlogik — netop for at de to harness ikke kan drive fra hinanden.

## Systemforståelse

### `system-guide` — Claude `/system-guide`, Codex `$system-guide`

Forklarer automatisk HEINRICHs arkitektur, mapper, ejerskab og begrundelser,
når brugeren spørger til systemet. Den læser den levende struktur og de
relevante kanoniske guides, men ændrer eller sundhedstjekker ikke noget.

Aktiv i begge harness mod den fælles
`agent_brain/understanding/playbooks/system-guide.md`.

De tre nabo-skills holdes bevidst adskilt: `system-guide` forklarer, `onboard`
sætter op, og `mothership-check` reviderer.

## Projekter og opgaver

### `/create-project`
Opretter én registreret projektsatellit med et minimalt charter, pladsholdere til
assets og skills, tynde runtime-pointere, en bridge i mothershipet og den første
opgave.

Kun til et nyt selvstændigt projekt — ikke til en opgave eller et eksperiment.

### `/delete-project`
Fjerner én præcist identificeret satellit permanent og rydder aktive referencer
op — men først efter en read-only forhåndsvisning og en eksplicit bekræftelse i
chatten.

Aldrig til arkivering, standby, frysning eller delvis oprydning. Skillen skelner
skarpt mellem *mappenavn* og *projektidentitet*, fordi de to kan divergere.

### `/create-task`
Opretter ét opgavekort hos dets kanoniske ejer: projektopgaver i satellitten,
uprojekterede eller tværgående opgaver centralt i hjernen.

Håndhæver vagter mod dubletter, forkert livscyklus og for mange igangværende
opgaver. Højst én opgave må globalt være `in_progress`.

## Kontinuitet

### `/handover`
Gemmer væsentlig tilstand midt i en opgave før en pause eller en
kontekstafkortning. Skriver en tidsstemplet historikfil plus en pointer til den
aktuelle opgave.

Ikke til færdigt arbejde.

### `/resume-handover`
Genoptager den rigtige igangværende opgave ved starten af en ny session. Læser
kun, opsummerer tilstanden, og fortsætter først når du bekræfter.

### `/close-handover`
Lukker én aktiv handover når opgaven er færdig, annulleret eller lukket
administrativt. Historikken er uforanderlig; intet slettes.

## Viden

### `/ingest`
Optager en kilde fra `raw/` — referat, artikel, eksport, research, transskription
eller dokument — og fordeler den til varige destinationer med oprindelsen intakt.

Stopper før den skriver privat eller blandet materiale.

### `/learn`
Bevarer varig viden fra den igangværende samtale, før den går tabt. Router
godkendte fund til hjernen, projektmekanikken, opgaver og skill-kandidater.

Ikke til midlertidig tilstand — brug `/handover`.

## Revision

### `/mothership-check`
Struktureret gennemgang af mothership, bridges, satellitter, opgaver, links,
dokumentation og drift mellem adaptere. Læser først, rapporterer før den skriver.

### `/collaboration-check`
Reviderer skriveejerskab, risiko for kollision i filer med igangværende
ændringer, og den fælles samarbejdskontrakt mellem de to harness.

Read-only som udgangspunkt. Ikke en almindelig kodegennemgang.

### `/eval`
Kører evalueringen af skrivekontrakten i isolerede syntetiske sandkasser med
uafhængig bedømmelse.

Retter aldrig noget automatisk og tester aldrig mod din rigtige hjerne.

## Hvorfor begge harness

De fælles workflowskills findes i to udgaver, fordi hvert harness kun læser sin
egen mappe. Indholdet er tilpasset harnesset, men adfærden skal være den samme.

Den fælles logik hører hjemme i den neutrale playbook under
`agent_brain/understanding/playbooks/`. Skillen er en tynd indpakning. Lægges
logikken i skillen i stedet, driver de to udgaver fra hinanden.

## Byg dine egne

Følg `agent_brain/understanding/standards/skill-authoring.md`.

To ting går oftest galt: en beskrivelse der er for vag til at skillen udløses på
det rigtige tidspunkt, og logik der lever i skillen frem for i playbooken.

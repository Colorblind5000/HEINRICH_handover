---
type: knowledge
summary: "Fælles procedure for at oprette ét task-kort hos dets kanoniske ejer: projekttasks i satellitten og uprojekterede eller tværgående tasks i mothershipet."
state: stable
updated: 2026-08-24
tags: [playbook, heinrich, opgaver]
---

# Create-task

## Formål

Opret én konkret opgave med fælles frontmatter og uden parallelle kopier.
Proceduren er fælles for alle LLM-harnesses. Adapteren opløser Work-roden,
læser sin task-constitution og udfører writes med harnessets værktøjer.

Input er en konkret handling i naturligt sprog. Opret ikke tasks for vage idéer
eller ukendte uden et næste skridt.

## Fase 1: Udled felterne

| Felt | Regel |
| --- | --- |
| Titel | kort handling i bydeform |
| Beskrivelse | én kort sætning om hvad og hvorfor |
| Prioritet | eksplicit værdi, ellers `p3` |
| Ejer | eksplicit værdi, ellers `brugeren` |
| Projekt | kun når aktivt projekt er entydigt; ellers spørg eller udelad |
| Kategori | én af `feature`, `review`, `learning`, `admin`, `other` |
| Deadline | kun en eksplicit reel dato |

Sluggen er lowercase med `æ→ae`, `ø→oe`, `å→aa`, bindestreger mellem
ord, ingen øvrige ikke-ASCII-tegn og højst 60 tegn.

## Fase 2: Opløs den kanoniske målmappe

Hvis `project` er sat:

1. Find bridgen i
   `heinrich/agent_brain/projects/<project>/<project>.md`.
2. Verificér `project_id`, `lifecycle: active` og et relativt
   `workspace_path`. En absolut sti, `..` eller mismatch stopper flowet.
3. Verificér at `Work/<workspace_path>/` findes.
4. Sæt målmappen til `Work/<workspace_path>/tasks/`.

Hvis `project` ikke er sat, er målmappen
`Work/heinrich/agent_brain/tasks/`.

En manglende bridge eller satellit oprettes aldrig som sideeffekt. Spørg om
tasken skal være uprojekteret, eller om `create-project` skal køres. En
manglende `tasks/` under en eksisterende aktiv satellit må oprettes som del
af første task-write efter normal preflight.

## Fase 3: Dubletter, order og fokus

Scan aktive task-kort med samme projektslug på både den kanoniske placering og
den centrale legacy-mappe. For uprojekterede tasks scannes den centrale mappe.
Brug både slug og semantisk handling.

- Et aktivt dubletkort stopper oprettelsen.
- En handling indlejret som næste skridt i en bredere aktiv task udskilles kun
  efter brugerens valg; den brede task beholder kontekst og får et sporingslink.
- Et centralt legacy-kort med samme projekt er en konflikt, ikke en tilladelse
  til at oprette endnu en kopi.
- `order` er højeste numeriske order i samme projektgruppe plus én.
- Nye tasks er `open`. Kontrollér samtidig, at højst én task globalt er
  `in_progress`.

Gentag dublet- og order-scanningen umiddelbart før skrivning.

## Fase 4: Preflight og write

Kør dirty-file preflight på målfilen og changeloggen. En eksisterende untracked
målfil eller en fremmed dirty ændring stopper den berørte write. Genlæs
changeloggen umiddelbart før den kontekstfølsomme patch.

Skriv `<task-slug>.md`:

```yaml
---
type: task
title: "<titel>"
summary: "<titel>"
status: open
priority: <p0|p1|p2|p3>
order: <max + 1>
due: <YYYY-MM-DD eller udeladt>
owner: <navn>
project: <projekt-slug eller udeladt>
category: <kategori>
description: "<kort hvad og hvorfor>"
source: manual
created: <i dag>
updated: <i dag>
tags: [task, <kategori>]
---
```

Brødteksten er `# <titel>` plus kun brugbar kontekst og relevante links.
Tilføj ingen tomme skabelonsektioner.

## Fase 5: Sporing og rapport

Tilføj én changelog-entry med et Work-relativt wikilink til den faktiske
task-sti. Rapportér oprettet sti, prioritet, projekt og deadline.

Hvis tasken er første handling i et nyt projekt, opdatér projektets bridge
`next_action` i samme autoriserede projektflow. Ved almindelig taskoprettelse
ændres bridge-cachen kun, når tasken udtrykkeligt bliver projektets valgte næste
handling.

## Invarianter

- Én task pr. fil og én kanonisk placering.
- Projektopgaver lever i satellitten; uprojekterede og tværgående tasks lever
  centralt.
- `project` er tekst-slug, ikke wikilink.
- Højst én global `in_progress`.
- Ingen backup, commit, push, deploy eller projektoprettelse som sideeffekt.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Oprettelse af projekt eller bridge: `create-project`.
- Ændring af lifecycle.
- Varig viden: `learn`.
- Midlertidig pausetilstand: `handover`.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

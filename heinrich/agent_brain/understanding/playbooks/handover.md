---
type: knowledge
summary: "Fælles procedure for at fastholde tilstanden i en igangværende opgave før en pause eller compaction, uden at overskrive parallelle opgaver."
state: stable
updated: 2026-08-23
tags: [playbook, heinrich, kontinuitet]
---

# Handover

## Formål

Bevar den flygtige opgavetilstand, som den næste session har brug for til at
fortsætte uden at miste momentum. Proceduren er fælles for alle LLM-harnesses.
Adapteren bestemmer kun, hvordan rod og filer opløses og skrives.

Handover fastholder **opgavetilstand**. Varig viden hører til `learn` og må
ikke udledes her.

## Trigger

Kør kun når brugeren beder om det, eller når en af disse gælder:

- før compaction i en session, hvor arbejdet er midt i en opgave;
- når en lang session har produceret taktiske detaljer, mislykkede forsøg og
  halvfærdigt arbejde, som compaction ville udviske;
- når en opgave sættes på pause og skal genoptages senere.

Kør ikke ved rene vidensessioner, ved trivielle opgaver, eller når opgaven
reelt er færdig. Er en opgavespecifik pointer stadig aktiv for færdigt arbejde,
hører det til `close-handover`.

## Bias

Vær konkret. Mislykkede forsøg og blindgyder er særligt værdifulde, fordi de
forhindrer den næste session i at gentage dem. Udfyld ikke sektioner uden
indhold; skriv `Ingen`.

## Fase 1: Identificér opgaven

Afklar hvilken konkret opgave handoveren hører til. Er det uklart, spørg.
En handover er altid forankret i én opgave.

Vælg et stabilt slug i kebab-case, typisk to til fire ord. Genbrug samme slug,
når den samme opgave opdateres.

## Fase 2: Skriv dokumentet

Samme indhold skrives to steder under HEINRICH-roden:

1. `artifacts/handovers/YYYY-MM-DD-HHMM-<slug>.md` er uforanderlig historik.
   Findes filnavnet allerede, tilføjes `-2`, `-3` og så videre. Tidsstemplet
   historik overskrives aldrig.
2. `artifacts/handovers/latest-<slug>.md` er den opgavespecifikke pointer. Den
   må kun overskrives af en nyere handover for samme slug.

Den globale `artifacts/handovers/latest.md` er historisk. Den må hverken
skrives eller overskrives; den bevares kun, så `resume-handover` kan læse
handovers fra før den opgavespecifikke pointer fandtes.

Før første write kontrolleres målfilernes tilstand. En fremmed handover
overskrives aldrig.

### Outputkontrakt

```markdown
---
type: handover
task: <kort opgavenavn>
slug: <slug>
created: YYYY-MM-DD HH:MM
status: in-progress
---

# Handover: <opgavenavn>

## Goal
Hvad opgaven skal opnå, i en til tre sætninger. Succeskriterier hvis de kendes.

## Context
Hvorfor opgaven betyder noget, hvad der udløste den, hvem der er involveret.
Link til hjernesider med wikilinks hvor det er relevant.

## What we tried
Kronologisk liste over forsøg med udfald: hvad blev gjort, og virkede det,
mislykkedes det eller delvist, og hvorfor.

## Current state
Situationen lige nu. Hvad virker, hvad er i stykker, hvad er halvfærdigt.

## Next step
Den vigtigste næste handling, konkret nok til at udføre uden at beslutte igen.

## Open questions
Det vi ikke ved, udskudte beslutninger, ting der skal afklares med brugeren.

## Files touched
Sti plus hvad der blev ændret og hvorfor.

## Gotchas
Ikke-oplagte ting, den næste session falder over: begrænsninger, skjult
tilstand, miljøsærheder, ting brugeren vil have på en bestemt måde.
```

## Fase 3: Rapportér

Returnér den skrevne historikfil og den opdaterede pointer, samt at næste
skridt er `resume-handover` efter compaction. Ikke mere.

## Grænser

- Bær relevant kontekst og tidligere blindgyder videre, når der findes en nyere
  handover for samme slug. Skriv derefter et nyt tidsstemplet snapshot og
  opdatér kun det slugs pointer.
- Overskriv aldrig en terminal pointer med `done`, `closed` eller `cancelled`,
  medmindre brugeren eksplicit beder om at genåbne opgaven. En genåbning skriver et
  nyt snapshot og sætter pointeren til `in-progress`.
- Handovers er opgavehistorik, ikke varig hjerne. De må gerne akkumulere, og
  brugeren rydder dem, når brugeren vil.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Varig viden: `learn`.
- Nye opgaver: `create-task`.
- Lukning af en færdig opgavepointer: `close-handover`.
- Strukturel kontrol af hjernen: `mothership-check`.
- Backup, commit, push, deploy eller eksterne handlinger.

Dukker der varig viden op undervejs, nævnes det i rapporten, så brugeren selv kan
køre `learn`. Den udtrækkes ikke her.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

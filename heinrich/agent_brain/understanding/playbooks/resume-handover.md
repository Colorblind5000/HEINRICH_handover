---
type: knowledge
summary: "Fælles read-only procedure for at genoptage den rigtige igangværende opgave fra en opgavespecifik handover efter compaction eller i en ny session."
state: stable
updated: 2026-08-23
tags: [playbook, heinrich, kontinuitet]
---

# Resume-handover

## Formål

Indlæs tilstanden for én bestemt igangværende opgave uden at antage, at den
senest skrevne handover hører til den aktuelle opgave. Proceduren er fælles for
alle LLM-harnesses. Adapteren bestemmer kun, hvordan rod og filer opløses.

Proceduren er **read-only**. Den ændrer hverken handovers eller pointere.

## Trigger

- efter compaction, når den forrige session skrev en handover;
- ved start på en ny session, hvor en igangværende opgave skal genoptages;
- når brugeren beder om at genindlæse en opgavehandover.

## Fase 1: Vælg handover

Følg denne rækkefølge:

1. Navngiver brugeren et slug eller en fil, læses netop den. Er dens `status`
   `done`, `closed` eller `cancelled`, rapportér at opgaven er lukket, og stop.
   Genoptag den ikke, og ændr ikke dens status uden en separat, eksplicit
   anmodning om at genåbne.
2. Ellers listes de opgavespecifikke pointere `latest-*.md`, og deres
   frontmatter samt `Current state` og `Next step` læses.
3. Kun pointere med `status: in-progress` er aktive kandidater. `done`,
   `closed` og `cancelled` udelades af både listen og optællingen. En manglende
   eller ukendt status er malformet, ikke implicit aktiv.
4. Er præcis én aktiv pointer plausibel, vælges den.
5. Er flere plausible, vises op til fem valg som en nummereret liste, der
   starter ved 1, med opgavenavn, oprettelsestidspunkt og næste skridt. Brugeren
   skal kunne svare med tallet alene. Vælg aldrig ud fra ændringstidspunkt.
6. Findes der opgavespecifikke pointere, men ingen aktive, oplyses det, og
   proceduren stopper. Færdige opgaver tilbydes ikke.
7. Findes ingen opgavespecifikke pointere, falder proceduren én gang tilbage
   til den historiske globale `latest.md`. Det skal siges eksplicit før det
   normale resumé, at den historiske globale handover bruges som fallback,
   fordi ingen opgavespecifik pointer fandtes. En opgavetitel, der indeholder
   ordet legacy, er ikke en tilstrækkelig markering.

Findes ingen handover overhovedet, oplyses det, og proceduren stopper.

## Fase 2: Vurdér friskhed

Læs `created` i frontmatter og reagér efter alder:

| Alder | Handling |
| --- | --- |
| under 24 timer | fortsæt normalt |
| 24 timer til 7 dage | markér at tilstanden kan have flyttet sig, og tilbyd at verificere den aktuelle filtilstand først |
| over 7 dage | markér stærkere, anbefal at gennemgå handoveren sammen frem for at behandle den som sandhed |

## Fase 3: Resumér og bekræft

Giv et kort resumé på tre linjer: opgavens navn, hvor arbejdet slap, og næste
skridt. Spørg derefter, om der kan fortsættes, eller om noget har ændret sig.

Er der åbne spørgsmål i handoveren, som brugeren kan svare på med det samme,
fremhæves ét eller to af dem i bekræftelsen.

## Fase 4: Fortsæt

Når brugeren har bekræftet, udføres næste skridt. Handoveren behandles som
bærende kontekst. Spørg ikke igen om det, den allerede besvarer: mål,
begrænsninger, hvad der blev forsøgt, og hvorfor tilgange blev fravalgt.

## Grænser

- Proceduren skriver ikke. Skal der pauses igen, bruges `handover`.
- Skal en ældre handover genoptages i stedet for den nyeste, beder brugeren om
  filen ved navn, og den læses i stedet.
- Handoveren er opgavetilstand, ikke varig viden. Intet fra den forfremmes til
  hjernen her.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Skrivning eller opdatering af handovers: `handover`.
- Lukning af en færdig opgavepointer: `close-handover`.
- Varig viden: `learn`.
- Backup, commit, push, deploy eller eksterne handlinger.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

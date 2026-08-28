---
type: knowledge
summary: "Fælles procedure for at bevare varig arbejdsviden fra den aktuelle samtale og route den til dens kanoniske ejer med proveniens."
state: stable
updated: 2026-08-23
tags: [playbook, heinrich, viden]
---

# Learn

## Formål

Bevar den viden fra denne samtale, som skal overleve den. Proceduren er fælles
for alle LLM-harnesses. Adapteren bestemmer kun, hvordan rod og filer opløses
og skrives, og hvilken constitution-fil der er harnessets kilde til
læringsautoritet.

Gennemgå **kun denne samtale**. Midlertidig opgavetilstand, mislykkede forsøg
og næste skridt hører til `handover`.

## Trigger

- før planlagt compaction eller et større kontekstskift;
- efter en samtale, der producerede væsentlig ny kontekst;
- når noget vigtigt er dukket op, og brugeren vil have det fastholdt nu.

Start aldrig proceduren lydløst. Foreslå den og vent på accept.

## Gate 0: Grænsen mellem arbejde og privat

Klassificér materialet, før der læses eller skrives til hjernedestinationer.

| Klassifikation | Handling |
| --- | --- |
| Klart arbejdsdomæne | fortsæt |
| Klart privat | stop. Skriv det ikke i hjernen, opgaver, changelog eller skills |
| Blandet eller usikkert | stop og spørg, hvad der må bevares |

Ved blandet materiale fortsættes kun med et eksplicit godkendt uddrag, der
udelukkende indeholder arbejdsindhold. Bevar hverken privat detalje eller en
provenienshenvisning, der blotlægger privat materiale.

Denne gate står over enhver indstilling for aggressivitet.

## Gate 1: Læringsautoritet

Læs harnessets constitution og anvend den gældende ingestionsaggressivitet.

| Niveau | Adfærd |
| --- | --- |
| `Ask` | undersøg og fremlæg de præcise foreslåede writes med destination, påstand og proveniens; vent på bekræftelse |
| `Auto` | efter at brugeren har kaldt proceduren, skriv kun klare, ikke-modstridende fund i arbejdsdomænet, og rapportér hver write. Løs aldrig konflikter automatisk |
| `Off` | rapportér kun kandidater. Skriv først efter en eksplicit tilsidesættelse |

Har brugeren allerede angivet den præcise påstand og destination, tæller den
instruktion som bekræftelse for netop den write.

## Konfliktreglen

Overskriv, flet eller tilføj aldrig en konkurrerende kendsgerning lydløst.

Vis den eksisterende påstand og dens ejer, den foreslåede påstand og dens
kilde, og det konkrete valg der kræves. Tilbyd altid alle tre udfald: behold
det eksisterende, erstat med det foreslåede, eller udskyd konflikten uløst.

Ved udskydelse bevares begge kilder uændret, og der skrives hverken viden eller
markør. Vent på brugeren, før nogen version ændres. Der findes ingen efterfølgende
procedure, som kan antages at løse konflikten senere.

## Fase 1: Gennemgå

Scan samtalen fra start til nu og klassificér kandidater:

- **Hjerneopdateringer.** Nye fakta om personer, projekter og interessenter.
  Beslutninger med begrundelse. Statusændringer. Kontekst der hører til en
  person- eller projektside.
- **Understanding.** Playbooks som gentagelige procedurer formuleret i denne
  session. Patterns som tilbagevendende tilgange værd at navngive. Standards
  som konventioner, der blev besluttet. Unknowns som åbne spørgsmål, der gentog
  sig.
- **Opgaver.** Forpligtelser brugeren påtog sig, opfølgninger der blev aftalt, og
  handlinger med et klart næste skridt.
- **Projektmekanik.** Projektinterne fakta, som fremtiden får brug for, men som
  er afgrænset til ét projekt: filstier, interne navne, skemaundtagelser,
  konfigurationsfælder og trinspecifik adfærd. Heuristikken er, om lektien
  ville være meningsløs eller forkert uden for projektet.

  Rut kun til projektets mekanikmappe, **når ingen stærkere projekt-ejet fil
  allerede ejer fundet**. Findes en ADR, en `CONTEXT.md` eller et andet
  projektdokument, der semantisk ejer det, opdateres den fil i stedet.
  Mekanikmappen må ikke blive en parallel ejer ved siden af projektets egen
  dokumentation.

  Opret mappen ved første reelle fund og giv den en kort README, der forklarer
  dens formål. Routingen betaler sig kun, hvis mappen faktisk genlæses:
  harnessets projektkontrakt skal forpligte til at læse den, når arbejdet med
  projektet genoptages. Er den forpligtelse ikke på plads, er viden skrevet
  dertil reelt utilgængelig, og det skal siges i rapporten.
- **Arbejdsrelaterede præferencer.** Stemme, kommunikation, værktøjer,
  beslutninger og proces på tværs af arbejdsprojekter. Generelle
  styringsændringer hører til den overordnede kontrakt og kræver et separat,
  eksplicit valg, også i `Auto`. Klart private præferencer hører aldrig hertil.
- **Skill-kandidater.** Workflows udført eller ønsket tre gange eller mere
  manuelt. Markér dem kun i rapporten. Opret dem først efter separat
  godkendelse.

## Fase 2: Filtrér

For hver kandidat:

1. Er den klart arbejdsdomæne og fri for privat detalje? Hvis nej, stop.
2. Betyder den noget om en uge? Hvis nej, spring den over.
3. Hvem er kanonisk ejer? For projektfakta følges projektets bridge, og
   projektets egen ejerfil opdateres først. Hold bridgen tynd.
4. Er den allerede fanget? Hvis ja, opdatér den side frem for at duplikere.
5. Er den i konflikt? Hvis ja, brug konfliktreglen og vent.
6. Er den konkret? Vage pointer hører ingen steder hjemme.
7. Er den underbygget? Angiv kilde, sikkerhed og usikkerhed hvor det er
   relevant.

## Fase 3: Foreslå eller skriv

- Opdatér eksisterende sider først. Opret kun nyt, når indholdet klart
  fortjener sin egen identitet.
- Hver write får proveniens i formen `> Kilde: samtale YYYY-MM-DD`.
- Under `Ask` fremlægges destination, påstand og proveniens, og der ventes.
- Opgaver oprettes gennem `create-task`. Skriv aldrig opgavefrontmatter i
  hånden.
- Nye selvstændige hjernesider starter som `state: needs-review`, medmindre de
  blev valideret i samme arbejde.
- For et godkendt uddrag af blandet materiale må proveniensen kun identificere
  det arbejdssikre uddrag, aldrig den private kilde.

## Fase 4: Log og markér

Tilføj én changelog-entry efter godkendte writes med dato, emne, opdaterede og
oprettede sider, antal opgaver og antal markerede skill-kandidater. Tilføj
ingen entry, når intet blev ændret.

Opdatér sessionsmarkøren først, når kørslen er autoriseret og færdig: enten er
de godkendte writes gennemført, eller brugeren har accepteret, at intet varigt skal
gemmes. Opdatér den aldrig, mens et `Ask`-forslag afventer bekræftelse, efter
et stop på privat eller blandet materiale, eller efter en mislykket kørsel.

## Fase 5: Rapportér

Rapportér hvad der blev bevaret fordelt på hjerne, opgaver og skill-kandidater,
hvor mange konflikter eller private emner der blev sprunget over, og hvad der
blev overvejet uden at være varigt. Angiv til sidst, om `handover` også er
nødvendig for igangværende opgavetilstand.

Er intet værd at gemme, er rapporten én linje.

## Driftsgrænse

Der findes ingen aktiv efterfølgende konsolidator. Proceduren skal selv færdiggøre
sin domænekontrol, deduplikering, ejerskabskontrol, konflikthåndtering og
proveniens. Gem aldrig tvivlsomt materiale i forventning om, at en anden
procedure rydder op senere.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Midlertidig opgavetilstand: `handover`.
- Oprettelse af opgavefiler i hånden: `create-task`.
- Strukturel kontrol af hjernen: `mothership-check`.
- Oprettelse af nye skills.
- Resumé af samtalen. Udtræk varig viden, referér den ikke.
- Backup, commit, push, deploy eller eksterne handlinger.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

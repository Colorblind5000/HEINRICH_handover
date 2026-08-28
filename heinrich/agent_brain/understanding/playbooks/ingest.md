---
type: knowledge
summary: "Fælles procedure for at behandle en arbejdskilde fra raw/ ind i hjernen med én skabelon, bevaret proveniens og kanonisk ejerskab."
state: stable
updated: 2026-08-23
tags: [playbook, heinrich, viden]
---

# Ingest

## Formål

Behandl én arbejdskilde: klassificér den, anvend præcis én skabelon, og bevar
den uforanderlige kilde som proveniens. Proceduren er fælles for alle
LLM-harnesses. Adapteren bestemmer kun, hvordan rod og filer opløses og
skrives, og hvilken constitution-fil der styrer autoritet.

Input er stien til en fil i `raw/`. Mangler den, listes ubehandlede kilder fra
`raw/` krydstjekket mod ingest-loggen, og brugeren vælger hvilken kilde der skal
behandles.

## Delt aktiv: skabelonerne

Skabelonsættet er fælles indhold og ikke harness-specifikt. Det ligger i dag i
`.agents/skills/ingest/templates/` og ejes af Codex-adapteren.

Begge harnesses læser skabelonerne derfra, indtil de flyttes til en neutral
placering. Kopiér dem ikke ind i en anden adapter; to kopier ville drive fra
hinanden, og det er netop den fejl, denne playbook findes for at undgå.

## Gate 0: Domæne og autorisation

Klassificér kilden før enhver write.

| Klassifikation | Handling |
| --- | --- |
| Klart arbejde | fortsæt |
| Klart privat | stop. Arbejdshjernen er ikke et godkendt privat hjem |
| Blandet eller tvetydigt | stop. Ingestér eller link aldrig den blandede original fra arbejdshjernen |

Ved klart privat materiale oprettes hverken journal, refleksion, personside,
hukommelsespost, artifact eller provenienslink. Bed brugeren udpege en godkendt
privat destination.

Ved en godkendt opdeling af blandet materiale:

1. Originalen flyttes først uden for `Work/` til en godkendt privat
   destination. Flyt eller slet den aldrig uden eksplicit autorisation.
2. Der oprettes et renset, arbejdsrelateret uddrag under
   `raw/work-extracts/YYYY-MM-DD/<slug>.md`. Det må ikke indeholde private
   fakta og ingen sti eller link til den private original. En generisk note om,
   at det stammer fra en blandet kilde, er nok.
3. Kun det uddrag bruges som proveniens for arbejdsresultater.

Findes ingen privat destination, stop. Et arbejdsresumé gør det ikke sikkert
at efterlade eller linke den blandede original under `Work/raw/`.

Følsomt arbejdsmateriale bliver i arbejdsdomænet, men bevar kun det brugbare
resumé, medmindre brugeren eksplicit beder om ordret opbevaring.

Et eksplicit kald med en sti autoriserer almindelige writes for en klart
arbejdsrelateret kilde. Blev proceduren valgt implicit, mens brugeren kun bad om
analyse, produceres et forslag, og der ventes.

## Fase 1: Læs kilden helt

Læs hele filen, før noget besluttes. Notér filens form, indholdets stil, hvem
der taler, og hvilken slags tekst det er.

## Fase 2: Klassificér og vælg skabelon

Vælg **én** skabelon:

| Kilde | Skabelon |
| --- | --- |
| Flere stemmer i dialog | `meeting` |
| Assistentens egen websyntese uden én ekstern forfatter | `research` |
| Eksternt skrevet indhold uden dialog | `article` |
| Bulk-eksport med mange poster i arbejdsdomænet | `export` |
| Alt andet | `general` |

Personlige journaler og selvrefleksioner er bevidst deaktiveret i
arbejdshjernen. Rut aldrig til dem.

Passer to skabeloner, vælges den mest specifikke. Er valget reelt tvetydigt,
spørg brugeren.

## Fase 3: Anvend skabelonen

Skabelonen bestemmer destinationer, frontmatter, hvad der udtrækkes, og
eventuel særbehandling. Følg den.

Før projektviden ændres, afklares ejerskab:

1. Læs projektets bridge og følg dens `path`.
2. Læs projektets egen kontrakt, `CONTEXT.md` og ADR'er, hvor de findes.
3. Identificér den kanoniske ejer af beslutninger og status, og opdatér den
   ejer først.
4. Hold bridgen tynd, når den kun er en pegepind. Tilføj kun den status eller
   det link, der er nødvendigt for genfinding. Dublér aldrig den kanoniske
   beslutning.

Er ejerskabet uklart, eller er kilderne i konflikt, spørg brugeren, før nogen af
placeringerne ændres.

Giver skabelonen konkrete opgaver, oprettes hver enkelt gennem `create-task`,
så eksempel-projektfelter, rækkefølge, dubletkontrol og projektvagter forbliver
konsistente. Gør ikke foreløbige idéer til opgaver.

Sæt efter oprettelsen `source: meeting` eller `source: ingest` på hver opgave
efter kildens type. Feltet skal afspejle, hvor opgaven faktisk kom fra.

Hold enhver opgavepåstand inden for kildens grænse. Titel, handling, formål,
succeskriterium, projektfase og deadline skal hver især stå eksplicit i kilden
eller være bekræftet særskilt af brugeren. Forbedr ikke en sparsom handling ved at
opfinde, hvorfor den betyder noget, hvad den validerer, eller hvilken senere
fase den muliggør. Brug en minimal beskrivelse, der kun bevarer den angivne
handling og kontekst.

## Fase 4: Selektiv hub-opdatering

Opdatér kun hubs for navngivne entiteter med varig relevans for et aktivt
arbejdsprojekt, et tilbagevendende referenceemne eller en dokumenteret
beslutning. En forbigående omtale giver ikke en hub-post.

En kvalificeret entry skrives i den fælles form med navn, oprindelse eller
udbyder, dato i formen `YYYY-MM`, en evidensbaseret beskrivelse på én sætning
og et link.

Findes ingen passende hub, oprettes en ny kun, når kilden etablerer et varigt
emne, ikke blot ved en første omtale. En ny hub oprettes gennem harnessets
godkendte hub-skabelon og føres ind i `agent_brain/_index.md`. Søg efter et
lille antal reelt nyttige tilbagelinks. Masseindsæt aldrig links for grafens
tæthed alene. Opdatér den berørte hubs dato.

Udled eller gem aldrig brugerens formodede holdning. Registrér kildens position,
en eksplicit udtalelse fra brugeren, eller lad holdningen stå uafklaret.

## Fase 5: Proveniens

Enhver hjerneside eller artifact skabt fra en arbejdskilde i `raw/` skal
indeholde et klikbart kildelink i formen `> Kilde: [[raw/...]]`.

På en wikiside står linket nær det afledte afsnit eller i en kildesektion. I en
artifact står det øverst. Bærer en artifact detaljer ud over wikiresuméet,
linkes wikisiden til den.

For en opdelt blandet kilde linkes kun den rensede fil under
`raw/work-extracts/`. Link aldrig den private original, og afslør ikke dens
sti.

## Fase 6: Opdatér sporing og rapportér

Tilføj kilde, destinationer og anvendt skabelon til ingest-loggen, og skriv én
changelog-entry med dato, skabelon og hvad der blev udtrukket. Opdatér indekset,
hvis nye sider eller hubs blev oprettet.

Rapportér den behandlede fil, skabelonen, destinationerne, den udtrukne viden,
antal oprettede opgaver og de berørte hubs.

## Grænser

- Læs hele kilden før udtræk. Kontekst betyder noget.
- Vær kortfattet i hjerneopdateringer. `raw/` har den uforanderlige optegnelse.
- En omfangsrig analyse hører til i artifacts, hvor kun de varige konklusioner
  forfremmes til hjernen.
- Proceduren tager tekst. Ved lyd skaffes en transskription, som gemmes i
  `raw/`, hvorefter proceduren køres på den.
- En ny skabelon tilføjes ved at lægge filen i skabelonmappen og tilføje en
  række i dens README. Proceduren opdager den automatisk.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Viden fra selve samtalen: `learn`.
- Opgavefrontmatter i hånden: `create-task`.
- Strukturel kontrol af hjernen: `mothership-check`.
- Backup, commit, push, deploy eller eksterne handlinger.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

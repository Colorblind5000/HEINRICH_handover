# Samarbejdsrum

`_collaboration/` er et neutralt arbejdsrum for afgrænset sparring mellem
AI-assistenter. Mappen er ikke et projekt eller en del af HEINRICHs mothership.
Aktive rum ligger direkte i mappen; afsluttede rum bevares under `_archive/`.

## Grundregel

Samarbejdsrummet ejer dialogen. Det konkrete projekt ejer det varige resultat.

Et afsluttet rum må ikke blive liggende blandt aktive rum eller fungere som
parallel sandhedskilde. Varige konklusioner routes til deres kanoniske ejer og
verificeres. Derefter flyttes hele rummet intakt til arkivet; det slettes ikke.

## Hvornår et rum bruges

Et rum oprettes kun, når brugeren eksplicit ønsker tvær-assistent-sparring, eller
når en opgave kræver en uafhængig second opinion på en væsentlig beslutning,
fælles kontrakt eller dokumenteret konflikt. Det kan godt vedrøre ét projekt.

Almindelige spørgsmål og små reviews løses direkte i chat.

## Arbejdsgang

1. Én assistent opretter et dateret rum og skriver `ROOM.md` samt et brief.
2. Briefet fastlægger ét konkret spørgsmål, berørte projekter, præmisser,
   filscope, ejerskab, acceptkriterier og ønsket svarformat.
3. Den anden assistent efterprøver briefets forslag uafhængigt i sin egen fil.
4. Assistenterne udfordrer konkrete uenigheder i hver deres filer. Ingen
   redigerer den andens arbejdsfil.
5. Der gennemføres højst to reviewrunder efter briefet. Derefter skriver
   briefets ejer enten én fælles anbefaling eller én præcis restuenighed som et
   valg til brugeren. Uenighed er et gyldigt slutprodukt.
6. Den anden assistent bekræfter anbefalingen eksplicit eller angiver den ene
   resterende uenighed med evidens og mindste nødvendige valg.
7. Brugeren får én anbefaling med enighed, evidens, tradeoffs og eventuelle
   uafklarede punkter. Dialogen er ikke i sig selv en beslutning.
8. Efter brugerens beslutning routes hvert accepteret, varigt resultat til sin
   kanoniske ejer af én navngiven implementør.
9. Når implementeringen er færdig, skriver implementøren en overlevering i
   rummet med ændrede filer, opfyldte acceptkriterier, egne kontroller, kendte
   begrænsninger og præcise instruktioner til den anden assistents test.
10. Den assistent, der ikke implementerede, efterprøver resultatet uafhængigt
    og skriver `PASS`, `FAIL` eller `BLOCKED` med konkret evidens i sin egen
    fil. Implementørens egne tests er input, ikke bevis for den uafhængige
    kontrol.
11. Først efter uafhængig `PASS` — eller en eksplicit undtagelse godkendt af
    brugeren — sættes rummet til `archived`, og briefets ejer flytter hele det
    daterede rum intakt til `_collaboration/_archive/<år>/<rumnavn>/`.

Hvis brugeren afviser anbefalingen helt, er der intet at route, og briefets ejer
arkiverer rummet med beslutningen dokumenteret i `ROOM.md`.

## Arkivstruktur

```text
_collaboration/
├── README.md
├── <aktive-rum>/
└── _archive/
    └── <år>/
        └── <afsluttet-rum>/
```

Arkivet er historik, ikke en aktiv opgaveliste eller workflowkilde. Arkiverede
rum redigeres ikke for at fortsætte arbejdet. En opfølgning får et nyt dateret
rum, som linker til det arkiverede rum og de kanoniske destinationsfiler.

## Ejerskab og writes

Hvert rum skal reservere én fil pr. skriver. Ved overlap i projektfiler er én
assistent skriver og de øvrige read-only reviewers, indtil ejerskabet er
overdraget eksplicit. Ingen redigerer en anden assistents arbejdsfil.

Et samarbejdsbrief eller en fælles anbefaling udvider aldrig automatisk
write-scope til berørte projekter. Eksisterende projektfiler ændres kun, når
den oprindelige opgave allerede autoriserer implementering, eller brugeren
særskilt har godkendt den.

Før routing skal `ROOM.md` navngive én skriver og én konkret destination for
hver målfil. Manglende write-autorisation stopper routingen.

## Implementeringsoverlevering og uafhængig test

Implementøren og testeren må ikke være samme assistent. Testeren er read-only
på implementeringens målfiler og skriver kun sin egen testfil i rummet. Hvis
testen fejler, beholder implementøren skriveejerskabet til rettelserne, og
testeren gentager kontrollen efter en ny overlevering. Ejerskab skifter kun ved
en eksplicit skriftlig overdragelse.

Implementeringsoverleveringen skal mindst indeholde:

- den accepterede anbefaling og brugerens konkrete valg;
- hver ændret eller oprettet destinationsfil;
- mapping fra acceptkriterium til implementeret resultat;
- de kontroller implementøren selv har kørt og deres faktiske resultat;
- kendte begrænsninger, blokerede tests og resterende risiko;
- én afgrænset testopgave til den anden assistent.

Den uafhængige tester skal genlæse de kanoniske destinationsfiler og teste den
faktiske brugersti og det synlige resultat, ikke kun implementørens resumé. En
mekanisk kontrol skal genkøres, hvor resultatet kan måles. Visuelle eller
adfærdsmæssige krav kontrolleres gennem den relevante brugersti. Manglende
testinfrastruktur er `BLOCKED`, aldrig `PASS`.

Testfilen skal mindst angive:

- `PASS`, `FAIL` eller `BLOCKED` samlet;
- evidens pr. acceptkriterium;
- filer og brugersti der blev kontrolleret;
- regressioner, rester eller manglende dækning;
- præcis rettelse og ejer ved `FAIL`, eller blocker og næste aktør ved
  `BLOCKED`.

Et `FAIL` eller `BLOCKED` må ikke omskrives til en fælles anbefaling eller
arkiveres som gennemført. Brugeren kan eksplicit acceptere en dokumenteret
undtagelse, men tavshed eller implementørens egen test er ikke en undtagelse.

## Routing af konklusioner

| Konklusionstype | Kanonisk destination |
| --- | --- |
| Arkitektur- eller produktbeslutning | Projektets eksisterende ADR eller beslutningsdokument |
| Stabil projektkontekst eller præmis | Projektets `CONTEXT.md` eller tilsvarende ejerfil |
| Aktuel status og næste handling | Projektets `PROJECT.md` eller bridge |
| Teknisk mekanik | Projektets eksisterende tekniske dokumentation |
| Konkret opfølgning | Projektets task-system |
| Genbrugelig tværgående HEINRICH-viden | Relevant standard, pattern eller decision i mothershipet; kræver eksplicit opgave fra brugeren |
| Ingen varig værdi | Routes ikke; bevares kun som del af det arkiverede rum |

Hvis én konklusion berører flere projekter, vælges én kanonisk ejer. De andre
projekter linker direkte til ejerfilen; de opbevarer ikke kopier.

Findes der ingen egnet projekt-ejet destination, stopper routingen. Brugeren skal
udpege eller godkende destinationen. En ny dokumentstruktur oprettes aldrig
skjult som del af routing, og mothership-bridgen bruges ikke som catch-all for
detaljerede projektkonklusioner.

## Verifikation og arkivering

Status `archived` må først bruges, når:

- hver accepteret konklusion har én navngiven destinationsfil;
- destinationen er skrevet af den autoriserede skriver;
- filen er genlæst, og det synlige resultat kan findes dér;
- eventuelle links fra andre projekter peger direkte på ejerfilen;
- alle uafklarede punkter er dokumenteret som uafklarede i `ROOM.md`.
- implementøren har skrevet en fuld overlevering;
- den ikke-implementerende assistent har skrevet en uafhængig `PASS`, eller
  brugeren har godkendt en præcist dokumenteret undtagelse.

Commit kan indgå i projektets normale workflow, men er ikke et globalt
lukningskrav. Briefets ejer er eneansvarlig for at flytte det præcise daterede
rum til den korrekte årsmappe efter verifikationen. Ingen filer fjernes under
arkiveringen.

## Minimum for `ROOM.md`

- status og dato;
- konkret spørgsmål og forventet slutprodukt;
- berørte projekter og præcise stier;
- accepterede præmisser og punkter der må udfordres;
- fil- og skriveejerskab;
- accept- og stopkriterier;
- forventede kanoniske destinationer;
- routing-skriver og målfil, når implementering er godkendt;
- navngiven implementør, navngiven uafhængig tester og deres reserverede
  overleverings- og testfiler;
- placering af fælles anbefaling og hvem der har bekræftet den;
- næste aktør og næste handling.

Tilladte statusser er `active`, `awaiting-review`, `awaiting-synthesis`,
`awaiting-brugeren`, `implementing`, `blocked` og `archived`. `blocked` skal
navngive blocker, næste aktør og betingelsen for at fortsætte. `archived` er den
eneste afsluttede lagerstatus og må kun findes under `_archive/`.

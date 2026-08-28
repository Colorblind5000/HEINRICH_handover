---
type: knowledge
summary: "Fælles procedure for fysisk at slette ét præcist identificeret HEINRICH-projekt og fjerne alle aktive rester efter preview og eksplicit bekræftelse."
state: stable
updated: 2026-08-24
tags: [playbook, heinrich, projekt, lifecycle, destructive]
---

# Delete-project

## Formål og trigger

Slet fysisk ét registreret projekt og ryd alle aktive systemreferencer.
Proceduren kører kun, når brugeren eksplicit beder om at slette et projekt.

`delete-project` arkiverer ikke. Før den destruktive bekræftelse skal previewet
tilbyde arkivering som alternativ. Vælger brugeren arkivering, stopper denne
procedure; lifecycle ændres gennem et separat ikke-destruktivt workflow.

## Fase 1: Identitetsgate

Opløs input til bridgens `project_id`, bridgefilens slug, `workspace_path` og
den faktiske absolutte satellitsti.

Alle fire skal være konsistente. Stop hvis:

- slug og `project_id` er forskellige;
- `workspace_path` er absolut, indeholder `..` eller peger uden for Work;
- den faktiske mappe ikke svarer til bridgen;
- målet er Work-roden, `heinrich/`, `_collaboration/`, `.git/` eller en anden
  fælles/systemejet mappe;
- to bridges eller mapper gør identiteten tvetydig.

Mappenavn og projektidentitet er ikke det samme begreb. Gæt aldrig det ene ud
fra det andet.

## Fase 2: Read-only preview

Før enhver write vises en komplet overfladeliste:

- absolut satellitsti, filantal, størrelse og dirty Git-status;
- eventuelt separat repo, upstream og upushede commits;
- bridgefil og øvrige aktive filer i bridge-mappen;
- projektets satellit-tasks og eventuelle centrale legacy-tasks med samme
  `project`;
- ankrede entries i `.gitignore`, backup-konfigurationer, eksempel-projekt-order,
  indekser og andre registre;
- aktive handover-pointere og aktive samarbejdsrum;
- projektlokale skills og adapters;
- aktive wikilinks og tekstfelter med slug eller `project_id`.

Scan skjulte stier eksplicit med hidden/no-ignore-adfærd. Udeluk `.git/`,
dependency/build-caches og `heinrich/agent_brain/inbox.md`; indbakken må aldrig
læses eller søges. Historiske changelogs, arkiverede samarbejdsrum og afsluttede
handovers klassificeres som historik og slettes ikke automatisk.

Previewet ændrer intet.

## Fase 3: Afklar tab og alternativ

Før bekræftelse:

1. tilbyd arkivering som ikke-destruktivt alternativ;
2. afklar åbne tasks: bevar varige resultater hos deres ejer, flyt en reelt
   tværgående handling eller bekræft at den slettes;
3. fremhæv assets, dokumenter, credentials og andre filer, som ikke kan
   genskabes;
4. ved eget repo: vis dirty og upushet arbejde og kræv særskilt anerkendelse
   af tabet;
5. stop på aktive samarbejds- eller handoverflows, indtil de er lukket eller
   eksplicit overdraget.

Kør aldrig backup som sideeffekt.

## Fase 4: Stærk chatbekræftelse

Vis den fulde absolutte satellitsti og den konkrete liste af materialer, der
fjernes. Brugeren skal svare i chatten, at netop denne sti må slettes. Et klik på
en tool-prompt er ikke godkendelse.

Genlæs bridge, målsti, Git-status og aktive referencer efter bekræftelsen. En
ændring i scope stopper eksekveringen og kræver nyt preview.

## Fase 5: Slet i zombie-sikker rækkefølge

1. Fjern eller afslut aktive task-kort og aktive pointers, som previewet har
   godkendt.
2. Fjern præcise projektentries i fælles registre med kontekstfølsomme patches.
3. Slet satellitten med en literal, verificeret absolut sti uden glob eller
   uafklaret variabel.
4. Slet bridgefilen og den nu tomme bridge-mappe sidst.

Før rekursiv sletning opløses stien igen og verificeres som et direkte barn
eller godkendt nested workspace under Work, aldrig selve Work. Ved delvis fejl
stoppes der. En synlig bridge-rest bevares og markeres som fejl frem for at
skjule en forældreløs rest.

## Fase 6: Efterkontrol

Scan igen efter både slug og `project_id` på tværs af Work med eksplicit
hidden/no-ignore-adfærd og samme private/system-ekskluderinger.

Hvert hit klassificeres:

- **bevidst historik** — bevaret changelog, arkiveret rum eller afsluttet
  handover;
- **ekstern reference** — en anden kanonisk ejer, der bevidst omtaler det
  slettede projekt;
- **aktiv rest** — fejl, som skal ryddes eller rapporteres præcist.

Kontrollér desuden, at mappe og bridge er væk, ingen aktive task-kort har
projektidentiteten, og projektet ikke længere vises i aktive Obsidian-views.

## Rapport

Rapportér:

- slettet satellit og bridge;
- fjernede aktive referencer og tasks;
- bevaret historik;
- ikke fundne forventede overflader;
- hver resterende fejl med ejer og næste handling;
- om materialet kan genskabes fra Git eller er permanent tabt.

Proceduren er kun gennemført, når ingen ukategoriseret aktiv rest findes.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

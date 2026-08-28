---
type: index
summary: "Hjernens indgang: organiseringsprincipper og hvor tingene hører hjemme."
state: canonical
tags: [heinrich, index]
---

# Hjernen

Dette er en **tom hjerne**. Strukturen er der; indholdet skriver du gennem brug.
Udfyld ikke mapperne i hånden — brug `/ingest`, `/learn` og `/create-project`,
så oprindelsen følger med.

## Hvor tingene hører hjemme

| Mappe | Indhold | Fyldes af |
| --- | --- | --- |
| `about_user/` | Hvem du er, hvordan du arbejder | `/onboard`, `/learn` |
| `people/` | Personer du arbejder med | `/ingest`, `/learn` |
| `projects/` | Én tynd bridge pr. projekt | `/create-project` |
| `tasks/` | Opgaver uden entydigt projektejerskab | `/create-task` |
| `understanding/` | Varig indsigt | `/learn`, `/ingest` |
| `references/` | Emne-hubs der navigerer | `/ingest` |
| `raw/` | Materiale der endnu ikke er fordøjet | dig |

## understanding/

Den vigtigste mappe. Fem slags viden, med hver sit formål:

| Undermappe | Svarer på |
| --- | --- |
| `standards/` | Sådan gør vi det her |
| `playbooks/` | Sådan udføres denne opgave, trin for trin |
| `patterns/` | Det her har vi lært virker eller ikke virker |
| `decisions/` | Det her valgte vi, og hvorfor |
| `unknowns/` | Det her ved vi ikke endnu |

`standards/` og `playbooks/` er udfyldt fra start — det er kittets egen logik og
grundlaget for de 11 systemskills. De øvrige er tomme.

## Principper

**Én kanonisk ejer.** Hver oplysning har præcis ét sted den bor. Findes den to
steder, er det ene forkert i morgen.

**Dupliker aldrig, flyt i stedet.** Hører noget hjemme et andet sted, så flyt
det og efterlad et link — ikke en kopi.

**Hubs navigerer, de ejer ikke.** En side i `references/` peger på den kanoniske
ejer. Bliver hubben det sted man læser frem for det sted man finder vej, mangler
der en ejer.

**Provenans følger med.** Alt udefra bærer sin oprindelse: hvorfra, hvornår, og
hvem der godkendte det. En påstand uden kilde kan ikke efterprøves.

**Begrundelsen er værdien.** I en beslutning er *hvorfor* det eneste der ikke kan
udledes senere. Om et halvt år er valget indlysende; grunden er det ikke.

## Beskyttede filer

Nogle filer er spærret mod utilsigtet ændring. Se [_protected.md](_protected.md).
Kilden er `heinrich/config/protected-paths.json`.

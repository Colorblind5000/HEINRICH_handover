---
type: guide
summary: "Hvordan viden lander i hjernen, og hvem der ejer hvad."
state: canonical
tags: [heinrich, docs, viden]
---

# Hvordan hjernen vokser

Hjernen fyldes ikke ved at skrive i den manuelt. Den fyldes gennem tre veje.

## De tre veje ind

| Vej | Skill | Kilde |
| --- | --- | --- |
| Nyt materiale udefra | `/ingest` | En fil i `raw/` |
| Indsigt fra en samtale | `/learn` | Den igangværende session |
| Tilstand før en pause | `/handover` | Det du er midt i |

**`/ingest`** tager et referat, en artikel, en eksport eller et dokument fra
`raw/` og fordeler det til de varige destinationer. Oprindelsen følger med, så
det altid kan spores tilbage.

**`/learn`** fanger det, der blev klogere undervejs i en samtale — inden
konteksten forsvinder. Den router til hjernen, til projektmekanik, til opgaver
og til skill-kandidater.

**`/handover`** er noget andet: den gemmer *midlertidig* tilstand, ikke varig
viden. Hvor du er, hvad der mangler, hvad der var mærkeligt. `/resume-handover`
henter det frem igen, og `/close-handover` lukker den, når opgaven er slut.

Bland dem ikke sammen. Varig indsigt i en handover går tabt, når opgaven lukkes.

## Hvem ejer hvad

Grundreglen: **opdatér den stærkeste kanoniske ejer først.**

| Slags viden | Kanonisk ejer |
| --- | --- |
| Hvem du er | `about_user/` |
| En person | `people/<navn>.md` |
| Et projekts detaljer | Satellitten selv |
| Et projekts status udadtil | Bridgen i `projects/<slug>/` |
| Sådan gør vi generelt | `understanding/standards/` |
| Sådan udføres denne opgave | `understanding/playbooks/` |
| Det her lærte vi | `understanding/patterns/` |
| Det her valgte vi, og hvorfor | `understanding/decisions/` |
| Det ved vi ikke endnu | `understanding/unknowns/` |

Emne-hubs i `references/` er **navigation**, ikke ejerskab. En hub peger på den
kanoniske ejer; den er ikke selv svaret. Bliver en hub til det sted man læser
frem for det sted man finder vej, er der en ejer der mangler.

## Én kilde, flere mål

Leverer én kilde til flere steder, skal hvert mål læse **direkte** fra kilden.

Byg aldrig kæder, hvor et afledt resultat bliver kilde for det næste. Kæden ser
harmløs ud, indtil ét led ændrer sig og de øvrige tavst driver fra hinanden.

Det er præcis derfor kernekontrakten har én kanonisk ejer og to kopier, der
begge læser fra den — ikke en kopi der læser fra den anden kopi.

## Beslutninger

Når et reelt valg med en pris træffes, skrives det i
`understanding/decisions/`: hvad vi valgte, hvad vi fravalgte, og hvorfor.

Værdien ligger i **hvorfor**. Om et halvt år er valget indlysende; begrundelsen
er det ikke. Uden den bliver beslutningen taget om igen.

## Provenans

Alt der kommer udefra bærer sin oprindelse: hvor det kom fra, hvornår, og hvem
der godkendte det. En påstand uden kilde kan ikke efterprøves, og en hjerne fuld
af upåviselige påstande er værre end en tom.

## Hvad du selv skal rydde op i

Systemet vokser af sig selv, men falder ikke selv sammen igen. Tre revisionsskills
findes til det:

- `/mothership-check` — struktur, døde links, drift mellem adaptere
- `/collaboration-check` — skriveejerskab og kollisionsrisiko
- `/eval` — om skrivekontrakten faktisk holder i praksis

De læser først og skriver ikke uopfordret.

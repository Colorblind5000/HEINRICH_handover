# HEINRICH

Et personligt assistent-setup til **Claude Code** og **Codex** med én fælles,
varig hjerne. Dette repo er grundstrukturen — ikke nogens færdige hjerne.
Den fyldes ud, efterhånden som du bruger den.

Dokumentationen er på dansk. Assistenten kan tale det sprog, du vælger under
opsætningen.

## Hvad du får

- **Én hjerne, to harness.** Viden ligger harness-neutralt i
  `heinrich/agent_brain/`. Claude Code og Codex er tynde adapterlag ovenpå — ikke
  to konkurrerende systemer.
- **11 fælles systemskills**, spejlet i begge harness, plus Codex-onboarding
  og en read-only system-guide:
  oprettelse og nedlæggelse af
  projekter og opgaver, handover før en pause, genoptagelse bagefter, ingest af
  nyt materiale, læring, og tre revisionsskills der kontrollerer setuppet selv.
- **En håndhævet kernekontrakt.** Fire regelblokke — sikkerhed, kvalitet,
  privatliv og skriveejerskab — står ordret i begge harnessers entrypoint. En
  maskinel kontrol fejler, hvis de driver fra hinanden.
- **Mothership og satellitter.** Det centrale rum ejer en tynd *bridge* pr.
  projekt; selve projektet ejer sine egne detaljer.
- **Et samarbejdsrum** hvor to assistenter kan give hinanden modspil på en
  afgrænset beslutning uden at træde i hinandens filer.

## Kom i gang

```bash
git clone <dit-repo> && cd <dit-repo>
```

Åbn mappen i Codex og kør:

```text
$onboard
```

Claude Code får en separat, tynd `/onboard`-adapter, som bruger samme motor.

Onboarding introducerer først systemet og spørger, om du vil tilknytte et nyt,
tomt og privat repo under din egen konto. Ved ja gemmes linket som lokal
`origin`; ved nej fortsætter flowet kun uden eksterne remotes. Derefter følger
Obsidian og selve profilopsætningen. Commit og push kræver altid særskilt
godkendelse.

Kør den igen når som helst; den er idempotent og overskriver ikke det, du selv
har rettet.

## Krav

**Node på PATH.** Bruges af onboarding, af kontrollen der håndhæver
kernekontrakten, og af commit-hooken. Mangler Node, kører setuppet i en
forklaret `DEGRADED`-tilstand frem for at blokere dit arbejde.

**Obsidian Desktop + Minimal Hidden Files.** Standard-onboarding bruger
Obsidian som systemets visuelle arbejdsrum og pluginet til at vise sikre
punktumfiler. Hjernen består fortsat af almindelige Markdown-filer.

## Læs videre

| Dokument | Indhold |
| --- | --- |
| [00-start-here](heinrich/docs/00-start-here.md) | Installation og første kørsel |
| [01-how-it-works](heinrich/docs/01-how-it-works.md) | Arkitektur: mothership, satellitter, hjerne |
| [02-how-the-brain-grows](heinrich/docs/02-how-the-brain-grows.md) | Hvordan viden lander og hvem ejer den |
| [03-adapters](heinrich/docs/03-adapters.md) | Dual harness og kernekontrakten |
| [04-skills-catalog](heinrich/docs/04-skills-catalog.md) | Den verificerede skillbestand |
| [05-customising](heinrich/docs/05-customising.md) | Tilpasning efter opsætning |
| [06-troubleshooting](heinrich/docs/06-troubleshooting.md) | Når noget ikke virker |

## Hvad der bevidst ikke følger med

Grundstrukturen er tom, fordi indholdet var personligt. Der er ingen profil,
ingen personer, ingen projekter, ingen opgaver, ingen ingested materiale og
ingen historik fra den installation, skelettet stammer fra. Mapperne findes;
du fylder dem.

## Licens

**Licens til personlig brug.** Du må bruge og tilpasse setuppet til dine egne
formål — det er hele meningen, og opsætningen omskriver selv filer med dine
værdier. Det du selv skaber med det, er dit eget.

Du må derimod ikke videredistribuere det, underlicensere det eller udnytte det
kommercielt, heller ikke i ændret form.

Se [LICENSE](LICENSE) for de fulde vilkår. Ønsker du rettigheder ud over det,
kræver det en skriftlig aftale med rettighedshaveren.

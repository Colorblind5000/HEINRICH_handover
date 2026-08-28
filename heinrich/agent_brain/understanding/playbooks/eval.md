---
type: knowledge
summary: "Fælles procedure for at regressionsteste skills og den delte skrivekontrakt i isolerede syntetiske sandkasser med uafhængig bedømmelse."
state: stable
updated: 2026-08-23
tags: [playbook, heinrich, integritet]
---

# Eval

## Formål

Regressionstest de skills, harnesset selv ejer, og den delte skrivekontrakt.
Proceduren er fælles for alle LLM-harnesses. Adapteren bestemmer kun, hvilken
skill-rod der er implementeringen under test, hvilket deterministisk
valideringsscript der køres, og hvordan runner og grader oprettes.

Bedøm ikke systemets egne indbyggede skills eller plugin-leverede skills
internt. Gennemgå dem kun for relevans og overlap i routing.

## Trigger

Kør efter ændringer i egne skills eller ved en eksplicit kvalitetsgennemgang.
Proceduren har ingen kadence og starter ikke som sideeffekt af andet arbejde.

## Modekatalog

Modes er semantiske og hører til denne playbook. Kun deres kaldesyntaks er
harness-specifik.

| Mode | Betydning |
| --- | --- |
| `all` | strukturel validering plus hver adfærdscase |
| `<skill>` | strukturel validering plus den navngivne skills case |
| `changed` | de skills, der er ændret i harnessets egen skill-rod. Er selve eval-skillen ændret, køres alle cases |
| `weekly` | alle cases sammenlignet med den nyeste tidligere rapport |
| `static` | kun de deterministiske strukturelle kontroller |
| `write-contract` | kun de delte skrivekontraktcases, kørt separat pr. harness |

Ukendte modes og ukendte skillnavne er en fejl. Fald aldrig lydløst tilbage til
`all`.

## Casekatalog og målmapping

| Mål | Case |
| --- | --- |
| `create-task` | `cases/create-task.md` |
| `create-project` | `cases/create-project.md` |
| `delete-project` | `cases/delete-project.md` |
| `ingest` | `cases/ingest.md` |
| `learn` | `cases/learn.md` |
| `handover` | `cases/handover.md` |
| `close-handover` | `cases/close-handover.md` |
| `resume-handover` | `cases/resume-handover.md` |
| `write-contract` | `cases/write-contract.md` |

Læs kun de valgte casefiler. Hver grader skal desuden læse grader-rubrikken.

## Kapabilitetsgrænse

En mode må kun annonceres af en adapter, der faktisk kan levere den.

- `write-contract` er fælles og skal køres separat i hvert harness.
- Skillcases er semantisk genbrugelige, men kræver, at adapteren kan levere
  målskillen, de nødvendige constitution-filer, en sandbox-runner og en
  validator for sit eget harness.
- `static` må kun annonceres, når adapteren navngiver et reelt
  harness-specifikt valideringsscript. En adapter må aldrig kalde et andet
  harness' validator og præsentere resultatet som sit eget.

Kan en adapter ikke levere en mode, annoncerer den den ikke, og casen markeres
`BLOCKED`.

## Delte aktiver

Case-kataloget og grader-rubrikken er fælles indhold og ikke
harness-specifikt. De ligger i dag under `.agents/skills/eval/` og ejes af
Codex-adapteren.

Begge harnesses læser dem derfra, indtil de flyttes til en neutral placering.
Kopiér dem ikke ind i en anden adapter.

## Sikkerhedsgrænse, ikke til forhandling

Adfærdstest må aldrig køre mod den levende hjerne, `raw/`, `artifacts/` eller
projektfiler.

- Byg én frisk syntetisk sandkasse pr. scenarie under systemets temp-mappe.
- Kopiér kun aktive skill-instruktioner, de nødvendige constitution-filer og
  den minimale syntetiske fixture, casen erklærer.
- Kopiér aldrig den levende hjerne eller rå kilder ind i en sandkasse.
- Runner og grader må kun skrive inde i deres tildelte sandkasse.
- Ret aldrig en fejlet skill automatisk. Rapportér fejlen og vent på en separat
  godkendt ændring.

Er en isoleret sandkasse eller en uafhængig grader utilgængelig, markeres
adfærdscasen `BLOCKED`. Erstat den aldrig med en kørsel mod den levende hjerne
eller med selvbedømmelse.

## Fase 1: Fastlæg rod og fang integritet

Fastlæg Work-roden. Før adfærdskørsler registreres arbejdstræets tilstand og
filhashes for de levende mapper under hjernen, `raw/` og `artifacts/`. Kun den
nye rapport, proceduren selv skriver efter bedømmelsen, undtages.

Ændrer nogen anden levende fil sig under kørslen, stop, bevar sandkassen til
inspektion, og rapportér en `P0` isolationsfejl.

## Fase 2: Deterministisk validering

Kør harnessets strukturelle valideringsscript. En fejlkode fælder det
strukturelle trin. Adfærdscases må stadig køre, når deres målskill kan indlæses
sikkert, men det samlede resultat kan ikke være helt grønt.

## Fase 3: Vælg cases

Anvend den ønskede tilstand. Ukendte skill- eller casenavne er en fejl. Fald
aldrig lydløst tilbage til alle cases.

Hver case indeholder flere scenarier. Giv hvert scenarie sin egen sandkasse, så
tilstand ikke kan lække mellem dem, medmindre scenariet eksplicit tester en
sekvens.

## Fase 4: Byg sandkassen

Inde i den syntetiske Work-rod:

- kopiér harnessets skill-rod skrivebeskyttet som implementeringen under test;
- kopiér kun de constitution-filer, casen udtrykkeligt kræver;
- opret en minimal hjerne, `raw/`, `artifacts/` og projektfixture fra casens
  opsætning;
- kopiér intet levende bruger-, projekt-, opgave-, handover-, rå- eller
  artifactindhold.

For målet `write-contract` kopieres den kanoniske kernekontrakt plus den
relevante rod-adapter. Fixturen initialiseres som et Git-repo med en committet
baseline, før scenariets staged, unstaged eller untracked tilstand påføres.
Codex og Claude køres i fysisk adskilte rødder.

Registrér sandkassens filhashes, før runneren starter.

## Fase 5: Kør med en uafhængig runner

Giv runneren kun målskillen eller den relevante rod-adapter, scenariets
anmodning, sandkassens sti og instruktionen om at returnere brugersynligt
output plus de stier, der blev ændret i sandkassen.

Giv aldrig runneren forventede resultater, rubrikken, tidligere konklusioner
eller et foreslået fix. Runneren må ikke bedømme sig selv.

## Fase 6: Bedøm uafhængigt

Giv en separat grader kun scenariets forventede og forbudte egenskaber,
rubrikken, runnerens brugersynlige output samt sandkassens diff og relevante
slutfiler.

Graderen skal citere konkret evidens. `PASS` kræver hver hård invariant; én
manglende invariant er `FAIL`. Manglende infrastruktur er `BLOCKED`, ikke en
bestået test.

## Fase 7: Verificér isolation og rapportér

Genberegn de levende hashes og sammenlign med målingen før kørslen. Sammenfat
derefter strukturelt resultat, antal beståede scenarier, regressioner,
blokerede cases, resultater med evidens pr. invariant, forskellen fra forrige
kørsel og den resterende risiko.

Gem rapporten under `heinrich/artifacts/eval-runs/`. Ændr ikke changeloggen
automatisk; rapporten er selve revisionssporet.

## Fase 8: Ryd op sikkert

Slet kun temp-mapper oprettet af denne kørsel, og først efter bedømmelse og
integritetskontrol. Før rekursiv sletning opløses den absolutte sti, og det
verificeres, at den ligger inde i systemets temp-mappe, og at dens sidste led
har det forventede præfiks. Fejler en af kontrollerne, slet ikke; rapportér
stien til manuel inspektion.

Behold kun en fejlet sandkasse, når den indeholder evidens til at diagnosticere
en isolationsfejl, og oplys dens præcise sti.

## Regressionsreglen

Sammenlign på en stabil nøgle af mål, harness, scenarie og invariant, ikke på
formulering. Fremhæv `PASS→FAIL` som en regression og `FAIL→PASS` som et
verificeret fix. En ny eller væsentligt ændret invariant har ingen tidligere
baseline og markeres `NEW`, aldrig lydløst som en regression.

Ét harness' resultat er aldrig evidens for det andet. Rapportér dem hver for
sig.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Automatisk rettelse af en fejlet skill.
- Live-audit af ejerskab: `collaboration-check`.
- Strukturel kontrol af hjernen: `mothership-check`.
- Bedømmelse af systemets indbyggede eller plugin-leverede skills.
- Backup, commit, push, deploy eller eksterne handlinger.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

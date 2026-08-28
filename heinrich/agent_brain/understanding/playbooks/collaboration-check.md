---
type: knowledge
summary: "Fælles read-only-first kontrol af skriveejerskab, kollisionsrisiko ved dirty filer og den delte Codex/Claude-samarbejdskontrakt."
state: stable
updated: 2026-08-24
tags: [playbook, heinrich, integritet]
---

# Collaboration-check

## Formål

Afgør om den delte skrivekontrakt er strukturelt sund, og om arbejdsområdet
lige nu udstiller en beviselig overtrædelse eller en ejerskabsrisiko.
Proceduren er fælles for alle LLM-harnesses. Adapteren bestemmer kun, hvordan
kommandoen køres, og hvordan filer læses.

## Trigger

Kør når brugeren beder om en samarbejds-, parallel-write-, ejerskabs- eller
kollisionskontrol. Proceduren er ikke løbende overvågning og har ingen kadence.

## Tilstande

| Tilstand | Betydning |
| --- | --- |
| `audit` | standard. Deterministisk live-audit, read-only |
| `test` | rutes til `eval` med målet `write-contract` |

En ukendt tilstand er en fejl. Fald aldrig lydløst tilbage til `audit`.

## Fase 1: Audit

Kør den deterministiske audit i `heinrich/tools/collaboration-audit.mjs` mod
Work-roden og læs dens strukturerede output.

Rapportér resultatet i tre sektioner med de konkrete stier eller tal, scriptet
returnerer:

```markdown
### Skal fixes
### Kan ikke verificeres
### Bestået
```

Bevisgrænsen er hård:

- `FAIL` kræver en mekanisk demonstreret overtrædelse.
- Dirty filer alene beviser hverken ejerskab eller manglende autorisation.
  Rapportér det som `Kan ikke verificeres`.
- Forskellige dirty projektsatellitter er tilladt og er ikke en kollision,
  blot fordi de findes samtidig.

Første gennemløb er strengt read-only. Kontrakter, opgaver, changelog,
rapporter og kildefiler ændres ikke under undersøgelsen. Er en rettelse
nødvendig, vises de præcise foreslåede destinationer, og der ventes på separat
godkendelse.

Når kontrollen gælder et konkret samarbejdsrum, læses også
`_collaboration/README.md` og rummets `ROOM.md`:

- status `implementing` kræver navngiven implementør, en anden navngiven
  tester samt reserverede overleverings- og testfiler;
- implementøren må ikke skrive testerens fil eller erklære sin egen
  implementering uafhængigt bestået;
- status `archived` kræver implementeringsoverlevering og en testfil med
  samlet `PASS`, eller en præcist dokumenteret undtagelse godkendt af brugeren;
- `FAIL` og `BLOCKED` må ikke behandles som afslutning.

Test den faktiske destination og brugersti; tilstedeværelsen af en
overleveringsfil alene er ikke bevis for korrekt implementering.

## Fase 2: Test

Følg `eval` og vælg kun målet `write-contract`.

- Rapportér Codex og Claude hver for sig. Ét harness' resultat er aldrig bevis
  for det andet.
- Er en isoleret runner eller en uafhængig grader utilgængelig for et harness,
  markeres det `BLOCKED`. Erstat aldrig med en selvtest eller en kørsel mod den
  levende hjerne.
- Deterministiske Node-tests må validere fixtures og auditmekanik, men de er
  ikke adfærdsbevis for noget harness.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Strukturel kontrol af hjernen: `mothership-check`.
- Kodekvalitet i projekter.
- Automation, hooks, låsefiler, ejerskabslogs eller modelregistre. Ingen af
  dem må opstå som sideeffekt.
- Backup, commit, push, deploy eller eksterne handlinger.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

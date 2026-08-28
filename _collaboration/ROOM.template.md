---
status: active
created: <YYYY-MM-DD>
brief_owner: <Claude|Codex>
reviewer: <Codex|Claude>
next_actor: <Claude|Codex|bruger>
review_round: 1
brief: 01-<EJER>-BRIEF.md
expected_response: 02-<REVIEWER>-RESPONSE.md
implementation_authorized: false
implementer: null
independent_tester: null
user_request: "<det brugeren faktisk bad om, ordret>"
---

# <Rummets emne>

> Skabelon. Kopiér til `_collaboration/<YYYY-MM-DD>-<emne-slug>/ROOM.md` og
> udfyld. Slet denne blok.
>
> Tilladte `status`: `active`, `awaiting-review`, `awaiting-synthesis`,
> `awaiting-user`, `implementing`, `blocked`, `archived`.
> `blocked` skal navngive blokering, næste aktør og genoptagelsesbetingelse.
> `archived` er den eneste terminale status og må kun findes under `_archive/`.

## Konkret spørgsmål

Ét spørgsmål. Kan det ikke formuleres som ét, er rummet ikke afgrænset nok.

## Slutprodukt

Hvad der konkret skal ligge, når rummet lukkes.

## Berørte områder og læsekilder

Præcise stier reviewer skal læse. Navngiv også hvad der **ikke** må læses.

## Scope og skriveejerskab

- Denne runde må kun skrive i `_collaboration/<rum>/`.
- <Ejer> ejer `ROOM.md`, briefet og senere egne filer.
- <Reviewer> ejer sin svarfil og senere egne filer.
- Ingen redigerer en anden assistents arbejdsfil.

## Accepterede præmisser

Det der ikke skal diskuteres i denne runde.

## Punkter der skal udfordres

Det reviewer udtrykkeligt skal angribe. Uden denne sektion får du bekræftelse
frem for modspil.

## Acceptkriterier

Hvornår er svaret godt nok. Tag evidenskravet med: uenigheder skal dokumenteres
med bevis, og fravær af evidens skal markeres eksplicit.

## Stopkriterium

Højst to reviewrunder. Derefter leverer brief-ejeren enten én fælles anbefaling
eller én præcis restuenighed. **Uenighed er et gyldigt slutprodukt.**

## Forventede kanoniske destinationer

Hvor konklusionen skal hen bagefter. Intet er reserveret til skrivning, før
brugeren har godkendt implementeringen.

## Næste handling

Hvem gør hvad nu.

---

## Filnavngivning

`NN-AKTØR-STADIE.md`, én fil pr. skriver pr. stadie:

```text
01-CODEX-BRIEF.md
02-CLAUDE-RESPONSE.md
03-CODEX-REVIEW.md
04-CLAUDE-CONFIRMATION.md
05-USER-DECISION.md
06-CODEX-IMPLEMENTATION-HANDOFF.md
07-CLAUDE-VERIFICATION.md
99-JOINT-RECOMMENDATION.md
```

Den der implementerer, må ikke være den der uafhængigt tester. Testeren skriver
`PASS`, `FAIL` eller `BLOCKED` med evidens.

Rummet arkiveres først efter et uafhængigt `PASS` — flyttet **intakt** til
`_archive/<år>/<rum>/`, aldrig slettet.

---
type: guide
summary: "Dual harness, kernekontrakten og den mekaniske paritetskontrol."
state: canonical
tags: [heinrich, docs, adapter, kontrakt]
---

# Adaptere og kernekontrakten

## Problemet

To harness. Hvert auto-loader kun sin egen fil: Claude Code læser `CLAUDE.md`,
Codex læser `AGENTS.md`.

De regler der må gælde, uanset hvilket værktøj der kører, skal derfor stå **i
begge filer**. Og så opstår problemet: to kopier driver fra hinanden. Nogen
retter den ene og glemmer den anden, og derefter opfører assistenten sig
forskelligt afhængigt af hvad du åbnede.

## Løsningen

Én kanonisk ejer, to markerede runtime-kopier, og en kontrol der fejler ved drift.

Den kanoniske ejer er:

```text
heinrich/agent_brain/understanding/standards/assistant-core-contract.md
```

Fire blokke er markeret i alle tre filer:

| Blok | Dækker |
| --- | --- |
| `security` | Eksterne handlinger, hooks, credentials, hvad et klik ikke betyder |
| `quality` | Verifikation, hvornår noget må kaldes bekræftet, mekaniske kontroller |
| `privacy` | Adskillelse af domæner, private noter |
| `collaboration` | Skriveejerskab, parallelt arbejde, preflight før writes |

Hver blok er indrammet:

```markdown
<!-- adapter-parity
block: security
role: canonical
-->
## Sikkerhed og eksterne handlinger
...
<!-- /adapter-parity -->
```

Kopierne bærer `role: copy` og et `synced`-felt, der skal matche kontraktens
`updated`.

## Kontrollen

```bash
node heinrich/tools/adapter-parity.mjs
```

Den fejler hvis en blok mangler, hvis indholdet afviger ordret, hvis der er
dubletter, eller hvis `synced` er forældet. Den er read-only og retter aldrig
noget selv.

`.githooks/pre-commit` kører den ved hver commit — men kun når hooks er
aktiveret:

```bash
git config --local core.hooksPath .githooks
```

**Git kører ikke hooks uden kørselsflag.** Er `pre-commit` committet uden det,
er hooken tavst inaktiv. Kontrollér med `git ls-files -s .githooks/pre-commit` —
den skal vise `100755`, ikke `100644`.

## Sådan ændrer du en fælles regel

1. Ret den i kernekontrakten.
2. Kopiér den ordret til begge entrypoints.
3. Sæt `synced` i begge kopier til kontraktens `updated`.
4. Kør kontrollen.

Alle fire trin i samme omgang. Halvvejs er værre end ikke begyndt, fordi de to
harness så er uenige uden at nogen opdager det.

## Hvad der ikke hører til i blokkene

Harness-specifik adfærd. Hvordan skills registreres, hvordan hooks konfigureres,
hvilke værktøjer der findes — det er forskelligt, og det skal ligge uden for.

Kun regler der skal gælde ens begge steder hører i en blok.

## Grænsen mellem lagene

`heinrich/.claude/` og `heinrich/.Codex/` er harness-lag. Fra det ene harness er
det andets lag **read-only**, medmindre du eksplicit beder om en adapterændring.

Grunden er enkel: en assistent der frit må omskrive det andet harness'
grundregler, kan fjerne præcis de spærringer der skulle begrænse den.

## Kontrollens grænse

Paritetskontrollen ser i dag kun de fire blokke i de to entrypoints. Den beviser
**ikke** at constitution-filerne, hook-listerne eller de 11 skillfamilier er i
sync på tværs af de to harness.

De overflader kontrolleres af `skill-inventory.mjs` og `collaboration-audit.mjs`,
og resten er stadig et menneskeansvar. Antag ikke at en grøn paritetskontrol
betyder at alt er ens.

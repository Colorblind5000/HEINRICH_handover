---
type: knowledge
summary: "Fælles read-only-first kontrol af mothershipets struktur, aktive projekter, dokumentationsdrift, adapterdrift og ejerskab."
state: stable
updated: 2026-08-22
tags: [playbook, heinrich, maintenance]
---

# Mothership-check

## Formål

Find strukturel drift uden at skabe ny viden eller omskrive hjernen automatisk.
Proceduren er fælles for alle LLM-harnesses. Adapteren bestemmer kun, hvordan
filer læses og ændres.

## Trigger

Kør kun når brugeren eksplicit beder om et mothership-check, en strukturel
hjernekontrol, adapterdrift eller en kontrol af bridge/satellit-sammenhængen.
Ingen fast kadence og ingen automatisk afslutningsrutine.

## Fase 1: Kontrol, altid read-only

Kontrollér kun:

1. **Front door:** `mothership.md`, `projects.base`, `opgaver.base` og de
   kanoniske arkitektur-/bridge-regler findes og peger på gyldige mål.
2. **Aktive bridges:** påkrævet frontmatter, gyldig satellitsti, `lifecycle`,
   kort resumé og højst én konkret `next_action`.
3. **Opgaver:** højst én `in_progress`; projektslug matcher en bridge; ingen
   åben opgave peger på et manglende projekt; påkrævet frontmatter findes.
4. **Aktive links:** døde wikilinks i mothership, `_index`, aktive bridges og
   deres åbne tasks. Arkivet scannes ikke kosmetisk.
5. **Ejerskab:** bridge og satellittens `CONTEXT.md`, ADR eller ejerfil må ikke
   hævde forskellige aktuelle mål, statusser eller næste handlinger.
6. **Adapterdrift:**
   - kør den read-only parity-kontrol i
     `heinrich/tools/adapter-parity.mjs`; rapportér enhver forskel i de
     markerede fælles blokke, metadata eller synkroniseringsdato;
   - aktive Codex- og Claude-adaptere må ikke pege på pensionerede skills eller
     slettede mapper;
   - rapportér en mulig semantisk drift, når en platformneutral, load-bearing
     regel kun findes i én adapter eller ligger uden for den neutrale
     kernekontrakt;
   - behandl ikke harness-specifik routing, værktøjsbrug eller syntaks som
     drift alene, fordi adapterne er forskellige.
7. **Aktiv dokumentation:** konkrete stier, skill-navne og aktive workflows i
   constitution, guides og dokumentation skal eksistere og matche deres
   kanoniske ejer. Kontrollér kun dokumenter, der beskriver den nuværende
   arkitektur. Kræv ikke, at et indeks oplister alle filer, og brug ikke antal
   skills eller links som kvalitetsmål.

Læs aldrig `agent_brain/inbox.md`. Undersøg ikke private kilder, credentials,
projektkodekvalitet, gamle artifacts eller arkivindhold, medmindre brugeren
eksplicit udvider kontrollens scope.

## Rapport

Returnér kun:

```markdown
## Mothership-check

### Skal fixes
- [konkret brud + fil]

### Skal afklares
- [reel konflikt eller manglende beslutning]

### Ser sundt ud
- [kort bekræftelse af kontrollerne]
```

Ingen findings betyder én kort linje. Gem ikke en rapportfil automatisk.

## Fase 2: Rettelser, kun efter godkendelse

Vis den præcise liste over foreslåede filændringer og vent på brugerens
godkendelse. Derefter:

- brug én skriver;
- ret kun de godkendte findings;
- genkør de berørte kontroller;
- skriv én changelog-entry, hvis varige brain-filer blev ændret.

Read-only kontroller må paralleliseres, hvis harnesset understøtter det.
Skrivende arbejde må aldrig paralleliseres.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Sessionslæring: `$learn` eller den tilsvarende adapter.
- Nye tasks: `$create-task` eller den tilsvarende adapter.
- Nye hubs, mønstre, syntese eller statusrapporter.
- Git-status, backup- eller push-alder.
- Linkmængde, `Related`-sektioner eller forældreløse noter som generel score.
- Gamle råfiler, arkivindhold eller eksempel-projekt-rester uden en aktiv reference.
- Automatisk promovering fra `needs-review` til `stable`.
- Backup, commit, push, deploy eller eksterne handlinger.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

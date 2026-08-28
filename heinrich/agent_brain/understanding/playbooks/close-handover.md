---
type: knowledge
summary: "Fælles procedure for at lukke én aktiv handover-pointer, når opgaven er færdig, opgivet eller administrativt afsluttet, uden at røre uforanderlig historik."
state: stable
updated: 2026-08-23
tags: [playbook, heinrich, kontinuitet]
---

# Close-handover

## Formål

Fjern en færdig eller opgivet opgave fra `resume-handover`s aktive kandidater
uden at slette dens historik. Proceduren er fælles for alle LLM-harnesses.
Adapteren bestemmer kun, hvordan rod og filer opløses og skrives.

Handoverdokumenter er midlertidig opgavetilstand. Lukningen ændrer kun
pointeren, aldrig historikken.

## Trigger

Kør når brugeren eksplicit beder om at lukke, afslutte eller annullere en
handover.

Er færdiggørelsen kun udledt af arbejdet, tilbyd at lukke og vent på
godkendelse. At ændre en pointer er en write, ikke en oprydning.

## Fase 1: Vælg pointer

1. Navngiver brugeren et slug, vælges præcis `latest-<slug>.md`.
2. Ellers inspiceres kun `latest-*.md`. `status: in-progress` er aktiv. En
   manglende eller ukendt status er malformet, ikke aktiv.
3. Findes præcis én aktiv pointer, vælges den. Findes flere, vises op til fem
   nummererede valg med opgavenavn og oprettelsestidspunkt, og der ventes på
   brugerens valg, før noget skrives.
4. Findes ingen, rapportér at der ikke er nogen aktiv opgavespecifik handover,
   og stop. Den historiske globale `latest.md` ændres aldrig implicit.

## Fase 2: Luk pointeren

Genlæs den valgte fil umiddelbart før redigering og følg den fælles preflight
for ejerskab af dirty filer.

- Kræv `status: in-progress`. En terminal status er en no-op.
- Sæt `status` efter brugerens hensigt: `done` ved færdigt arbejde, `cancelled` ved
  opgivet arbejde, `closed` ved en generisk administrativ lukning.
- Tilføj `closed_at: YYYY-MM-DD HH:MM` i Europe/Copenhagen.
- Bevar `created`, hele brødteksten og alle øvrige frontmatterfelter.
- Ændr kun den valgte opgavespecifikke pointer.

## Fase 3: Rapportér

Returnér pointeren, den terminale status og at den uforanderlige historik
består. Ikke mere.

## Grænser

- Tidsstemplet historik hverken oprettes, redigeres eller slettes her.
- Ingen filer fjernes. Proceduren rydder ikke op.
- Den globale changelog opdateres ikke for denne midlertidige
  livscyklusændring.
- En genåbning kræver en eksplicit anmodning fra brugeren og en ny `handover`. En
  terminal pointer genåbnes aldrig lydløst.

## Efter kørsel

Sæt tidsstempel på `heinrich/artifacts/.last-learn` (opret filen hvis den ikke
findes). `pre-compact`-hooken læser markøren: er den yngre end 30 minutter,
tier påmindelsen om at bevare viden, fordi det netop er sket.

Uden dette trin har markøren ingen producent, og påmindelsen kan aldrig blive
stille.

## Ikke denne procedures ansvar

- Skrivning af handovers: `handover`.
- Genoptagelse: `resume-handover`.
- Varig viden: `learn`.
- Opgavesystemet: `create-task`.
- Backup, commit, push, deploy eller eksterne handlinger.

> Kilde: kitbeslutning. Adfærden vedligeholdes her som den harness-neutrale kontrakt.

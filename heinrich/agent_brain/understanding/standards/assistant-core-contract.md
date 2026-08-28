---
type: standard
summary: "Neutral kanonisk ejer for load-bearing regler, som skal være ens i HEINRICHs Codex- og Claude-entrypoints."
state: canonical
updated: 2026-08-22
tags: [heinrich, adapter, sikkerhed, kvalitet, privatliv, samarbejde]
---

# Assistant core contract

Denne fil er den kanoniske ejer for de markerede fælles runtime-regler i
root-`AGENTS.md` og root-`CLAUDE.md`. Kontrakten vinder ved enhver uenighed.

Reglerne står fortsat ordret i begge entrypoints, fordi de skal være til stede,
når hver harness auto-loader sin egen fil. Harness-specifik adfærd ligger uden
for blokkene.

Efter enhver ændring opdateres kontrakten og begge runtime-kopier i samme tur,
deres `synced` sættes til kontraktens `updated`, og denne kontrol køres:

```powershell
node heinrich/tools/adapter-parity.mjs
```

Kontrollen er read-only og skriver aldrig kopierne. Pre-commit-hooken er et
ekstra sikkerhedsnet, ikke den eneste trigger.

## Fælles blokke

<!-- adapter-parity
block: security
role: canonical
-->
## Sikkerhed og eksterne handlinger

- Kør eller tilbyd ikke backup, push eller deploy som rutinemæssig afslutning.
  Gør det kun, når brugeren eksplicit beder om den konkrete handling.
- Skriv aldrig i hooks eller i den kanoniske liste over beskyttede stier.
  Lever en foreslået ændring som færdig tekst med filnavn og placering, så
  brugeren selv kan indsætte den. Skriveadgang til det, der håndhæver reglerne,
  gør ét uheld permanent.
- En værktøjsgodkendelse autoriserer kun den konkrete handling i prompten.\n  Den udvider aldrig opgavens scope; ny eller bredere handling kræver sin egen\n  tydelige autorisation.
- Credentials må gemmes, når brugeren eksplicit beder om det. Brug kun en lokal
  secret-fil som `.secrets/...` eller projektets `.env.local`, verificér før
  skrivning at filen er udelukket fra Git, og gengiv aldrig værdien i
  `agent_brain`, en LLM-hukommelse, changelog eller chat.
<!-- /adapter-parity -->

<!-- adapter-parity
block: quality
role: canonical
-->
## Kvalitet og verifikation

- Bekræft den konkrete projektsti, før en app åbnes, previewes eller ændres.
  Udled aldrig målprojektet alene fra et løst navn.
- Kald først noget verificeret, når kontrollen følger den brugersti og det
  synlige resultat brugeren faktisk anvender. Et internt API eller mellemresultat
  er ikke alene bevis for slutresultatet.
- Når en gentagelig, tavs og maskinelt målbar fejl rettes, tilføj en mekanisk
  kontrol der fanger samme fejlklasse. Visuelle smagsdomme kræver stadig
  visuel kontrol; opfind ikke en falsk automatisk måling.
- Når én kilde leverer til flere mål, skal hvert mål læse direkte fra kilden.
  Byg ikke kæder hvor ét afledt mål bliver kilde for et andet.
<!-- /adapter-parity -->

<!-- adapter-parity
block: privacy
role: canonical
-->
## Privatliv vs. arbejde

Hård opdeling — aldrig bland de to domæner. Spørg hvis noget hører til begge.

`./heinrich/agent_brain/inbox.md` er brugerens private notesblok. Læs, søg,
fortolk, surface eller brug aldrig indholdet uden en eksplicit anmodning fra
Brugeren om netop indbakken eller en bestemt note. Reglen gælder også, hvis
indholdet optræder i et screenshot eller indsættes som eksempel i en chat.
<!-- /adapter-parity -->

<!-- adapter-parity
block: collaboration
role: canonical
-->
## Skriveejerskab og parallelt arbejde

- En projektopgave skriver kun i sin aftalte satellit, sine konkrete målfiler
  og projektets bridge. Projektindhold i bridgen må opdateres; ændringer i
  lifecycle, bridge-schema, mothershipets arkitektur, root-adaptere,
  kernekontrakten eller fælles skills kræver en eksplicit opgave fra brugeren.
- Parallelt arbejde er tilladt, når projekter og konkrete filer ikke
  overlapper. Ved filoverlap er én model skriver; andre er read-only reviewers,
  indtil ejerskabet overdrages eksplicit og skriftligt.
- Task-kort følger deres projektscope, ikke placering eller en bestemt model. Oprettelse,
  redigering og afslutning følger samme ejerskabs- og preflightregler som andre
  writes. Tasks med `project: heinrich` eller uden entydigt projektscope kræver
  en eksplicit opgave. Højst én task må globalt være `in_progress`.
- Før første write i en målfil: kør `git status --short -- <målfil>`, og
  inspicér relevante staged eller unstaged diffs. En eksisterende dirty eller untracked
  målfil ændres kun, når ændringen tilhører den aktuelle opgave eller er
  eksplicit overdraget. Genlæs filen før hver edit; tving aldrig en patch
  igennem, hvis konteksten har ændret sig.
- Ved en ukendt eller overlappende ændring stoppes arbejdet på de berørte filer;
  ikke-overlappende arbejde kan fortsætte. Orientér brugeren med fil og fund. Skriv
  kun en koordineringsnote i en fil, du allerede ejer. Tavshed, alder og commits
  overdrager ikke ejerskab.
- Fælles filer genlæses umiddelbart før en afgrænset, kontekstfølsom edit, og
  fremmede entries bevares. Git og worktrees er sikkerhedsnet, ikke ejerskab.
  Ingen låsefil i v1.
<!-- /adapter-parity -->

## Runtime-kopier

- `Work/AGENTS.md` — Codex-entrypoint.
- `Work/CLAUDE.md` — Claude-entrypoint.

De markerede blokke skal matche denne fil ordret. `derives_from` og `synced`
ligger i HTML-kommentarer, så entrypoints forbliver almindelige Markdown-filer
uden ny frontmatter-kontrakt.

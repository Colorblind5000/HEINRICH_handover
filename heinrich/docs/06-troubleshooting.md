---
type: guide
summary: "Symptomer, årsager og kontroller når setuppet ikke opfører sig som forventet."
state: canonical
tags: [heinrich, docs, fejlfinding]
---

# Fejlfinding

## Assistenten kender ikke sit navn

`identity.md` er ikke renderet endnu. Kør `/onboard configure`.

Er den renderet, men indholdet ser forkert ud, så kontrollér at du åbnede
**repo-roden**. Begge harness auto-loader kun entrypointet i den mappe, der er
åbnet.

## Paritetskontrollen fejler

```bash
node heinrich/tools/adapter-parity.mjs
```

| Fejl | Årsag |
| --- | --- |
| Blok mangler | En markør er slettet eller stavet forkert |
| Indhold afviger | En kopi er rettet uden den anden |
| `synced` forældet | Kontrakten er opdateret, kopiernes `synced` ikke |
| Dublet | Samme `block:` optræder to gange i samme fil |

Ret altid i kernekontrakten først, kopiér derefter ordret til begge entrypoints.
Se [03-adapters](03-adapters.md).

## Hooken kører ikke ved commit

Tre ting skal være opfyldt. Kontrollér i rækkefølge:

```bash
git config --local core.hooksPath
git ls-files -s .githooks/pre-commit
node --version
```

Hooks-stien skal være `.githooks`. Filen skal stå som `100755` — er den `100644`,
mangler kørselsflaget, og **Git springer hooken over uden at sige noget**. Node
skal være på PATH.

Sæt kørselsflaget med:

```bash
git update-index --chmod=+x .githooks/pre-commit
```

## Setuppet siger DEGRADED

Node blev ikke fundet. De mekaniske kontroller er slået fra, men resten virker.
Installér Node og kør `/onboard status` igen.

Det er med vilje, at manglende Node ikke blokerer dine commits. En kontrol der
gør arbejdet umuligt bliver slået fra og kommer aldrig tilbage.

## To assistenter har skrevet i samme fil

```bash
/collaboration-check
```

Grundreglen: ved filoverlap er **én** model skriver, resten er read-only, indtil
ejerskabet er overdraget eksplicit og skriftligt.

Tavshed, alder og commits overdrager ikke ejerskab. Er skaden sket, så stop
arbejdet på de berørte filer — ikke på alt — og afklar ejerskabet først.

## En skill udløses ikke

Beskrivelsen er for vag. Den afgør hvornår skillen vælges, så den skal nævne de
konkrete situationer og formuleringer der skal udløse den.

Kontrollér også at den findes i det harness du kører:

```bash
node heinrich/tools/skill-inventory.mjs
```

## En skill opfører sig forskelligt i de to harness

Logikken ligger i skillen frem for i den fælles playbook. Flyt den til
`agent_brain/understanding/playbooks/` og gør begge skills til tynde indpakninger.

Det er den hyppigste årsag til drift mellem de to harness.

## Assistenten finder ikke noget, den burde vide

Søg i `agent_brain/` frem for at gætte. Er viden der ikke, blev den aldrig
skrevet ned — en samtale er ikke en kilde.

Er den der, men ikke fundet, mangler der som regel et link fra det sted man ville
kigge først. Emne-hubs i `references/` er navigation; de ejer ikke svaret.

## Assistenten er for medgørlig

Skru op for push-back i `conversation-style.md`. Sat lavt får du medhold; sat
højt får du modstand med evidens — og besked når evidensen mangler.

## Noget blev slettet

Handover-historik er uforanderlig og slettes aldrig, kun lukket.
`/delete-project` er den eneste destruktive skill, og den kræver en read-only
forhåndsvisning og en eksplicit bekræftelse.

Er noget andet forsvundet, så tjek din git-historik. Det er derfor setuppet lever
i et repo.

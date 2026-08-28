---
type: guide
summary: "Tilpasning af setuppet efter den første opsætning."
state: canonical
tags: [heinrich, docs, tilpasning]
---

# Tilpasning

## Hvad onboarding ejer

Onboarding renderer en håndfuld filer fra din profil. De er **generator-ejede**:

| Fil | Indhold |
| --- | --- |
| `constitution/identity.md` | Navn, mission, personlighed |
| `constitution/conversation-style.md` | Hvordan assistenten taler til dig |
| `constitution/guide.md` | Indeks over resten af constitution |
| `constitution/config.yaml` | Runtime-flag |
| `constitution/communications.md` | Regler for udadgående kommunikation |
| `constitution/training-wheels.md` | Midlertidig støtte under indkøringen |
| `constitution/writing.md` | Skriveprincipper |

Hver findes i **begge** harness og renderes uafhængigt fra samme profil. Den ene
er aldrig kilde for den anden.

Du må gerne rette dem i hånden. Kører du `$onboard` igen, opdager den at filen er
ændret, viser forskellen og stopper — i stedet for at overskrive dit arbejde.

Vil du hellere ændre grundlaget, så ret profilen og kør onboarding igen.

## Hvad du selv ejer

Alt andet. Hjernen, projekterne, opgaverne, dine egne skills og
samarbejdsrummene bliver aldrig rørt af en generator.

## Tone og modspil

Personligheden bor i `identity.md` og `conversation-style.md`.

Det felt der betyder mest i praksis er **push-back**: hvor hårdt assistenten skal
gå imod dig. Sat lavt får du medhold. Sat højt får du modstand med evidens — og
en eksplicit markering når evidensen mangler.

Vil du have en assistent der fanger dine fejl, skal den have lov til at sige fra.

## Sprog

Dokumentationen i dette repo er dansk. Samtalesproget er dit valg, og de to
behøver ikke være ens.

Vær opmærksom på at de medfølgende playbooks og standarder er skrevet på dansk.
Vælger du et andet samtalesprog, vil assistenten læse dansk og svare dig på dit
sprog.

## Beskyttede filer

Nogle filer er så load-bearing at en tilfældig redigering kan tage spærringer ud
af drift. De står i en maskinlæsbar liste, som begge harnessers hooks læser:

```text
heinrich/config/protected-paths.json
```

`agent_brain/_protected.md` er den menneskelige visning af samme liste.

Vil du redigere en beskyttet fil, kræver det en bevidst handling — ikke fordi
filen er hellig, men fordi en utilsigtet ændring dér ikke opdages af sig selv.

Tilføj gerne dine egne filer til listen. Fjern kun noget hvis du ved præcis hvad
spærringen beskyttede.

## Skills

Ændrer du en systemskill, så ændr den i **begge** harness, og læg den fælles
logik i playbooken frem for i skillen. Ellers driver de to udgaver fra hinanden.

```bash
node heinrich/tools/skill-inventory.mjs
```

## Obsidian

`projects.base` og `opgaver.base` er Obsidian-visninger, og
`heinrich/mothership.md` er indgangen. Bruger du ikke Obsidian, kan de ignoreres
— hjernen er almindelige Markdown-filer.

## Hooks

Hooks ligger i `.claude/` og `.codex/` med en fælles kerne. De håndhæver
beskyttede stier og kører paritetskontrollen ved commit.

Slår du dem fra, mister du de mekaniske kontroller — ikke funktionaliteten.
Setuppet virker stadig, men det opdager ikke længere sine egne fejl.

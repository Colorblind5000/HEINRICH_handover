---
type: guide
summary: "Installation og første kørsel af HEINRICH-setuppet."
state: canonical
tags: [heinrich, docs, onboarding]
---

# Start her

Denne guide tager dig fra et klonet repo til et fungerende setup.

## 1. Forudsætninger

**Node på PATH** er det eneste hårde krav:

```bash
node --version
```

Node driver tre ting: onboarding, kontrollen der håndhæver kernekontrakten, og
commit-hooken. Mangler Node, kører setuppet videre i en `DEGRADED`-tilstand hvor
kontrollerne ikke håndhæves. Onboarding siger det tydeligt og giver dig den
præcise kommando til at aktivere dem senere. Den installerer aldrig noget selv.

**Claude Code eller Codex** — eller begge. Setuppet virker med ét harness; begge
giver adgang til samarbejdsrummet.

**Et nyt, tomt og privat Git-repository** under din egen konto, hvis du ønsker
Git. Onboarding kan gemme det som `origin` med det samme. Vælger du Git fra,
fortsætter den kun, når ingen ekstern remote er tilkoblet.

**[Obsidian Desktop](https://obsidian.md/download)** er det visuelle arbejdsrum
for mothershipet, hjernen og projektnoterne. Installér også pluginet
**[Minimal Hidden Files](https://github.com/viggomeesters/obsidian-minimal-hidden-files)**,
så Obsidian kan vise sikre filer og mapper der begynder med punktum, blandt
andet `.agents/`, `.claude/` og `.codex/`. Pluginet installeres indtil videre
via instruktionen på GitHub, ikke fra Obsidian Community-kataloget.

## 2. Kør onboarding

Åbn repo-roden i Codex og kør:

```text
$onboard
```

Claude Code får sin egen tynde `/onboard`-adapter separat. Begge adaptere skal
bruge den samme motor og profil; ingen af dem må have sin egen generatorlogik.

Onboarding har fire modes, som den normalt kører i rækkefølge:

| Mode | Gør |
| --- | --- |
| `status` | Læser kun. Finder ud af hvad der allerede er sat op |
| `explain` | Forklarer setuppet. Stiller ingen spørgsmål |
| `configure` | Spørger om det der ændrer filer, og skriver dem |
| `git` | Kobler dit eget repo på |

Første kørsel har to trin. I trin 1 introducerer HEINRICH systemet kort og
spørger, om du vil tilknytte et nyt privat Git-repository. Ved ja gemmes dit
link som `origin`; ved nej kontrolleres det, at ingen remote er tilkoblet. Først
derefter går trin 2 direkte til installation af Obsidian og Minimal Hidden
Files samt åbning af HEINRICH-mappen som vault — uden at gentage
systemforklaringen.
Onboarding stopper uden ændringer efter hvert trin. Når du vender tilbage og
skriver `klar`, vises de tre valg direkte uden endnu en systemforklaring: få
mere forklaring, gennemgå de 11 fælles core skills eller start
opsætningen. Den detaljerede systemgennemgang vises kun, hvis du vælger den.
Core-skill-gennemgangen ændrer ingen filer. En manglende profil er normal
første-gangstilstand — ikke en fejl.

### Skills

- Core skills ligger i mothershipet og giver fælles arbejdsgange på tværs.
- Projektskills bliver i projektet og indeholder kun lokal viden.
- Kan en skill genbruges på tværs, er den core. Ellers er den lokal.

Det holder mothershipet slankt og forhindrer kontekstlæk mellem projekter.

Du kan køre en enkelt mode direkte, fx `$onboard explain`, hvis du bare vil
forstå strukturen uden at ændre noget.

## 3. Hvad du bliver spurgt om

Kun spørgsmål hvor svaret ændrer en fil:

- hvad du vil kaldes
- hvad assistenten skal hedde
- hvilken tone den skal have, og hvor hårdt den skal give modspil
- om den kun må røre arbejde, eller også private ting
- sprog, tidszone, datoformat og arbejdsuge

Du bliver **ikke** spurgt om arkitekturen, opgaveformatet eller
samarbejdskontrakten. Det er kittets kontrakter — de bliver forklaret, ikke
forhandlet.

## 4. Git

Onboarding finder selv ud af hvilken situation du er i:

| Situation | Hvad der sker |
| --- | --- |
| Ikke et git-repo endnu | Forklarer `git init` og kører det kun hvis du siger ja |
| Repo uden remote | Tilføjer kun dit nye `origin`, hvis du vælger ja |
| Repo med remote | Overskriver aldrig; forbindelsen skal fjernes med godkendelse først |
| Du vælger Git fra | Fortsætter kun når der ikke findes eksterne remotes |
| Remote peger på selve skabelonen | Pusher aldrig til den |

Før første commit tilbyder onboarding at sætte repoets eget `user.name` og
`user.email`. Det ændrer ikke din globale Git-identitet.

Commit og push er **to adskilte spørgsmål**. Et ja til at gemme er ikke et ja
til at sende noget ud.

Overvej at gøre dit eget repo **privat**. Hjernen kommer til at indeholde dine
noter, dine projekter og dine beslutninger.

## 5. Bagefter

Onboarding tilbyder at aktivere commit-hooken. Den gør det kun efter din
separate godkendelse. Du kan altid gøre det selv:

```bash
git config --local core.hooksPath .githooks
```

Kontrollér at kernekontrakten er intakt:

```bash
node heinrich/tools/adapter-parity.mjs
```

Så er du klar. Start gerne med et testprojekt: skriv `Opret et testprojekt`,
eller kør `$create-project` i Codex.

Når den ene assistent har skrevet briefet, går du til den anden og skriver den
relevante sætning:

```text
Der ligger et brief fra Codex.
```

eller:

```text
Der ligger et brief fra Claude.
```

Det aktiverer samarbejdsrummet.

## Kør den igen

`$onboard` er idempotent. Den overskriver kun sine egne genererede filer, og kun
hvis du ikke selv har rettet dem. Har du redigeret en genereret fil, viser den
forskellen og stopper i stedet for at trampe hen over dit arbejde.

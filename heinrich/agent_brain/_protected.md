---
type: standard
summary: "Menneskelig visning af de beskyttede filer. Kilden er heinrich/config/protected-paths.json."
state: canonical
tags: [heinrich, sikkerhed, hooks]
---

# Beskyttede filer

> **Denne fil er en visning, ikke kilden.** Den maskinlæsbare liste er
> `heinrich/config/protected-paths.json`, og det er den, begge harnessers hooks
> læser. Tilføj eller fjern altid i JSON-filen først, og opdatér derefter denne
> visning.
>
> Grunden til opdelingen: hvis hooks læste denne fil, ville en tastefejl i en
> Markdown-tabel kunne slå en spærring fra.

## Hvad beskyttelsen gør

En skrivning til en fil på listen bliver **blokeret**, indtil der foreligger en
eksplicit godkendelse. Godkendelsen er en enkelt linje i `.protected-override` i
repo-roden, og den **forbruges ved første brug** — den er ikke et frikort.

Beskyttelse er ikke fredning. Filerne må gerne ændres. Spærringen findes, fordi
en utilsigtet ændring i netop disse filer ikke opdages af sig selv: flere af dem
er præcis de mekanismer, der ellers ville fange fejlen.

## Hvad der er beskyttet

| Fil | Hvorfor |
| --- | --- |
| `CLAUDE.md` | Claude Codes entrypoint. Bærer kontraktblokke i runtime |
| `AGENTS.md` | Codex' entrypoint. Samme rolle |
| `heinrich/CLAUDE.md` | Indre Claude-adapter |
| `heinrich/AGENTS.md` | Indre Codex-adapter |
| `heinrich/agent_brain/understanding/standards/assistant-core-contract.md` | Kanonisk ejer af de fire paritetsblokke |
| `heinrich/.claude/constitution/identity.md` | Assistentens identitet, Claude-side |
| `heinrich/.Codex/constitution/identity.md` | Assistentens identitet, Codex-side |
| `heinrich/.claude/constitution/guide.md` | Constitution-indeks, Claude-side |
| `heinrich/.Codex/constitution/guide.md` | Constitution-indeks, Codex-side |
| `heinrich/.claude/constitution/config.yaml` | Runtime-flag, Claude-side |
| `heinrich/.Codex/constitution/config.yaml` | Runtime-flag, Codex-side |
| `heinrich/agent_brain/_index.md` | Hjernens indgang |
| `heinrich/agent_brain/_protected.md` | Denne visning |
| `heinrich/config/protected-paths.json` | Listen selv |
| `.claude/settings.json` | Hook-konfiguration, Claude |
| `.codex/hooks.json` | Hook-konfiguration, Codex |
| `.githooks/pre-commit` | Kører paritetskontrollen ved commit |
| `heinrich/tools/hooks/protect-paths.mjs` | Selve skrivebeskyttelsen |
| `heinrich/tools/hooks/lib.mjs` | Rodopløsning og udtrækning af mål |
| `heinrich/tools/hooks/pre-compact.mjs` | Automatisk påmindelse før afkortning |
| `heinrich/tools/hooks/daily-focus.mjs` | Automatisk fokusinjektion |
| `heinrich/tools/adapter-parity.mjs` | Håndhæver kernekontraktens paritet |
| `heinrich/config/onboarding.json` | Afgrænser onboardingens profil, targets og remotes |
| `heinrich/tools/onboard.mjs` | Udfører generatorwrites og godkendte Git-handlinger |
| `…/playbooks/onboard.md` | Kanonisk ejer af onboardingens flow, profilspørgsmål og Git-porte |
| `.agents/skills/onboard/SKILL.md` | Codex' onboarding-adapter |
| `.claude/skills/onboard/SKILL.md` | Claudes onboarding-adapter |
| `heinrich/.claude/constitution/identity.md.template` | Generatorinput til Claude-identiteten |
| `heinrich/.Codex/constitution/identity.md.template` | Generatorinput til Codex-identiteten |
| `setup/templates/conversation-style.md.template` | Samtalestil, begge harness |
| `setup/templates/guide-claude.md.template` | Claude-constitutionens indeks |
| `setup/templates/guide-codex.md.template` | Codex-constitutionens indeks |
| `setup/templates/config.yaml.template` | Runtimekonfiguration, begge harness |
| `setup/templates/communications.md.template` | Udadgående kommunikation, begge harness |
| `setup/templates/training-wheels-claude.md.template` | Claude-opstartstips |
| `setup/templates/training-wheels-codex.md.template` | Codex-opstartstips |
| `setup/templates/writing.md.template` | Skriveregler, begge harness |

De nederste poster beskytter håndhævelsen og onboardingens generatorinput.
Uden dem kunne en spærring eller fremtidig runtimefil ændres indirekte ved at
redigere den kode eller template der producerer den.

## Matchning

Stier er **rod-relative og matches eksakt**.

Der er bevidst ingen suffix-matchning. En projektsatellits egen
`.claude/CLAUDE.md` er en anden fil end root-`CLAUDE.md` og skal ikke spærres,
blot fordi navnet er det samme. Suffix-matchning rammer også arbejdskopier og
build-mapper, hvor filen kun deler navn med den beskyttede — en spærring der
udløses på det forkerte grundlag bliver hurtigt en spærring man lærer at
omgå.

## Tilføj dine egne

Skriv en ny post i `protected-paths.json` med `path` og `reason`, og opdatér
tabellen ovenfor. `reason` vises til brugeren, når spærringen udløses — skriv
den, så det fremgår hvad der er på spil.

Fjern kun noget, når du ved præcis hvad spærringen beskyttede.

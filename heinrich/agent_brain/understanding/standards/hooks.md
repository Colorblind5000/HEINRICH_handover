---
type: standard
summary: "Hook-arkitekturen: én kanonisk implementering pr. adfærd, tynde launchers, og hvorfor assistenten ikke selv må ændre spærringerne."
state: canonical
tags: [heinrich, hooks, sikkerhed, arkitektur]
---

# Hooks

## Topologi

Én kanonisk implementering pr. hookadfærd, delt af begge harness:

```text
heinrich/tools/hooks/
├── lib.mjs             rodopløsning, payload-parsing, målfiludtræk
├── protect-paths.mjs   PreToolUse — spærrer beskyttede filer
├── pre-compact.mjs     PreCompact — påmindelse om at bevare viden
└── daily-focus.mjs     UserPromptSubmit — dagens fokus
```

Harnessene leverer **kun** en kommandolinje: `.claude/settings.json` og
`.codex/hooks.json`. Ingen logik i konfigurationen.

**Hvorfor ikke én implementering pr. harness.** To scripts med samme formål
divergerer. En rettelse lander i det ene og ikke i det andet, og derefter
håndhæver de to harness forskellige regler — uden at nogen opdager det, fordi
begge stadig "virker". Divergensen er tavs, og det er den værste slags.

## Rodopløsning

Hooks må aldrig antage, at arbejdsmappen er repo-roden. Sessionen kan være åbnet
i `heinrich/`, i en satellit eller i et nestet repo.

Alle hooks går opad gennem ancestors efter sentinel'en `heinrich/agent_brain`.
Findes den ikke, giver hooken fri — vi er uden for et HEINRICH-repo.

Codex kører hooks med sessionens cwd, så dens launcher udfører samme opgang,
før den kalder Node. Launcheren indeholder **kun** stiopløsning.

Brug aldrig en absolut brugersti eller et løst mappenavnsmatch. Begge går i
stykker, så snart nogen flytter mappen eller åbner den fra et andet sted.

## Spærring af beskyttede filer

Kilden er `heinrich/config/protected-paths.json`. Begge harness læser den
direkte. `agent_brain/_protected.md` er en menneskelig visning og må aldrig
blive en konkurrerende kilde — en tastefejl i en Markdown-tabel skal ikke kunne
slå en spærring fra.

### Eksakt matchning

Stier er rod-relative og matches **eksakt**.

Der er bevidst ingen suffix-matchning. Matcher man på suffix, spærres enhver fil
der blot *ender* på et beskyttet navn: en satellits egen `.claude/CLAUDE.md`, en
arbejdskopi, en build-mappe. En spærring der udløses på forkert grundlag lærer
man at omgå — og så beskytter den ingenting.

### Alle skriveformater skal dækkes

Claude angiver målet i `tool_input.file_path`. Codex' `apply_patch` angiver det
**inde i patchteksten**, og én patch kan ramme flere filer:

```text
*** Update File: sti/til/fil.md
*** Add File: ny.md
*** Delete File: gammel.md
*** Move to: nyt-navn.md
```

Læses kun det ene format, er hele det andet harness' skrivevej ubeskyttet.
Enhver ny skrivevej skal have en regressionstest, før den regnes for dækket.

En testsuite der kun afprøver ét harness giver falsk tryghed: den er grøn,
mens den vigtigste brugersti står åben.

### One-shot override

Blokering ophæves af én linje i `.protected-override` i repo-roden. Linjen
**forbruges ved brug** — den er ikke et frikort.

Rammer en patch flere beskyttede filer, skal **alle** være godkendt. En patch må
ikke slippe halvt igennem på én godkendelse, og en afvist patch må ikke forbruge
de godkendelser der allerede lå.

Filen må aldrig committes. Den er i `.gitignore`.

## Hvad der er beskyttet, og hvorfor

Ud over indholdsfilerne beskytter listen **sig selv og sin egen håndhævelse**:
hook-konfigurationen, hook-implementeringerne, paritetskontrollen og
pathlisten.

Uden det kan en agent ændre koden, som de beskyttede launchers automatisk
eksekverer — og så er spærringen kun beskyttet i navnet.

## Assistentens grænse

En assistent må ikke selv ændre spærringer eller hooks. Den leverer en foreslået
ændring som færdig tekst med filnavn og placering; mennesket indsætter den.

**Skriveadgang gør et uheld permanent.** Den hyppigste angrebsvej mod en agent
er instruktioner gemt i noget, agenten læser. Kan agenten skrive i det, der
håndhæver reglerne, kan én forgiftet kilde slå håndhævelsen fra permanent — og
alle senere sessioner arver den svækkelse uden at vide det.

Prisen er reel: trivielle rettelser i en hook kræver et menneske. Den pris er
mindre end en spærring, der kan fjerne sig selv.

## Degraderet tilstand

Hooks og kontroller kræver Node på PATH. Mangler Node, skal setuppet melde
`DEGRADED` og forklare hvad der ikke håndhæves — men **aldrig blokere arbejdet**.

En kontrol, der gør arbejdet umuligt, bliver slået fra og kommer aldrig tilbage.
En kontrol, der siger tydeligt fra og lader arbejdet fortsætte, bliver aktiveret
igen.

## Test

`heinrich/tools/hooks.test.mjs` kører mod syntetiske fixtures i en midlertidig
mappe — aldrig mod det rigtige repo.

Dækker: spærring, regression mod suffix-matchning, begge harnessers
skriveformater, multi-file patches, one-shot override, delvis godkendelse,
rodopløsning fra undermappe og fejltolerance ved ugyldigt input.

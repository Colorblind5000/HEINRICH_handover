---
type: playbook
summary: "Harness-neutral procedure for førstegangsopsætning af et frisk HEINRICH-kit."
state: canonical
tags: [heinrich, playbook, onboarding, setup]
---

# Onboarding

Kanonisk, harness-neutral procedure. Adapterne i `.claude/skills/onboard/` og
`.agents/skills/onboard/` er tynde indpakninger om denne fil og om motoren
`heinrich/tools/onboard.mjs`.

Motoren ejer **alle** writes, al validering og alle Git-kald. Playbooken ejer
forklaring, spørgsmål og godkendelsesporte. Ingen adapter må indeholde
generatorlogik.

Kommandonavne skrives her uden præfiks. Hvert harness bruger sin egen form:
Claude `/onboard`, Codex `$onboard`.

## Start

1. Find nærmeste ancestor der indeholder `heinrich/agent_brain/`. Det er roden.
2. Kør `node heinrich/tools/onboard.mjs status --json` read-only derfra.
3. Mangler Node: rapportér `DEGRADED`, gengiv Node-kravet fra
   `heinrich/docs/00-start-here.md`, og stop før `configure` og Git.
4. Uden eksplicit mode bruges `status` **tavst** som kontekst. Et ukonfigureret
   kit er den forventede førstegangstilstand — indled aldrig med manglende
   profil eller fejlet verifikation.

## Førstegangsflow

### Trin 1 — System og brugerens eget repository

Introducér kort systemet og dets værdi på dansk:

> Jeg er HEINRICH — et personligt AI-assistent-system skabt af Emil Olsen. Du
> har fået den rene grundstruktur, ikke hans personlige hjerne. Vi kan nu gøre
> den til din.

Tilføj højst to sætninger om at HEINRICH kombinerer et centralt mothership, en
varig hjerne og adskilte projektsatellitter — og at det giver kontinuitet og
overblik på tværs af samtaler og projekter.

Stil derefter ét spørgsmål med to muligheder:

1. **Tilknyt et nyt privat Git-repository** — initialisér lokal Git om
   nødvendigt og gem brugerens repository som `origin`.
2. **Fortsæt uden Git** — fortsæt med nul eksterne remotes.

**Ingen af mulighederne må markeres som anbefalet.**

**Ved ja:** bed om URL'en til et nyt, tomt og privat repository under brugerens
egen konto. Forklar at den gemmes lokalt som `origin` i `.git/config`. Afvis
credentials i URL'en og afvis kit-templatens egen adresse. Vis den redigerede
plan, kør derefter `git-init --apply` hvis nødvendigt og
`git-remote --url <url> --apply`.

Et ja plus URL godkender **kun** disse to reversible lokale handlinger. Det
autoriserer aldrig commit eller push. Verificér med `git-status --json` at
præcis den oplyste URL er eneste `origin`, før du fortsætter.

**Ved nej:** undersøg `git.remotes`. Er den tom, gå direkte til trin 2. Findes
der en remote, forklar at fortsat kørsel ville efterlade et eksternt
repository tilkoblet. Preview `git-disconnect`, indhent eksplicit godkendelse,
kør `git-disconnect --apply`, og verificér at `git.remotes` er tom. Uden
godkendelse eller verifikation: stop før trin 2.

Manglende push-tilladelse er **ikke** det samme som at være afkoblet.

**Ved ja hvor en remote allerede findes:** overskriv den aldrig. Preview
`git-disconnect`, indhent godkendelse, verificér nul remotes, og tilføj først
derefter brugerens nye `origin`.

Proveniensintroduktionen og den korte systemforklaring vises **kun** her.

### Trin 2 — Obsidian

Når Git-valget har nået enten en verificeret `origin` eller en verificeret
no-remote-tilstand, gå direkte til installationen. Introducér **ikke** systemet
igen:

1. [Obsidian](https://obsidian.md/download) — det visuelle arbejdsrum for
   mothership, hjerne og projektnoter.
2. [Minimal Hidden Files](https://github.com/viggomeesters/obsidian-minimal-hidden-files)
   — pluginet der viser sikre mapper og filer med punktum foran, herunder
   `.agents/`, `.claude/` og `.codex/`.

Nævn at pluginet installeres fra sin GitHub-vejledning, da det endnu ikke ligger
i Obsidians Community-katalog. Bed brugeren vende tilbage med `klar`, når
Obsidian og pluginet er installeret, og HEINRICH-mappen er åbnet som vault.

Stop der. Tilbyd ingen andre ruter, stil ingen profilspørgsmål, foretag ingen
ændringer. En klar bekræftelse er nok — forsøg aldrig at inspicere eller styre
brugerens programmer.

Efter bekræftelsen vises de tre ruter fra `explain` **direkte**, uden først at
køre forklaringen. Gentag hverken introduktion, systemforklaring eller
installationskrav.

## Modes

### status

Rapportér kun: fundet profil, generatortilstand, uløste targets, Git-tilstand,
redigerede remotes, hook-tilstand og verifikationsresultat. Ingen ændringer,
ingen opsætningsspørgsmål.

Skeln mellem fravær og ugyldighed. Sig `ikke opsat endnu`, når profilen ikke
findes, og reservér `ugyldig` til en eksisterende profil der fejler validering.
Sig `ikke klar endnu` frem for `fejler`, når verifikation ikke er kørt, fordi
konfigurationen mangler. Opfind aldrig en liste over uløste targets, som
motoren ikke har rapporteret.

### explain

Forklarer uden at ændre filer. Start med `Sådan fungerer HEINRICH:` og gå
direkte til helheden. Gentag aldrig proveniensintroduktionen fra trin 1.

1. **Mothershipet er det centrale hjem.** Ét sted til overblik, fælles regler,
   åbne løse ender og forbindelserne mellem projekter.
2. **Hjernen giver kontinuitet.** `heinrich/agent_brain/` bevarer godkendt,
   varig viden på tværs af samtaler, projekter og AI-harness. Værdien er mindre
   gentagelse, færre tabte beslutninger og et system der bliver bedre af brug.
3. **Projekter er satellitter.** Hvert projekt ejer sin kode, sine opgaver og
   sin lokale kontekst. En tynd bridge lader mothershipet se status og retning
   uden at kopiere hele projektet ind i hjernen.
4. **Claude og Codex er to grænseflader til samme system.** Separate adaptere,
   fælles hjerne, profil og kernekontrakt. Brugeren skal ikke vedligeholde to
   konkurrerende assistenter.
5. **Skills og spærringer gør adfærd gentagelig.** Skills er genbrugelige
   procedurer; fælles playbooks bærer den harness-neutrale logik; beskyttede
   filer og hooks værner om de load-bearing regler.

Tilføj ét kort afsnit om skills med højst tre punkter:

- Fælles core skills bor i mothershipet og giver projekter de samme
  arbejdsgange.
- Projektspecifikke skills bor i projektet og rummer kun dets lokale domæne-,
  kunde- eller værktøjsviden.
- Regel: genbrugelig på tværs af projekter er core; ellers bliver skillen lokal.

Værdien i én sætning: et slankt mothership, ingen kontekstlæk mellem projekter,
og kun relevant information indlæst. Nævn ikke adapterstier og opremse ikke de
11 core skills her — gennemgangen nedenfor ejer den detalje.

Oversæt hvert fagudtryk første gang. Led med praktisk værdi, ikke med stier.
Nævn at det fysiske `heinrich/`-namespace ligger fast, at personligt indhold
holdes adskilt efter den valgte privatlivsgrænse, og at brugerens fremtidige
repo normalt bør være privat.

Afslut med dette valg på naturligt dansk:

> Vil du have, at jeg forklarer systemet mere, gennemgår de vigtigste core
> skills, eller starter opsætningen, så HEINRICH passer til dit workflow?

Præcis tre ruter, **ingen markeret som anbefalet**:

1. `Fortæl mig mere om systemet` — fortsæt den pædagogiske gennemgang uden
   opsætningsspørgsmål og uden writes.
2. `Gennemgå core skills` — forklar de 11 fælles workflow-skills og hvornår de
   bruges. Ingen ændringer.
3. `Start opsætningen` — gå til `configure`.

Sig derefter, at system-guide-skillen er specialist i HEINRICH og aktiveres
automatisk ved senere systemspørgsmål. Brugeren behøver ikke huske navnet.

#### Gennemgang af core skills

Læs `heinrich/docs/04-skills-catalog.md`. Forklar at de allerede er installeret,
og at gennemgangen er read-only. Gruppér efter workflow, ikke alfabetisk, og
giv for hver skill én kort `Hvad` og ét konkret `Hvornår`:

- **Projekter og opgaver:** `create-project`, `create-task`, `delete-project`.
- **Kontinuitet:** `handover`, `resume-handover`, `close-handover`.
- **Viden:** `ingest`, `learn`.
- **Kvalitet og koordinering:** `mothership-check`, `collaboration-check`,
  `eval`.

Skeln de forvekslelige par: projekt kontra opgave, handover kontra varig
læring, og mothership-sundhed kontra kollisionsrisiko ved samarbejde.

Sig at skills kan vælges automatisk ud fra anmodningen og kan kaldes eksplicit
ved navn. Gør tallet eksplicit: det er de **11** skills der deles af begge
harness.

`onboard` og `system-guide` tælles **ikke** som en af de 11. De er kittets
indgang og dets systemforklaring, og de findes som adapter i begge harness.

Tilbyd derefter at svare på spørgsmål, uddybe én skill eller starte
opsætningen. Start aldrig `configure` uden brugerens valg.

Spørg ikke brugeren om arkitektur, task-skema, samarbejdskontrakt eller
nested-repo-konvention. Det er kitkontrakter — de forklares, ikke forhandles.

### configure

Stil kun spørgsmål hvis svar ændrer profilen.

Presets er startpunkter, ikke skjulte beslutninger — vis altid den konkrete
tekst der bliver gemt. **Ingen mulighed må mærkes, beskrives eller efterstilles
som anbefalet.** Kræver den klikbare grænseflade en anbefaling, så vis i stedet
mulighederne som neutral tekst.

#### Minimumsspørgsmål

1. `user_name` og `assistant_name`.
2. `archetype` med konkrete `archetype_traits`.
3. `push_back_stance`: `evidensbaseret`, `blød` eller `hård`.
4. `privacy_scope`: `work-only` holder dette repo til arbejde; `hard-split`
   holder arbejde og privat i adskilte hjem; `custom` kræver en konkret
   grænsetekst.
5. `language`, IANA-`timezone`, `date_format` og `working_week`.

`namesake_note` og `strategic_lens` er valgfrie. En tom navnenote er gyldig.

#### Personlighed

Et arketypenavn alene er ikke operationelt. Gem derfor også en kort, konkret
`archetype_traits`-tekst om længde, tempo, initiativ og modspil. Gør ikke
personlige præferencer til universelle kitregler.

Brug disse neutrale standardvalg:

- `A — Skarp minimalist`: Kortfattet, højt tempo og initiativrig. Giver
  tydeligt, evidensbaseret modspil.
- `B — Rolig rådgiver`: Mere forklarende og afmålt. Giver blødt modspil og
  spørger oftere først.
- `C — Hård sparringspartner`: Meget direkte og handlekraftig. Udfordrer
  konsekvent og uden indpakning.

Vises valgene som tekst, afslut med:
`Svar A, B, C eller skriv din egen formulering.`

#### Privatlivstekster

Foreslå disse, men lad brugeren redigere dem:

- `work-only`: `Brug kun arbejdsrelateret materiale. Stop og spørg før privat eller blandet indhold.`
- `hard-split`: `Arbejde hører til i dette repo. Privat materiale hører til i et separat, udpeget hjem. Stop ved blandet materiale.`
- `custom`: ingen standardtekst; brugeren formulerer selv den konkrete grænse.

#### Overførsel til motoren

Send profilobjektet direkte til motorens stdin. Brug **aldrig** interpolation i
en shellstreng, miljøvariabler eller en midlertidig fil med brugerens fritekst.

Byg ét JSON-objekt med hvert felt i
`heinrich/config/onboarding.json.profileSchema`. Start motoren:

```text
node heinrich/tools/onboard.mjs configure --stdin --json
```

Send objektet på stdin. Dette er preview-only: vis de rapporterede
filændringer og konflikter. Konvertér **aldrig** brugertekst til en
shellkommando.

Efter eksplicit godkendelse: gentag med `--apply`, send samme objekt, og kør:

```text
node heinrich/tools/onboard.mjs verify --json
```

Stop hvis et target er håndredigeret siden sidste generering. Vis konflikten.
Send aldrig `--force`, redigér aldrig et target i hånden, og omskriv aldrig
hjerne-, projekt-, task- eller samarbejdsfiler.

### git

Kør `git-status --json` først. Vis den præcise planlagte mutation og indhent en
**separat** godkendelse umiddelbart før hver kommando uden for trin 1:

- `git-init --apply`
- `git-remote --url <url> --apply`
- `git-disconnect --apply`
- `git-hooks --apply`
- `git-identity --name <navn> --email <email> --apply`
- `git-commit --message <besked> [--initial] --apply`
- `git-push --apply`

Overskriv aldrig en eksisterende remote. Fjern kun remotes gennem en previewet
`git-disconnect` efter eksplicit godkendelse. Peger `origin` på kit-templaten,
så push aldrig dertil. Afvis credentials i URL'er. Kræv repo-lokal `user.name`
og `user.email` før commit.

**Commit og push er altid to adskilte godkendelser.** Ingen af dem er et
rutinemæssigt afslutningstrin.

## Afslutning

Kald først onboarding gennemført, når `verify` passerer, og hver anvendt
handling er rapporteret. En bruger må bevidst stoppe efter `status`, `explain`,
`configure`, lokal-only Git eller commit-uden-push. Rapportér den grænse som
det valgte resultat, ikke som en fejl.

Tilføj umiddelbart efter afslutningsopsummeringen disse to næste skridt:

1. Anbefal et lille testprojekt og nævn skillen ved navn. Det er
   afslutningsvejledning, ikke en svarmulighed, og projektet må ikke oprettes
   automatisk.
2. Forklar at samarbejde med den anden assistent genoptages med én sætning.
   Vis begge retninger uden sti eller teknisk vejledning:
   - I Claude, når Codex har skrevet briefet: `Der ligger et brief fra Codex.`
   - I Codex, når Claude har skrevet briefet: `Der ligger et brief fra Claude.`

   Sætningen aktiverer samarbejdsrummet. Start aldrig samarbejdet automatisk.

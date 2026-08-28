# HEINRICH — Claude adapter

Dette er Claude-adapteren. Kanonisk viden og projektstatus er
harness-uafhængig.

Læs ved orientering i mothership:

- `mothership.md` — Obsidian-front door og projektoversigt.
- `agent_brain/understanding/decisions/mothership-satellit-arkitektur.md` —
  godkendt ejerskab og grænser.
- `agent_brain/understanding/standards/project-bridge.md` — bridge-kontrakten.

Kun `lifecycle: active` hører til det løbende projektoverblik. `standby`,
`frozen` og `archived` hentes frem ved eksplicit relevans. `state` beskriver
dokumentets tillidsniveau, ikke projektets livscyklus.

Læs som Claude-harnesslag ved starten af en HEINRICH-session:

- `.claude/constitution/identity.md` — assistant name, mission, personality, strategic lens
- `.claude/constitution/guide.md` — index into the rest of `.claude/constitution/`
- `.claude/constitution/config.yaml` — runtime flags

Skills i `.claude/skills/`, hooks og Claude-specifikke felter er adapterlaget.
De må ikke være eneste hjem for projektfakta eller fælles arbejdsgange.
`.Codex/` er Codex' harness-lag og er read-only fra Claude, medmindre brugeren
eksplicit godkender en adapterændring.

Den varige hjerne er `agent_brain/`. Projektdetaljer ejes af satellitten på den
sti, bridge-siden angiver. Genererede outputs ligger i `artifacts/`, og nye
kilder i `raw/`.

**Default retrieval**: search `agent_brain/` first (grep, your editor's search, or the Obsidian CLI if installed). Leave the brain only to follow source links or ingest new material. Full reference: `.claude/constitution/retrieval.md`.

**Knowledge ownership**: update the strongest canonical owner first. Topic hubs
are navigation, not default owners. Follow
`agent_brain/understanding/standards/topic-hubs.md`.

**Training wheels**: if `training_wheels: true` in `config.yaml`, end every response with a rotating tip per `.claude/constitution/training-wheels.md`. Defaults to on for fresh installs; brugeren turns off any time by saying "slå training wheels fra".

## Kommandoform (gælder også subagenter)

Godkendelses-prompts afhænger ofte af kommandoens form. Hold derfor hvert kald afgrænset og genkendeligt, så brugeren kan se præcis hvad der godkendes, og så tilladelser ikke bliver bredere end opgaven.

Derfor:

- **Ingen `cd` som præfiks.** Brug absolutte stier, eller Bash-værktøjets egen arbejdsmappe. `cd X && grep …` matcher ingen regel.
- **Ét formål per kald.** Kæd ikke `ls && grep && echo` sammen for at spare en tur. Separate kald matcher `Bash(ls:*)`, `Bash(grep:*)` osv. og er gratis efter første godkendelse.
- **Foretræk de dedikerede værktøjer** (Read, Grep, Glob) frem for `cat`, `grep`, `find` i Bash. De prompter ikke, og de er hurtigere.
- **Batch kun når resultatet er ét datasæt** — fx et enkelt `node -e`-script der udregner en hel statistik. Det er ét kald med ét formål, ikke en kæde.

Reglen gør godkendelser forståelige og genbrugelige. Se harnessets lokale indstillinger for de mønstre, der faktisk er tilladt.

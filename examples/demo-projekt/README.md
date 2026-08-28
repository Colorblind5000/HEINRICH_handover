# Demo-projekt

Et opdigtet miniprojekt, der viser hvordan en satellit, dens bridge og et
opgavekort hænger sammen. **Det er ikke et aktivt projekt.**

Alt her ligger under `examples/` og bliver derfor ikke fanget af de scanninger,
der læser det operative register. Der er ingen kunde, ingen person, ingen rigtig
remote og ingen credentials.

**Du kan slette hele mappen.** Intet i setuppet afhænger af den.

## Hvor tingene ville ligge i virkeligheden

| Her i demoen | Operativ placering |
| --- | --- |
| `examples/demo-projekt/PROJECT.md` | `Work/<slug>/PROJECT.md` |
| `examples/demo-projekt/AGENTS.md` | `Work/<slug>/AGENTS.md` |
| `examples/demo-projekt/.claude/CLAUDE.md` | `Work/<slug>/.claude/CLAUDE.md` |
| `examples/demo-projekt/tasks/` | `Work/<slug>/tasks/` |
| `examples/demo-projekt/assets/` | `Work/<slug>/assets/` |
| `examples/demo-projekt/.agents/skills/` | `Work/<slug>/.agents/skills/` |
| `examples/demo-projekt/.claude/skills/` | `Work/<slug>/.claude/skills/` |
| `examples/bridge/demo-projekt.md` | `heinrich/agent_brain/projects/<slug>/<slug>.md` |

Bridgen ligger med vilje under `examples/` og ikke i hjernen. Lå den i
`agent_brain/projects/`, ville den tælle som et rigtigt projekt i dit overblik.

## Det demoen viser

**Satellitten ejer detaljerne.** Charter, opgaver og assets bor i projektet.

**Mothershipet ejer en tynd bridge.** Den siger hvor projektet ligger, hvad det
handler om, hvilken fase det er i, og præcis én næste handling — ikke en kopi af
projektet.

**Opgavekortet peger på sin ejer.** `project` knytter kortet til sluggen, og
bridgens `workspace_path` fortæller hvor arbejdet foregår.

**Adapterne er tynde.** `AGENTS.md` og `.claude/CLAUDE.md` i projektet peger på
charteret; de gentager det ikke.

**Skills er delt i to hjem.** Fælles arbejdsgange bor i mothershipet;
projektspecifikke skills bor i projektets egne `.agents/skills/` og
`.claude/skills/`. Reglen: genbrugelig på tværs af projekter er core — ellers
bliver skillen lokal.

## Lav dit eget i stedet

Kør `/create-project` (Claude) eller `$create-project` (Codex). Den opretter
satellit, bridge og første opgave efter samme mønster — men registreret, så det
tæller med i dit overblik.

Brug ikke denne mappe som skabelon ved at kopiere den. Skabelonen er
`projekt-template/`.

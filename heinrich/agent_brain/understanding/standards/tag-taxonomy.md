---
type: knowledge
summary: "Kontrolleret vokabular for tags i agent_brain/ — vedligeholdt som kit-kontrakt. Nye tags vælges herfra; nye tilføjes bevidst, ikke ad hoc."
state: stable
updated: 2026-08-22
tags: [standard, brain-architecture, obsidian]
---

# Tag-taksonomi (kontrolleret vokabular)

> Tags er den ene konvention i vaulten der må rådne hvis den er fri. Denne liste er et startvokabular og kan udvides bevidst, når installationens egne domæner opstår. **Vælg fra listen. Tilføj nye bevidst — ikke ad hoc.**

## Regel

1. **Vælg eksisterende tag** fra grupperne nedenfor frem for at finde på et nyt.
2. **Nyt tag** tilføjes kun bevidst — føj det til den rette gruppe her i samme commit som du bruger det. Et tag der ikke står her, er enten en stavefejl eller en udvidelse der mangler at blive registreret.
3. **Ental vinder** ved synonym-tvivl (`hub`, ikke `hubs`). Dansk i kontekst-/privat-tags, engelsk i struktur-/domæne-tags — matcher eksisterende brug.

## Vokabular

**Sidetype** — hvad siden *er*
`standard` · `pattern` · `hub` · `hub-first` · `template` · `index` · `reference`

**Vidensdomæne** — hvad siden *handler om*
`brain-architecture` · `llm-agents` · `multi-agent` · `agents` · `ai` · `ai-agents` · `orchestration` · `harness` · `rag` · `ai-tooling` · `prompt-engineering` · `context-engineering` · `animation` · `svg` · `design` · `kreativ` · `obsidian` · `bases` · `graph`

**Tech-stack**
`nextjs` · `supabase` · `vercel` · `web-stack`

**Projekt** — projekt-slug som tag
`<projekt-slug>` · `<andet-projekt>`

**Arbejdskontekst**
`tilbud` · `udkast` · `scope` · `klient` · `samarbejde` · `internt-vaerktoej` · `single-source-of-truth` · `product-framing` · `framing` · `content` · `vision` · `raadgiver` · `arbejde`

**System / proces**
`ingestion` · `feeds` · `hooks` · `skills` · `skill-design` · `tasks` · `opgaver` · `cadence` · `synchronization` · `external-systems` · `data-model` · `trust` · `provenance` · `best-practice` · `references` · `governance` · `drift`

**Person / bruger**
`person` · `profile` · `about_user` · `habit`

**Privat**
`privat` · `kost` · `motion`

## Sammenlagte synonymer\n\n| Kanonisk | Alias |\n| --- | --- |\n| `standard` | `standards` |\n| `hub` | `hubs` |\n| `projekt` | `projects` |\n\n## Kandidat-merges (ikke besluttet)

Flag til en senere oprydning — ikke smeltet sammen endnu:
- `reference` (sidetype) vs `references` (system/proces) — næsten-dublet; afklar om de dækker forskellige ting.
- `ai` / `agents` / `llm-agents` / `multi-agent` — overlappende klynge; muligvis for finkornet.

## Related

- [[doc-types]] — samme governance-mønster, for `type:`-feltet (to kontekster)
- [[provenance]] — epistemisk status pr. påstand
- [[topic-hubs]] — hub-laget bruger `hub` / `hub-first`
- [[task-project-structure]] — projekt-slug-tags

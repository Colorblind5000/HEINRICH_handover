---
type: index
summary: "Obsidian-kontrolrum for projekter og tværgående arbejdsviden."
state: canonical
tags: [heinrich, mothership, index]
---

# Mothership

Forsiden i Obsidian. Obsidian er **visning** — Markdown-filerne er sandhedskilden,
og alt her virker også uden Obsidian.

## Projekter

![[projects.base]]

`Aktive` er det løbende overblik. `Standby`, `Frosne` og `Arkiverede` trækkes kun
frem ved behov. Intet projekt forsvinder, fordi en status er uklar.

Listen er tom, indtil du opretter dit første projekt med `/create-project`.

## Brug

1. Åbn denne side for overblik.
2. Åbn projektets **bridge** for orientering.
3. Åbn **satellitten** som arbejdsområde, når der skal arbejdes.
4. Skriv detaljerne tilbage i satellitten. Her opdateres kun resumé,
   `lifecycle` og én `next_action`.

## Opgaver

![[opgaver.base]]

Task-filerne er sandhedskilden. Højst én opgave må globalt være `in_progress` —
det er det aktuelle fokus.

## Fælles viden

- [[agent_brain/_index|Hjernens indgang]]
- [[agent_brain/_protected|Beskyttede filer]]
- [[agent_brain/understanding/decisions/mothership-satellit-arkitektur|Arkitekturbeslutning]]
- [[agent_brain/understanding/standards/project-bridge|Projekt-bridge-standard]]
- [[agent_brain/understanding/standards/hooks|Hook-arkitektur]]
- [[agent_brain/understanding/playbooks/mothership-check|Mothership-check]]

## Grænser

- Obsidian er visning; Markdown er sandhedskilden.
- Mothership kopierer ikke projektdetaljer eller hele tasklister. Den ejer en
  tynd bridge pr. projekt — ikke en kopi af projektet.
- Aktivering flytter ingen mapper.
- En LLM's chat-hukommelse er aldrig den kanoniske projektstatus.

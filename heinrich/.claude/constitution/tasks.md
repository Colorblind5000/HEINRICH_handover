# Tasks

## Kanonisk placering

Task-laget spænder over mothership og registrerede projektsatellitter:

- projekttasks lever under den sti, bridgens `workspace_path` angiver:
  `Work/<workspace_path>/tasks/<slug>.md`;
- uprojekterede og tværgående tasks lever under
  `Work/heinrich/agent_brain/tasks/<slug>.md`;
- samme handling må aldrig være aktiv begge steder;
- der findes intet task-arkiv.

Opret tasks gennem den fælles `create-task`-procedure. Gæt aldrig en
projektsti ud fra sluggen.

## Frontmatter

```yaml
type: task
title: ""
summary: ""
status: open | in_progress | blocked | done | dropped
priority: p0 | p1 | p2 | p3
order: 1
due: YYYY-MM-DD
owner: brugeren
project: project-slug
category: feature | review | learning | admin | other
description: ""
source: manual | heinrich | meeting | ingest
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [task]
```

`project` og `due` er valgfrie. `project` er en tekst-slug.

## Regler

- Opret kun en task for en konkret handling, ikke et interessant ukendt.
- Tasks ejer eksekveringstilstand; projektet og hjernen ejer varig forståelse.
- Prioritet er `p0` i dag, `p1` denne uge, `p2` denne måned og `p3`
  backlog.
- Nye tasks starter som `open`.
- Højst én task på tværs af mothership og registrerede satellitter må være
  `in_progress`.
- Kun et projekt med `lifecycle: active` må få nye `open` tasks.
- Når en task bliver `done` eller `dropped`, bevar først varige resultater
  hos den kanoniske ejer og slet derefter task-filen.
- Det centrale Opgaver-board er et view af task-kortene, aldrig en kopi.

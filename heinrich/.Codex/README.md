# HEINRICH Codex overlay

Dette overlay gør HEINRICH tilgængelig i Codex uden at ændre `.claude/`.

- `constitution/` — Codex-routet kopi af adfærdslaget.
- `memory/` — byte-identisk migration af `MEMORY.md` plus 36 underfiler.
- `../AGENTS.md` — HEINRICH-entrypoint når Codex åbnes i vaulten.
- `../../.agents/skills/` — repo-skills, tilgængelige i alle Work-projekter.

`.claude/` er fallback under cutover. Den må læses, men ikke bruges som ny
Codex-skriveflade.

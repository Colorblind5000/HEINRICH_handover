---
type: standard
summary: "Minimumskontrakten for en projekt-bridge mellem Obsidian-mothership og projektets satellit."
state: canonical
updated: 2026-08-22
tags: [heinrich, projektstruktur, bridge, standard]
---

# Projekt-bridge

## Formål

En bridge gør et projekt synligt og genfindeligt fra mothership uden at kopiere
satellittens indhold.

Bridgen er et kort. Satellitten er sandhedskilden for projektets detaljer.

## Minimumsmetadata

```yaml
---
type: project
project_id: eksempel-projekt
summary: "Én sætning om projektets formål og nuværende betydning."
state: stable
lifecycle: active
workspace_path: eksempel-projekt
repository:
updated: YYYY-MM-DD
next_action: "Kun én konkret næste handling; kun nødvendig for aktive projekter."
tags: [projekt]
---
```

Tilladte værdier for `lifecycle`:

- `active`
- `standby`
- `frozen`
- `archived`

`workspace_path` er relativ til `Work/` og må ikke være en maskinspecifik
absolut sti. `repository` er valgfrit.

## Minimumsindhold

1. Projektets mål i én kort formulering.
2. Nuværende status på højst fem linjer.
3. Henvisning til satellittens stærkeste ejerfiler.
4. Centrale relationer til mothershipets personer, referencer eller andre
   projekter.

## Ejerskab

| Viden | Ejer |
|---|---|
| Projektmål, lokal status og projektbeslutninger | Satellitten |
| Kode, assets og detaljerede tasks | Satellitten |
| Personer, kunder og generelle arbejdspræferencer | Mothership |
| Tværgående standarder, mønstre og referencer | Mothership |
| Projektets placering og livscyklus | Bridge-siden |

Hvis samme oplysning ser ud til at have to ejere, stoppes ændringen, indtil
ejerskabet er afklaret.

## Kompatibilitet

Gamle bridges kan fortsat have `status`. Under migrationen:

- gæt ikke `lifecycle` ud fra en gammel dato;
- brug `lifecycle`, når brugeren har klassificeret projektet;
- behold `status` midlertidigt, hvis eksisterende views eller tasks bruger det;
- fjern først legacy-feltet efter en verificeret migration.

## Størrelsesgrænse

En bridge må ikke vokse til projektarkiv. Når historik eller mekanik fylder mere
end orienteringen, flyttes den til satellitten eller et tydeligt historikspor.

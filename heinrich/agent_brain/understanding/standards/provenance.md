---
type: knowledge
summary: "Epistemisk status pr. påstand — tre niveauer der skelner kendsgerning fra HEINRICH's egne slutninger."
state: stable
updated: 2026-08-22
tags: [standard, provenance, trust, ingestion]
---

# Provenance-standard (pr. påstand)

> Dette lag supplerer kilde-trail (se [[knowledgebase]] "Source provenance") — det handler ikke om *hvor siden kom fra*, men om *hvor sikker en enkelt påstand er*.

## De tre niveauer

**Extracted** (standard — markeres ikke)
Stod direkte i en kilde. Ingen markør. Udgangspunktet for al indhold.

**`^[inferred]`**
HEINRICH's egen syntese, mønster-matching eller udledning. Stod ikke i kilden.

**`^[ambiguous]`**
Kilder er uenige, konteksten er uklar, eller påstanden er usikker af anden grund.

## Regel

- Skriv påstande uden markør som standard.
- Tilføj `^[inferred]` eller `^[ambiguous]` umiddelbart efter påstanden i løbende tekst, eller som inline note i bullet-lister.
- Tilføj **aldrig** `^[extracted]` — det er underforstået.

## Hvornår det er obligatorisk

- Enhver genereret påstand uden en direkte kildelinje markeres med `^[inferred]`.
- Enhver `^[ambiguous]`-markering skal efterfølges af en note om *hvorfor* — enten på samme linje eller som indented bullet.

## Eksempler

```markdown
Brugeren arbejder bedst i 2-timers blokke. ^[inferred]

- Projektet er sat til Q3 ^[ambiguous] — to kilder siger hhv. Q3 og Q4.
```

## Related

- [[knowledgebase]] — kilde-trail-standarden (hvor siden kom fra)
- [[lateral-linking]] — spoke-to-spoke disciplin
- [[tag-taxonomy]] — kontrolleret vokabular (søster-standard for metadata-disciplin)

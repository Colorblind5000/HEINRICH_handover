---
type: knowledge
summary: "How to build and maintain navigational topic hubs in agent_brain/references/. Covers the hub-first paradigm, entry format, creation triggers, sub-hub splits, freshness signals, and retirement rules."
state: stable
updated: 2026-08-18
tags: [standard, hub, references, hub-first]
---

# Topic Hubs Standard

Topic hubs live in `agent_brain/references/` and answer "what do we know about X?" → load one hub → pick entry → follow link.

## The hub-first paradigm

> The hub layer is what makes the brain beat raw search. Lateral links are decoration without a hub anchor.

**Order of operations for durable knowledge entering the brain**:

1. **Canonical owner first** — update the project document, person page,
   standard, decision record, or other page that owns the fact.
2. **Selective hub placement** — add a thin entry only when a topic/entity is
   recurring or the hub materially improves navigation.
3. **Linking search** — add only useful backlinks and lateral links. See
   `lateral-linking.md`.

A hub is navigation, never the canonical owner of a project fact. A durable fact
can be fully ingested without a hub entry when the canonical page and local
links are sufficient.

This applies to `$learn`, `$ingest`, and approved ad-hoc knowledge writes.

## What a hub is

- **Navigational, not encyclopedic.** Entries link out to where the actual detail lives.
- **Opinionated groupings are fine.** Grouping by tier ("frontier / cheap-at-scale / legacy") reflects real takes.
- **Thin content, not thin signal.** Each entry carries a short opinionated description — enough to answer "what is this?" without clicking out.

## Entry format

```
- **<Name>** (<provider/origin>, <YYYY-MM or year>) — <one-sentence opinionated description> · [[link1]] · [[link2]]
```

Pick 1–3 most-useful links per entry. Description should answer "what's the story with this?" — opinionated beats neutral.

**Source links don't have to be user-output.** Internal wiki-links (post archives, takes, project pages) are best, but when an entry surfaces in research and the user hasn't written about it yet, an external link (vendor blog, paper URL, HuggingFace) is correct. Hubs reflect what exists in the topic space, not just what the user has touched.

## Frontmatter

```yaml
---
type: reference
summary: "<one-line>"
state: stable | needs-review
updated: <YYYY-MM-DD>           # last entry-level touch
last-reconciled: <YYYY-MM-DD>   # last completeness sweep
tags: [hub, <topic>]
---
```

`last-reconciled` is the freshness signal. `updated` changes when any entry is touched; `last-reconciled` only when the hub is deliberately swept. An old `last-reconciled` tells the reader "this may be stale — consider a search as backup."

## Mandatory "Known gaps" section

Every hub ends with:

```markdown
## Known gaps

- [what's probably missing and why]
- [areas the brain is still thin on]
```

If genuinely no gaps: `- None known as of <date>.` The point is **explicit honesty about coverage** so readers don't trust an incomplete hub as complete. Missing this section is a failure mode.

## When to create a new hub

**Be liberal.** Plenty of hubs + plenty of links is the goal, not a conservative set. If you catch yourself thinking "this doesn't fit anywhere" for a new entry, that's the signal.

The threshold is **dial-aware** — it depends on Ingestion aggressiveness in
`.Codex/constitution/learning-aggressiveness.md`:

- **Under `Ask` / `Off`** — default rule: any topic with **3+ scattered references** across the brain is a candidate hub. The 3-reference threshold filters one-off mentions from genuine clusters.
- **Under `Auto`** — a hub may be created earlier when the topic is clearly
  recurring and no existing hub fits. Do not create one-entry stubs merely on
  the assumption that later maintenance will clean them up.

Missing navigation and hub sprawl are both failure modes. Prefer the smallest
structure that makes retrieval materially easier.

When creating:
1. Use the entry format + frontmatter above.
2. Add a line to `agent_brain/_index.md` under `## References → Topic hubs`.
3. Log the creation in `artifacts/_changelog.md`.
4. New hubs start as `state: needs-review` unless they were validated in the
   same work.

## Update discipline (critical)

When external information adds a recurring topic or entity, update the
canonical owner first and then the relevant hub if it improves navigation.

Three-step update path, in order:

1. **Canonical update** — write the fact to its strongest owner.
2. **Selective hub placement** — add the entity to relevant hub(s) only when
   retrieval improves.
3. **Linking search** — add useful backlinks and `## Related` references; avoid
   mechanical link density.

Skills that must apply this discipline:
- **`$learn`** — canonical owner and authority gates first; hub placement is
  selective.
- **`$ingest`** — canonical owner and source provenance first; only durable,
  navigational entities enter hubs.

## Verify before adding

Before adding an entity to a hub, **verify it isn't already there**. Search the hub file (or use `obsidian backlinks file="<hub>"` if the CLI is installed). Sub-agent and quick-scan workflows tend to over-claim coverage; a 30-second verify saves duplicate entries.

## Sub-hub splits

When a single hub grows past a certain size, navigation latency creeps back. Split into sub-hubs **when any of**:

- Total entries pass **~25–30**
- Any single sub-tier has **5+ entries** with a clear conceptual boundary (e.g. "frontier" vs "workhorse")
- The hub's `## Known gaps` section is naming sub-domains warranting their own coverage

### Naming convention

`<topic>-<sub-axis>.md` — flat naming, no folders. Examples:
- `llms.md` → `llms-frontier.md` + `llms-workhorse.md`
- `image-models.md` → `image-models-generation.md` + `image-models-classification.md`

Sub-axis should match the user's editorial groupings, not provider/license. The whole point of hubs is opinionated navigation.

### Meta-hub pattern

The original hub stays as a **meta-hub**: ~10 lines of orienting prose + links to the sub-hubs + Legacy section if cross-tier. Preserves all existing wikilinks pointing to the original (don't break the graph) while letting catalog work happen on lean sub-hubs.

```markdown
# LLMs

Meta-hub. Detail lives on the sub-hubs below — split when entry count crossed 27.

- [[llms-frontier|Frontier LLMs]] — closed + open-weights at the intelligence ceiling
- [[llms-workhorse|Workhorse LLMs]] — cheap-at-scale models, embeddings

## Legacy / historical reference
... (Legacy entries stay on the meta-hub if cross-tier)

## Related
... (cross-hub navigation stays here)
```

### Update `_index.md`

When you split, add the sub-hubs under the original entry in `_index.md` (indented bullets). Don't remove the parent — `_index.md` should still point at the meta-hub as the entry point.

### When NOT to split

- Hub has <25 entries even with concentrated sub-tiers — don't split prematurely.
- Sub-tiers are weakly defined or shifting — let them stabilize first.
- The hub already serves a single coherent question well — splitting just to reduce length is wrong.

## Retirement

Move an entry to a `## Legacy` section within the same hub when **any two** of:

- It's no longer offered by the provider.
- It's no longer SOTA or relevant in its tier.
- It hasn't appeared in fresh material for 6+ months.

**Don't delete.** Legacy entries preserve history.

## Related

- [[lateral-linking]] — horizontal axis: spoke-to-spoke `## Related` discipline
- [[skill-authoring]] — sibling standard governing skill page shape

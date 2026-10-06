---
id: KI-WEB-SITE-001
area: SITE
title: Interactive island diagram
theme: site-experience
horizon: waiting-for
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T00:11:08Z
updated_at: 2026-10-06T01:20:57Z
---

## Goal

The website shows an interactive, accessible diagram of a Knowledge Island as a place, rendered from Arcadia's canonical geography model and its approved isometric tile set.

## Context

Create a visual, interactive version of the island geography using the isometric tile set from Arcadia's Aesthetics pillar. This record is the execution item for the rendered artefact. The content and knowledge model behind it belong to `KI-ARCADIA-MOD-003` (Geography model and tiles) in `knowledgeislands/ki-arcadia-principal`, which will publish how an island's zones and artefacts map to places and approve a tile set fit for interactive web use. Arcadia holds draft concept sheets in `Pillars/Aesthetics/Isometric Tiles/`, but no approved, web-suitable asset set or canonical geography model exists yet.

## Boundary

- Website implementation only: interaction design, accessibility model, presentation and hosting of the diagram.
- No geography model or tile artwork is invented here; both come from Arcadia under `KI-ARCADIA-MOD-003`.
- Implementation does not begin until that record's waiting-for condition is discharged.

## Current state

The geography model and an approved, web-suitable tile set are not yet available, so this item remains draft in `Waiting for` with no implementation baseline. Its waiting-for condition is named below.

## Steps

- [ ] Confirm that the approved isometric asset set is available and suitable for interactive web use.
- [ ] Design the interaction and accessibility model around the agreed Capital, Library, Streams, and Harbour geography.
- [ ] Implement and verify the diagram in the website before requesting review.

## Files touched

- Website guidance and presentation files that host the interactive geography diagram.

## Verify

- The diagram is keyboard-accessible, understandable without the visual treatment, and uses the approved assets.
- Relevant website build, lint, and authored-content checks pass.

## Dependencies / blocks

Blocked by `KI-ARCADIA-MOD-003` in `knowledgeislands/ki-arcadia-principal`. This is genuine build order: the diagram cannot be built until Arcadia publishes the geography model and approves a web-suitable tile set. The waiting-for condition is discharged when those outputs land in Arcadia's `Pillars/`, regardless of that record's later review or acceptance. The relationship is recorded in prose on both records because `blocks` and `blocked_by` hold local identifiers only. No local roadmap item is blocked by this one.

## Discussion

### Owner decision (2026-10-06)

The 2026-10-06 roadmap consolidation found this record overlapping `KI-ARCADIA-MOD-003`. Both are adopted, so neither was merged. The owner decided to keep both and split them by ownership: this record owns the rendered, interactive diagram, and Arcadia owns the aesthetics and knowledge model behind it. The generic Goal was restated and the waiting-for condition now names the Arcadia record.

### Related work

`KI-HARNESS-GOV-131` (Govern living diagrams) in `knowledgeislands/ki-agentic-harness` is related diagram-governance work. It is a non-blocking cross-link, not a dependency in either direction.

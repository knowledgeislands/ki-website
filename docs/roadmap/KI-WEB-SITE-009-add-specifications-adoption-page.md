---
id: KI-WEB-SITE-009
area: SITE
title: Add specifications adoption page
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: d0c40b2b6b8ae499e5525eef3c0a5c17b2f5ce8e
created_at: 2026-09-18T04:50:00Z
updated_at: 2026-09-18T06:05:00Z
---

# Add specifications adoption page

## Goal

Give the website a public entry point for adopting the Knowledge Islands specifications, linking the corpus rather than restating it.

## Context

`ki-specifications/docs/adoption-guide.md` explains how an organisation or tool adopts Knowledge Packages. The `KI-WEB-SITE-002` inventory classified it as source-owned: it is an informative section of the specification corpus, versioned with the KIS documents it describes, so copying it to the website would create a second version that ages differently.

What is missing is the route in. The website's `/specifications/` page does not currently lead a reader to the adoption path.

## Boundary

Website-only. The page links the `ki-specifications` corpus and does not restate it; no specification document is copied, summarised at length, or edited.

If the adoption guide's own content turns out to need work, that is the specifications repository's item, not this one.

## Current state

`/specifications/` is a two-section page: a hero, and a role statement ending in a single link to the repository root. A reader who wants to adopt the contracts has to find `docs/adoption-guide.md` by browsing the repository.

`ki-specifications` holds five informative documents — adoption guide, specification process, numbering, versioning, and architecture context — all anchored to `GOVERNANCE.md`.

## Steps

- [x] Add an adoption section to `/specifications/` linking the five informative documents with one line of orientation each.
- [x] Keep the existing repository link as the canonical destination.

## Files touched

- `site/src/specifications/index.njk` — one added section.

## Verify

- `bun run ki:site:build` succeeds and `/specifications/` renders the new section.
- Every added link resolves to a document that exists in `ki-specifications`.

## Dependencies / blocks

None. Website-only.

## Documentation impact

### Decision Records

None.

### Specifications

None. The site links the corpus; it does not restate or alter it.

### Guides

None.

### Roadmap

This record only.

## Review

### Delivered

`/specifications/` now has an adoption section that routes a reader to the five informative documents in `ki-specifications` — adoption guide, specification process, numbering, versioning, and architecture context — with one line of orientation each, plus the `GOVERNANCE.md` anchor.

Delivered as a section on the existing page rather than a new route. The page was two short sections and a single link to a repository root; a reader's problem was that it dead-ended, not that it lacked a destination to click through to.

### Summary of changes

- `site/src/specifications/index.njk` — one added section, using the existing section and prose classes.

### Verification

- Every linked document was confirmed to exist in `ki-specifications`.
- `bun run ki:site:build` succeeds and `/specifications/` renders the new section.
- `ki repo audit --repo .` reports `PASS` across 18 skills.

### Outstanding concerns

None. The repository stays canonical, and nothing on this page restates a normative contract.

### Post-change review

The inventory classified these five documents as source-owned and that held up — the useful change was a route in, not a move. Worth noting for the remaining consolidation: "this is hard to find" and "this is in the wrong repository" are different problems, and the first is usually cheaper to fix.

### Mini recap

Adoption route added to `/specifications/`; nothing copied, nothing moved.

## Done

Accepted 2026-09-18 by Kris Brown on the review packet above.

## Discussion

Website-only; no source repository needs to change. The page should be short and should link out, not duplicate. The test is whether a reader who lands on `/specifications/` can find the adoption guide without already knowing it exists.

Originating item: `KI-WEB-SITE-002`.

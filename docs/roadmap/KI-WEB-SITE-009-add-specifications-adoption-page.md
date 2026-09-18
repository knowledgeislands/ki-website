---
id: KI-WEB-SITE-009
area: SITE
title: Add specifications adoption page
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T04:50:00Z
updated_at: 2026-09-18T04:50:00Z
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

## Discussion

Website-only; no source repository needs to change. The page should be short and should link out, not duplicate. The test is whether a reader who lands on `/specifications/` can find the adoption guide without already knowing it exists.

Originating item: `KI-WEB-SITE-002`.

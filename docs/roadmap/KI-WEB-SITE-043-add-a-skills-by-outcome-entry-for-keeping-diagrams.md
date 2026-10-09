---
id: KI-WEB-SITE-043
area: SITE
title: Diagrams skills-by-outcome entry
kind: deliver
status: cancelled
resolution: obsolete
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T13:32:54Z
updated_at: 2026-10-09T21:40:00Z
---

## Goal

A reader who wants to keep diagrams that explain a system finds `ki-diagrams` from the [Choose a skill by outcome](/docs/ki-agentic-harness/skills-by-outcome/) routing table, which points at the skill's Diagrams standard.

## Context

`ki-agentic-harness` KI-HARNESS-GOV-131 delivered the `ki-diagrams` skill: one consistent way to keep diagrams traced from the code, committed as a source and a self-contained SVG, listed in one manifest and refreshed when what they draw changes. Its standard is `skills/governance/ki-diagrams/references/standards-diagrams.md` in the harness. The routing table in `apps/site/src/docs/ki-agentic-harness/skills-by-outcome.md` has no entry for it yet.

Trades are on hold, so the handoff is recorded here directly rather than sent as a knowledge trade, with Kris's approval on 2026-10-08.

Originating repository and item: `ki-agentic-harness` KI-HARNESS-GOV-164, which this item does not block and which does not block it.

## Boundary

In scope: one skills-by-outcome entry for keeping diagrams, pointing at the Diagrams standard. Out of scope: any wider documentation of the skill. This repository owns whether and when to act; the `website` Project is currently paused.

## Cancelled

Cancelled 2026-10-09 as obsolete, approved by Kris Brown (state-of-play decisions log, Decision 31): the entry was made directly as a minor change in commit db3f668, which adds a ki-diagrams route under "Record why, what, how, or when" in `apps/site/src/docs/ki-agentic-harness/skills-by-outcome.md` and cites the Diagrams standard as a page source. That settles the Discussion question. It leaves no outstanding change.

## Discussion

- Which row of the routing table fits best: an existing outcome group, or a new one for keeping a system's explanation current?

---
id: KI-WEB-SITE-008
area: SITE
title: Migrate skill outcome routing
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T04:50:00Z
updated_at: 2026-09-18T04:50:00Z
---

# Migrate skill outcome routing

## Goal

Publish the outcome-to-skill routing guidance on the website and reduce the harness copy to a pointer.

## Context

`ki-agentic-harness/docs/guides/skills-by-outcome.md` answers "I know what I want to achieve, which skill serves it?". That is public explanatory guidance for a reader who is unlikely to open the harness repository, and it is the one genuine migration candidate the `KI-WEB-SITE-002` inventory found.

The website already owns the complementary half at `/guidance/skills/catalogue/`, which answers "what does skill Y govern?". Holding the two halves in different repositories is what makes the routing hard to find.

The harness keeps the generated capability catalogue under `skills/README.md`. That is source-owned inventory and does not move.

## Boundary

The website adds the page and the navigation entry. Reducing or removing `ki-agentic-harness/docs/guides/skills-by-outcome.md` is a source-owned change that this item cannot make; it needs a handoff the harness accepts.

Nothing ships on the website until that handoff is agreed, so the two copies never coexist as competing sources.

## Discussion

This is a cross-repository slice. The website adds the page; `ki-agentic-harness` owns the deletion or pointer replacement and must accept a handoff item before the source side can change. Do not publish the website copy until the harness has agreed, or the two will diverge silently — exactly what `KI-WEB-SITE-002` set out to prevent.

Originating item: `KI-WEB-SITE-002`.

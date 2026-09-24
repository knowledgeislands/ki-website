---
id: KI-WEB-SITE-038
area: SITE
title: Rethink the documentation content
theme: site-experience
horizon: triage
status: done
blocks: []
blocked_by: []
intake_disposition: merged
intake_disposition_target: KI-WEB-SITE-037
baseline_ref: null
created_at: 2026-09-25T09:00:00Z
updated_at: 2026-09-25T09:45:00Z
---

## Goal

Every Docs section holds enough to be worth entering. A reader who opens one finds a sequence that takes them from not knowing the thing to being able to use it, rather than a single page that stops.

## Context

`KI-WEB-SITE-037` arranges the site's instructional material into six Docs sections, each presented as a card stating how many pages it holds. Three of those six are a single page:

| Section | Pages | |
| --- | --- | --- |
| Prompting | 14 | A section |
| The Agentic Harness | 10 | A section |
| The `ki` CLI | 9 | A section |
| Get Started | 1 | |
| Optional Tools | 1 | |
| Contribute | 1 | |

The three at the bottom are not small sections. They are articles that the current navigation promotes to the same rank as a section, which is why nobody has noticed. A card reading "Get Started · 1 page" beside "Prompting · 14 pages" states the problem plainly for the first time.

The user's instruction was that this is the moment to rethink a lot of the documentation to align with the structural approach, and the inventory above is what that instruction was reaching for. The structure is not merely a container to pour existing pages into; it sets an expectation — a section teaches a capability — and three sections cannot currently meet it.

## Boundary

This item is about what the documentation says and how it is divided: which sections exist, what pages each holds, what order they read in, and what material has to be written to fill a gap. It is authoring and editorial judgment.

It does not change the navigation, the card grid, the section registry, or the routes. `KI-WEB-SITE-037` owns all of that and must land first — this item writes into a structure that already exists.

It does not revisit what the site is willing to publish. `GDR-KI-WEBSITE-002` and [what-to-publish.md](../guides/developer/what-to-publish.md) still decide whether material belongs here at all, and a thin section is not a licence to restate an upstream repository's guide wholesale in order to reach a page count. A section with four honest pages is better than one with ten padded ones, and if a section genuinely has one page's worth of material, the right answer may be to merge it rather than grow it.

Every page it writes still declares its `sources`, and every page it moves keeps the declaration it had.

## Intake disposition

**Merged into `KI-WEB-SITE-037`.** The retained target carries this item's scope in its own Boundary, Steps and Verify.

Splitting the move from the rewrite was the right call while they were going to be sequential — a move and a rewrite in one diff are hard to review separately. That reasoning assumed two passes. In one pass the split becomes an obstacle rather than a safeguard: `blocked_by: KI-WEB-SITE-037` would hold executable work behind a review queue, which the roadmap standard names as a declaration that "makes the audit fail for a reason that is not true".

Nothing in the analysis is discarded. The three thin sections, the judgment that Contribute may honestly not be a section, and the question of what a section owes a reader all move into 037 intact.

## Done

Accepted 2026-09-25 by Kris Brown on the intake disposition above.

## Discussion

### The three thin sections are not the same problem

**Get Started** is the one that most obviously wants to be a sequence. It is the first thing a reader meets, and a five-minute path through install, first repository, first skill, and seeing something happen is the shape Paperclip's Quickstart uses to good effect. The material largely exists, scattered across `/projects/ki/getting-started/`, the harness's installation guide, and the current single page — this is mostly a redistribution, not net new writing.

**Contribute** may honestly be one page. Plenty of good sites have a single contribution page and lose nothing. The question is whether it belongs as a Docs section at all, or whether it is site chrome like a footer link. Forcing it to be a section to satisfy a grid would be the grid dictating to the content.

**Optional Tools** is a list of recommendations about a reader's own machine. It could grow into a section, one page per tool — but it would want a reason beyond symmetry.

So the outcome is not "grow all three". It is three separate judgments, and at least one of them may be "this is not a section".

### What a section owes a reader

Worth settling before writing anything, because it is the standard the whole item is measured against. A first draft: a section names a capability, its first page tells you what you will be able to do and what it assumes, its pages read in an order that builds, and its last page leaves you able to do the thing rather than pointing somewhere else. The existing `verify-guides.ts` already enforces the opening-claim half of that and bans the hand-off, so part of this is mechanised; the sequence and the ending are not.

Whether that belongs in `docs/guides/developer/project-guides.md` — which `KI-WEB-SITE-037` is already rewriting — or in a new guide about sections is a question for delivery.

### Why this is triage

The direction is clear but it sits behind `KI-WEB-SITE-037`, and its first real step is an editorial judgment per section that is better made with the restructured site in front of you than in the abstract. Scheduling it now would mean planning against a shape that does not exist yet.

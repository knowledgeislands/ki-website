---
id: KI-WEB-SITE-029
area: SITE
title: Gate guide reading order
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 59f53d0d4b7f4aa013dfc96ab99e7694e3305a83
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:18:55Z
---

## Goal

A project's guides appear in a deliberate reading order, and a guide added later cannot quietly land at the end of the list because nobody set its position. The order a reader sees is one somebody chose.

## Context

`KI-WEB-SITE-025` gave each project a Guides block on its project page, rendered from the `guides` collection and sorted by an `order` frontmatter key, then by title. `order` is optional and ungated: a page without one sorts last.

That default is reasonable in isolation and wrong in aggregate. The first guide a reader meets under a project is the one that decides whether they continue, and appending each new page to the end means the list degrades toward chronology — the order pages happened to be written, not the order they should be read. The failure is silent, which is the property that makes it worth gating: nothing fails, nothing warns, and the list is simply a little worse each time.

This was recorded as an outstanding concern in `KI-WEB-SITE-025` and lost when that record was pruned.

`apps/site/scripts/verify-guides.ts` already reads every guide's frontmatter to check the opening claim and the directory binding, so it is the natural place for the check and the additional cost is nil.

The rendering of the Guides block has also never been confirmed in a browser. `KI-WEB-SITE-025` verified it against built markup and recorded the same limitation `KI-WEB-SITE-024` did. Ordering work is the right occasion to look at the rendered list properly.

## Boundary

This item makes `order` required and unique within a project, and states that in the guide contract. It does not change the sort key, introduce nested grouping, or add a second ordering dimension across projects. It does not reorder any project's guides editorially beyond assigning each existing page the position it already holds — deciding a better reading order for a given project is ordinary content work, not this gate. It does not touch the `/guidance/` residual collection, which has its own hub ordering.

## Current state

Delivered. `verify-guides.ts` now requires `order` on every guide, requires it to be a positive whole number, and requires it to be unique within its project directory.

The corpus turned out to be already correct: all nineteen guides carried `order`, densely numbered 1–9 under `ki` and 1–10 under `ki-agentic-harness`, with no gaps and no ties. No page needed a position assigned. The item therefore closed a hole in the gate rather than a defect in the content, which is the useful case to close — the convention was being followed by hand, and the next person adding a guide is the one who would have broken it.

## Steps

- [x] Add an `order` check to `verify-guides.ts`: present, a positive integer, and unique within each project's directory.
- [x] Assign `order` to every guide currently missing one — none were missing; the existing numbering was dense and unique in both projects.
- [x] State the requirement in `docs/guides/developer/project-guides.md`, where `order` was described as optional and defaulting to last.
- [x] Re-home the browser verification this item cannot perform, rather than deferring it into a Review section for a fourth time.

## Files touched

- `apps/site/scripts/verify-guides.ts`
- `docs/guides/developer/project-guides.md`
- `docs/roadmap/KI-WEB-SITE-029-gate-guide-reading-order.md`

No page under `apps/site/src/projects/` needed changing.

## Verify

- `bun run --cwd apps/site verify:guides` reports 19 guides across 2 project directories verified.
- Removing one page's `order` fails the gate naming that page; giving it a position another page holds fails naming both. Both proven against `src/projects/ki/commands.md`, which was then restored.
- `bunx tsc --noEmit -p apps/site/tsconfig.json` passes.
- `bun run ki:site:clean && bun run ki:site:build` passes.

## Dependencies / blocks

Nothing blocks this and it blocks nothing. The browser verification it could not perform is `KI-WEB-SITE-032`, which needs a person rather than an agent and is non-blocking in both directions.

## Documentation impact

### Decision Records

None. Requiring a key the contract already describes is an implementation tightening, not a change to what the contract is for.

### Specifications

None. No published interface is involved.

### Guides

`docs/guides/developer/project-guides.md` states that `order` is optional and defaults to last; that sentence becomes wrong and is part of the delivery.

### Roadmap

`KI-WEB-SITE-032` carries the browser verification of rendered prose, which this item could not perform and which two earlier items also deferred.

## Review

### Delivered

`order` is now a requirement of the guide contract rather than a convention, enforced in the gate that already reads every guide's frontmatter. A guide with no position, a non-numeric position, or a position another guide in the same project holds fails the build and says which page and which conflict.

### Change Summary

`verify-guides.ts` gained a per-directory `Map` of taken positions and three checks inside the existing page loop: presence, positive-integer shape, and uniqueness within the project. `project-guides.md` replaced the sentence describing `order` as optional with the requirement and the reason for it. No guide page was edited, because none needed one.

### Verification

`bun run --cwd apps/site verify:guides` reports all nineteen guides verified. Both failure modes were demonstrated rather than reasoned about: removing `order` from `src/projects/ki/commands.md` produced one failure, and setting it to a position `capability-lifecycle.md` already held produced one failure; the page was restored and the gate returned to green, confirmed by `git diff --stat` showing only the script changed. `bunx tsc --noEmit` and the full clean build pass.

### Outstanding concerns

**The browser check was not performed here.** This item planned to close the rendering verification carried forward from `KI-WEB-SITE-024` and `KI-WEB-SITE-025`, and it could not: confirming the Guides block in a browser in both colour schemes needs a person at a browser, and claiming it from built markup would repeat exactly the substitution those records recorded as a limitation. Three items having now deferred it for the same reason makes it a standing gap rather than an exception, so it is `KI-WEB-SITE-032` rather than a fourth line in a Review section — which is the form in which the previous two were lost.

The gate checks that positions are unique, not that they are contiguous. A project numbered 1, 2, 7 passes, which is intended — sparse numbering is a legitimate way to leave room — but it means a deleted guide leaves a hole nothing reports.

Ordering is per project. Nothing relates one project's sequence to another's, which is right while the Guides block renders per project and would need revisiting if a combined index ever existed.

### Post-change review

The goal is met. The reading order of every project's guides is now a decision the build insists on rather than a default that erodes, and the change cost nothing in content because the convention was already being kept. The risk introduced is bounded to one direction: a contributor adding a guide now has one more required key, and the failure message says what to do about it.

The item's real finding is that the corpus was clean. A gate added over conforming content proves nothing on the day it lands, which is precisely why it is worth adding on that day rather than after the first page that breaks the rule.

### Mini recap

`KI-WEB-SITE-029` makes `order` required, positive, and unique per project, enforced in `verify-guides.ts` and stated in the guide contract. All nineteen existing guides already complied, so no content changed. Both failure modes were proven and reverted. The browser verification this item could not perform is now `KI-WEB-SITE-032` rather than a deferral inside a Review section.

## Done

Accepted 2026-09-24 by Kris Brown on the review packet above.

## Discussion

### Why gate rather than document

A convention that only a person enforces is enforced when a person remembers. The pattern this repository keeps rediscovering is that a check which passes tells you the check ran, not that the property holds — and the corollary is that an unchecked property holds only while someone is paying attention. `order` costs one line per page and the gate costs a few in a script that already reads the frontmatter.

### Integers or explicit sequence

Open question. Sparse integers — 10, 20, 30 — leave room to insert without renumbering, at the cost of looking arbitrary. Dense integers are readable and force a renumber on every insertion, which is a small edit the gate would catch if botched. A third option is ordering the list in the directory data file rather than per page, which centralises the decision but separates it from the page it concerns. Dense integers with a uniqueness check are probably right for lists of this size.

### The unverified rendering

Worth naming separately. Two items have now recorded that a visual change was verified from built markup rather than a browser, each for the same defensible reason. That is twice, and a third would be a habit rather than an exception.

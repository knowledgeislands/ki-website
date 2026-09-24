---
id: KI-WEB-SITE-029
area: SITE
title: Gate guide reading order
theme: site-experience
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:06:42Z
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

`order` appears in some guide frontmatter and not others. `eleventy.config.ts` sorts the `guides` collection by `order` then title, with pages lacking the key falling to the end. `verify-guides.ts` checks the project binding, the 120-character opening claim, and the seventeen banned deferral phrases; it does not look at `order`. Nothing detects a duplicate `order` within a project either, where the tie silently falls through to title.

## Steps

- [ ] Add an `order` check to `verify-guides.ts`: present, a positive integer, and unique within each project's directory.
- [ ] Assign `order` to every guide currently missing one, preserving the order the project page renders today unless the project's reading order is obviously wrong.
- [ ] State the requirement in `docs/guides/developer/project-guides.md`, where `order` is currently described as optional and defaulting to last.
- [ ] Confirm the Guides block renders as intended in a browser, in both colour schemes, closing the verification gap carried since `KI-WEB-SITE-024`.

## Files touched

- `apps/site/scripts/verify-guides.ts`
- `apps/site/src/projects/ki/*.md`, `apps/site/src/projects/ki-agentic-harness/*.md`
- `docs/guides/developer/project-guides.md`

## Verify

- `bun run --cwd apps/site verify:guides` fails on a guide with no `order` and on two guides sharing one, with a message naming the page.
- `bun run ki:site:clean && bun run ki:site:build` passes.
- Each project page's Guides block lists its pages in the assigned order.
- The rendered block is checked in a browser rather than in built markup.

## Dependencies / blocks

Nothing blocks this. The browser check needs the site running locally or deployed, which `bun run ki:site:dev` supplies.

## Documentation impact

### Decision Records

None. Requiring a key the contract already describes is an implementation tightening, not a change to what the contract is for.

### Specifications

None. No published interface is involved.

### Guides

`docs/guides/developer/project-guides.md` states that `order` is optional and defaults to last; that sentence becomes wrong and is part of the delivery.

### Roadmap

None expected.

## Discussion

### Why gate rather than document

A convention that only a person enforces is enforced when a person remembers. The pattern this repository keeps rediscovering is that a check which passes tells you the check ran, not that the property holds — and the corollary is that an unchecked property holds only while someone is paying attention. `order` costs one line per page and the gate costs a few in a script that already reads the frontmatter.

### Integers or explicit sequence

Open question. Sparse integers — 10, 20, 30 — leave room to insert without renumbering, at the cost of looking arbitrary. Dense integers are readable and force a renumber on every insertion, which is a small edit the gate would catch if botched. A third option is ordering the list in the directory data file rather than per page, which centralises the decision but separates it from the page it concerns. Dense integers with a uniqueness check are probably right for lists of this size.

### The unverified rendering

Worth naming separately. Two items have now recorded that a visual change was verified from built markup rather than a browser, each for the same defensible reason. That is twice, and a third would be a habit rather than an exception.

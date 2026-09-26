---
id: KI-WEB-SITE-039
area: SITE
title: Decide the landing pages
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T14:00:00Z
updated_at: 2026-09-26T18:18:00Z
---

## Goal

A reader who clicks **Get Started** on the Docs grid starts something. A reader who clicks **Contribute** finds a page that knows what it is for and is not explaining the Contribution Process for the second time.

## Context

The completed Docs restructure gathered everything that teaches into Docs sections and settled four of the six. Optional Tools grew from one page to six. Get Started and Contribute were left, deliberately, because measuring them turned up a problem the restructure could name but not fix.

They are not thin articles waiting to be grown. Both are hand-built Nunjucks pages on `layouts/base.njk` carrying hero sections, full-bleed backgrounds and their own containers — 199 lines and 88 lines of markup respectively, not prose. Converting either into a prose sequence is a visual change, and nothing in this session could see the result.

Worse, they overlap. Get Started's headings run: Arcadia, "Arcadia is not documentation", Philosophy, The Model, the Contribution Process in four stages, Establishing an Island, Charter, The Council, Territories, Archipelagos. Contribute's run: "Improve what's shared", three steps of the Contribution Process, "Contribution is not internal setup". Two of the six sections explain the same process, and one of them also restates Philosophy and Model, which are two of the three top-level nav entries.

The sharper finding is that **Get Started does not get anybody started.** It is an Arcadia overview and a conversion page. The pages that actually start someone are `/docs/ki/getting-started/` — "Install and get started" — and `/docs/ki-agentic-harness/installing-a-harness/`, both of which sit in other sections. So the first card on the Docs grid, the one a reader is told to begin at, leads to an explainer, while the sequence it promises exists under two other names.

## Boundary

This decides what Get Started and Contribute are, and rewrites them accordingly. It may move material between sections, and it may conclude that one of them is not a Docs section at all — Contribute could reasonably be site chrome, like a footer link, rather than something a reader works through.

It does not touch the other four sections, the grid, the registry or the gates; the completed Docs restructure settled those and they hold whatever answer this reaches. It needs a person at a browser, because both pages are visual compositions and the verification is whether the result still looks like the site.

## Current state

Six Docs sections. Four of them are settled by `KI-WEB-SITE-037`: The ki CLI at 9 pages, The Agentic Harness at 10, Prompting at 14, Optional Tools at 6 after that item split it. Two are not.

| Section | Pages | What it actually is |
| --- | --- | --- |
| Get Started | 1 | 199 lines of Nunjucks on `layouts/base.njk` — hero, full-bleed sections, icon macros |
| Contribute | 1 | 88 lines of the same |

Get Started's headings, in order: Arcadia; "Arcadia is not documentation"; Philosophy; The Model; the Contribution Process in four stages; Establishing an Island; Charter; The Council; Territories; Archipelagos. Contribute's: "Improve what's shared"; three steps of the Contribution Process; "Contribution is not internal setup".

Two of the six sections therefore explain the Contribution Process, and one of them also restates Philosophy and Model, which are the other two top-level nav entries.

The pages that actually start someone are `/docs/ki/getting-started/` and `/docs/ki-agentic-harness/installing-a-harness/`, both in other sections.

## Steps

- [ ] Take `baseline_ref` before any edit.
- [ ] Decide whether Get Started is a sequence a reader works through or a landing page that routes into the sections — the two shapes in the Discussion below are not equivalent and the choice is editorial.
- [ ] Decide whether Contribute is a Docs section, a page inside another section, or site chrome that leaves the grid.
- [ ] Settle where the Contribution Process is explained, once, and remove the other explanation.
- [ ] Execute whichever shape the first two steps chose, including any material that moves between sections or to `/model/`.
- [ ] Update `docsSections.json5` and the 301s if a section leaves or changes slug.
- [ ] Look at the result in both colour schemes; these are visual compositions and the build cannot judge them.

## Files touched

- `apps/site/src/docs/get-started/index.njk`
- `apps/site/src/docs/contribute/index.njk`
- `apps/site/src/_data/docsSections.json5` — if a section leaves or is renamed
- `apps/site/src/redirects.njk` — if an address changes
- `apps/site/src/model/` or `src/model.njk` — if the Arcadia material moves there

## Verify

- `bun run ki:site:clean && bun run ki:site:build` passes; `verify-docs-sections` and `verify-reachable` hold whatever shape is chosen.
- The Contribution Process is explained on exactly one page, confirmed by grep rather than by memory.
- Every address that existed before still resolves.
- A person has looked at both pages in both colour schemes and at a narrow viewport.

## Dependencies / blocks

Nothing blocks this. The accepted Docs restructure delivered the structure this decides the contents of and is already closed for what it delivered.

`KI-WEB-SITE-032` owns whether the Docs grid looks right, including whether a "1 page" card looks broken. If this item removes the one-page cards, that question goes away; if it keeps them, 032 still owns it.

## Documentation impact

### Decision Records

Possible. `ADR-KI-WEBSITE-003` states that everything which teaches lives in a Docs section. Concluding that Contribute is site chrome rather than documentation is consistent with that record but worth a sentence in it, because it draws the boundary the record left implicit.

### Specifications

None.

### Guides

`docs/guides/developer/docs-sections.md` notes that Get Started and Contribute are hand-built landing pages and that whether they grow into sequences is unsettled. That paragraph is rewritten to state the answer.

### Roadmap

None beyond this record.

## Discussion

### The grid asked the question, it does not get to answer it

A card reading "1 page" is uncomfortable next to one reading "14 pages", and the temptation is to write pages until the numbers look respectable. That would be the grid dictating to the content. The honest outcomes include "this is one page and that is correct" and "this is not a section" — and the count being visible is doing its job either way, because it surfaced the overlap that nobody had noticed while the two pages sat at opposite ends of a six-entry nav.

### Two candidate shapes, and they are not equivalent

One: **Get Started becomes the sequence it promises** — install, first repository, first skill, see something happen — assembled largely from material that already exists in the `ki` and harness sections, with the Arcadia explanation moving to `/model/` where the rest of it lives. That is mostly redistribution rather than net new writing, and it makes the first card true.

Two: **Get Started stays a conversion page and leaves the grid**, becoming a landing page that routes into the sections. That preserves a page that was presumably built to convert, at the cost of the Docs grid no longer having an obvious first card.

The first is better for a reader who came to learn; the second is better for a reader who came to be persuaded. Which matters more here is not a question a gate can settle.

### The overlap is the part that is not optional

Whatever shape the two pages take, the Contribution Process should be explained once. Two explanations drift, and the one nobody is looking at drifts first.

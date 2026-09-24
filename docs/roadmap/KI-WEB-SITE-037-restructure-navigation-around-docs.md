---
id: KI-WEB-SITE-037
area: SITE
title: Restructure navigation around docs
theme: site-experience
horizon: next
status: draft
blocks: [KI-WEB-SITE-038]
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T22:30:00Z
updated_at: 2026-09-25T09:00:00Z
---

## Goal

The top navigation says what this site is rather than listing what it contains. Philosophy, Model, Docs — with every instructional page living inside Docs as a section a reader can enter, work through, and finish.

## Context

The reference is [docs.paperclip.ing](https://docs.paperclip.ing/), which the user raised as the shape to aim at. Its top bar carries three things plus a `⌘K` search. Everything instructional sits behind Docs as a grid of cards, and a card names a section, states how many pages it holds — Quickstart 8, Working Day-to-day 12, CLI 35 — and deep-links to the section's first page rather than to an index. Entering a section starts you reading rather than choosing again.

What the user liked: you can go into a section, it has eight pages, and it feels like learning a capability. That is the property worth copying. A section reads as a finite, completable thing with a beginning, not as a folder.

This site currently has six top-level nav entries of very unequal weight. Four open a single page; two open thirty-seven pages between them. A reader scanning that bar cannot tell which links are destinations and which are bodies of material, and the two that are genuinely deep are the two that look least like it.

**The open question is answered.** The first draft of this record could not say whether Projects belonged under Docs, because a project page is a registry entry rather than an article. The user's answer splits it at exactly the right seam: the **projects index does not go under Docs — the guides beneath it do**. The catalogue stays a catalogue, and the material written to teach somebody something becomes Docs sections. That removes the double-route ambiguity the first draft worried about, because each page then has one home and one meaning.

## Boundary

This item is the information architecture and the navigation that expresses it: what the top bar holds, what the Docs landing page is, how a section is declared and counted, and how a reader moves inside one. It moves pages and fixes what breaks when they move.

It is not a visual redesign. The token set, the prose treatment, and the page templates stay as they are; `KI-WEB-SITE-032` and `KI-WEB-SITE-036` own how the site looks.

**It does not rewrite page content, and this is the boundary that matters here**, because the restructure surfaces a content problem it must not try to solve in passing. Three of the six sections it creates are a single page each. Growing them, redistributing their material, and deciding what a section owes a reader is `KI-WEB-SITE-038`, raised from this item's own Current state. Doing both at once would produce a change nobody can review: a move and a rewrite in one diff make it impossible to tell which one broke a page.

It does not commit to client-side search. Paperclip's `⌘K` is part of why Docs is navigable at 285 pages; at roughly 40 it may not be needed, and a search index is its own decision with its own cost.

It does not adopt the Learn / Reference split. That earns its place across 285 pages by separating what you read once from what you return to. Across 40 it would produce buckets of three and four, which communicates less than no split.

## Current state

Six nav entries, and what is actually behind them:

| Entry | Pages | Kind |
| --- | --- | --- |
| `/philosophy/` | 1 | A statement |
| `/model/` | 1 | A statement |
| `/projects/` | 18 registry entries, plus 19 guides under two of them | A catalogue with documentation buried in it |
| `/prompting/` | An index and 14 model guides | A section already |
| `/get-started/` | 1 (`index.njk`) | An article |
| `/contribute/` | 1 (`index.njk`) | An article |
| `/optional-tools/` | 1 (`index.md`) | An article |

Under the decision above, Docs would hold six sections:

| Section | Pages today | Source |
| --- | --- | --- |
| Get Started | 1 | `src/get-started/index.njk` |
| The `ki` CLI | 9 | `src/projects/ki/*.md` |
| The Agentic Harness | 10 | `src/projects/ki-agentic-harness/*.md` |
| Prompting | 14 | `src/prompting/*.md` |
| Optional Tools | 1 | `src/optional-tools/index.md` |
| Contribute | 1 | `src/contribute/index.njk` |

**Three of the six are a single page.** That is the finding this item hands to `KI-WEB-SITE-038`, and it is the structural argument for the user's instinct that the documentation needs rethinking: a card reading "Get Started · 1 page" next to "Prompting · 14 pages" does not present a site that teaches. Either those sections grow into real ones or the card has to admit what it is, and the first is plainly what the site wants.

Sixteen of the eighteen projects have no guides at all, which the split handles correctly — they stay registry entries in the catalogue and never appear in Docs.

`src/redirects.njk` already carries 65 lines from the last restructure, and `verify-reachable.ts` proves the tree is navigable from the root by BFS, so a page that loses its inbound link fails the build rather than going quiet.

## Steps

- [ ] Take `baseline_ref` before any edit.
- [ ] Add a `docs` section registry — a data file declaring each section's slug, title, one-line description, page order, and the page a card deep-links to. Page counts derive from it rather than being written by hand, so a card cannot claim a number the section does not hold.
- [ ] Build the `/docs/` landing page as a card grid reading from that registry, in the Paperclip shape: name, description, count, deep link to the first page.
- [ ] Move the two project guide directories to their Docs sections, leaving `/projects/` as the catalogue of registry entries.
- [ ] Decide how a project page points at its section now that its guides have moved — the Guides block `KI-WEB-SITE-025` added becomes a single link to the section rather than a list.
- [ ] Move `get-started`, `contribute`, `optional-tools` and `prompting` under `/docs/`.
- [ ] Reduce the top nav to Philosophy, Model, Docs in `src/_data/site.ts`.
- [ ] Add a 301 in `src/redirects.njk` for every moved page.
- [ ] Add within-section navigation, so a reader who finishes a page is offered the next one rather than the back button.
- [ ] Fix any opening line that refers to a page's old position, and nothing else about its prose.

## Files touched

- `apps/site/src/_data/site.ts` — the nav
- `apps/site/src/_data/` — a new section registry
- `apps/site/src/docs/` — the landing page and the moved sections
- `apps/site/src/projects/project.njk` — the Guides block becomes a section link
- `apps/site/src/projects/`, `src/prompting/`, `src/get-started/`, `src/contribute/`, `src/optional-tools/` — the moves
- `apps/site/src/redirects.njk`
- `apps/site/scripts/verify-guides.ts` — the guide location rule changes with the move
- `docs/guides/developer/project-guides.md` — the contract it states is what moved

## Verify

- `bun run ki:site:clean && bun run ki:site:build` passes; `verify-reachable.ts` is what proves every moved page is still findable by navigating from the root.
- Every 301 resolves against the built `_redirects`, and no moved URL 404s.
- Each card's page count equals the number of pages the registry declares for it — checked mechanically, not read.
- `ki repo audit --skill ki-repo-website-content --repo .` passes; this is a structural change and that is its gate.
- `ki repo audit --skill ki-engineering --repo .` and `--skill ki-authoring --repo .` pass.
- `bun run --cwd apps/site verify:provenance -- --network` still resolves, since moving a page must not disturb its `sources` declaration.

## Dependencies / blocks

Blocks `KI-WEB-SITE-038`, which rethinks what the sections contain. The order is deliberate: the structure has to exist before there is anything to write into, and 038's whole subject is the three one-page sections this item creates.

Nothing blocks this. It overlaps `KI-WEB-SITE-032` only in that both touch pages a reviewer would look at; neither needs the other.

## Documentation impact

### Decision Records

One is likely. `ADR-KI-WEBSITE-003` and the `KI-WEB-SITE-025` contract place a guide beside the project it describes, and this item moves guides away from their projects into Docs sections. That is a reversal of a recorded decision and needs a record saying why — the reason being that the earlier decision solved ownership, and this one solves reading, which turned out to be a different question.

### Specifications

None. No published interface is involved.

### Guides

`docs/guides/developer/project-guides.md` states the location contract that this item changes; it is rewritten rather than repointed. `docs/guides/developer/page-reachability.md` gains whatever the section navigation adds to the reachability graph.

### Roadmap

`KI-WEB-SITE-038`, raised by this item.

## Discussion

### Why the split lands where the user put it

The first draft framed this as a binary — Projects under Docs or not — and both answers were unsatisfying. Under Docs, a catalogue of eighteen registry entries hides behind a word promising documentation. Outside it, thirty-seven pages of genuine instruction stay buried under a catalogue.

The user's answer dissolves it by declining the binary: the index and the guides are different kinds of thing and do not have to travel together. A registry entry answers "what is this"; a guide answers "how do I". Splitting them at that seam gives each page one home, and it is the same distinction `verify-projects.ts` and `verify-guides.ts` already enforce mechanically — the site's own checks had drawn this line before its navigation did.

### The restructure is what exposes the content problem

Three one-page sections is not a defect the move introduces; it is a fact about the current documentation that the current navigation conceals. Get Started, Contribute and Optional Tools each look substantial as a top-level nav entry and each turn out to be one page. Putting them in a grid beside Prompting's fourteen is what makes that visible.

This is the usual value of a structural change: it does not create problems so much as stop hiding them. Which is also why the rewrite has to be a separate record — the move's job is to make the shape legible, and if it also filled in the gaps nobody could see which was which.

### The page count is the load-bearing detail

It would be easy to take the card grid and not the counter. The counter is most of the value. "Prompting" says nothing about whether it is an afternoon or a reference you dip into; "Prompting · 14 pages" tells a reader what they are agreeing to. It also keeps the site honest, because a section that cannot state a respectable number is a section that needs work — which is exactly how the finding above surfaced.

Deriving the count from a registry rather than writing it by hand is the difference between a fact and a claim that rots.

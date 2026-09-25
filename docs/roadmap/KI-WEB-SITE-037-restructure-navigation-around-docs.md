---
id: KI-WEB-SITE-037
area: SITE
title: Restructure navigation around docs
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: ae5276d789e9aef37b3e434f748d3aba6d013913
created_at: 2026-09-24T22:30:00Z
updated_at: 2026-09-25T14:20:00Z
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

**It rewrites page content where a section needs it.** This was originally excluded and handed to `KI-WEB-SITE-038`; that record is now merged in, because the user's direction is that the structure and the content are one pass. The reasoning for the split assumed two passes and does not survive the merge. So the scope includes growing a section that is currently one page, redistributing material between sections, and deciding what a section owes a reader.

It does not revisit what the site is willing to publish. `GDR-KI-WEBSITE-002` and [what-to-publish.md](../guides/developer/what-to-publish.md) still decide whether material belongs here at all, and a thin section is not a licence to restate an upstream repository's guide wholesale to reach a page count. A section with four honest pages beats one with ten padded ones, and if a section genuinely holds one page's worth of material the right answer may be to merge it away rather than grow it.

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

**Three of the six are a single page**, and that is the substance of the content half of this item. They are not small sections; they are articles the current navigation promotes to section rank, which is why nobody has noticed. A card reading "Get Started · 1 page" beside "Prompting · 14 pages" states it plainly for the first time. Either those sections grow into real ones or the card has to admit what they are.

Sixteen of the eighteen projects have no guides at all, which the split handles correctly — they stay registry entries in the catalogue and never appear in Docs.

`src/redirects.njk` already carries 65 lines from the last restructure, and `verify-reachable.ts` proves the tree is navigable from the root by BFS, so a page that loses its inbound link fails the build rather than going quiet.

## Steps

- [x] Take `baseline_ref` before any edit.
- [x] Add a `docs` section registry — a data file declaring each section's slug, title, one-line description, page order, and the page a card deep-links to. Page counts derive from it rather than being written by hand, so a card cannot claim a number the section does not hold.
- [x] Build the `/docs/` landing page as a card grid reading from that registry, in the Paperclip shape: name, description, count, deep link to the first page.
- [x] Move the two project guide directories to their Docs sections, leaving `/projects/` as the catalogue of registry entries.
- [x] Decide how a project page points at its section now that its guides have moved — the Guides block `KI-WEB-SITE-025` added becomes a single link to the section rather than a list.
- [x] Move `get-started`, `contribute`, `optional-tools` and `prompting` under `/docs/`.
- [x] Reduce the top nav to Philosophy, Model, Docs in `src/_data/site.ts`.
- [x] Add a 301 in `src/redirects.njk` for every moved page.
- [x] Add within-section navigation, so a reader who finishes a page is offered the next one rather than the back button.
- [x] Fix any opening line that refers to a page's old position.
- [x] Settle what a section owes a reader, and write it down where the guide contract lives.
- [x] Judge each thin section on its own: grow Get Started into a sequence from material that already exists scattered; decide whether Optional Tools has a reason to be a section beyond symmetry; decide whether Contribute is a section at all or site chrome.
- [x] Write what the judgments call for, and merge away any section that honestly holds one page.

## Files touched

- `apps/site/src/_data/site.ts` — the nav, reduced to three entries
- `apps/site/src/_data/docsSections.json5` — new; the section registry
- `apps/site/src/docs/` — the landing page and all six moved sections
- `apps/site/src/docs/optional-tools/` — one page split into six
- `apps/site/src/_includes/partials/section-contents.njk` — new; within-section navigation
- `apps/site/src/_includes/partials/up-link.njk` — keys on `section` rather than `project`
- `apps/site/src/_includes/layouts/page.njk` — includes the contents block
- `apps/site/eleventy.config.ts` — the `guides` collection becomes `docsPages`
- `apps/site/src/projects/project.njk` — the Guides block becomes a section link
- `apps/site/src/sitemap.njk` — two loops become one
- `apps/site/src/redirects.njk` — 24 new rules, and the older targets repointed
- `apps/site/scripts/verify-docs-sections.ts` — replaces `verify-guides.ts`
- `apps/site/scripts/verify-provenance.ts`, `verify-reachable.ts` — the trees they walk
- `apps/site/package.json` — `verify:guides` becomes `verify:docs`
- `docs/decisions/ADR-KI-WEBSITE-003-documentation-is-a-thing-you-work-through.md` — rewritten and renamed
- `docs/guides/developer/docs-sections.md` — replaces `project-guides.md`
- `docs/guides/developer/{README,page-provenance,page-reachability,projects-directory,what-to-publish}.md`, `docs/guides/README.md`, `AGENTS.md` — the contract they cite

## Verify

- `bun run ki:site:clean && bun run ki:site:build` passes; `verify-reachable.ts` is what proves every moved page is still findable by navigating from the root.
- Every 301 resolves against the built `_redirects`, and no moved URL 404s.
- Each card's page count equals the number of pages the registry declares for it — checked mechanically, not read.
- No section exists that the record has not justified at its size, and no page was written purely to raise a count.
- `ki repo audit --skill ki-repo-website-content --repo .` passes; this is a structural change and that is its gate.
- `ki repo audit --skill ki-engineering --repo .` and `--skill ki-authoring --repo .` pass.
- `bun run --cwd apps/site verify:provenance -- --network` still resolves, since moving a page must not disturb its `sources` declaration.

## Dependencies / blocks

Nothing blocks this and it blocks nothing.

`KI-WEB-SITE-038` was merged into this record rather than sequenced behind it. It held the content half, and while the two were going to be separate passes the `blocked_by` declaration was right; in one pass it would hold executable work behind a review queue, which the roadmap standard names as a dependency that "makes the audit fail for a reason that is not true".

`KI-WEB-SITE-039` receives the half of the merged content scope this item could measure but not execute: what Get Started and Contribute should be. It carries the findings rather than restating the question.

`KI-WEB-SITE-032` reviews the result. It is the visual pass and it needs a person at a browser, which is the one input this session cannot supply — so it stays its own record and its list is rewritten against the restructured site rather than the old one.

`KI-WEB-SITE-040` is unrelated to the restructure but was raised from it: consolidating the nine site scripts, which this item added to and repointed.

## Documentation impact

### Decision Records

`ADR-KI-WEBSITE-003` is rewritten and renamed, from _A Page Lives With What It Is About_ to _Documentation Is A Thing You Work Through_. The decisions directory holds living present-state records rather than supersession chains, so reversing the location contract means rewriting the record that set it rather than adding a fourth. Its filename changed with its title and `docs/decisions/README.md` is repointed.

The reversal is stated as such in the record: the earlier decision solved ownership, this one solves reading, and they turned out to be different questions. What survives intact is the part that was right — that the binding is the directory and never the page's frontmatter.

### Specifications

None. No published interface is involved.

### Guides

`docs/guides/developer/project-guides.md` became `docs/guides/developer/docs-sections.md`, rewritten rather than repointed, because the contract it states is what moved. `page-reachability.md` gained the reason the contents block is load-bearing; `page-provenance.md`, `projects-directory.md`, `what-to-publish.md`, both READMEs and `AGENTS.md` were repointed.

### Roadmap

`KI-WEB-SITE-038` is merged into this record. `KI-WEB-SITE-039` and `KI-WEB-SITE-040` are new. `KI-WEB-SITE-032` is repointed at the restructured site.

## Review

### Delivered

The site's top navigation is three entries — Philosophy, Model, Docs — and everything that teaches lives under `/docs/` in six sections a reader works through in order. A Docs landing grid names each section, states how many pages it holds, and deep-links to its first page. Every page in a section closes with that section's contents in reading order, marking where the reader is and naming what comes next. `/projects/` remains as the catalogue of what exists, linking to a section in one sentence rather than listing its pages.

The last two steps were judged in full and executed in part, which is the honest reading of "judge each on its own". Optional Tools had a reason to be a section and is now six pages. Get Started and Contribute turned out not to be thin articles at all but hand-built landing pages with hero sections, overlapping each other on the Contribution Process, and Get Started does not get anybody started — findings this item could measure and record but not act on, because rewriting a visual composition needs a person at a browser. Both are handed to `KI-WEB-SITE-039` with the measurements attached, rather than being half-rewritten here or leaving this item open behind an approval it cannot ask for.

### Change Summary

Seventy-six files across three commits.

`1053121` moved the structure: six directories under `src/docs/`, forty permalinks and internal links repointed, a new `docsSections.json5` registry, the `guides` collection generalised to `docsPages`, a new landing page and contents partial, the nav reduced, twenty-four new 301s with the older rules repointed at final homes, `verify-guides.ts` rewritten as `verify-docs-sections.ts`, and the decision record and guide contract rewritten to match.

`3aef892` split Optional Tools from one 220-line page into six, promoting the five questions that decide whether a tool is worth adopting from the foot of the watch list to the front of the section.

This record, `KI-WEB-SITE-039` and `KI-WEB-SITE-040` are the third.

The registry declares only a slug, a title and a description. Counts and entry points are derived at build time from the pages that carry the binding, so a card cannot claim a number its section does not hold and adding a page changes the count without anyone editing anything.

### Verification

- `bun run ki:site:clean && bun run ki:site:build` passes, exit 0. All six gates run in-build: `verify-tool-routes` 4 routes, `verify-projects` 18 entries, `verify-provenance` 39 pages, `verify-docs-sections` 41 pages across 6 sections, `verify-reachable` 60 pages, `verify-prose-coverage` 158 regions.
- **`verify-reachable` was looking at a third of the site and now looks at all of it.** Its `publishedTrees` still named `prompting/` and `optional-tools/`, so after the move it reported 18 reachable pages — the project catalogue — and silently ignored the 37 that had just moved. Widened to `docs/` and `projects/`: 55 pages, then 60 after the split. This is the gate that proves the sections are navigable, because the landing grid links only each section's first page.
- Every rule in the built `_redirects` was resolved against `dist/`: 0 problems across 98 lines.
- The card counts were read out of the built HTML and match the directories: Get Started 1, The ki CLI 9, The Agentic Harness 10, Prompting 14, Optional Tools 6, Contribute 1.
- `bunx tsc --noEmit` clean; `bun test apps/site/scripts` 32 pass, 0 fail.
- `ki repo audit --skill ki-repo-website-content --repo .`, `--skill ki-engineering --repo .` and `--skill ki-authoring --repo .` all pass.

### Outstanding concerns

**Nobody has looked at it.** The gates prove the tree is navigable, the counts are honest and nothing 404s. They say nothing about whether a six-card grid on the parchment ground looks like this site, whether the contents block at the foot of every page reads as useful or as clutter, or whether the three-entry nav feels sparse. That is `KI-WEB-SITE-032`'s pass and it needs a person at a browser.

**Get Started and Contribute are unresolved and now more visible than they were.** Both are hand-built landing pages with hero sections, not prose articles, and they overlap each other on the Contribution Process. Get Started does not get anybody started — it is an Arcadia explainer, while the pages that actually start someone sit in the `ki` and harness sections. Promoting it to the first card of the Docs grid makes that mismatch more prominent than it was in the old nav, which is an argument for `KI-WEB-SITE-039` being scheduled soon rather than an argument against the move.

**`--network` provenance was not run.** The offline gate passes on all 39 pages, and the six new Optional Tools pages inherit `sources: original`, which needs no network. The upstream drift check is unchanged by this item and was left for a run that is not competing with a restructure.

### Post-change review

The move surfaced two things that had nothing to do with navigation.

The first is that **a gate scoped by a list of directory names stops being a gate the moment the directories change**, and it does so silently and in the reassuring direction. `verify-reachable` reported a pass while ignoring two thirds of the site, and the only reason anyone noticed was that its page count looked too small next to a `find` of `dist/`. The fix here was to widen the list, but the durable lesson is that `verify-provenance` was rewritten to walk `src/docs/` as a tree rather than as an enumeration, which is why it will survive the next move without being edited.

The second is that **three one-page sections were not three instances of one problem.** Optional Tools was a section wearing one page — 220 lines and eight top-level headings — and splitting it was straightforwardly right. Get Started and Contribute were the opposite: not too little material but the wrong material, duplicated. A grid that shows page counts is good at finding the first kind and actively misleading about the second, because it frames every thin card as "needs more pages" when the answer for two of them is "needs to decide what it is".

### Mini recap

`KI-WEB-SITE-037` restructured the site around Docs sections, absorbing the content scope of the merged `KI-WEB-SITE-038`. Sixty published pages are reachable by navigation, every previously published address resolves in one hop, and the decision record that put guides beside their projects was rewritten to say why reading beat ownership. The visual pass belongs to `KI-WEB-SITE-032`; the Get Started and Contribute question belongs to `KI-WEB-SITE-039`; the script duplication the work walked past belongs to `KI-WEB-SITE-040`.

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

### The three thin sections are not one problem

Carried from `KI-WEB-SITE-038`, because the judgment survives the merge.

**Get Started** most obviously wants to be a sequence. It is the first thing a reader meets, and a path through install, first repository, first skill, and seeing something happen is the shape Paperclip's Quickstart uses well. The material largely exists already, scattered across `/projects/ki/getting-started/`, the harness's installation guide, and the current single page — mostly a redistribution rather than net new writing.

**Contribute** may honestly be one page. Plenty of good sites have a single contribution page and lose nothing by it. The real question is whether it belongs in Docs at all or is site chrome like a footer link. Forcing it to be a section to satisfy a grid would be the grid dictating to the content.

**Optional Tools** is a list of recommendations about a reader's own machine. It could become one page per tool, but it would want a reason beyond symmetry.

So the outcome is not "grow all three", and at least one answer may be "this is not a section".

### What a section owes a reader

Worth settling before writing anything, because it is the standard the content half is measured against. A first draft: a section names a capability; its first page says what you will be able to do and what it assumes; its pages read in an order that builds; its last page leaves you able to do the thing rather than pointing elsewhere. `verify-guides.ts` already enforces the opening-claim half and bans the hand-off, so part of this is mechanised — the sequence and the ending are not.

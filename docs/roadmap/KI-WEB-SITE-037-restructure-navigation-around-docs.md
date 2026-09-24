---
id: KI-WEB-SITE-037
area: SITE
title: Restructure navigation around docs
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T22:30:00Z
updated_at: 2026-09-24T22:30:00Z
---

## Goal

The top navigation says what this site is rather than listing what it contains. Philosophy, Model, and Docs — with everything instructional living inside Docs as a browsable set of sections a reader can work through, rather than as four sibling links of unequal weight.

## Context

The reference is [docs.paperclip.ing](https://docs.paperclip.ing/), which the user raised as the shape to aim at. Its top bar carries three things — Blog, Docs, GitHub — plus a `⌘K` search. Everything instructional sits behind Docs, split into **Learn** and **Reference**, and each of those is a grid of cards. A card names a section, tags it, and states how many pages it holds: Quickstart 8, Working Day-to-day 12, Connectors 62, CLI 35. Roughly 285 pages in sixteen sections. The card deep-links to the section's first page rather than to an index, so entering a section starts you reading rather than choosing again.

What the user liked about it, in their words: you can go into a section, it has eight pages, and it feels like learning a capability. That is the property worth copying — a section reads as a finite, completable thing with a beginning, not as a folder.

This site currently has six top-level nav entries of very unequal weight:

| Entry | What is behind it |
| --- | --- |
| `/philosophy/` | One page |
| `/model/` | One page |
| `/projects/` | 18 project pages, 19 guides across two of them |
| `/prompting/` | An index and 14 model guides |
| `/get-started/` | One page |
| `/contribute/` | One page |

Four of the six are single pages sitting at the same visual rank as a section holding thirty-seven. A reader scanning that bar cannot tell which links open a page and which open a body of material, and the two that are genuinely deep are the two that look least like it.

The user's proposal is that Prompting, Get Started, and Contribute are articles rather than destinations, and belong under a Docs section the way Paperclip's guides do. Whether Projects joins them or stays top-level is open — see the Discussion.

There is a branding argument that this is not merely borrowed. A section you enter, move through, and complete is an island. The site is already named for that idea and the navigation does not currently express it, so the structure and the name would agree for the first time.

## Boundary

This item is the information architecture and the navigation that expresses it: what the top bar holds, what a Docs landing page looks like, how sections are declared and counted, and how a reader moves within one. It is not a visual redesign — the token set, the prose treatment, and the existing page templates stay as they are, and `KI-WEB-SITE-032` and `KI-WEB-SITE-036` own anything that is about how the site looks rather than how it is arranged.

It does not commit to client-side search. Paperclip's `⌘K` is part of why its Docs section is navigable at 285 pages; at this site's scale it may not be, and adding a search index is its own decision with its own cost. Raise it separately if the restructure makes it necessary.

It does not rewrite page content. A page that moves keeps its prose, its `sources` declaration, and its provenance footer. Where a moved page's opening line refers to its old position, that is a consequence of the move and gets fixed with it — but re-authoring for voice is not in scope and has its own history in `KI-WEB-SITE-025`.

Every moved page needs a 301. `src/redirects.njk` already carries 65 lines of them from the last restructure, and `verify-reachable.ts` is what proves the new tree is still navigable from the root.

## Discussion

### The question that decides the shape: does Projects go under Docs?

Two readings, and they lead to different sites.

**Projects stays top-level.** Docs then holds Prompting, Get Started, Contribute, and Optional Tools — the material about using the ecosystem — while Projects remains the catalogue of what the ecosystem _is_. This matches Paperclip less closely but matches the current content better: a project page is a registry entry with reader fields, not an article, and `verify-projects.ts` enforces that distinction today. It also keeps the per-project guides where `KI-WEB-SITE-025` deliberately put them, next to the project they describe.

**Projects goes under Docs.** The top bar becomes exactly Philosophy, Model, Docs, which is the cleanest expression of the idea and the closest to the reference. But it puts the project catalogue behind a word that promises documentation, and it would make the harness's ten guides reachable by two different routes — through Docs, and through the project — which is the ambiguity `verify-reachable.ts` exists to keep honest.

The first is the safer default and the second is what the user described. The deciding question is whether Projects is a catalogue or a section, and that is a judgment about what this site is for rather than something the content can settle.

### Whether to copy the Learn / Reference split

Probably not, at this scale. That split earns its place across 285 pages because it separates material you read once from material you return to. This site has roughly 40 instructional pages, and imposing two buckets on them would produce categories of three and four — which communicates less than no split at all. The page-count-per-card affordance is worth taking regardless; it is what makes a section read as finite.

### What the sections would plausibly be

Not a commitment, but the shape is visible from what exists: Get Started, Prompting (14 pages, already exactly the size the user liked), Contribute, Optional Tools, and — depending on the question above — one section per project that has guides. That is four or six sections, most of them small. Two of them are currently a single `.njk` page each, so the restructure would either grow them into real sections or admit they are one-page sections and let the card say so.

### Why this is triage rather than scheduled

The direction is clear and the open question above is not answerable by an agent. It needs the user to say what Projects is. Writing the steps before that is answered would produce a plan for whichever reading was guessed, and the two readings do not share an implementation.

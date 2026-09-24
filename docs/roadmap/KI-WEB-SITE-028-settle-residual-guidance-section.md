---
id: KI-WEB-SITE-028
area: SITE
title: Settle residual guidance section
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

The fifteen pages that belong to no Knowledge Islands project get a home whose name says what they are, and the site's top-level navigation stops offering "Guidance" as a category when the guidance a reader most wants now lives with the projects.

## Context

`KI-WEB-SITE-025` moved nineteen pages out of `/guidance/` and into the projects that own them. What remained was never a designed collection: fourteen prompting guides for third-party models — GPT, Gemini, Llama, Qwen, Mistral, DeepSeek, GLM, Gemma, and the Claude family — plus `recommended-tools`, plus a hub page rewritten to introduce exactly those.

These pages are good and they are genuinely ours: original editorial judgment about how to work with models this project does not own. What they are not is "guidance" in the sense the site's navigation implies. A reader who clicks **Guidance** expecting help with Knowledge Islands lands on a page about prompting other vendors' models, while the guidance they wanted sits under **Projects**.

That concern was recorded in `KI-WEB-SITE-025`'s outstanding concerns as an open question the item deliberately did not answer, and it was lost when that record was pruned.

The naming problem is compounded by the developer guides. `docs/guides/developer/` still calls three files `guidance-ownership`, `guidance-provenance` and `guidance-reachability`, all of which now govern `src/projects/` as much as `src/guidance/`. The word is doing two jobs and neither well.

## Boundary

This item decides the residual set's home, name, and navigation position. It does not rewrite the fifteen pages' content — they are not the problem. It does not move any project-owned guide, revisit the `KI-WEB-SITE-025` split, or change the `verify:guidance` and `verify:reachable` gates beyond whatever a directory rename requires. It does not rename the developer guides under `docs/guides/`; that is `KI-WEB-SITE-031`. It does not add new prompting pages.

## Current state

`apps/site/src/guidance/` holds `index.md`, `recommended-tools.md`, and `prompting/` with fourteen model pages and its own index. `src/_data/site.ts:12` carries `{ label: 'Guidance', href: '/guidance/' }` in the top-level navigation. `verify:guidance` and `verify:reachable` both name `guidance` explicitly and would need to follow any directory rename. Redirects from the moved pages already point into `/projects/`, so the historical addresses are covered; a further rename would add a second layer of them.

Nothing currently distinguishes, in a reader's path through the site, material about Knowledge Islands from material about working with language models generally.

## Steps

- [ ] Decide the outcome from the options in Discussion, and record the reasoning where a future reader will find it.
- [ ] Rename the directory and permalinks if the decision is a rename, and add a 301 per moved page in `src/redirects.njk` in the style of the existing `/tooling/*` block.
- [ ] Update `src/_data/site.ts` navigation to the chosen label and route.
- [ ] Follow the rename through `verify-guidance-sources.ts` and `verify-guidance-reachable.ts`, which name the directory.
- [ ] Rewrite the hub page's opening so it introduces the collection by what it actually is.
- [ ] Update the references to `/guidance/` in `docs/guides/developer/` prose, leaving the historical mentions in `docs/decisions/` and `docs/roadmap/` untouched.

## Files touched

- `apps/site/src/guidance/` and everything beneath it
- `apps/site/src/_data/site.ts`
- `apps/site/src/redirects.njk`
- `apps/site/scripts/verify-guidance-sources.ts`, `apps/site/scripts/verify-guidance-reachable.ts`
- `docs/guides/developer/*.md` prose references

## Verify

- `bun run ki:site:clean && bun run ki:site:build` passes, with `verify:reachable` proving every page in the renamed collection is still reachable by navigating from `dist/index.html`.
- Every retired address resolves through `dist/_redirects` to its new one.
- Read the navigation as a stranger: the label predicts what the section contains.

## Dependencies / blocks

No item blocks this. It is worth doing before `KI-WEB-SITE-031` renames the developer guides, because the name chosen here is the word those files should use — but that is sequencing preference, not build order, and either order works with one extra pass.

## Documentation impact

### Decision Records

Likely one, if the outcome is a rename or a navigation change. The site's section structure is what `ADR-KI-WEBSITE-002` settled for projects, and the residual collection is the part that decision did not cover. A record here says what the site's top-level sections are and why this material is not a project.

### Specifications

None. No published interface or machine route is involved.

### Guides

`docs/guides/README.md` and `docs/guides/developer/README.md` both describe the split and would follow the chosen name.

### Roadmap

None expected.

## Discussion

### The options

**Rename in place.** `/guidance/` becomes something that names the content — `/prompting/` if the fourteen model pages are the collection and `recommended-tools` moves elsewhere, or a broader label if the two belong together. Cheapest, and it fixes the mismatch a reader actually hits.

**Demote from top-level navigation.** Keep the route, drop the nav entry, and reach the pages from a hub or from `/get-started/`. Honest about the collection's weight relative to Projects, at the cost of discoverability for pages that are among the site's best.

**Split.** `recommended-tools` is advice about a working environment and belongs near getting started; the fourteen prompting pages are a reference collection. Two homes, each named for what it holds. More work, and the cleanest result.

**Leave it.** Defensible only if the collection is about to grow into something that earns the general name. Nothing currently suggests it will.

The split reads strongest, because the discomfort is not one bad name but one directory holding two unrelated things.

### What the name has to survive

Whatever is chosen has to still make sense when the site publishes prompting guidance for a model released after it. Naming the collection after the current vendor set would be a name with an expiry date.

### Why this is not urgent but is worth doing

Nothing is broken: the pages are reachable, gated, and provenanced. The cost is comprehension, paid by every first-time reader, and it compounds quietly — each new page added under a name that does not fit makes the eventual correction larger.

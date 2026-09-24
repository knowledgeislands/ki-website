---
id: KI-WEB-SITE-028
area: SITE
title: Settle residual guidance section
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: fae4a6b7f4ddef245ebf4770f5f9b07e32eba441
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:27:50Z
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

Delivered. The residual set was split, because the discomfort was never one bad name but one directory holding two unrelated things under a third.

`apps/site/src/prompting/` holds the thirteen model guides and their index, published at `/prompting/` and carrying the top-level navigation entry that `Guidance` used to hold. `apps/site/src/optional-tools/` holds the one page about a reader's own machine, published at `/optional-tools/` and reached from the two guides that have a reason to send a reader there. `apps/site/src/guidance/` no longer exists, and neither does `/guidance/`.

## Steps

- [x] Decide the outcome from the options in Discussion, and record the reasoning where a future reader will find it.
- [x] Split the directory: `src/guidance/prompting/` becomes `src/prompting/`, `src/guidance/recommended-tools.md` becomes `src/optional-tools/index.md`, and the hub page is retired with the collection it introduced.
- [x] Add a 301 per retired address in `src/redirects.njk`, in the style of the existing `/tooling/*` block.
- [x] Update `src/_data/site.ts` navigation to the chosen label and route.
- [x] Follow the rename through `verify-guidance-sources.ts` and `verify-guidance-reachable.ts`, which name the directory.
- [x] Rewrite the surviving index's opening so it introduces the collection by what it actually is, carrying forward the orientation the retired hub held.
- [x] Update the references to `/guidance/` in `docs/guides/developer/` prose, leaving the historical mentions in `docs/decisions/` and `docs/roadmap/` untouched.

## Files touched

- `apps/site/src/guidance/` — retired; `prompting/` and `recommended-tools.md` moved out, `index.md` and `guidance.json5` deleted
- `apps/site/src/prompting/` and `apps/site/src/optional-tools/`, each with its own directory data file
- `apps/site/src/_data/site.ts`, `apps/site/src/redirects.njk`, `apps/site/src/sitemap.njk`, `apps/site/src/_includes/partials/up-link.njk`
- `apps/site/scripts/verify-guidance-sources.ts`, `apps/site/scripts/verify-guidance-reachable.ts`
- `apps/site/src/projects/ki/getting-started.md` and `apps/site/src/projects/ki-agentic-harness/tuning.md`, where they link the moved page
- `docs/guides/README.md`, `docs/guides/developer/{guidance-ownership,guidance-provenance,guidance-reachability,project-guides}.md`, `AGENTS.md`
- `docs/roadmap/KI-WEB-SITE-028-settle-residual-guidance-section.md`

## Verify

- `bun run ki:site:clean && bun run ki:site:build` passes. `verify:guidance` reports 34 pages provenanced, `verify:reachable` reports 52 published pages reachable from the home page with no warnings, `verify:guides` reports the nineteen project guides unaffected, and `verify:prose` reports 152 prose regions against 17 styled elements.
- `dist/guidance/` is absent from the built tree, and no `href` in any built page contains `guidance/` other than one external link to OpenAI's own documentation.
- Every retired address has a rule in `dist/_redirects`: a splat for the model pages, the bare `/guidance/prompting` that a splat does not match, `/guidance/recommended-tools`, and `/guidance` itself.
- `/guidance/using-ki/recommended-tools` now points straight at `/optional-tools/` rather than at a rule that redirects again; Cloudflare does not follow a chain.
- `ki repo audit --skill ki-engineering --repo .`, `--skill ki-authoring`, `--skill ki-repo-website-content` and `--skill ki-work-roadmap` all pass.

## Dependencies / blocks

No item blocks this. It is worth doing before `KI-WEB-SITE-031` renames the developer guides, because the name chosen here is the word those files should use — but that is sequencing preference, not build order, and either order works with one extra pass.

## Documentation impact

### Decision Records

One, written by `KI-WEB-SITE-030` rather than here. The site's section structure is what `ADR-KI-WEBSITE-002` settled for projects, and both this item and `KI-WEB-SITE-025` changed the part that decision did not cover. Those are one structural decision — where a page lives is decided by what it is about — so `KI-WEB-SITE-030` writes one record covering both halves rather than this item writing a record that the next item immediately merges.

### Specifications

None. No published interface or machine route is involved.

### Guides

`docs/guides/README.md` and the three `guidance-*` developer guides all named `src/guidance/` and follow the split. `project-guides.md`'s "What stays in `/guidance/`" section becomes "What belongs to no project", because there is no longer a `/guidance/` for anything to stay in.

### Roadmap

`KI-WEB-SITE-030` gains the structural record described above. `KI-WEB-SITE-031` renames the three `guidance-*` developer guides; the word this item settles is the word those files should use, which is why it ran first.

## Review

### Delivered

The fifteen pages that belonged to no project now live at two addresses that each name what they hold, and the site's top-level navigation offers `Prompting` — a category a reader can predict — in place of `Guidance`, which by this week described neither half of what sat under it.

### Summary of changes

`src/guidance/prompting/` became `src/prompting/`, keeping its thirteen model guides and index; the directory data file moved with it, so every page is still styled because of where it lives rather than because of a frontmatter line. `src/guidance/recommended-tools.md` became `src/optional-tools/index.md` at `/optional-tools/` — the name every inbound link already used for it in prose. The hub page was retired: its only remaining job was introducing a collection that no longer exists, and the orientation it carried, that a project's own guides live on the project's pages, moved into the prompting index where a reader who arrives from the navigation will meet it.

`site.ts` swapped the navigation entry. `up-link.njk`'s escape route now points at `/prompting/` for a prompting guide. `verify-guidance-sources.ts` and `verify-guidance-reachable.ts` follow the three trees rather than two. Four gate-adjacent developer guides and `AGENTS.md` stopped naming a directory that is gone.

The sitemap changed more than a rename required, and deliberately. It carried `/guidance/` as a single hand-written URL, which meant thirteen model pages were never submitted at all; a loop over the pages under `/prompting/` replaces it. Leaving that as-is would have produced a sitemap listing one address for a collection of fourteen, which is a defect this item would have been walking past rather than one it introduced.

### Verification

The clean build passes all seven gates with the figures in Verify above. `dist/guidance/` is gone and no built page links into it. Every retired address resolves in `dist/_redirects`, including the bare `/guidance/prompting`, which Cloudflare's splat does not match and which therefore needed its own rule. The pre-existing chain from `/guidance/using-ki/recommended-tools` was collapsed to point directly at the final address, because `_redirects` does not follow one rule into another.

### Outstanding concerns

**`/optional-tools/` lost a navigation path and gained a better one.** It used to be two clicks from the top-level `Guidance` entry. It is now reached from the `ki` getting-started guide and the harness tuning guide, which is where a reader who needs it actually is, but there is no browsing route to it for somebody who is not already reading about the tooling. That is the honest position for a single page about a reader's own machine, and it is worth revisiting if a second such page ever appears — which is why it has a directory rather than sitting loose in `src/`.

**No Decision Record was written here.** The reasoning is in Documentation impact: this and `KI-WEB-SITE-025` are halves of one structural decision, and `KI-WEB-SITE-030` writes it as one record. Until that item lands, the site's section structure is recorded only in this item and in `project-guides.md`. That is a gap of hours rather than of principle, but it is a gap.

**`/prompting/` in the navigation is a judgment, not a derivation.** The alternative was dropping the entry entirely and reaching the collection from elsewhere. Thirteen model guides are the largest collection on the site outside the projects, and burying them to avoid an awkward-looking navigation row would have cost a reader more than the row costs. If the collection ever stops being worth a top-level entry, the entry is one line to remove.

### Post-change review

The goal is met. A reader clicking the navigation now lands where the label promised. The item's useful finding is that the naming problem and the structural problem were the same problem: the word "guidance" was load-bearing in a directory name, a navigation label, two script names, four guide filenames and a gate's failure messages, and every one of those was describing a different set of pages by the end. Splitting the directory made the remaining misuse visible rather than fixing it — the three `guidance-*` developer guides still carry the word, which is `KI-WEB-SITE-031`.

The risk introduced is bounded to addresses, and addresses are what redirects are for. The one thing a redirect cannot repair is an external link to `/guidance/` landing on `/prompting/` when the reader wanted the tools page; that is the cost of retiring a hub with two unrelated children, and it is small against fourteen pages that now sit at an honest address.

### Mini recap

`KI-WEB-SITE-028` split the residual guidance collection in two: `/prompting/` for the thirteen model guides and their index, `/optional-tools/` for the one page about a reader's machine. The `/guidance/` hub and directory are retired, the navigation entry became `Prompting`, both gate scripts follow the new trees, every retired address has a 301, and the sitemap now lists every prompting page rather than one hub URL. The structural Decision Record is `KI-WEB-SITE-030`'s to write, covering this and the `KI-WEB-SITE-025` move together.

## Discussion

### The options

**Rename in place.** `/guidance/` becomes something that names the content — `/prompting/` if the fourteen model pages are the collection and `recommended-tools` moves elsewhere, or a broader label if the two belong together. Cheapest, and it fixes the mismatch a reader actually hits.

**Demote from top-level navigation.** Keep the route, drop the nav entry, and reach the pages from a hub or from `/get-started/`. Honest about the collection's weight relative to Projects, at the cost of discoverability for pages that are among the site's best.

**Split.** `recommended-tools` is advice about a working environment and belongs near getting started; the fourteen prompting pages are a reference collection. Two homes, each named for what it holds. More work, and the cleanest result. **Chosen**, with one correction found in execution: `/get-started/` turned out to be about the Knowledge Islands model — Charter, Council, Archipelagos — and not about setting up a machine at all, so `optional-tools` has its own address and is reached from the tooling guides rather than from there.

**Leave it.** Defensible only if the collection is about to grow into something that earns the general name. Nothing currently suggests it will.

The split reads strongest, because the discomfort is not one bad name but one directory holding two unrelated things.

### What the name has to survive

Whatever is chosen has to still make sense when the site publishes prompting guidance for a model released after it. Naming the collection after the current vendor set would be a name with an expiry date.

`prompting` and `optional-tools` both pass that test: neither names a vendor, a model generation, or a tool. The pages inside carry the version — `opus-4-8`, `gpt-5-5`, `glm-5-2` — which is the right place for it, because a new generation then adds a file instead of dating the directory that holds it.

### Why this is not urgent but is worth doing

Nothing is broken: the pages are reachable, gated, and provenanced. The cost is comprehension, paid by every first-time reader, and it compounds quietly — each new page added under a name that does not fit makes the eventual correction larger.

---
id: KI-WEB-SITE-025
area: SITE
title: Guides belong to projects
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 4f1ea1c17093695abee9bc453f5227eb1121b0dc
created_at: 2026-09-22T15:50:00Z
updated_at: 2026-09-22T17:30:01Z
---

## Goal

A reader who wants to use a project finds its guides on that project's pages, written in the site's own voice, rather than in a separate section that routes them into somebody's repository.

## Context

`/guidance/` reads as a routing layer over other repositories' work. Thirty-five pages carry seventy links into GitHub; `/projects/ki/operator-guides/` contains six literal `[The full guide](…/tools-ki/blob/v0.4.0/docs/guides/…)` deferrals, and `/guidance/recommended-tools/` carries sixteen outbound links of its own. That is the failure GDR-KI-WEBSITE-002 was written against: a repository link should survive as a stated fact, not as the place the answer actually lives.

The corpus also splits cleanly by owner. Eight pages restate `tools-ki` material, twelve restate `ki-agentic-harness` material, and the remaining fifteen — fourteen model prompting guides and `recommended-tools` — belong to no project at all. A section organised by "guidance" hides that; a site organised by project makes it obvious, and makes the owner of each page a fact the build can check.

## Boundary

This site. The guide shape defined here is worth feeding back into `tools-ki` and `ki-agentic-harness` `docs/guides/`, but those repositories own their own documentation and get a handoff, not an edit.

`/guidance/` is not deleted. The fifteen pages that belong to no project stay there as a residual set while it is clear whether they earn a section of their own; the hub is rewritten for exactly what remains.

Voice is in scope and is the bulk of the work. A page that moves to `/projects/ki/` and still says the full guide is elsewhere has fixed nothing.

## Shaping

**Ownership becomes structure.** A guide lives under the project it is about, at `/projects/<slug>/<page>/`, and the directory data file beside it declares `project: <slug>`. The gate resolves that against the registry, so a guide cannot belong to a project that does not exist and a renamed slug fails the build rather than the link. Binding on the directory rather than on each page means a guide added later is owned, styled and listed because of where it lives.

**The deferral is the defect, so the gate names it.** Link text may not be a hand-off phrase — `the full guide`, `see the README`, `read more`, a bare `here`. A repository link as a citation of a fact is fine and stays. This is the mechanical form of the ownership test.

**Provenance is unchanged.** Every moved page keeps its `sources` declaration and the footer `KI-WEB-SITE-024` gave it; `verify-guidance-sources.ts` widens to cover the new locations rather than being relaxed.

**The project page surfaces its guides.** `project.njk` grows a Guides section from a collection keyed on `project`, in the same shape as the Nearby block it already renders. A project with no guides renders no section.

## Current state

| Destination | Pages | Source |
| --- | --- | --- |
| `/projects/ki/` | 9 | `guidance/cli/` (7), `using-ki/command-line-interface`, `using-ki/getting-started` |
| `/projects/ki-agentic-harness/` | 10 | `guidance/skills/` (3), `guidance/using-ki/` (5), `guidance/repositories/`, `guidance/harnesses/` |
| Residual `/guidance/` | 15 | `guidance/prompting/` (14), `using-ki/recommended-tools` |

`ki-agentic-harness` is a special case: its registry entry carries `route: '/projects/ki-agentic-harness/installing-a-harness/'`, so a guidance page is currently the whole of that project's page on the site.

## Steps

- [x] Write the guide-page contract down, and gate it with `verify-guides.ts` before moving anything.
- [x] Move the `tools-ki` pages under `/projects/ki/` and the harness pages under `/projects/ki-agentic-harness/`, with directory data binding each to its project.
- [x] Drop the harness entry's `route` so its page generates like every other project's, and give it the reader fields a generated entry requires.
- [x] Move the four overlapping pages as guides rather than folding them, since each carries material nothing else holds.
- [x] Rewrite the deferrals: every page carries what the reader needs, with the repository link as a citation.
- [x] Surface each project's guides on its page, and rewrite the `/guidance/` hub for the residual set.
- [x] Redirect every moved URL, and prove the moved pages are still reachable by navigating.

## Files touched

- `apps/site/src/guidance/**` — the pages that move, and the hub that remains.
- `apps/site/src/projects/<slug>/` — their new homes, with directory data per project.
- `apps/site/src/projects/project.njk` — the Guides section.
- `apps/site/src/_data/projects.json5` — the harness entry's route and reader fields.
- `apps/site/scripts/verify-guides.ts`, `verify-guidance-sources.ts`, `verify-guidance-reachable.ts`, `apps/site/package.json`.
- `apps/site/eleventy.config.ts` — the `guides` collection; `apps/site/src/sitemap.njk`; `apps/site/src/_includes/partials/up-link.njk`.
- `apps/site/src/redirects.njk` — a 301 per moved page.
- `docs/guides/developer/project-guides.md` — the contract.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes with `verify:guides` in the chain, and `verify:reachable` proves every moved page is still on the far end of a link from the home page. The new gate fails a guide naming an unknown project and fails a deferral link, both demonstrated and restored. No banned phrase appears anywhere in the built output. Every retired URL has a 301 in the built `_redirects`.

## Dependencies / blocks

Unblocked. `KI-WEB-SITE-024` is sequenced before it so the moved pages land already styled.

## Documentation impact

### Decision Records

None expected. GDR-KI-WEBSITE-002 already states the ownership test this item implements; implementing a decision is not changing it.

### Specifications

None. `/install/<slug>` is untouched.

### Guides

`docs/guides/developer/project-guides.md` is new and carries the contract. `guidance-ownership.md` needs its scope updated now that project-owned material has a home.

### Roadmap

A handoff is owed to `tools-ki` and `ki-agentic-harness` once the contract is proven here, so their own `docs/guides/` can adopt the same shape. Recorded in the Review rather than written into those repositories from here.

## Review

### Delivered

Nineteen guidance pages now live under the project they are about, at `/projects/ki/<page>/` and `/projects/ki-agentic-harness/<page>/`. `/guidance/` keeps the fifteen that belong to no project — the fourteen prompting pages and `recommended-tools` — and its hub was rewritten for exactly that, saying plainly that a project's guides live with the project.

Ownership is structural rather than declared per page. A directory data file — `src/projects/ki/ki.json5` — sets `layout` and `project` for everything beside it, so a guide added later is bound, styled and listed because of where it lives. `verify-guides.ts` is new and checks that file against the registry, then checks each page for an opening claim of at least 120 characters and for link text that hands the reader off. The six `[The full guide](…)` deferrals in `operator-guides.md` are gone: each now states the fact and cites the procedure by name and release.

`ki-agentic-harness` stopped pointing at a guide. Its registry entry dropped `route: '/guidance/harnesses/'` and gained the five reader fields a generated entry requires, so it has an ordinary project page like every other entry, and the page that used to be its whole presence on the site is now one of its ten guides.

Four pages the plan expected to fold turned out to carry nine hundred to thirteen hundred words each of material nothing else holds, so they moved as guides instead of being compressed into registry fields. Nothing was folded away and no material was lost.

A `guides` collection in `eleventy.config.ts` drives three things that would otherwise be hand-maintained: the Guides block on each project page, the upward link on each guide, and the sitemap entries. `verify-guidance-sources.ts` now reads `src/projects/` as well as `src/guidance/`, and `verify-guidance-reachable.ts` holds `dist/projects/` to the same fail-level standard as `dist/guidance/`, so moving a page sheds neither its provenance nor its reachability.

### Summary of changes

| File | Change |
| --- | --- |
| `apps/site/src/projects/ki/**` (10) | Nine guides plus the directory data file that binds them. |
| `apps/site/src/projects/ki-agentic-harness/**` (11) | Ten guides plus its directory data file. |
| `apps/site/src/guidance/` | Reduced to the hub, `recommended-tools`, and `prompting/`; the hub rewritten for the residual set. |
| `apps/site/src/_data/projects.json5` | Harness entry: `route` dropped, five reader fields added. |
| `apps/site/src/projects/project.njk` | The Guides block. |
| `apps/site/eleventy.config.ts` | The `guides` collection. |
| `apps/site/src/_includes/partials/up-link.njk` | Renamed from `guidance-up.njk`; a guide's way up is its project. |
| `apps/site/src/redirects.njk`, `sitemap.njk` | Twenty-one 301s; sitemap generated from the collection. |
| `apps/site/scripts/verify-guides.ts` | New gate: binding, opening claim, no deferral. |
| `apps/site/scripts/verify-guidance-sources.ts`, `verify-guidance-reachable.ts` | Widened to `src/projects/` and `dist/projects/`. |
| `docs/guides/developer/project-guides.md` | New; the contract. |
| `docs/guides/developer/{README,guidance-provenance,guidance-reachability,guidance-ownership,projects-directory}.md`, `docs/guides/README.md`, `CLAUDE.md` | Scope updated to two trees. |

### Verification

`bun run ki:site:clean && bun run ki:site:build` passes all six gates: 4 tool routes, 18 project entries, 35 pages of provenance, 19 guides across 2 project directories, 53 published pages reachable from the home page, 153 prose regions against 17 styled elements.

The new gate was shown to fail rather than assumed to, twice and restored each time: a directory data file declaring `project: 'ki-cli'` produced `src/projects/ki/ki.json5: declares project "ki-cli", but sits at src/projects/ki/`, and an appended `[The full guide](…)` produced `a link reads "the full guide", which names a destination rather than a fact the page states`.

Independently of the gates: zero anchors in `dist/` carry any of the sixteen banned link texts, and every one of the twenty-one redirect targets in the built `_redirects` resolves to a file that exists in `dist/`.

`verify:guidance --network` reports warnings only — `tools-ki`'s `man/ki.1` has moved past `v0.4.0` — and resolved 38 repository sources and 13 prose links before GitHub's unauthenticated rate limit stopped the sweep.

Audits: `ki-work-roadmap`, `ki-authoring`, `ki-guides`, `ki-repo-website-content` and `ki-repo-website` pass. `ki-engineering` passes with the pre-existing `turbo.json` warning.

### Outstanding concerns

The upstream drift the network sweep reports is real and predates this item: eight pages cite `man/ki.1` at `v0.4.0`, which `tools-ki` has since moved past. Refreshing them against a newer release is its own item, not this one — the pages correctly declare the ref they were written from.

`/guidance/` is still in the navigation, now pointing at fifteen pages about other people's models and tools. Whether that earns a top-level nav entry, a different name, or a home somewhere else is the open question the residual set was kept to answer.

The rendering was verified from the built markup, not from a browser — the same limitation `KI-WEB-SITE-024` recorded, for the same reason — so the Guides block's appearance on a project page is owed a visual check after the next deploy.

The `order` frontmatter key is optional and ungated. A guide without one sorts last, which is a reasonable default but means a project's reading order can silently degrade as pages are added.

### Post-change review

The interesting decision was where the binding lives. The contract was written first, with `project: <slug>` in each page's frontmatter, and the gate enforced it — then the pages moved into directories that already had to carry a data file for the layout, and the frontmatter line became a second place to say the same thing. Two declarations of one fact is how they drift. Moving the binding into the directory data made the gate simpler and made ownership structural: a page cannot be in `src/projects/ki/` and belong to something else, because nothing about the page says what it belongs to.

The other finding was that the page-count estimates in this item's own Current state table were made from directory listings rather than from reading the pages. Four pages marked "fold into an existing page" held about four thousand words between them, none of it duplicated elsewhere. Folding them as planned would have destroyed material in the name of tidiness — and the plan would have looked delivered.

Restoring one file with `git checkout` after a negative test also silently reverted it to its staged state from the `git mv`, discarding the URL rewrite and the `order` key applied afterwards. Caught by inspection immediately after; worth remembering that a staged rename makes the index an older copy than the working tree.

### Mini recap

Dissolved `/guidance/` into the projects that own it: nineteen guides moved under `/projects/ki/` and `/projects/ki-agentic-harness/`, bound by directory data rather than per-page frontmatter, surfaced by a generated Guides block on each project page, and gated by a new `verify:guides` that refuses a page without an opening claim or with link text that hands the reader off. The harness stopped using a guidance page as its project page. Fifteen pages that belong to no project stayed behind under a rewritten hub. Verified by a clean build through six gates, two demonstrated-and-restored negative tests, zero deferral anchors in `dist/`, and twenty-one redirects that all resolve.

## Done

Accepted 2026-09-22 by Kris Brown on the review packet above.

## Discussion

---
id: KI-WEB-SITE-021
area: SITE
title: Retire specifications section
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-22T09:15:00Z
updated_at: 2026-09-22T10:00:00Z
---

## Goal

The site stops publishing a specifications section, because the corpus behind it is not ready to be presented to readers.

## Context

The owner's instruction: take specifications off the website, because it is not ready.

`/specifications/` is 205 words of orientation plus seven outbound links to the KI Specifications repository. It promises normative contracts — KIPs, KIS documents, schemas, conformance rules — and delivers a signpost. A section that advertises material a reader cannot yet use is worse than no section, because the navigation entry makes the promise before the page can qualify it.

## Boundary

This retires the section from the site. It does not delete anything in `ki-specifications`, and it does not judge that corpus — only its readiness to be published here.

## Shaping

**The route is removed and redirected, not kept and unlisted.** An unlinked page still makes the promise — a reader who has the URL, or who arrives from a search engine, meets a section advertising normative contracts that are not ready. Unlisting hides the problem from the navigation while leaving it in place for exactly the reader most likely to care.

The redirect target is the home page rather than the projects entry for `ki-specifications`, since that entry is routeless and would be a second dead end.

**Nothing in `ki-specifications` changes.** This is a judgement about readiness to publish here, and the item should not be read as a judgement of that corpus.

**The four remaining inbound references are rewritten individually.** Each sentence needs a different repair: some can drop the reference, others need to point at the repository directly. A blanket find-and-replace would leave dangling prose.

## Current state

`/specifications/` is a single `.njk` route with no children. Nothing contractual depends on it: `verify:routes` covers only the `/install/<slug>` installer routes, and `verify-projects.ts` does not reference it.

Five source files link to it: `apps/site/src/guidance/cli/operator-guides.md`, `apps/site/src/guidance/skills/by-outcome.md`, `apps/site/src/guidance/skills/index.md`, `apps/site/src/projects/index.njk`, and `apps/site/src/tooling/index.njk`. The last of those disappears with `KI-WEB-SITE-020` either way.

`ki-specifications` is one of the three registry entries in `projects.json5` that is deliberately routeless, so the project registry already records the repository without publishing a page for it.

## Steps

- [ ] Remove the `Specifications` entry from the navigation in `apps/site/src/_data/site.ts`.
- [ ] Remove `apps/site/src/specifications/` and redirect `/specifications/` rather than letting a held URL 404.
- [ ] Rewrite the four remaining inbound references so they do not dangle — each should either drop the reference or point at the repository directly, depending on what the sentence needs.
- [ ] Run `bun run ki:site:clean` before building, so the retired route leaves `dist/`.
- [ ] Note in the projects registry entry for `ki-specifications` that the corpus is not yet published here, so a later reader does not restore the section by accident.

## Files touched

- `apps/site/src/specifications/index.njk` — removed.
- `apps/site/src/_data/site.ts`.
- `apps/site/src/guidance/cli/operator-guides.md`, `apps/site/src/guidance/skills/by-outcome.md`, `apps/site/src/guidance/skills/index.md`, `apps/site/src/projects/index.njk`.
- `apps/site/src/_data/projects.json5`.
- The `_redirects` source.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes with no `dist/specifications/` output, no navigation entry, and no remaining internal link to the route. `/specifications/` redirects rather than 404s. `verify:guidance` still passes over the four edited guidance pages.

## Dependencies / blocks

Not blocked. Overlaps `KI-WEB-SITE-020` only in that both edit `site.ts` navigation and `projects/index.njk`; whichever lands second reconciles.

## Documentation impact

### Decision Records

Probably not on its own. If `KI-WEB-SITE-020` records the retirement of a top-level section, this belongs in the same record rather than a second one.

### Specifications

None. The site publishes no contract, and this changes nothing in `ki-specifications`.

### Guides

None.

### Roadmap

Worth a note to `ki-specifications` that the site has stopped publishing an entry point, so that repository knows the site is no longer a route to it. Informational, not a blocking handoff.

## Discussion

The reversible question is whether the route is deleted or kept and unlisted. Deleting plus redirecting is cleaner and is what this item assumes; keeping an unlinked page means the promise still exists for anyone who finds it, which is the thing the owner objected to.

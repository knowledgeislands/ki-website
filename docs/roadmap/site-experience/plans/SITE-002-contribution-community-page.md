---
id: 'SITE-002'
title: Contribution Community page
status: done
roadmap: site-experience/contribution-community-page
blocks: —
blocked-by: —
baseline-ref: 0b5d1023fab26219ddf6e9e66ba5b51d75cb4f51
---

## Context

The site describes the Contribution Process across the Model and Get Started pages, but has no dedicated public page for islands and teams that want to contribute to the shared model.

The new page should complete that external-facing path without duplicating the internal setup guidance or inventing a submission mechanism.

## Current state

`site/src/get-started/index.njk` explains the Contribution Process, Arcadia's Council assessment, and federation alongside internal island setup.

`site/src/model/index.njk` defines the Contribution Process as external propagation, while `site/src/_data/site.ts` and `site/src/sitemap.njk` define the site's public route surfaces.

No contribution or community route currently exists.

## Steps

1. ✓ Add a source-grounded `/contribute/` page explaining the purpose of contribution, the generic-scope and Council-ratification constraints, and the distinction between contribution, territory, and archipelago.

2. ✓ Link the new page to the existing Model and Get Started routes for process and setup detail, without adding a submission form, contact promise, or governance rule not already published on the site.

3. ✓ Add a concise public-navigation entry and sitemap record for `/contribute/`, preserving the existing navigation items and route conventions.

4. ✓ Build from a clean output directory and confirm the generated route, navigation link, and sitemap entry; run the website and roadmap audits.

## Files touched

- `site/src/contribute/index.njk`
- `site/src/_data/site.ts`
- `site/src/sitemap.njk`
- `docs/roadmap/site-experience/ROADMAP.md`
- `docs/roadmap/site-experience/plans/SITE-002-contribution-community-page.md`

## Verify

- `bun run ki:site:clean`
- `bun run ki:site:build`
- `test -f site/dist/contribute/index.html`
- `rg 'href="contribute/index.html"' site/dist/index.html`
- `rg 'https://knowledgeislands.info/contribute/' site/dist/sitemap.xml`
- `ki repo audit --skill ki-website`
- `ki repo audit --skill ki-roadmap`

## Dependencies / blocks

This work has no plan dependencies and does not block another active plan.

## Acceptance

### Delivered

The site now has a public Contribution / Community page at `/contribute/`, linked from navigation and listed in the sitemap.

### Summary of changes

- Added `site/src/contribute/index.njk` with a source-grounded explanation of the Contribution Process, its generic-scope and Council-ratification constraints, and the island, territory, and archipelago distinction.
- Linked visitors to the existing Model and Get Started pages instead of creating a submission mechanism or new governance policy.
- Added the Contribute navigation item in `site/src/_data/site.ts` and the route in `site/src/sitemap.njk`.
- Strengthened the plan verification so generated navigation and sitemap surfaces are asserted separately.

### Verification

- `bun run ki:site:clean` — passed.
- `bun run ki:site:build` — passed; Eleventy wrote 12 files.
- `test -f site/dist/contribute/index.html` — passed.
- `rg 'href="contribute/index.html"' site/dist/index.html` — passed.
- `rg 'https://knowledgeislands.info/contribute/' site/dist/sitemap.xml` — passed.
- `ki repo audit --skill ki-website` — passed with no FAIL or WARN findings.
- `ki repo audit --skill ki-roadmap` — passed with no FAIL or WARN findings.
- Evidence revision: `46495d5fd6c069427dabc05faf732151e67c6095`.

### Outstanding concerns

None.

### Mini recap

The public page can be useful without a submission form when it states the existing governance boundary and routes visitors to the source pages that define the process.

## Done

The Contribution / Community page completed after manual acceptance.

Residual concern: none.

Intended follow-up: select later roadmap work separately.

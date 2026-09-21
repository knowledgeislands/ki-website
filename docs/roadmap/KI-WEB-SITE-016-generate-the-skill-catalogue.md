---
id: KI-WEB-SITE-016
title: Generate the skill catalogue
area: SITE
theme: site-experience
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T16:40:00Z
---

## Goal

`/guidance/skills/catalogue/` is built from the harness's own skill declarations rather than restated by hand, so a skill renamed or redescribed upstream cannot leave the site describing one that no longer exists.

## Context

`src/guidance/skills/catalogue.md` restates every harness skill's description in hand-written prose. It now declares `knowledgeislands/ki-agentic-harness` `skills/README.md` as its source, so `verify:guidance --network` will report when that file moves — but a warning still needs a person to re-read a long document and reconcile it line by line.

The catalogue is the one restating page where the derived account adds almost nothing. `by-outcome.md` earns its restatement: it routes a plain-language outcome to a capability, which is a genuinely different document from an inventory. The catalogue is the inventory, reworded.

`skills/README.md` upstream is itself generated, so the structured source exists. Generating from it would leave provenance to cover the pages that actually restate — which is what `docs/guides/developer/guidance-provenance.md` describes it as being for.

The open question is how the site reaches the data. Fetching at build time makes the build depend on a network and on another repository's default branch, which is exactly the coupling the pinned-ref discipline avoids elsewhere. A vendored snapshot advanced by an explicit handoff, like `tools.json5`, keeps the build hermetic and the advance deliberate.

## Boundary

This item covers the catalogue only. `by-outcome.md` and `skills/index.md` restate deliberately and keep their `sources` declarations.

It does not propose the site fetch from `main` at build time; if that is the only workable route, that is a finding to record rather than an assumption to build on.

## Shaping

- Decide the data route: build-time fetch, vendored snapshot advanced by handoff, or a generated artefact the harness publishes for consumers.
- Confirm what `skills/README.md` is generated from upstream, and whether that source is a stable interface or an implementation detail.
- Decide what the page does when the snapshot is stale — the tool-route registry warns rather than fails, and the same reasoning applies.
- Keep the page's framing prose, which orients the reader, separate from the generated inventory.

## Current state

`src/guidance/skills/catalogue.md` restates every harness skill's description in hand-written prose. It now declares `knowledgeislands/ki-agentic-harness` `skills/README.md` as its source and includes `partials/sources.njk`, so `verify:guidance --network` reports when that file moves. Nothing generates the inventory, so acting on the warning still means re-reading a long document line by line.

## Steps

- [ ] Confirm what `skills/README.md` is generated from upstream, and whether that source is a stable interface or an implementation detail.
- [ ] Decide the data route: build-time fetch, a vendored snapshot advanced by an explicit handoff, or a generated artefact the harness publishes for consumers.
- [ ] Separate the page's framing prose from the generated inventory so a regeneration cannot overwrite editorial judgment.
- [ ] Implement the chosen route and generate the inventory.
- [ ] Decide and implement what the page does when the snapshot is stale, following the tool-route registry's warn-rather-than-fail precedent.
- [ ] Reconcile the page's `sources` declaration with its new status, since a generated inventory cites differently from a restated one.

## Files touched

`apps/site/src/guidance/skills/catalogue.md`, a new generator or vendored data file under `apps/site/`, `apps/site/package.json` if a script is added, and `apps/site/scripts/verify-guidance-sources.ts` if generated pages declare sources differently.

## Verify

`bun run ki:site:build` passes, `/guidance/skills/catalogue/` renders every skill the harness declares, and deliberately staling the snapshot produces a warning rather than a build failure.

## Dependencies / blocks

Depends on what the harness publishes. A route that reads an artefact the harness maintains for consumers needs a handoff to `ki-agentic-harness`; a vendored snapshot does not, and can proceed alone. `KI-WEB-SITE-017` touches the same guidance tree but different pages.

## Documentation impact

### Decision Records

A decision record is owed if the site adopts a vendored cross-repository snapshot, since that is a standing coupling with a refresh obligation rather than a one-off page change.

### Specifications

No behaviour-level contract changes. The site publishes no contract; the catalogue's URL is unchanged.

### Guides

`docs/guides/developer/guidance-provenance.md` needs a statement of how a generated page declares provenance, which today's text does not cover. `docs/guides/developer/guidance-ownership.md` may need the generated case added to its test.

### Roadmap

If the chosen route needs something from the harness, that handoff is a new item there. Otherwise no roadmap change follows.

## Discussion

Shaping settles the design, not whether to act. The prompting question is whether the site wants a second inventory at all, or whether the catalogue should become a route into the harness's own.

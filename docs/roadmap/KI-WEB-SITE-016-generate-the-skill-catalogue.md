---
id: KI-WEB-SITE-016
title: Generate the skill catalogue
area: SITE
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T19:45:00Z
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

`apps/site/src/guidance/skills/catalogue.md` is 206 hand-written lines restating every skill in the harness, pinned at `7dcee9dc`. It is the page the provenance mechanism was built for and the one it serves worst: nothing detects a skill renamed, added, or removed upstream except the blunt fact that `skills/README.md` changed, which it does for every edit.

Shaping answered both open questions, and the answers are firmer than the item assumed.

**The upstream block is a published interface, not an implementation detail.** `skills/README.md` carries its inventory between `<!-- ki-repo-harness:capability-catalogue:start -->` and `<!-- ki-repo-harness:capability-catalogue:end -->` (lines 19–651 today). Those markers are named normatively in `ki-repo-harness`'s own standard, which specifies what the block publishes: source-domain groups, full descriptions, governance/process counts, runtime-neutral argument hints, required dependencies, and runtime bindings. `ki repo conform --skill ki-repo-harness` regenerates it from canonical `SKILL.md` frontmatter, and the harness's rubric tests assert both markers. Parsing between them is consuming a contract, not reverse-engineering a file.

**So no handoff is needed.** The item allowed for asking the harness to publish a machine-readable artefact; it already publishes a specified one. Asking for a second format would be asking for work that duplicates what exists.

**Build-time fetch is rejected, on the repository's own terms.** The neutral website seam requires `apps/site/dist/` to be reproducible, and `verify:guidance --network` is already a person's command rather than a build step for the same reason. A catalogue fetched at build time would make the output depend on when it was built and would fail offline.

That leaves a vendored snapshot pinned at an immutable ref, which is also the house preference for sharing across repositories and the shape `tools.json5` already uses. Staleness detection comes free: the page keeps its `sources` declaration, so the sweep extended in `KI-WEB-SITE-017` already warns when `skills/README.md` moves past the pinned ref — warn rather than fail, exactly the precedent this item wanted to follow.

One consequence needs stating plainly: the page stops being a restatement and becomes a vendored copy. `guidance-ownership.md`'s test asks whether the site is adding something for its reader. For the framing prose the answer stays yes; for the inventory it was always no, which is why it rotted. Provenance gains a third case — declared, restated, or vendored — and the guide has to say so.

## Steps

- [x] Confirm what `skills/README.md` is generated from upstream and whether it is a stable interface: it is, with normatively named markers and a specified field set.
- [x] Decide the data route: vendored snapshot pinned at an immutable ref. Build-time fetch rejected against the reproducible-`dist/` contract; no harness handoff needed.
- [ ] Add `apps/site/scripts/sync-skill-catalogue.ts`, which resolves `skills/README.md` at a given ref, parses the marker-delimited block into structured entries, and writes `apps/site/src/_data/skillCatalogue.json5` carrying the ref it was taken at.
- [ ] Cover the parser with tests, following `sync-tool-release.test.ts`: a pure parse function over fixture text, so the shape the site depends on is asserted rather than assumed.
- [ ] Rewrite `catalogue.md` as framing prose plus a Nunjucks loop over that data, keeping the editorial framing outside anything a regeneration overwrites.
- [ ] Make the ref mismatch mechanical: fail the build offline when the vendored snapshot's ref and the page's declared `sources` ref disagree, since that is a local inconsistency rather than upstream drift.
- [ ] Reconcile the `sources` declaration for a vendored page and record the vendored case in `guidance-provenance.md`.
- [ ] Wire the sync script into `apps/site/package.json` and confirm `bun run ki:site:build` passes with the generated page.

## Files touched

`apps/site/src/guidance/skills/catalogue.md`, `apps/site/scripts/sync-skill-catalogue.ts` and its test, `apps/site/src/_data/skillCatalogue.json5`, `apps/site/scripts/verify-guidance-sources.ts`, `apps/site/package.json`, and `docs/guides/developer/guidance-provenance.md`.

## Verify

`bun run ki:site:build` passes, `/guidance/skills/catalogue/` renders every skill the harness declares, and deliberately staling the snapshot produces a warning rather than a build failure.

## Dependencies / blocks

Not blocked. Shaping established that the vendored route needs nothing from `ki-agentic-harness`, so no handoff is owed. The standing dependency is on the catalogue markers and field set staying as `ki-repo-harness` specifies them; a change there breaks the parser, which is why the parser fails loudly rather than degrading.

## Documentation impact

### Decision Records

A decision record is owed: the site is adopting a vendored cross-repository snapshot, which is a standing coupling with a refresh obligation rather than a one-off page change. It should record why build-time fetch was rejected and what the site depends on upstream, so the next person meeting the coupling finds the reasoning rather than rediscovering it.

### Specifications

No behaviour-level contract changes. The site publishes no contract; the catalogue's URL is unchanged.

### Guides

`docs/guides/developer/guidance-provenance.md` needs a statement of how a generated page declares provenance, which today's text does not cover. `docs/guides/developer/guidance-ownership.md` may need the generated case added to its test.

### Roadmap

No handoff follows. The route consumes an interface the harness already publishes and specifies, so nothing is asked of it.

## Discussion

Shaping settles the design, not whether to act. The prompting question is whether the site wants a second inventory at all, or whether the catalogue should become a route into the harness's own.

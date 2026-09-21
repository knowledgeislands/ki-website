---
id: KI-WEB-SITE-016
title: Generate the skill catalogue
area: SITE
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 3ddcc869ed4844752905b7fd81fcab6d909b3513
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T20:40:00Z
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
- [x] Add `apps/site/scripts/sync-skill-catalogue.ts`, which resolves `skills/README.md` at a given ref, parses the marker-delimited block into structured entries, and writes `apps/site/src/_data/skillCatalogue.json5` carrying the ref it was taken at.
- [x] Cover the parser with tests, following `sync-tool-release.test.ts`: a pure parse function over fixture text, so the shape the site depends on is asserted rather than assumed.
- [x] Rewrite `catalogue.md` as framing prose plus a Nunjucks loop over that data, keeping the editorial framing outside anything a regeneration overwrites.
- [x] Make the ref mismatch mechanical: fail the build offline when the vendored snapshot's ref and the page's declared `sources` ref disagree, since that is a local inconsistency rather than upstream drift.
- [x] Reconcile the `sources` declaration for a vendored page and record the vendored case in `guidance-provenance.md`.
- [x] Wire the sync script into `apps/site/package.json` and confirm `bun run ki:site:build` passes with the generated page.

## Files touched

`apps/site/src/guidance/skills/catalogue.md`, `apps/site/scripts/sync-skill-catalogue.ts` and its test, `apps/site/src/_data/skillCatalogue.json5`, `apps/site/scripts/verify-guidance-sources.ts`, `apps/site/package.json`, and `docs/guides/developer/guidance-provenance.md`.

## Verify

`bun run ki:site:build` passes, `/guidance/skills/catalogue/` renders every skill the harness declares, and the two staleness cases behave differently on purpose: upstream movement past the pinned ref warns, while a snapshot whose ref disagrees with the page's citation fails offline.

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

## Review

### Delivered

The catalogue is now vendored from the harness's own published inventory rather than written by hand, and the change immediately corrected a bigger gap than the item anticipated: **the page listed 42 skills where the harness publishes 61**. Nineteen capabilities were simply absent from the site's catalogue. That is the concrete cost of a hand-maintained inventory, and it was invisible to the provenance sweep, which could only report that a long README had changed.

The route is the one shaping settled on. `sync-skill-catalogue.ts` resolves `skills/README.md` at an explicit immutable ref, parses the block between the two `ki-repo-harness:capability-catalogue` markers, and writes `src/_data/skillCatalogue.json5`. The page keeps its framing prose and renders the inventory from that data, so a regeneration cannot overwrite editorial judgment.

Two staleness cases now behave differently, and the difference is the point. Upstream moving past the pinned ref is a **warning** from the ordinary sweep — the harness editing its own README must not break this build. The snapshot's ref disagreeing with the page's citation is a **failure**, and an offline one, because that is the site publishing one thing while citing another. The second case is verified by a deliberate negative test rather than assumed.

The parser refuses rather than degrades. It cross-checks the entries it parsed against the counts the block states about itself, so a silently halved catalogue cannot reach `dist/`.

### Summary of changes

- `apps/site/scripts/sync-skill-catalogue.ts` — new; fetch, parse, and vendor, with a pure exported `parseCatalogue`.
- `apps/site/scripts/sync-skill-catalogue.test.ts` — new; 9 tests over fixture text, five of them asserting the parser refuses a shape it does not recognise.
- `apps/site/src/_data/skillCatalogue.json5` — new; the vendored snapshot at `7dcee9dc`.
- `apps/site/src/guidance/skills/catalogue.md` — 206 hand-written lines become framing prose plus a loop.
- `apps/site/scripts/verify-guidance-sources.ts` — the offline snapshot/citation agreement check.
- `apps/site/package.json` — `sync:skills`.
- `docs/decisions/ADR-KI-WEBSITE-001-…` and `docs/decisions/README.md` — the standing coupling recorded and indexed.
- `docs/guides/developer/guidance-provenance.md` — the vendored case, its narrow applicability, and the refresh command.

### Verification

- `ki repo audit` against `ki-engineering`, `ki-authoring`, `ki-decision-records`, `ki-guides`, and `ki-work-roadmap` — all PASS.
- `bun test scripts/sync-skill-catalogue.test.ts` — 9 pass, 0 fail.
- `bun run ki:site:clean && bun run ki:site:build` — passes from a clean tree.
- Rendered output inspected, not assumed: 61 `h3` entries across 8 domain headings, 318 `code` spans, no stray `pre` blocks.
- Negative test on the agreement check: mutating the page's declared ref fails the build with the expected message; restored afterwards.
- `GITHUB_TOKEN="$(gh auth token)" bun run --cwd apps/site verify:guidance -- --network` — 31 pages, 21 repository sources, 15 prose links, no failures.

### Outstanding concerns

The site now has a standing refresh obligation it did not have before. It is cheaper than the one it replaces — one command and one ref bump, rather than reconciling a long document by hand — but it is real, and the ADR is where it is recorded.

The snapshot stays at `7dcee9dc` because that is what the page already cited and it is current for this file. A future refresh should advance both together.

### Post-change review

Two things were wrong on the first pass and are worth naming.

Nunjucks autoescaping double-escaped every code span, so `audit <repo>` would have reached readers as `audit &lt;repo&gt;` — wrong-layer escaping, caught by inspecting rendered HTML rather than by any gate. Nothing in the build would have complained, which is a reminder that "the build passed" and "the page is right" are different claims.

The Markdown gate then failed on the template itself: `rumdl` reads the page source, and a Nunjucks comment opener `{#` looks exactly like a malformed heading. The tempting fix was to exempt the file. Instead the template was restructured to be valid Markdown in its own right, which meant moving field ordering out of the template and into the parser — where it belongs anyway, since the upstream block is what fixes that order. The entry shape is now carried verbatim as an ordered label/value list rather than destructured into named properties the site would have to keep in step. That is both simpler and more faithful to what "vendored" means.

### Mini recap

The item's Context assumed the hard question was how to reach the data, and allowed for asking the harness to publish something consumable. Shaping found the opposite: `ki-repo-harness` already names the markers normatively and specifies the fields between them, with its own rubric tests asserting both. There was nothing to ask for. The site had been paraphrasing a published interface by hand for months — and the 42-versus-61 gap is what that costs.

The durable lesson is to check whether the thing you are about to request already exists as a specification before designing a request for it. The standard that governs the upstream repository is the place to look, not the file you are reading.

## Discussion

Shaping settles the design, not whether to act. The prompting question is whether the site wants a second inventory at all, or whether the catalogue should become a route into the harness's own.

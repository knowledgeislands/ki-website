---
id: KI-WEB-SITE-016
area: SITE
title: Generate the skill catalogue from harness source
theme: site-experience
blocks: []
blocked_by: []
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T15:44:00Z
horizon: triage
status: draft
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

## Discussion

Review before deciding. The prompting question is whether the site wants a second inventory at all, or whether the catalogue should become a route into the harness's own.

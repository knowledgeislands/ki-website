---
id: ADR-KI-WEBSITE-001
title: 'Vendoring the Harness Capability Catalogue'
date: 2026-09-21
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-WEBSITE-001: Vendoring the Harness Capability Catalogue

## Context

`/guidance/skills/catalogue/` published every harness skill as hand-written prose. It was the one guidance page whose derived account added nothing to its source: an inventory, reworded. The [ownership test](../guides/developer/guidance-ownership.md#the-test) predicts that outcome — an inventory ages with each release — and the page had already drifted, listing 42 skills where the harness published 61.

The harness does not merely happen to publish that inventory. `ki-repo-harness` names the `ki-repo-harness:capability-catalogue:start` and `:end` markers in `skills/README.md` normatively and fixes what the block between them carries: source-domain groups, full descriptions, governance and process counts, runtime-neutral argument hints, required dependencies, and runtime bindings. `ki repo conform --skill ki-repo-harness` regenerates it from canonical `SKILL.md` frontmatter, and the harness's own rubric tests assert both markers.

This site therefore had a specified interface available and was paraphrasing it by hand.

## Decision

The site vendors that block as data rather than restating it. `apps/site/scripts/sync-skill-catalogue.ts` resolves `skills/README.md` at an explicit immutable ref, parses the marker-delimited block, and writes `apps/site/src/_data/skillCatalogue.json5`. The catalogue page keeps its framing prose and renders the inventory from that data.

The snapshot is vendored, not fetched during the build. The website seam requires a reproducible `apps/site/dist/`, so a build that reached the network would depend on when it ran and would fail offline — the same reasoning that already keeps `verify:guidance --network` out of the build.

Refreshing is a deliberate act: re-run the sync at a new ref and advance the page's `sources` ref in the same change. Two checks hold that together. Upstream movement past the pinned ref is reported by the ordinary provenance sweep as a **warning**, because an upstream repository editing its own README must not break this site's build. Disagreement between the vendored snapshot's ref and the page's declared ref is a **failure**, and an offline one, because that is the site contradicting itself rather than upstream moving.

The parser refuses anything it does not recognise instead of degrading. It cross-checks the entry count it parsed against the count the block states about itself, so a silently halved catalogue cannot reach `dist/`.

## Consequences

- The catalogue cannot describe a skill that no longer exists, or omit one that does; the 19 missing skills were published by the change that introduced this record.
- Provenance gains a third case alongside declared and restated. A vendored page cites a source it reproduces rather than one it rewrote, which [the provenance guide](../guides/developer/guidance-provenance.md) now states.
- The site takes a standing dependency on the catalogue markers and field set. If `ki-repo-harness` changes either, the sync fails loudly at the next refresh rather than publishing a partial inventory. No handoff to `ki-agentic-harness` is owed for the interface itself, which already exists and is specified.
- Refreshing is no longer a reconciliation of a long document by hand; it is one command and one ref bump.
- The editorial framing stays the site's own. Only the inventory is vendored, and a regeneration cannot overwrite the prose around it.

## References

- [Guidance provenance](../guides/developer/guidance-provenance.md) — the declaration, the sweep, and the vendored case.
- [Deciding what this site publishes](../guides/developer/guidance-ownership.md) — the ownership test this decision applies.
- `ki-repo-harness`, `references/standards-compatible-harness.md` — the normative definition of the catalogue block.

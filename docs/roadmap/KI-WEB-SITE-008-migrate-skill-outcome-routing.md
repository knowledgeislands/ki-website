---
id: KI-WEB-SITE-008
area: SITE
title: Migrate skill outcome routing
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: d0c40b2b6b8ae499e5525eef3c0a5c17b2f5ce8e
created_at: 2026-09-18T04:50:00Z
updated_at: 2026-09-18T05:25:00Z
---

# Migrate skill outcome routing

## Goal

Publish the outcome-to-skill routing guidance on the website and reduce the harness copy to a pointer.

## Context

`ki-agentic-harness/docs/guides/skills-by-outcome.md` answers "I know what I want to achieve, which skill serves it?". That is public explanatory guidance for a reader who is unlikely to open the harness repository, and it is the one genuine migration candidate the `KI-WEB-SITE-002` inventory found.

The website already owns the complementary half at `/guidance/skills/catalogue/`, which answers "what does skill Y govern?". Holding the two halves in different repositories is what makes the routing hard to find.

The harness keeps the generated capability catalogue under `skills/README.md`. That is source-owned inventory and does not move.

## Boundary

The website adds the page and the navigation entry. Reducing or removing `ki-agentic-harness/docs/guides/skills-by-outcome.md` is a source-owned change that this item cannot make; it needs a handoff the harness accepts.

Nothing ships on the website until that handoff is agreed, so the two copies never coexist as competing sources.

## Current state

`ki-agentic-harness/docs/guides/skills-by-outcome.md` is 108 lines across ten outcome sections, with exactly one relative link — to the harness's generated capability catalogue at `skills/README.md`.

The website has no equivalent page. `/guidance/skills/` explains what a skill is and how the set composes; `/guidance/skills/catalogue/` lists what each skill governs. Neither answers "I want to achieve X, which skill?".

## Steps

- [ ] Copy the guide to `site/src/guidance/skills/by-outcome/` verbatim, rewriting only its frontmatter and the one relative link.
- [ ] Link it from `/guidance/skills/` alongside the catalogue.
- [ ] File a handoff in `ki-agentic-harness` to reduce its copy to a pointer.

## Files touched

- `site/src/guidance/skills/by-outcome.md` — new.
- `site/src/guidance/skills/index.md` — one link.
- `ki-agentic-harness/docs/roadmap/` — one handoff record.

## Verify

- `bun run ki:site:build` emits `/guidance/skills/by-outcome/` and the routes gate passes.
- The migrated prose is byte-identical to the source apart from frontmatter and the rewritten catalogue link.
- The harness handoff record exists and names the exact file to reduce.

## Dependencies / blocks

The website page can ship independently, but the source is not reduced until `ki-agentic-harness` accepts the handoff. Until then two copies exist — recorded, not silent.

## Documentation impact

### Decision Records

None. The classification rationale lives in the inventory this slice came from.

### Specifications

None.

### Guides

None. This is site page content, not repository operating knowledge.

### Roadmap

This record, plus one handoff record in `ki-agentic-harness`.

## Discussion

This is a cross-repository slice. The website adds the page; `ki-agentic-harness` owns the deletion or pointer replacement and must accept a handoff item before the source side can change. Do not publish the website copy until the harness has agreed, or the two will diverge silently — exactly what `KI-WEB-SITE-002` set out to prevent.

Originating item: `KI-WEB-SITE-002`.

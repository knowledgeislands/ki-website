---
id: KI-WEB-SITE-019
area: SITE
title: Guidance hub and navigation
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-22T09:05:00Z
updated_at: 2026-09-22T10:00:00Z
---

## Goal

Every published guidance page is reachable by navigating the site, and a reader looking for the list of skills finds it without knowing its URL.

## Context

There is no `/guidance/` route. Four sibling collections exist under that path — `cli`, `prompting`, `skills`, `using-ki` — and the navigation hardcodes a link to one of them, `/guidance/using-ki/`. Nothing tells a reader the other three exist.

The owner could not find the skill catalogue. That page carries all 61 skills and is the longest on the site, and it has exactly one inbound link: a bullet in the final section of the using-ki index.

## Boundary

This item is about reachability and the hub page. It does not rewrite the guidance pages themselves; depth is `KI-WEB-SITE-018` and the section items.

The 31 pages keep their current URLs. This adds a route and changes links into them.

## Shaping

**The reachability check is in scope, not optional.** Without it this item fixes today's orphans and nothing prevents tomorrow's, and the prompting collection is the evidence: fourteen pages that presumably had a way in once and lost it silently. The check walks links from `dist/index.html` and fails the build on any unreachable page, which is the same reasoning that made the provenance sweep worth building — a condition nobody can see is a condition nobody fixes.

It fails rather than warns, because unlike upstream drift this is entirely within the site's control. The provenance sweep warns because another repository editing its own README must not break this build; an orphaned page is the site's own doing.

**The hub introduces four collections by the question each answers**, not by listing them. A list of four links is the navigation problem restated one level down.

**The 31 pages keep their URLs.** This adds a route and rewires links into it; nothing moves, so nothing needs redirecting.

## Current state

Inbound-link analysis of the built `dist/`, counting links from outside each collection's own subtree:

| Collection | Pages | Inbound links from elsewhere |
| --- | --- | --- |
| `/guidance/prompting/` | 14 | 0 — the string `prompting` appears nowhere outside its own subtree |
| `/guidance/cli/` | 6 | 0 — linked only by its own children |
| `/guidance/skills/` | 3 | 1, from the using-ki index |
| `/guidance/using-ki/` | 8 | navigation |

Nineteen of 31 guidance pages are unreachable by navigation. The prompting guides are reachable only by typing the URL.

Separately, `/tooling/harnesses/` and `/tooling/guidance/` are task guidance — how to bootstrap a harness, how to activate a skill in user or repository scope — filed under a section about released tools. They are candidates to move here, which `KI-WEB-SITE-020` will hand over.

## Steps

- [ ] Add a `/guidance/` hub that introduces the four collections and says what question each answers, rather than listing them.
- [ ] Point the navigation entry at `/guidance/` instead of `/guidance/using-ki/`.
- [ ] Surface the skill catalogue from the hub directly, not only through the using-ki index.
- [ ] Give each collection index a link back to the hub, so a reader who lands deep can get out.
- [ ] Add a mechanical reachability check to the build, so a page that no route reaches fails rather than sits unnoticed.

## Files touched

- `apps/site/src/guidance/index.md` — new.
- `apps/site/src/_data/site.ts` — the navigation entry.
- `apps/site/src/guidance/*/index.md` — upward links.
- `apps/site/scripts/` — the reachability check, and `apps/site/package.json` to wire it into the build.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes. Every page under `dist/guidance/` is reachable from `dist/index.html` by following links only, demonstrated by the new check rather than asserted. Navigating from the home page reaches the skill catalogue.

## Dependencies / blocks

Not blocked. `KI-WEB-SITE-020` hands over `/tooling/harnesses/` and `/tooling/guidance/`; if 020 lands first the hub covers them, and if this lands first 020 adds them.

## Documentation impact

### Decision Records

None expected. Adding an index and fixing navigation applies existing structure rather than changing a standing decision.

### Specifications

None.

### Guides

None, unless the reachability check needs describing alongside the provenance sweep in `docs/guides/developer/`.

### Roadmap

No handoff.

## Discussion

The reachability check is the part worth arguing about. Without it this item fixes today's orphans and nothing stops tomorrow's — the prompting collection was presumably reachable once. With it, the site gains a second build-time gate, which is a cost.

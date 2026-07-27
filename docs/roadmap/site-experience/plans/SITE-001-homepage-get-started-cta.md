---
id: 'SITE-001'
title: Homepage Get Started CTA
status: in-progress
roadmap: site-experience/homepage-get-started-cta
blocks: —
blocked-by: —
baseline-ref: b5333fa884782a10478564a814e477e5a022036a
---

## Context

The homepage's hero introduces the model but only offers Philosophy and Model links.

A visible route to the existing Get Started page completes the reading funnel for visitors ready to act.

## Current state

`site/src/index.njk` has a two-link hero action group and no homepage link to `/get-started/`.

The existing `/get-started/` page provides the appropriate first-step guidance, so this work needs no new destination content or route.

## Steps

1. ✓ Add a clearly labelled Get Started link to the homepage hero action group, using the existing button treatment and preserving the current Philosophy and Model links.

2. ✓ Keep the change limited to the homepage reading funnel; do not add a duplicate CTA card or alter the Get Started destination.

3. ✓ Build from a clean output directory and confirm the generated homepage contains one working Get Started hero link alongside the existing actions.

## Files touched

- `site/src/index.njk`
- `docs/roadmap/site-experience/ROADMAP.md`
- `docs/roadmap/site-experience/plans/SITE-001-homepage-get-started-cta.md`

## Verify

- `bun run ki:site:clean`
- `bun run ki:site:build`
- `rg 'href="get-started/index.html"' site/dist/index.html`
- `ki repo audit --skill ki-website`

## Dependencies / blocks

This work has no plan dependencies and does not block another active plan.

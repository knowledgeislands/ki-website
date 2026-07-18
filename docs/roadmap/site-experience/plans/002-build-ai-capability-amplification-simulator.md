---
id: '002'
title: Build AI capability amplification simulator
status: open
roadmap: site-experience/ai-capability-amplification-simulator
blocks: —
blocked-by: —
---

## Context

The Website needs an interactive thought experiment that makes one idea tangible: AI amplifies existing human capability, judgment, and error rather than automatically improving outcomes. Phase 1 is an explanatory visualisation, not a scientific model, prediction tool, or data-collection feature.

## Current state

The Website has static explanatory pages but no interactive simulator or client-side graphing surface. The existing site is built with Eleventy and served as static assets, so the simulator must add no framework or runtime dependency and must remain fully usable in the delivered static page.

## Steps

1. Define and document a deterministic, deliberately illustrative model that normalises the five controls into capability, precision, and effective amplification; make low precision plus high AI power widen the downside envelope while capability and learning improve the expected trajectory over time.
2. Add a dedicated simulator route with an SVG or Canvas graph that renders time and value/impact axes, an unmistakable zero line, a central expected trajectory, upper and lower bounds, and a translucent uncertainty envelope.
3. Implement labelled, keyboard-operable sliders for raw intelligence, learning ability, skills and knowledge, governance or guard rails, and AI power; display the derived values and a concise live interpretation without exposing the model as a factual forecast.
4. Recalculate and smoothly redraw the graph as controls change, honour reduced-motion preferences, preserve readable contrast at narrow widths, and ensure low-precision configurations visibly demonstrate below-zero risk.
5. Keep the application self-contained at its public route, integrate it with the existing Website shell and discovery paths, and add only the minimal explanatory copy needed to establish the simulator as a conceptual experiment.
6. Manually exercise representative configurations: high capability/high precision/high power; low capability/low precision/high power; and governance changes at otherwise fixed settings. Confirm the graph and explanatory state make the intended amplification relationship clear in each case.

## Files touched

- `site/src/simulator/index.njk`
- `site/src/_data/site.ts`
- `site/src/index.njk`
- `site/src/assets/css/main.css`

## Verify

Run `bun run ki:site:build`, `bun run ki:website:audit`, `bun run ki:website-cloudflare:audit`, and `bun run ki:project-roadmap:audit`. Inspect the built simulator at desktop and mobile widths, operate every control with mouse and keyboard, and confirm that the stated representative configurations produce the expected trajectory and uncertainty-envelope relationships.

## Dependencies / blocks

This Phase 1 implementation is independent. The Future multi-actor and scenario item is explicitly deferred until the single-person conceptual model is coherent and usable.

---
id: '002'
title: Build AI capability amplification simulator
status: in-progress
roadmap: site-experience/ai-capability-amplification-simulator
blocks: —
blocked-by: —
---

## Context

The Website needs an interactive thought experiment that makes one idea tangible: AI amplifies existing human capability, judgment, and error rather than automatically improving outcomes. Phase 1 is an explanatory visualisation, not a scientific model, prediction tool, or data-collection feature.

## Current state

The Website has static explanatory pages but no interactive simulator or client-side graphing surface. The existing site is built with Eleventy and served as static assets, so the simulator must add no framework or runtime dependency and must remain fully usable in the delivered static page.

Phase 1 will use D3 only for the focused SVG renderer: it draws this model's axes, zero line, expected curve, and uncertainty envelope without introducing a framework or a reusable drawing layer.

## Steps

1. ✓ Defined and documented a deterministic, deliberately illustrative model that normalises the five controls into capability, precision, and effective amplification; low precision plus high AI power widens the downside envelope while capability and learning improve the expected trajectory over time.
2. ✓ Added a dedicated simulator route with a D3-rendered SVG graph for time and value/impact axes, an unmistakable zero line, a central expected trajectory, upper and lower bounds, and a translucent uncertainty envelope.
3. ✓ Implemented labelled, keyboard-operable sliders for raw intelligence, learning ability, skills and knowledge, governance or guard rails, and AI power; the page displays the derived values and a concise live interpretation without presenting the model as a factual forecast.
4. ✓ Recalculated and smoothly redrew the graph as controls change, honoured reduced-motion preferences, preserved readable contrast at narrow widths, and made low-precision configurations visibly demonstrate below-zero risk.
5. ✓ Kept the application self-contained at its public route, integrated it with the existing Website shell and homepage discovery path, and added only the explanatory copy necessary to establish it as a conceptual experiment.
6. ✓ Manually exercised high capability/high precision/high power; low capability/low precision/high power; and governance changes at otherwise fixed settings. The graph and explanatory state make the intended amplification relationship clear in each case.

## Files touched

- `site/src/simulator/index.njk`
- `site/src/index.njk`
- `site/src/assets/css/main.css`
- `site/src/_includes/partials/nav.njk`
- `site/eleventy.config.ts`
- `package.json`
- `bun.lock`

## Verify

Run `bun run ki:site:build`, `bun run ki:website:audit`, `bun run ki:website-cloudflare:audit`, and `bun run ki:project-roadmap:audit`. Inspect the built simulator at desktop and mobile widths, operate every control with mouse and keyboard, and confirm that the stated representative configurations produce the expected trajectory and uncertainty-envelope relationships.

## Dependencies / blocks

This Phase 1 implementation is independent. The Future multi-actor and scenario item is explicitly deferred until the single-person conceptual model is coherent and usable.

---
id: '003'
title: Build technical V2 AI capability simulator
status: open
roadmap: site-experience/technical-v2-ai-capability-simulator
blocks: —
blocked-by: —
---

## Context

V1 is an approachable conceptual simulator and must remain available unchanged. V2 is a separate, technical visual instrument: it should feel substantially different from the Website's normal editorial experience, but it must make the reasoning behind its visual output more legible, not merely more decorative.

The supplied EcoDiagnose reference is useful for its dark instrument-panel density, disciplined signal accents, and central working surface. V2 should borrow those interaction qualities without copying its information architecture or complexity.

## Current state

V1 at `/simulator/` uses five 0–100 controls, a D3 SVG chart, and dynamically rescaled axes. Its current formula combines intelligence, learning, and skills into capability; intelligence, skills, and governance into precision; and AI power with capability into effective amplification. That is a useful first thought experiment, but it does not yet explain a deliberate contribution from each human-condition factor to each derived measure, nor does it support the requested fixed-frame comparison.

## Steps

1. Define and document the V2 model before implementation: use a factor-to-output matrix for raw intelligence, learning ability, and skills and knowledge across starting state, capability, precision, and effective amplification; specify governance and guard rails as the precision control and AI power as the distinct amplification control. Resolve the exact neutral midpoint, signed direction, bounds, and formula weights with the product owner rather than infer them from V1.
2. Specify a fixed chart domain and visual grammar: axes, ticks, labels, zero/reference lines, and plot bounds remain immobile for every interaction; derive a non-zero starting state from the agreed model; animate only the expected trajectory, uncertainty envelope, and numerical readouts within that stable frame.
3. Create a dedicated V2 route and minimal standalone document shell, intentionally omitting the normal Website navigation and footer while retaining an accessible labelled route back to V1 or the main site.
4. Build the V2 visual system around a large central D3 SVG plot with dark graphite surfaces, restrained violet/cyan signal accents, technical labels, and compact surrounding instrument controls. Reuse the locally shipped D3 bundle; do not add a framework or CDN dependency.
5. Implement five keyboard-operable, midpoint-centred controls for the human and institutional conditions, plus the distinct AI-power control. Show the declared derived values, starting state, and concise scenario interpretation alongside the graph without presenting the output as a forecast.
6. Preserve V1 as a stable route and regression-check it independently. Verify V2 at desktop and narrow widths, with reduced motion, and across neutral, strong-positive, strong-negative, low-governance, and high-AI-power combinations; confirm that only plotted data and readouts animate while the graph frame remains fixed.

## Files touched

- `docs/roadmap/site-experience/ROADMAP.md`
- `docs/roadmap/site-experience/plans/003-build-technical-v2-ai-capability-simulator.md`
- `site/src/simulator/v2/index.njk`
- `site/src/simulator/index.njk`
- `site/src/assets/css/main.css`
- `site/eleventy.config.ts`

## Verify

Run `bun run ki:site:build`, `bun run ki:website:audit`, `bun run ki:website-cloudflare:audit`, and `bun run ki:project-roadmap:audit`. Manually verify that V1 remains available at `/simulator/`; V2 loads without normal Website chrome; all controls work by keyboard; the fixed-axis SVG frame and reference labels do not move during interaction; and only the data paths and derived readouts transition.

## Dependencies / blocks

The V2 interface depends on agreement of the model matrix and formula weights in Step 1. That agreement is deliberately part of this plan rather than an inferred external dependency. It does not block V1, which remains the stable current version.

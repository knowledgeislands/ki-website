---
id: '003'
title: Build technical V2 AI capability simulator
status: open
roadmap: site-experience/technical-v2-ai-capability-simulator
blocks: —
blocked-by: —
---

## Context

V1 is an approachable conceptual simulator and must remain available unchanged. `/simulator/` will become a landing page that links to V1 at `/simulator/v1/` and V2 at `/simulator/v2/`. V2 is a separate, technical visual instrument: it should feel substantially different from the Website's normal editorial experience, but it must make the reasoning behind its visual output more legible, not merely more decorative.

The supplied EcoDiagnose reference is useful for its dark instrument-panel density, disciplined signal accents, and central working surface. V2 should borrow those interaction qualities without copying its information architecture or complexity.

## Current state

V1 currently at `/simulator/` uses five 0–100 controls, a D3 SVG chart, and dynamically rescaled axes. Its current formula combines intelligence, learning, and skills into capability; intelligence, skills, and governance into precision; and AI power with capability into effective amplification. That is a useful first thought experiment, but it does not yet explain a deliberate contribution from each human-condition factor to each derived measure, nor does it support the requested fixed-frame comparison.

## Working V2 model specification

V2 treats the controls as conditions relative to a neutral midpoint, not as immutable scores about a person or organisation. Each control starts at 50. Moving a human or institutional condition right improves that condition; moving it left weakens it. AI power is different: it is the non-negative strength of the amplifier, not a claim that more power is inherently good.

### Inputs

- **Raw intelligence** — contributes most strongly to the chart's starting state, and also changes capability, precision, and human amplification potential.
- **Learning ability** — changes the starting state, capability, precision, and human amplification potential; it also determines how quickly the expected trajectory can change over time.
- **Skills and knowledge** — changes the starting state, capability, precision, and human amplification potential through context and applied judgment.
- **Governance and guard rails** — changes precision only: it improves or weakens feedback, constraints, accountability, and error correction.
- **AI power** — changes only the effective amplification multiplier. Higher power increases the scale of both the expected outcome and its uncertainty; it does not improve direction or precision by itself.

For the four midpoint-centred controls, normalise the user value `x` as `d(x) = (x − 50) / 50`, giving a signed range from `−1` to `+1`. Normalise AI power as `p = power / 100`, giving an absolute range from `0` to `1`.

### Derived values and provisional equation

The final weights require product-owner agreement, but V2 will expose and implement this structure rather than hide overlapping effects:

```text
S₀ = clamp(Sneutral + wiS·di + wlS·dl + wsS·ds)                  starting state
C  = clamp(50 + wiC·di + wlC·dl + wsC·ds)                       capability
Q  = clamp(50 + wiQ·di + wlQ·dl + wsQ·ds + wgQ·dg)              precision
H  = clamp(50 + wiH·di + wlH·dl + wsH·ds)                       human amplification potential
M  = p · H / 100                                                 effective AI amplification
D  = α·((C − 50) / 50) + (1 − α)·((Q − 50) / 50)                expected direction
E(t) = S₀ + M·D·f(t)                                             expected trajectory
R(t) = M·(1 − Q / 100)·r(t)                                     uncertainty radius
L(t) = E(t) − R(t); U(t) = E(t) + β·R(t)                        lower and upper bounds
```

`f(t)` is a fixed monotonic time function and `r(t)` is a fixed increasing uncertainty function. The plotted y-domain, `Sneutral`, weights `w`, balance `α`, and asymmetry `β` will be chosen once in Step 1, documented beside the graph, and then remain fixed for every interaction. The uncertainty term makes weak precision and high AI power visibly riskier; the fixed graph frame ensures that this change is perceived as movement in the model rather than a rescaled chart.

## Steps

1. Confirm the working V2 model specification with the product owner: choose `Sneutral`, all weights `w`, balance `α`, asymmetry `β`, graph bounds, and the fixed time functions. Document the resulting factor-to-output matrix and formula at the V2 route rather than infer it from V1.
2. Specify a fixed chart domain and visual grammar from the agreed model: axes, ticks, labels, zero/reference lines, and plot bounds remain immobile for every interaction; derive a non-zero starting state from the agreed formula; animate only the expected trajectory, uncertainty envelope, and numerical readouts within that stable frame.
3. Turn `/simulator/` into a clear simulator landing page with distinct links to the V1 conceptual experience and V2 technical experience. Move V1 unchanged to `/simulator/v1/`; create V2 at `/simulator/v2/`; retain an accessible labelled route from V2 back to the landing page.
4. Build the V2 visual system around a large central D3 SVG plot with dark graphite surfaces, restrained violet/cyan signal accents, technical labels, and compact surrounding instrument controls. Use a minimal standalone document shell that intentionally omits the normal Website navigation and footer. Reuse the locally shipped D3 bundle; do not add a framework or CDN dependency.
5. Implement five keyboard-operable, midpoint-centred controls for the human and institutional conditions, plus the distinct AI-power control. Show the declared derived values, starting state, and concise scenario interpretation alongside the graph without presenting the output as a forecast.
6. Regression-check V1 at `/simulator/v1/` and the new landing page independently. Verify V2 at desktop and narrow widths, with reduced motion, and across neutral, strong-positive, strong-negative, low-governance, and high-AI-power combinations; confirm that only plotted data and readouts animate while the graph frame remains fixed.

## Files touched

- `docs/roadmap/site-experience/ROADMAP.md`
- `docs/roadmap/site-experience/plans/003-build-technical-v2-ai-capability-simulator.md`
- `site/src/simulator/index.njk`
- `site/src/simulator/v1/index.njk`
- `site/src/simulator/v2/index.njk`
- `site/src/assets/css/main.css`
- `site/eleventy.config.ts`

## Verify

Run `bun run ki:site:build`, `bun run ki:website:audit`, `bun run ki:website-cloudflare:audit`, and `bun run ki:project-roadmap:audit`. Manually verify that the landing page links to both versions; V1 remains intact at `/simulator/v1/`; V2 loads without normal Website chrome; all controls work by keyboard; the fixed-axis SVG frame and reference labels do not move during interaction; and only the data paths and derived readouts transition.

## Dependencies / blocks

The V2 interface depends on agreement of the model matrix and formula weights in Step 1. That agreement is deliberately part of this plan rather than an inferred external dependency. It does not block V1, which remains the stable current version.

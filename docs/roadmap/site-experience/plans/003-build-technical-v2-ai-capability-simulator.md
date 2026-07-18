---
id: '003'
title: Build technical V2 AI capability simulator
status: in-progress
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

For the four midpoint-centred controls, normalise the user value `x` as `d(x) = (x − 50) / 50`, giving a signed range from `−1` to `+1`. Call the resulting values `i`, `l`, `s`, and `g`. Normalise AI power as `p = power / 100`, giving an absolute range from `0` to `1`.

### Derived values and provisional equation

V2 will expose and implement this provisional calibration rather than hide overlapping effects. The coefficients are deliberately easy to tune after the first visual review; they are not empirical claims.

```text
S₀ = 10·(0.80i + 0.10l + 0.10s)                                 starting state
H  = 0.45i + 0.35l + 0.20s                                      human direction potential
Q  = clamp(0.50 + 0.10i + 0.08l + 0.12s + 0.35g, 0.05, 0.95)    precision
A  = 1 + 1.50p                                                   AI amplification multiplier
r  = 0.06 + 0.02·max(l, 0)                                      compounding rate
F(t) = ((1 + r)^t − 1) / ((1.06)^10 − 1)                        fixed 10-year growth shape
E(t) = S₀ + 24·A·H·F(t)                                          expected trajectory
R(t) = p·(1 − Q)·(12 + 28·(t / 10)^1.35)                        uncertainty radius
L(t) = E(t) − R(t); U(t) = E(t) + R(t)                          lower and upper bounds
```

The graph uses a fixed 0–10-year x-axis and a fixed `−120…+120` y-axis, with a central zero reference line. It never resizes or recalculates its axes. AI power increases `A` from 1× to 2.5×, so it amplifies an existing human trajectory instead of making that trajectory disappear when AI is off. `R(0)` is non-zero whenever AI power is on, so the cone begins above and below the expected line rather than at a single point. The first calibration uses a symmetric cone; any later asymmetry must be a deliberate model change.

### First visual-calibration defaults

The first V2 build is a visual calibration surface, not final coefficient approval. At the neutral midpoint for raw intelligence, learning, skills and knowledge, and governance, with AI power set to zero, the expected trajectory is a straight horizontal zero line. Increasing raw intelligence and learning ability together produces a modest upward compound curve over the ten years. Increasing AI power magnifies that curve and widens the uncertainty cone without moving the frame. With neutral human direction and high AI power, the expected line remains flat while the cone spreads either side of it.

The initial review cases are: neutral conditions with AI off; neutral conditions with AI at 100; raw intelligence and learning at 60 with AI off; the same condition with AI at 50; all human conditions at 100 with AI at 100; and all human conditions at 0 with AI at 100. Expose starting state, human direction potential, precision, amplification multiplier, year-10 expected value, and year-10 range as live readouts so these cases can be compared without reverse-engineering the chart.

## Steps

1. ✓ Implemented and documented the provisional V2 formula and calibration cases at the V2 route. Every coefficient is named and local to the model so the product owner can revise it after visual review.
2. ✓ Specified the fixed chart domain and visual grammar from that formula: 0–10 years and `−120…+120`; axes, ticks, labels, zero/reference lines, and plot bounds remain immobile for every interaction; the starting state and cone derive from the formula; only the expected trajectory, uncertainty envelope, and numerical readouts animate within that stable frame.
3. ✓ Turned `/simulator/` into a clear simulator landing page with distinct links to the V1 conceptual experience and V2 technical experience. V1 now lives unchanged at `/simulator/v1/`; V2 is at `/simulator/v2/`; V2 has an accessible labelled route back to the landing page.
4. ✓ Built the V2 visual system around a large central D3 SVG plot with dark graphite surfaces, restrained violet/cyan signal accents, technical labels, and compact surrounding instrument controls. It uses a minimal standalone document shell without the normal Website navigation or footer and reuses the locally shipped D3 bundle.
5. ✓ Implemented five keyboard-operable, midpoint-centred controls for the human and institutional conditions, plus the distinct AI-power control. The interface shows starting state, human direction, precision, AI multiplier, year-10 expected value, and year-10 range.
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

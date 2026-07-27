---
id: 'SITE-001'
title: Inline SVG diagram polish
status: acceptance
roadmap: site-experience/inline-svg-diagram-polish
blocks: —
blocked-by: —
baseline-ref: f4c244bbce623c3c8d452f08283a529d6ed0c5f0
---

## Context

The Philosophy page's cycle and home geography diagrams use fixed light-surface SVG presentation values.

The site's dark mode changes page and component tokens, but these diagrams retain white boxes and a pale ring, creating inverted surfaces and weak contrast.

## Current state

`site/src/philosophy/index.njk` contains both inline SVGs with direct fill and stroke values.

`site/src/assets/css/main.css` has a dark-mode section but no diagram-specific declarations; it retains a comment that labels the faint cycle ring acceptable despite the roadmap finding.

## Steps

1. ✓ Add stable, semantic classes to the cycle and home geography SVG containers without changing their meaning, accessible names, geometry, or flow labels.

2. ✓ Replace the affected hardcoded light-surface, low-contrast, and muted SVG presentation values with scoped CSS custom properties so each diagram has coherent light defaults.

3. ✓ Define dark-mode values for those properties within the diagram scopes, preserving the existing domain accent colours while giving node labels, surfaces, rings, arrows, and secondary text sufficient contrast.

4. ✓ Remove the obsolete dark-mode comment and keep unrelated inline SVGs and page content unchanged.

5. ✓ Build the site from a clean output directory, inspect the generated Philosophy page in light mode, verify its dark-mode token declarations, and run the website and engineering audits to confirm the change remains conformant.

## Files touched

- `site/src/philosophy/index.njk`
- `site/src/assets/css/main.css`
- `docs/roadmap/site-experience/ROADMAP.md`
- `docs/roadmap/site-experience/plans/SITE-001-inline-svg-diagram-polish.md`

## Verify

- `bun run ki:site:clean`
- `bun run ki:site:build`
- `ki repo audit --skill ki-website`
- `ki repo audit --skill ki-engineering`
- Inspect the generated `/philosophy/` page in light mode and verify the built dark-mode diagram token declarations.

## Dependencies / blocks

This work has no plan dependencies and does not block another active plan.

## Acceptance

### Delivered

The Philosophy page's cycle and home geography diagrams now use scoped presentation tokens with coherent dark-mode values.

### Summary of changes

- Added `philosophy-diagram` classes and replaced the two diagrams' affected SVG presentation values in `site/src/philosophy/index.njk`.
- Added light and dark presentation-token values in `site/src/assets/css/main.css`, including dark surfaces, ring, arrow, and secondary-text contrast values.
- Removed the obsolete comment that treated the cycle ring's dark-mode contrast as acceptable.

### Verification

- `bun run ki:site:clean` — passed.
- `bun run ki:site:build` — passed; Eleventy wrote 11 files.
- `ki repo audit --skill ki-website` — passed with no FAIL or WARN findings.
- `ki repo audit --skill ki-engineering` — passed with no FAIL or WARN findings.
- `ki repo audit --skill ki-roadmap` — passed with no FAIL or WARN findings.
- Inspected the generated `/philosophy/` page in the browser's light colour scheme; both accessible SVG diagrams and their presentation tokens rendered as expected.
- Confirmed the built stylesheet contains the scoped dark-mode presentation-token values.
- Evidence revision: `97966245b68d23057bf265f7a1cd219050ce618d`.

### Outstanding concerns

The available browser session could not emulate `prefers-color-scheme: dark`; the dark variant was verified from the generated media-rule values rather than a second visual screenshot.

### Mini recap

Inline SVG presentation attributes can inherit CSS custom properties, allowing the diagrams to retain their semantic geometry while following the site's colour scheme without duplicating SVG markup.

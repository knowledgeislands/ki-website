---
id: 'SITE-001'
title: Inline SVG diagram polish
status: open
roadmap: site-experience/inline-svg-diagram-polish
blocks: —
blocked-by: —
baseline-ref: —
---

## Context

The Philosophy page's cycle and home geography diagrams use fixed light-surface SVG presentation values.

The site's dark mode changes page and component tokens, but these diagrams retain white boxes and a pale ring, creating inverted surfaces and weak contrast.

## Current state

`site/src/philosophy/index.njk` contains both inline SVGs with direct fill and stroke values.

`site/src/assets/css/main.css` has a dark-mode section but no diagram-specific declarations; it retains a comment that labels the faint cycle ring acceptable despite the roadmap finding.

## Steps

1. Add stable, semantic classes to the cycle and home geography SVG containers without changing their meaning, accessible names, geometry, or flow labels.

2. Replace the affected hardcoded light-surface, low-contrast, and muted SVG presentation values with scoped CSS custom properties so each diagram has coherent light defaults.

3. Define dark-mode values for those properties within the diagram scopes, preserving the existing domain accent colours while giving node labels, surfaces, rings, arrows, and secondary text sufficient contrast.

4. Remove the obsolete dark-mode comment and keep unrelated inline SVGs and page content unchanged.

5. Build the site from a clean output directory and inspect the generated Philosophy page for the scoped classes and token references; run the website and engineering audits to confirm the change remains conformant.

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
- Inspect the generated `/philosophy/` page in both light and dark colour schemes.

## Dependencies / blocks

This work has no plan dependencies and does not block another active plan.

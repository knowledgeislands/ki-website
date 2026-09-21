---
id: KI-WEB-SITE-013
area: SITE
title: Reconcile static analysis warnings
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-19T19:54:00Z
updated_at: 2026-09-21T07:38:11Z
---

# Reconcile static analysis warnings

## Goal

`bunx @biomejs/biome check .` and `bunx knip` both return clean with no warnings and no configuration hints, and the rendered site is unchanged at desktop and mobile widths. A future warning then means something, instead of arriving in a pile of accepted noise.

## Context

The estate baseline passes every gate — full build, route verification, types, dependency analysis, Markdown, and the KI audits — while still reporting thirteen advisory findings. Biome reports seven `lint/complexity/noImportantStyles` warnings in `site/src/assets/css/main.css` at lines 175, 187, 191, 496, 497, 505, and 506. Knip reports six configuration hints: five suppressions it believes are now redundant, and one structural note that the site workspace excludes `.css` from its project patterns so CSS imports are not followed.

Triage framed the Biome half as CSS specificity to be tuned. Investigation shows it is not specificity at all. Five of the seven `!important` declarations exist because the templates set the same properties inline, and an inline declaration beats any selector regardless of specificity — only `!important` in a stylesheet can override it. Biome marks all seven FIXABLE, so an unattended `--write` would strip them and silently break the narrow-viewport layout.

## Boundary

No visual change at any viewport width. No lint rule is weakened, disabled, or suppressed per-file, and no ignore pattern is broadened. Dependencies are not declared unused to quiet a hint; each suppression is removed only after the analyser is shown to pass without it.

This item does not change the repository's workspace layout or adopt a task runner, even though both would touch `knip.json`. That is [KI-WEB-SITE-015](KI-WEB-SITE-015-align-website-workspace-layout.md).

## Current state

The seven Biome warnings are three separate situations, not one:

| Lines | Selector | Why `!important` is there |
| --- | --- | --- |
| 505–506 | `.section-pad-lg` | Nothing. The class appears nowhere outside `main.css` — the whole rule is dead. |
| 496–497 | `.hero-section` | Eleven templates set `padding` inline on the same element, in two variants (`6rem 0 5rem` on the home hero, `4rem 0 3.5rem` elsewhere). |
| 175, 187, 191 | `.site-header-inner`, `.site-nav-list`, `.site-nav-list a` | `partials/nav.njk` sets `align-items`, `gap`, and `font-size` inline on those three elements. |

The Knip hints were probed against a trial configuration rather than reasoned about. Removing all five suppressions — `ignore` of `.claude/skills/**`, `.agents/skills/**`, and site `src/assets/**`, plus `ignoreDependencies` of `tailwindcss` and `syncpack` — leaves the analyser clean with no unused files, exports, or dependencies reported. Only the `.css` hint survives, and adding `**/*.css` to the site workspace's `project` patterns clears it; an accompanying explicit entry for `main.css` is reported as a redundant pattern, so the `project` change alone is the fix.

## Steps

- [ ] Delete the dead `.section-pad-lg` rule from `main.css`, confirming first that no template, partial, or Markdown page names the class.
- [ ] Add `hero-section-tall` and `hero-section-standard` modifier rules to `main.css` carrying the two padding variants, and replace the inline `padding` on all eleven `.hero-section` elements with the matching modifier.
- [ ] Move the inline `align-items`, `gap`, and `font-size` declarations for `.site-header-inner`, `.site-nav-list`, and `.site-nav-list a` out of `partials/nav.njk` and into the base rules in `main.css`.
- [ ] Remove the now-unneeded `!important` from the five media-query declarations at lines 175, 187, 191, 496, and 497, by hand rather than through Biome's autofix.
- [ ] Remove the five redundant `knip.json` suppressions and add `**/*.css` to the site workspace's `project` patterns.
- [ ] Capture rendered screenshots at 1440px and 375px before and after, and compare the computed styles of the header, nav, and hero elements at both widths.

## Files touched

- `site/src/assets/css/main.css`
- `site/src/_includes/partials/nav.njk`
- the eleven templates carrying an inline `hero-section` padding
- `knip.json`

## Verify

- `bunx @biomejs/biome check .` reports zero warnings and zero errors.
- `bunx knip` exits clean with no configuration hints.
- `bun run ki:site:clean && bun run ki:site:build` succeeds and both route gates pass.
- `ki repo audit --skill ki-engineering --repo .` and `ki repo audit --skill ki-repo-website-content --repo .` pass.
- Computed `align-items`, `gap`, `font-size`, and `padding` on the header, nav, and hero elements match the pre-change capture at 1440px and 375px.

## Dependencies / blocks

Nothing blocks this: every file it touches exists and no other work must land first, so `blocked_by` is empty.

There is a sequencing preference rather than a build-order constraint. [KI-WEB-SITE-015](KI-WEB-SITE-015-align-website-workspace-layout.md) moves the site workspace to `apps/site` and adopts Turborepo, which rewrites the workspace key in `knip.json`. Doing this item first means that key is renamed once during the migration — a one-line cost, not a reason to wait. Doing them in the other order would mean probing the Knip suppressions against a layout that is about to change. Either order works; this one is cheaper.

## Documentation impact

### Decision Records

None. Removing accepted lint noise and relocating inline declarations into the stylesheet changes no authority, boundary, or durable rationale.

### Specifications

None. Nothing here is a portable normative contract; the CSS and the analyser configuration are local implementation.

### Guides

None expected. No guide documents the `!important` declarations or the Knip suppressions, so nothing goes stale. If the hero modifier classes turn out to need an authoring convention, that belongs in the site's own conventions rather than a new guide.

### Roadmap

Closing this item leaves KI-WEB-SITE-015 as the remaining alignment work. No new follow-on item is expected unless the computed-style comparison finds a width where the inline declarations were doing something the stylesheet cannot reproduce.

## Discussion

### Why the autofix is a trap

Biome marks all seven warnings FIXABLE, which is true of the syntax and false of the intent. Stripping `!important` from the five live declarations restores the inline styles' precedence and silently returns the narrow-viewport layout to its unresponsive desktop form. The build stays green and the gates stay green, because nothing in the toolchain renders a page and looks at it. That is why the last step is a computed-style comparison and not a visual glance.

### Inline styles as the underlying cause

The site's templates carry substantial inline styling throughout, and this item deliberately does not try to fix that pattern — only the five places where it forces a stylesheet override. If inline styling is to be reduced more broadly, that is a separate piece of work with a much larger surface and its own visual-regression risk.

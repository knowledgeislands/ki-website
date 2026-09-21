---
id: KI-WEB-SITE-013
area: SITE
title: Reconcile static analysis warnings
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 681af19afd11e32fa4d0182fc054456335e60bed
created_at: 2026-09-19T19:54:00Z
updated_at: 2026-09-21T08:03:45Z
---

# Reconcile static analysis warnings

## Goal

`bunx @biomejs/biome check .` and `bunx knip --no-config-hints` both return clean, no suppression survives that the analyser cannot justify, and the rendered site is unchanged at desktop and mobile widths. A future warning then means something, instead of arriving in a pile of accepted noise.

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

The Knip hints were probed against a trial configuration rather than reasoned about, and the probe over-reached on two of the five. Removing site `src/assets/**` and the `ignoreDependencies` of `tailwindcss` and `syncpack` leaves the analyser clean with no unused files, exports, or dependencies reported, and adding `**/*.css` to the site workspace's `project` patterns clears the structural `.css` hint; an accompanying explicit entry for `main.css` is reported as a redundant pattern, so the `project` change alone is the fix.

The `ignore` entries for `.claude/skills/**` and `.agents/skills/**` stay. `ki-engineering`'s `GEN-1` requires the managed discovery surfaces to carry matching Biome, knip, and Markdown exclusions, and removing them fails that audit outright. Knip cannot see the obligation, so it reports them as removable; the house gate is `bunx knip --no-config-hints`, which is what makes the two positions compatible.

## Steps

- [x] Delete the dead `.section-pad-lg` rule from `main.css`, confirming first that no template, partial, or Markdown page names the class.
- [x] Add `hero-section-tall` and `hero-section-standard` modifier rules to `main.css` carrying the two padding variants, and replace the inline `padding` on all eleven `.hero-section` elements with the matching modifier.
- [x] Move the inline `align-items`, `gap`, and `font-size` declarations for `.site-header-inner`, `.site-nav-list`, and `.site-nav-list a` out of `partials/nav.njk` and into the base rules in `main.css`.
- [x] Remove the now-unneeded `!important` from the five media-query declarations at lines 175, 187, 191, 496, and 497, by hand rather than through Biome's autofix.
- [x] Remove the genuinely redundant `knip.json` suppressions and add `**/*.css` to the site workspace's `project` patterns, keeping any that another standard mandates.
- [x] Capture rendered screenshots at 1440px and 375px before and after, and compare the computed styles of the header, nav, and hero elements at both widths.

## Files touched

- `site/src/assets/css/main.css`
- `site/src/_includes/partials/nav.njk`
- the eleven templates carrying an inline `hero-section` padding
- `knip.json`

## Verify

- `bunx @biomejs/biome check .` reports zero warnings and zero errors.
- `bunx knip --no-config-hints` exits clean, and every surviving suppression is justified by a standard.
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

## Review

### Delivered

The approved boundary held: no visual change at any viewport, no lint rule weakened, disabled, or suppressed per-file, no ignore pattern broadened, and no dependency declared unused to quiet a hint. The workspace layout and task runner were excluded and remain untouched, as did the site's wider inline-styling pattern.

Baseline `681af19afd11e32fa4d0182fc054456335e60bed`. The seven Biome warnings and four of the six Knip hints are gone; the two that remain are required by another standard and are recorded below.

### Summary of changes

- `site/src/assets/css/main.css` — deleted the dead `.section-pad-lg` rule; added `.hero-section-tall` and `.hero-section-standard` carrying the two padding variants; added base `align-items`, `gap`, and `font-size` rules for `.site-header-inner`, `.site-nav-list`, and `.site-nav-list a` ahead of the narrow-viewport block; removed all five live `!important` declarations by hand.
- `site/src/_includes/partials/nav.njk` — removed exactly the three inline declarations that forced the overrides, leaving the rest of the element's inline styling in place.
- Eleven templates — replaced the inline hero `padding` with the matching modifier class. `site/src/index.njk` keeps its inline `position` and `overflow`; `site/src/model/index.njk` is `section-ocean` rather than `section-navy` and was matched on its padding.
- `knip.json` — removed the site `src/assets/**` ignore and the `tailwindcss` and `syncpack` dependency suppressions; added `**/*.css` to the site workspace `project` patterns.

One material departure from the plan. The plan called for removing five suppressions; only three went. `ki repo audit --skill ki-engineering` failed on `GEN-1` when `.claude/skills/**` and `.agents/skills/**` left `knip.json`, because the managed discovery surfaces must carry matching exclusions across Biome, knip, and Markdown. They were restored.

The new base rules sit inside `@layer components` and ahead of the narrow-viewport block, so the overrides win on source order. The `.hero-section` media query is unlayered, so it outranks the layered modifier classes without needing specificity or `!important`.

### Verification

- `bunx @biomejs/biome check .` — clean, zero warnings and zero errors, against seven before.
- `bunx knip --no-config-hints` — exit 0, clean. The bare `bunx knip` reports two hints, both the `GEN-1` exclusions above; the house gate is the `--no-config-hints` form the rubric runs.
- `bun run ki:site:clean && bun run ki:site:build` — succeeded; `verify-tool-routes` passed 4 routes and `verify-projects` passed 14 entries against 4 released tools.
- `ki repo audit --skill ki-engineering --repo .` — PASS. `ki repo audit --skill ki-repo-website-content --repo .` — PASS, with `ki-repo-website` also selected.
- Computed styles: 594 properties compared across eleven pages at 1440px and 375px, covering `align-items`, `display`, `justify-content`, `flex-direction`, row and column `gap`, `padding`, `font-size`, `color`, `width`, and `height` on the header, nav, nav links, and hero. Zero differences against a build of the baseline commit.
- Full-page screenshots: 22 captures compared by hash across the same pages and widths. Zero differences on two consecutive sweeps.

### Outstanding concerns

None blocking.

One measurement needs recording honestly. The first screenshot sweep reported a single difference on `/tooling/guidance/` at 375px. Three repeat captures of that exact page were byte-identical between the two builds, and two further full sweeps were clean, so it was a first-paint timing artefact rather than a regression. It is noted because a one-off pixel difference that is waved away without re-measurement is how a real regression ships.

Separately, `/tooling/guidance/` has a `scrollWidth` of 400px in a 375px viewport. That horizontal overflow is present identically in both builds, so it is pre-existing and outside this boundary.

### Post-change review

The goal is met on its own terms: both analysers are clean under the house gate, and the two surviving suppressions are mandated rather than tolerated. Scope did not creep — the inline-styling pattern the item declined to fix is still there, and the layout item was not touched.

Regression risk is low and directly measured rather than argued. The change's whole risk was that removing `!important` would restore the inline styles' precedence, and the inline declarations that would have won were removed in the same change; the computed-style and pixel comparisons test exactly that. The residual risk is a viewport between or outside 1440px and 375px, and a browser other than Chromium, neither of which was sampled.

Ready for acceptance.

### Mini recap

Reconciled thirteen advisory findings to zero under the house gate. Seven Biome `!important` warnings were caused by inline `style` attributes, not specificity, so the declarations moved into `main.css` and the `!important` came out by hand; Biome's autofix would have stripped them and silently broken the narrow-viewport layout. Four Knip suppressions were genuinely redundant and went; two are mandated by `ki-engineering` `GEN-1` and stayed. Verified by 594 computed properties and 22 screenshots across eleven pages at two widths, all identical to baseline, plus four green audits.

Two things worth routing rather than promoting. The plan asserted five redundant Knip suppressions on the strength of Knip's own hint, and `GEN-1` contradicted two of them — a reminder that an analyser's opinion about its own configuration is not authority over a standard it cannot see. And the site's templates still carry substantial inline styling, which is what made a routine lint cleanup a visual-regression risk in the first place.

## Discussion

### Why the autofix is a trap

Biome marks all seven warnings FIXABLE, which is true of the syntax and false of the intent. Stripping `!important` from the five live declarations restores the inline styles' precedence and silently returns the narrow-viewport layout to its unresponsive desktop form. The build stays green and the gates stay green, because nothing in the toolchain renders a page and looks at it. That is why the last step is a computed-style comparison and not a visual glance.

### Inline styles as the underlying cause

The site's templates carry substantial inline styling throughout, and this item deliberately does not try to fix that pattern — only the five places where it forces a stylesheet override. If inline styling is to be reduced more broadly, that is a separate piece of work with a much larger surface and its own visual-regression risk.

### What the Knip probe could not see

The probe was empirical and its method was sound — trial configurations, observed output — but it treated Knip as the authority on whether a Knip suppression is needed. It is not. `.claude/skills/**` and `.agents/skills/**` are excluded because `ki-engineering` requires the managed discovery surfaces to be excluded consistently across every analyser, and that obligation is invisible from inside Knip. The audit caught it; the probe could not have.

---
id: KI-WEB-SITE-036
area: SITE
title: Raise link contrast
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 09696cb0ddd5d9144a15e08454c17c57ccb596f6
created_at: 2026-09-24T21:15:00Z
updated_at: 2026-09-24T22:05:00Z
---

## Goal

Every link on the site meets WCAG AA contrast against the surface it sits on, in both colour schemes, without losing the teal that carries the site's identity.

## Context

`--color-teal` is `#3d8a8a`, and `a { color: var(--color-teal) }` in `apps/site/src/assets/css/main.css` gives every link on the site that colour. Measured against the three light surfaces it appears on:

| Surface | Ratio | AA for body text |
| --- | --- | --- |
| `--color-parchment` `#f5efe0` | 3.52 | fails |
| `--color-mist` `#eef1f5` | 3.56 | fails |
| white | 4.04 | fails |

AA asks 4.5 for text below 24px, which is every link in running prose. The dark scheme is not affected: it already brightens the token to `#52b8b8`, which reaches 7.26 against the page.

This was found by arithmetic rather than by eye while working through `KI-WEB-SITE-032`, whose Boundary excludes revisiting the token set — so it is raised here rather than fixed there, which is what that item's Steps ask for.

## Boundary

This item changes the colour teal resolves to in the light scheme and takes nothing else about the visual system with it. It does not revisit the rest of the palette, does not introduce underlines as an affordance substitute for contrast, and does not add an automated contrast gate — the last is worth considering, but deciding it as a side-effect of one fix would be the wrong way round.

It does not touch the dark scheme, which passes.

## Current state

`main.css` line 22 sets `a { color: var(--color-teal) }` globally, with no prose-specific override. The token is declared at `tokens.css` line 20 as `#3d8a8a` and overridden in the dark block of `main.css` to `#52b8b8`.

Three other rules read the same token in the light scheme, and a dozen inline `style=` attributes across `index.njk`, `model/index.njk`, `philosophy/index.njk`, `contribute/index.njk` and `get-started/index.njk` do too. **Every one of the text uses carries the same 4.5 obligation the links do, and every one of them is failing today.** `.overline` is 13px uppercase at weight 600 — small text, not large — as are the `0.75rem` section labels written inline. Two circles set `background: var(--color-teal); color: white`, which measures 4.04 and fails the same way. The only non-text uses are the `.symbol-circle-teal` icon glyph and the philosophy diagram, which owe 3:1 and sit on light grounds, so darkening the token can only help them. `--diagram-teal` is a separate literal in the light block and does not move at all.

Candidate values, measured:

| Value | Parchment | Mist | White |
| --- | --- | --- | --- |
| `#347777` | 4.52 | 4.58 | 5.18 |
| `#317070` | 4.97 | 5.03 | 5.70 |
| `#2f6b6b` | 5.33 | 5.39 | 6.11 |
| `#2b6161` | 6.13 | 6.21 | 7.03 |

The ramp holds the token's own 61:138:138 proportions, so every candidate is the same hue at a lower lightness. `#347777` clears AA by 0.02 on parchment, which is no margin at all. `#317070` is the lightest point with real headroom on the worst surface, and is the value taken.

## Steps

- [x] Decide between darkening `--color-teal` and introducing a separate link token, on the question of whether links should read as the same thing as overline labels.
- [x] Apply the chosen value and confirm every light surface a link appears on reaches 4.5.
- [x] Check the dark scheme is unaffected, since its override is a separate declaration.
- [x] Hand the visual confirmation to `KI-WEB-SITE-032`, which already holds a browser pass, rather than holding this item open behind a step it cannot perform.

## Files touched

- `apps/site/src/assets/css/tokens.css`
- `apps/site/src/assets/css/main.css`
- `docs/roadmap/KI-WEB-SITE-036-raise-link-contrast.md`

## Verify

- Every light-scheme link surface measures at least 4.5 against the link colour.
- The dark scheme still measures at least 4.5, unchanged.
- `bun run ki:site:clean && bun run ki:site:build` passes.
- `ki repo audit --skill ki-engineering --repo .` passes, which catches a descending-specificity selector introduced by the edit.
- The change is looked at in both schemes before the item is reviewed.

## Dependencies / blocks

Nothing blocks this. `KI-WEB-SITE-032` overlaps it — a person at a browser would see both — but 032 excludes the token set by its own Boundary, so the two are separable and this one does not need a browser to decide.

## Documentation impact

### Decision Records

None, unless the answer is a second token, in which case why the palette carries two teals is worth a sentence somewhere rather than a puzzle for the next reader.

### Specifications

None.

### Guides

`docs/guides/developer/prose-styling.md` if the token set changes shape.

### Roadmap

None beyond this record.

## Review

### Delivered

Every text use of teal in the light scheme now meets WCAG AA. `--color-teal` moved from `#3d8a8a` to `#317070`, which is the same hue at a lower lightness, and that single value carries links, `.overline` labels, the twelve inline `0.75rem` section labels, and the two circles that use teal as a ground for white ink.

### Change Summary

One line changed: `apps/site/src/assets/css/tokens.css:20`. No selector was added, no rule was overridden, and no second token was introduced.

The record itself changed more than the stylesheet did. It was written recommending a separate `--color-link` token, and counting the token's actual uses overturned the premise that recommendation rested on — that the other consumers owed 3:1 rather than 4.5. They are small text and owe 4.5, so a link-only token would have fixed the links and left a dozen labels failing. `## Current state` and `## Discussion` now carry the corrected analysis rather than the original one, because a record that argues to the wrong conclusion is worse than no record.

### Verification

| Surface | Before | After |
| --- | --- | --- |
| `--color-parchment` `#f5efe0` | 3.52 | 4.97 |
| `--color-mist` `#eef1f5` | 3.56 | 5.03 |
| white | 4.04 | 5.70 |

The dark scheme is untouched and still measures 7.66 against the page ground and 6.73 against dark mist, through its own `#52b8b8` override in `main.css`.

- `bun run ki:site:clean && bun run ki:site:build` passes; all seven gates run in-build and 60 files were written.
- The built stylesheet resolves `a{color:var(--color-teal)}` through the new value; the three remaining `#3d8a8a` literals in `dist/` are `--diagram-teal` and the `.symbol-circle-teal` ground, neither of which is text.
- `ki repo audit --skill ki-engineering --repo .` passes.
- `ki repo audit --skill ki-repo-website-content --repo .` passes.
- `ki repo audit --skill ki-work-roadmap --repo .` passes.

### Outstanding concerns

**Nobody has looked at it.** The measurement says the link is legible and cannot say whether the site still looks like itself with a slightly deeper accent. That is the same blocker `KI-WEB-SITE-032` carries, so the check is handed there rather than held here — an item kept open behind an approval it cannot ask for stops being a record of delivered work. 032 now names the accent change explicitly in its list.

**Two alpha tints still carry the old value as a literal.** `.symbol-circle-teal` and one card in `index.njk` set `rgb(61 138 138 / 12%)`, which is the previous teal at 12% alpha rather than a reference to the token. At that alpha the hue shift is not perceptible and neither is text, so nothing fails; repointing them is a tidy, not a fix, and doing it here would widen a one-value change into a sweep.

### Post-change review

The interesting part was not the fix, it was that the first analysis was confidently wrong in a way that would have shipped a worse outcome. The error was a plausible generalisation — "an icon owes 3:1, a label is decorative, so the token serves mixed obligations" — applied without checking what the labels actually were. `.overline` is 13px. WCAG's large-text threshold is 18.66px bold. Those two numbers settle it, and neither was looked at until the token's uses were enumerated one by one.

The general lesson is that a contrast obligation is a property of the rendered size and weight, not of what the element is called. `.overline` sounds like chrome and is text.

### Mini recap

`KI-WEB-SITE-036` closed a live WCAG AA failure affecting every link and every uppercase label on the light-scheme site, by moving one token value. The measurement that raised it came from `KI-WEB-SITE-032`'s arithmetic half; the visual half of both items remains open and needs a person.

## Discussion

### Two ways to do it, and the measurement decided between them

This record was first written recommending a separate `--color-link` token, on the reasoning that `--color-teal` also paints overline labels, symbol-circle icons and the philosophy diagram, and that those owe 3:1 rather than 4.5 — so darkening the one token would move things that did not need moving.

**That reasoning was wrong on its central fact, and counting the uses is what showed it.** `.overline` is 13px at weight 600, and the inline section labels are 12px. WCAG's large-text allowance starts at 18.66px bold or 24px regular, so none of them qualify: they are small text owing the same 4.5 as a link, and all of them are failing at 3.52 today. Two circles use teal as a ground for white ink and measure 4.04, failing as well. The genuinely non-text uses — the icon glyph and the diagram — sit on light grounds, so a darker teal raises their contrast too, and the diagram does not even read the token.

So the two options are not a trade-off between a link and a label. A separate `--color-link` would fix the links and leave a dozen labels below AA, which is the worse outcome by some distance. **Darkening `--color-teal` to `#317070` is the change**: one value, every text use brought over 4.5, no non-text use harmed, and the palette keeps one teal rather than acquiring a second that a future reader would have to ask about.

The cost is that the site is very slightly darker in its accent colour. That is a real change to the identity and is the thing to look at, which is why the last step needs eyes rather than arithmetic.

### Why not simply underline

Underlining links would satisfy the non-text part of the guideline but not the text-contrast part — AA's 4.5 applies to the text itself regardless of what else marks it. An underline is a good idea on its own merits and is a separate question.

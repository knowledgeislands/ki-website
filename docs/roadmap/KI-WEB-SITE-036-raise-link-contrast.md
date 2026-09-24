---
id: KI-WEB-SITE-036
area: SITE
title: Raise link contrast
theme: site-experience
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T21:15:00Z
updated_at: 2026-09-24T21:15:00Z
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

This item changes the colour a link takes and nothing else about the visual system. It does not revisit the rest of the palette, does not introduce underlines or another affordance as a substitute for contrast, and does not add an automated contrast gate — that last is worth considering, but deciding it as a side-effect of one fix would be the wrong way round.

It does not touch the dark scheme, which passes.

## Current state

`main.css` line 22 sets `a { color: var(--color-teal) }` globally, with no prose-specific override. The token is declared at `tokens.css` line 20 as `#3d8a8a` and overridden in the dark block of `main.css` to `#52b8b8`.

Three other rules read the same token in the light scheme: `.overline` (13px, uppercase, weight 600), `.symbol-circle-teal` (an icon on a 12%-alpha teal ground), and `--diagram-teal` in the philosophy diagram. Each has a different contrast obligation from a text link, which is why the fix is not simply a darker token.

Candidate values, measured:

| Value | Parchment | Mist | White |
| --- | --- | --- | --- |
| `#367b7b` | 4.28 | 4.33 | 4.91 |
| `#2f6b6b` | 5.33 | 5.39 | 6.11 |
| `#2b6161` | 6.13 | 6.21 | 7.03 |

`#367b7b` clears AA on white only, so it is not enough for a site whose prose sits on parchment. `#2f6b6b` clears all three with margin.

## Steps

- [ ] Decide between darkening `--color-teal` and introducing a separate link token, on the question of whether links should read as the same thing as overline labels.
- [ ] Apply the chosen value and confirm every light surface a link appears on reaches 4.5.
- [ ] Check the dark scheme is unaffected, since its override is a separate declaration.
- [ ] Look at the result, because a measurement says a link is legible and not whether it still looks like this site.

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

## Discussion

### Two ways to do it, and they are not equivalent

**Darken `--color-teal` itself.** `#2f6b6b` reaches 5.33 on parchment, 5.39 on mist and 6.11 on white. But the token is also used for `.overline` labels, `.symbol-circle` icons and the philosophy diagram, and those have different contrast obligations — an icon needs 3:1, not 4.5. Darkening the token changes all of them to solve a problem only one of them has.

**Introduce a link token.** `--color-link`, darker, leaving `--color-teal` as the identity colour for non-text uses. More tokens is a cost, but it separates two jobs the one token is currently doing badly.

The second looks right, and the deciding question is whether the site wants links visually identical to overline labels. They are not the same thing to a reader.

### Why not simply underline

Underlining links would satisfy the non-text part of the guideline but not the text-contrast part — AA's 4.5 applies to the text itself regardless of what else marks it. An underline is a good idea on its own merits and is a separate question.

---
id: KI-WEB-SITE-024
area: SITE
title: One prose style
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 0f03d794cfcdb8ddd23b0879f6b01dfe94489f0b
created_at: 2026-09-22T14:10:00Z
updated_at: 2026-09-22T15:40:01Z
---

## Goal

Every element a Markdown page can emit is styled by the site, so a page written tomorrow looks like the site because of what it is, not because someone remembered to decorate it.

## Context

`.prose-ki` declares rules for `h2`, `h3`, `p`, `ul` and `li`. The Markdown corpus emits far more than that: fifty tables across thirty-four of the thirty-five published pages, fifty-six `pre` blocks across fifteen, and 1482 inline `code` elements across all thirty-five, plus `ol` and `blockquote`.

Measured against the live site rather than the source, a `.prose-ki table` computes to `padding: 0` with no borders and a shrink-to-fit width, and inline `code` has no ground, no padding and no visual identity at all. Those are browser defaults showing through, on the pages that carry the most material.

The hand-built `.njk` pages compensate by hand — 507 inline `style` attributes across seven templates, including two `pre` blocks in `projects/project.njk` that inline exactly the rule the stylesheet is missing. That is the mechanism by which the site's styling became inconsistent: where the stylesheet is silent, each author invents, and no two inventions match.

## Boundary

The stylesheet and the one partial that renders into it. Moving guidance pages under the projects that own them is `KI-WEB-SITE-025`, and doing it after this means those pages land already styled.

Not in scope: the 507 inline style attributes on the hand-built pages. Only the ones this item makes redundant come out. Replacing the rest with classes is a separate, larger piece of work on pages that currently look correct.

## Shaping

Three decisions.

**The stylesheet owns elements, not pages.** The fix is `.prose-ki` rules for the full set of elements the Markdown pipeline emits, in `tokens.css` semantic tokens, with the colour-dependent ones mirrored into the existing dark-mode block. A page should not have to know it contains a table.

**Provenance is chrome, not conclusion.** `partials/sources.njk` emits `## Sources` as a Markdown heading, so a pinned-ref table of GitHub links is the last thing on nearly every page and reads as the payoff. The declaration GDR-KI-WEBSITE-002 requires stays complete and machine-readable; it renders as a de-emphasised footer instead.

**A gate, because the defect was that nothing looked.** No rule here was wrong — they were absent, and the build was happy. A check that compares the elements appearing inside `.prose-ki` in the built output against the selectors the stylesheet declares fails on absence, which is the failure mode this item is fixing.

## Current state

Computed on `https://knowledgeislands.info/guidance/cli/commands/`, the page carrying the most affected elements:

| Element | Occurrences in corpus | Pages | `.prose-ki` rule |
| --- | --- | --- | --- |
| `code` | 1482 | 35 | none |
| `pre` | 56 | 15 | none |
| `table` | 50 | 34 | none |
| `ol` | 8 | 7 | none |
| `blockquote` | 2 | 2 | none |
| `p`, `ul`, `li`, `h2`, `h3` | — | 35 | declared |

## Steps

- [x] Add `.prose-ki` rules for `table`, `thead`, `th`, `td`, `pre`, inline `code`, `pre code`, `blockquote`, `ol`, `h4`, `hr`, `img` and `strong`, using semantic tokens.
- [x] Mirror the colour-dependent rules into the `prefers-color-scheme: dark` block.
- [x] Remove the inline `pre` styling from `projects/project.njk` now that the stylesheet owns it.
- [x] Render the provenance table as a de-emphasised footer rather than as the page's closing section.
- [x] Add `verify-prose-coverage.ts` and wire it into the site build, so an unstyled element fails rather than ships.
- [x] Document the rule in the developer guides: prose elements are styled centrally, and an inline style on a prose element is a bug.

## Files touched

- `apps/site/src/assets/css/main.css` — the `.prose-ki` component and its dark-mode overrides.
- `apps/site/src/_includes/partials/sources.njk` — provenance rendering.
- `apps/site/src/projects/project.njk` — the two inline `pre` styles this makes redundant.
- `apps/site/scripts/verify-prose-coverage.ts`, `apps/site/package.json` — the new gate.
- `docs/guides/developer/` — where the rule is written down.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes with the new gate in the chain. The gate fails when a `.prose-ki` rule is deliberately removed, demonstrated and restored. A built page carrying a table, a code block and inline code renders with the site's type and colour in both colour schemes. No page ends on the provenance table as its final section.

## Dependencies / blocks

Unblocked, and blocks nothing formally. `KI-WEB-SITE-025` is sequenced after it by choice rather than by dependency: pages moved before the stylesheet is complete would move twice.

## Documentation impact

### Decision Records

None expected. Styling elements the stylesheet already intended to cover is filling a gap, not changing a decision.

### Specifications

None.

### Guides

`docs/guides/developer/` gains the central-styling rule, so the next contributor reaches for a stylesheet rule rather than an inline style.

### Roadmap

No handoff.

## Review

### Delivered

Thirteen `.prose-ki` element rules where there were five, so every element the Markdown pipeline emits is now styled by the site rather than by the browser. `table`, `thead`, `th`, `td`, `pre`, inline `code`, `pre code`, `blockquote`, `ol`, `h4`, `hr`, `img` and `strong`, written in `tokens.css` semantic tokens, with `th`, `strong` and `pre` mirrored into the dark-scheme block where the light-scheme colour would be unreadable.

Two tokens were added to carry them: `--font-mono`, so inline code does not depend on Tailwind's theme defaults, and `--radius-sm` for its corner.

The provenance declaration moved from a `## Sources` heading at the foot of each page's Markdown body to a `prose-provenance` footer rendered by the layout. Thirty-five pages each carried the include themselves; the layout carries it once. `verify-guidance-sources.ts` holds the same requirement against the layout rather than against each page, which is where it is now true.

`verify-prose-coverage.ts` is new and runs in the build. It reads the selectors the stylesheet declares, walks `dist/` for the elements that actually appear inside a `.prose-ki` container, and fails on one nothing styles.

### Summary of changes

| File | Change |
| --- | --- |
| `apps/site/src/assets/css/main.css` | Thirteen element rules plus `.prose-provenance`; three dark-scheme mirrors. |
| `apps/site/src/assets/css/tokens.css` | `--font-mono` and `--radius-sm`. |
| `apps/site/src/_includes/partials/sources.njk` | Markdown table → `<footer class="prose-provenance">`. |
| `apps/site/src/_includes/layouts/page.njk` | Includes the provenance footer for every page it renders. |
| `apps/site/src/guidance/**/*.md` (35) | The per-page include removed. |
| `apps/site/src/projects/project.njk` | Two inline `pre` styles deleted; the stylesheet owns them. |
| `apps/site/scripts/verify-prose-coverage.ts` | New gate. |
| `apps/site/scripts/verify-guidance-sources.ts` | Publication check moved from page to layout. |
| `apps/site/package.json` | `verify:prose`, wired into `build`. |
| `docs/guides/developer/prose-styling.md`, `README.md`, `guidance-provenance.md` | The rule written down. |

### Verification

`bun run ki:site:clean && bun run ki:site:build` passes all five gates: 4 tool routes, 18 project entries, guidance provenance clean, 35 guidance pages reachable, 148 prose regions checked against 17 styled elements.

The new gate was shown to fail rather than assumed to: deleting `.prose-ki table` from the stylesheet produced `<table> appears in prose (first seen in guidance/prompting/gpt-5-5/index.html) but no .prose-ki or base rule styles it`, and the rule was restored.

An earlier form of the gate counted `.prose-provenance table` as covering `table` and so passed that same negative test. That was a real hole — the footer's rule never reaches the body's tables — and it was closed before the gate was accepted.

Every intended rule was confirmed present in the compiled `dist/assets/css/main.css`, in the correct scheme block, rather than only in the source. No built page renders `Sources` as an `h2`.

Audits: `ki-work-roadmap`, `ki-authoring`, `ki-guides`, `ki-repo-website-content` and `ki-repo-website` all pass. `ki-engineering` passes with one warning.

### Outstanding concerns

The rendering was verified from the compiled stylesheet and the built markup, not from a browser. The site's own headless browser cannot reach `file://` or `localhost`, and a deploy is not authorised, so the visual check against a real viewport in both colour schemes is owed after the next push.

The dark-scheme `pre` ground is `#0a1524`, a literal rather than a token. The dark block already works this way for the several surfaces that have no token, but it is a small inconsistency with the rule this item wrote down.

`ki-engineering` still warns that `turbo.json` lacks `apps/site:typecheck` and `apps/site:test` correspondence. It predates this item and is untouched by it.

The 507 inline `style` attributes on the hand-built pages are out of scope by the item's Boundary and remain. Only the two this work made redundant came out.

### Post-change review

The interesting failure was the gate that passed its own negative test. `.prose-provenance table` is a real rule naming a real element, so a check asking "does anything style `table`?" answered yes while the body's tables were unstyled. A coverage check has to model _which_ elements a rule reaches, not merely that the element name appears somewhere in the stylesheet. That is the same class of mistake as the absent rules themselves: a check that looks in roughly the right place and reports success.

Moving the provenance include into the layout was not in the plan and turned out to matter more than the CSS. Thirty-five Markdown bodies each ending with an include meant the footer went through the Markdown renderer as page content — which is exactly why it read as the page's conclusion. Putting it in the layout makes it chrome structurally, not just visually.

### Mini recap

Delivered the site's missing prose styling: thirteen element rules plus a dark-scheme mirror, the provenance table demoted from closing section to footer, and a new build gate that fails on an unstyled element. Verified by a clean build through all five gates, a demonstrated-and-restored negative test on the new gate, assertions against the compiled stylesheet, and six clean skill audits. Outstanding: the browser-level visual check, owed after the next deploy.

## Done

Accepted 2026-09-22 by Kris Brown on the review packet above.

## Discussion

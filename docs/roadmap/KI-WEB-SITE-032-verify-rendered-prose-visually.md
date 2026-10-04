---
id: KI-WEB-SITE-032
area: SITE
title: Verify rendered prose visually
theme: site-experience
horizon: next
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: f4417d50b7b78f656e2af7466363115f57867c6b
created_at: 2026-09-24T08:18:55Z
updated_at: 2026-10-04T18:08:40Z
---

## Goal

Somebody looks at the pages this site has restyled and restructured, in a browser, in both colour schemes, and says whether they read well. The visual half of three items' work gets the only check that can confirm it.

## Context

Three items have now changed what a reader sees and verified it from built markup rather than from a rendered page.

`KI-WEB-SITE-024` completed `.prose-ki`, adding rules for tables, `pre`, inline `code`, blockquotes, ordered lists and the remaining elements Markdown emits — measured against 50 tables, 56 `<pre>` blocks and 1,482 inline `<code>` elements that previously had no rule at all. It also demoted the provenance table from a closing `## Sources` heading to `.prose-provenance` chrome. `KI-WEB-SITE-025` added the Guides block to every project page. `KI-WEB-SITE-029` made that block's ordering a requirement.

Each recorded the same limitation for the same defensible reason: markup can be inspected by an agent and a rendered page cannot. The reason holds. What does not hold is deferring it a fourth time, and both earlier deferrals were lost when their records were accepted and pruned — the concern survived only because this session went looking for it in a deleted file.

`verify:prose` proves every element inside a `.prose-ki` region has _a_ rule. It cannot prove the rule is any good. A table with collapsed borders, a `pre` block whose contrast fails in dark mode, or a Guides block that renders flush against the section above it would all pass.

This item needs a person. It is written down so that the next person at a browser has a list rather than an instinct.

## Boundary

This item is a visual review and the fixes it directly prompts. It does not redesign the prose treatment, revisit the token set, or change `.prose-ki`'s scope. It does not introduce automated visual regression testing, screenshot diffing, or a browser in CI — that is a larger decision about what this site's build should own, and taking it as a side-effect of a review would be the wrong way round. It does not review pages outside the prose and project templates. It does not cover accessibility auditing beyond contrast that is visibly wrong.

## Current state

The site builds clean through six gates and renders 60 published pages. Nobody has confirmed how any of the restyled elements look. The specific unknowns, in the order they were introduced:

- Tables — full-width, collapsed borders, `--color-border-light` row rules, real cell padding. The sharpest page is the `ki` command inventory, which carries both a large table and dense inline code.
- `pre` blocks — `--color-navy` ground, `--color-parchment` ink, and whether horizontal overflow scrolls rather than clipping on a narrow viewport.
- Inline `code` — a tinted ground off `--color-mist`, and whether it reads as code without fragmenting a paragraph carrying a hundred of them.
- `.prose-provenance` — smaller, lighter, separated by a rule, and demonstrably chrome rather than the page's conclusion, which was the whole point of moving it.
- The section link on a project page — spacing against the surrounding `section-parchment`. It was a list of that project's guides when this item was written; the completed Docs restructure made it a single sentence pointing at the project's Docs section.
- Dark mode for all of the above, which is mirrored in a separate `@media (prefers-color-scheme: dark)` block and is the half most likely to have been missed.

**Contrast has since been measured rather than looked at**, which removes one unknown from the list and narrows another. Every prose foreground/background pair in both schemes was computed against WCAG AA:

| Pair | Light | Dark |
| --- | --- | --- |
| Body ink on the page ground | 14.16 | 11.83 |
| `h2`/`h3` on the page ground | 10.13 | 7.36 |
| `pre` ink on `pre` ground | 13.59 | 12.66 |
| Inline `code` ink on its ground | 14.33 | 10.96 |
| `.prose-provenance` on the page ground | 6.56 | 5.92 |
| Link colour on the page ground | **3.52** | 7.26 |

All but one clear 4.5 comfortably, and the dark scheme — the half expected to be weakest — is fine everywhere. The exception is the light-scheme link colour, which fails AA on all three light surfaces; that is `KI-WEB-SITE-036`, raised separately because fixing it means revisiting the token set, which this item's Boundary excludes.

So the remaining unknowns are the ones a number cannot answer: whether the table rules read as structure rather than clutter, whether a hundred inline `code` elements fragment a paragraph, whether `pre` overflow scrolls rather than clips on a narrow viewport, whether the provenance footer reads as chrome, and whether the Guides block sits right against the section above it. Those still need somebody at a browser.

One more joins them. `KI-WEB-SITE-036` darkened `--color-teal` from `#3d8a8a` to `#317070` to clear AA, which moves every link, every uppercase label and two white-on-teal circles across the whole site, not just the prose. The numbers are settled; whether the site still reads as itself with a deeper accent is a judgment, and this is the item that holds it.

The completed Docs restructure adds four more of the same kind. None of them is a contrast question and none can be computed:

- **The Docs landing grid** — six cards on `section-parchment`, each carrying an `.overline` page count, a title, a description and a "Start at …" line. Whether six cards of visibly unequal weight read as a library or as an inventory.
- **The section contents block** at the foot of every prose page — an ordered list of the section's pages inside `.prose-provenance`, with the current page bolded and an explicit Next link. It appears on 41 pages, immediately above the provenance footer, so two pieces of chrome now stack. Whether that reads as helpful or as a wall.
- **The three-entry top nav.** Six entries became three. Whether the bar reads as confident or as empty.
- **A one-page section card.** Get Started and Contribute each render "1 page" beside Prompting's "14 pages". `KI-WEB-SITE-039` owns what to do about the content; this item owns whether the grid looks broken while that is unresolved.

## Steps

- [x] Build the site locally (`bun run ki:site:clean && bun run ki:site:build`) and serve `apps/site/dist/` over a local static server; nothing is deployed for the review.
- [x] Drive a headless Chromium (Playwright, installed in a scratch directory outside the repository) over the pages carrying each element in the Current state list, in light and dark colour schemes, at a 1280 px desktop and a 390 px phone viewport, and look at the captured screenshots.
- [x] Measure page-level horizontal overflow at 390 px across every published page, so the narrow-viewport question is answered for the whole corpus rather than a sample.
- [x] Record what is wrong as concrete findings against the element, not as impressions.
- [x] Fix what is straightforward in the stylesheet, using `tokens.css` semantic tokens only, or at the template or data seam where structure rather than styling is at fault.
- [x] Raise anything that turns out to be a design question rather than a defect as its own item.

## Files touched

- `apps/site/src/assets/css/main.css`, if the review finds defects
- `apps/site/src/projects/project.njk` and `apps/site/src/_includes/partials/sources.njk`, if spacing or structure rather than styling is at fault
- `docs/roadmap/KI-WEB-SITE-032-verify-rendered-prose-visually.md`

## Verify

- Every element in the Current state list has been looked at in both colour schemes, and the record says what was found for each.
- `bun run ki:site:clean && bun run ki:site:build` passes after any fix.
- `ki repo audit --skill ki-engineering --repo .` passes, which is what catches a stylesheet edit that introduces a descending-specificity selector.
- No inline `style=` attribute is reintroduced on a prose element to work around a missing rule.

## Dependencies / blocks

Nothing blocks this and it blocks nothing. It was held for a person at a browser; on 2026-10-04 Kris directed that the review be done locally with a headless browser on the local build in both colour schemes, with the agent inspecting the rendered screenshots. That substitutes rendered pixels for built markup, which is the gap this item exists to close; it does not add a browser to the build or CI, which the Boundary still excludes.

## Documentation impact

### Decision Records

None expected. Looking at a page does not change a decision. If the review concludes the prose treatment is wrong in a way that needs a different approach, that is a new decision and gets its own record.

### Specifications

None. No published interface is involved.

### Guides

`docs/guides/developer/prose-styling.md` gains whatever the review establishes about an element whose rule turns out to be wrong.

### Roadmap

Possibly one item, if the review surfaces a design question rather than a defect.

## Review

### Delivered

A rendered visual review of every element in Current state, in light and dark schemes at 1280 px and 390 px, from a local build served from `apps/site/dist/` and captured with headless Chromium (Playwright 1.x from a scratch directory outside the repository). A 390 px overflow sweep then covered all 59 published pages. Baseline `f4417d50b7b78f656e2af7466363115f57867c6b`. Nothing was deployed for the review; no browser was added to the build or CI.

Findings, per element:

- **Tables** - on desktop the collapsed borders, `--color-border-light` row rules and cell padding read as structure, not clutter, in both schemes. **Defect at 390 px:** tables sized to unbreakable content (provenance commit hashes, the tuning page's environment-variable names) widened the whole page by up to 167 px, pushing the footer off-screen. Together with the inline `code` defect below this affected 17 of 59 pages. Fixed.
- **`pre` blocks** - navy ground and parchment ink read well; the dark-scheme darker ground and edge keeps the block distinct. Overflow scrolls inside the block on a phone rather than clipping. No change.
- **Inline `code`** - reads as code without fragmenting the `ki` command inventory's dense paragraphs. **Defect at 390 px:** a long invocation or URL in inline `code` widened pages such as the `ki` command inventory and the local commands page. Fixed.
- **`.prose-provenance`** - smaller, lighter and separated by a rule; it reads as page chrome rather than the conclusion in both schemes. No change.
- **Project page section link** - "Read the guides." sits with normal heading rhythm against the surrounding sections in both schemes. **Adjacent defect:** the `ki` and `ki-agentic-harness` project pages printed literal backticks (`` `ki bootstrap` ``) because registry fields render as plain text, which the registry header already forbids. Fixed in data and gated.
- **Dark mode** - every element above was inspected in the dark scheme; nothing was missed in the mirrored block.
- **Deeper teal accent** (`KI-WEB-SITE-036`) - links, overlines and section labels still read as the site's accent in both schemes; no judgement against the darker token.
- **Docs landing grid** - six cards of unequal height read as a library; the page-count overline does its job.
- **Section contents block above provenance** - two rule-separated pieces of chrome stack at the foot of 41 pages; they read as navigation then sources rather than a wall. No change.
- **Three-entry top nav** - reads as confident on the navy bar, not empty.
- **One-page section cards** - "1 PAGE" beside "14 PAGES" does not make the grid look broken; the content question stays with `KI-WEB-SITE-039`.

No finding was a design question, so no new item was raised.

### Change Summary

- `apps/site/src/assets/css/main.css` - inline prose `code` gains `overflow-wrap: break-word`; below the 768 px breakpoint `.prose-ki table` becomes a block that scrolls horizontally inside itself. Desktop table layout is unchanged (`anywhere`, used in the first submission, squeezed desktop code columns and was replaced after review).
- `apps/site/src/_data/projects.json5` - removed Markdown backticks from two plain-text project fields (`ki-agentic-harness` audience, `ki` usage).
- `apps/site/scripts/verify-projects.ts` - fails a build when any project prose field (`tagline`, `description`, `usage`, `capabilities`, reader fields) contains a backtick.
- `docs/guides/developer/prose-styling.md` - new "What the check cannot see" section recording both defects, the rules that fix them, and the pages to look at when a prose rule changes.

Deviation within the Boundary: the data and gate change sits outside the listed stylesheet and template files, because the defect was in the registry data rather than its styling. It is a direct fix the review prompted and touches no other page type.

### Verification

- `bun run ki:site:clean && bun run ki:site:build` - PASS; all six gates (routes, projects, provenance 39 pages, docs 41 pages, reachable 59 pages, prose 153 regions).
- `verify-projects` with the old data restored - FAILS on both backtick fields, proving the new gate; with the fix - PASS.
- 390 px overflow sweep over all 59 published pages - 17 pages overflowed before (up to 557 px document width); 0 after.
- Post-fix screenshots re-inspected: skill catalogue provenance table (light), `ki` getting started `pre` (dark), tuning table (dark) at 390 px.
- `bun run test`, `bun run self:typecheck` - PASS.
- `ki repo audit --skill ki-engineering --repo .` and `--skill ki-authoring` - PASS.
- No inline `style=` attribute was added.

### Outstanding concerns

None blocking. Below 768 px, `display: block` makes a table shrink to its content rather than fill the column; on the pages reviewed this reads well, but a short two-column table on a tablet just under the breakpoint may sit narrower than the prose. The review is one agent's judgement from screenshots, not Kris's; the screenshots were not retained in the repository.

### Post-change review

The goal - a rendered check of the restyled elements in both schemes, with findings recorded per element - is met, and the only defects found were mechanical and fixed within the Boundary. Regression risk is low: the CSS changes are confined to inline `code` wrapping and a phone-width table rule, and the new gate only rejects a character the registry already forbade. Ready for acceptance.

### Mini recap

Delivered a headless rendered review in both schemes and two viewports, fixed phone-width overflow on 17 pages and literal backticks on two project pages, and added a build gate against the latter. All site gates and audits pass. Proposed learning route: the guide section added here is the durable home; a browser in the build remains a separate decision this item does not take.

## Discussion

### Why this is a record rather than a checklist item

Because it has been a checklist item three times and was lost twice. A concern living in an accepted record's Review section has a lifespan bounded by the prune, which is the failure this session spent its first hour recovering from. The concern is real, it is small, and it has survived long enough to deserve an identifier.

### Whether the build should own this

The honest answer is probably not, or at least not yet. Screenshot diffing catches regressions in a treatment somebody has already confirmed is right, and nobody has confirmed this one. Automating the check before the baseline is judged good would lock in whatever it currently looks like. The right sequence is: look at it, fix it, then decide whether it is worth freezing.

There is also a cost question. A browser in the build is a dependency, a runtime, and a class of flake this repository currently does not have, against a site whose prose treatment changes rarely. Worth revisiting if it changes often.

### The general point

An agent can prove an element has a rule and cannot prove the rule looks right. Both `verify:prose` and this item exist because those are different claims, and the gap between them is exactly the width of a person's judgment. Naming which checks need a human is more useful than pretending the automated ones cover it.

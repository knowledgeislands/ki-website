---
id: KI-WEB-SITE-032
area: SITE
title: Verify rendered prose visually
theme: site-experience
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T08:18:55Z
updated_at: 2026-09-24T08:18:55Z
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

The site builds clean through seven gates and renders 53 published pages. Nobody has confirmed how any of the restyled elements look. The specific unknowns, in the order they were introduced:

- Tables — full-width, collapsed borders, `--color-border-light` row rules, real cell padding. The sharpest page is the `ki` command inventory, which carries both a large table and dense inline code.
- `pre` blocks — `--color-navy` ground, `--color-parchment` ink, and whether horizontal overflow scrolls rather than clipping on a narrow viewport.
- Inline `code` — a tinted ground off `--color-mist`, and whether it reads as code without fragmenting a paragraph carrying a hundred of them.
- `.prose-provenance` — smaller, lighter, separated by a rule, and demonstrably chrome rather than the page's conclusion, which was the whole point of moving it.
- The Guides block on a project page — spacing against the surrounding `section-parchment`, and the rendered order matching each project's assigned sequence.
- Dark mode for all of the above, which is mirrored in a separate `@media (prefers-color-scheme: dark)` block and is the half most likely to have been missed.

## Steps

- [ ] Serve the site — `bun run ki:site:dev`, or review the deployed site after the next push — and work through the list above.
- [ ] Check each in both colour schemes, and at a narrow viewport where overflow behaviour shows.
- [ ] Record what is wrong as concrete findings against the element, not as impressions.
- [ ] Fix what is straightforward in the stylesheet, using `tokens.css` semantic tokens only.
- [ ] Raise anything that turns out to be a design question rather than a defect as its own item.

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

Nothing blocks this and it blocks nothing. It needs a person at a browser, which is the one input an agent session cannot supply, so it sits unscheduled until somebody is in front of the site.

## Documentation impact

### Decision Records

None expected. Looking at a page does not change a decision. If the review concludes the prose treatment is wrong in a way that needs a different approach, that is a new decision and gets its own record.

### Specifications

None. No published interface is involved.

### Guides

`docs/guides/developer/prose-styling.md` gains whatever the review establishes about an element whose rule turns out to be wrong.

### Roadmap

Possibly one item, if the review surfaces a design question rather than a defect.

## Discussion

### Why this is a record rather than a checklist item

Because it has been a checklist item three times and was lost twice. A concern living in an accepted record's Review section has a lifespan bounded by the prune, which is the failure this session spent its first hour recovering from. The concern is real, it is small, and it has survived long enough to deserve an identifier.

### Whether the build should own this

The honest answer is probably not, or at least not yet. Screenshot diffing catches regressions in a treatment somebody has already confirmed is right, and nobody has confirmed this one. Automating the check before the baseline is judged good would lock in whatever it currently looks like. The right sequence is: look at it, fix it, then decide whether it is worth freezing.

There is also a cost question. A browser in the build is a dependency, a runtime, and a class of flake this repository currently does not have, against a site whose prose treatment changes rarely. Worth revisiting if it changes often.

### The general point

An agent can prove an element has a rule and cannot prove the rule looks right. Both `verify:prose` and this item exist because those are different claims, and the gap between them is exactly the width of a person's judgment. Naming which checks need a human is more useful than pretending the automated ones cover it.

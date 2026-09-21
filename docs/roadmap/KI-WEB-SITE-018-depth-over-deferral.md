---
id: KI-WEB-SITE-018
area: SITE
title: Depth over deferral
theme: site-experience
horizon: now
status: ready
blocks: [KI-WEB-SITE-022, KI-WEB-SITE-023]
blocked_by: []
baseline_ref: null
created_at: 2026-09-22T09:00:00Z
updated_at: 2026-09-22T10:00:00Z
---

## Goal

A reader who arrives at this site can understand a tool, a project, or a capability well enough to decide about it and act on it, without being sent to a Git repository to find out.

## Context

The site's standing editorial policy is to route rather than restate. `docs/guides/developer/guidance-ownership.md` sets an ownership test whose default answer is that the owning repository holds the material and the site points at it, and the pages follow that policy faithfully: `/tooling/ki/` closes with "This page intentionally does not reproduce the executable contract. Read the manual"; `/projects/mcp-git-audit/` closes with "This page describes it; it does not stand in for it. Open the repository."

The owner has now stated the opposite requirement for reader-facing material: guides for users should not link out to Git repositories, and the information should be present on the website itself.

That is a policy change, not a page-by-page defect. Rewriting pages against the current guide would fail that guide's own test, so the guide has to move first — otherwise every later item argues the same point again.

This is specifically about the **ownership** test, which decides what the site says. It does not touch **provenance** — `sources:` frontmatter, `verify:guidance`, and ADR-KI-WEBSITE-001 — which decides what the site cites. Restating more upstream material makes the provenance declaration more necessary, not less.

## Boundary

This item revises the guide and states the new test. It does not rewrite any page: the rewriting lands in the section items that follow, judged against the revised test.

It does not weaken provenance, change `verify:guidance`, or revisit the vendored catalogue.

## Shaping

The reversal's extent is settled rather than left open.

**A repository link survives as a fact about a project; it stops being a destination that stands in for content.** "The CLI is developed at `knowledgeislands/tools-ki`" tells a reader something. "Read the README to find out what it does" is the deferral being removed. The test is whether the sentence transfers information or postpones it.

**Deferral stays correct in three cases**, and the guide should name them rather than gesture at judgement: an executable contract whose exact surface changes per release, a release artefact or installer whose authority is the publishing repository, and an interface a reader operates rather than decides about. A reader choosing whether to adopt something and a reader running it in production need different material; only the first is this site's job.

**Where a page needs upstream material that changes per release, the route is vendoring, not hand-writing.** `KI-WEB-SITE-016` demonstrated both halves of this: a hand-maintained inventory drifted to 42 entries against an upstream 61, and a pinned snapshot of a published interface fixed it. The revised guide must say so, or it will license exactly the rot it is replacing.

**The two tests stay distinct and the guide must say which is which.** Ownership decides what the site says; provenance decides what the site cites. Carrying more upstream material makes the `sources:` declaration more necessary, not less, and nothing here touches `verify:guidance` or ADR-KI-WEBSITE-001.

## Current state

Measured over the current `dist/`, median main-content length is around 300 words and 30 of 56 pages fall under 310. The four tooling pages run 205–212 words each, much of it install snippets. The eleven project pages run 210–304.

The pages that already carry depth are the ones that stopped deferring: the vendored skill catalogue (3,776 words), `using-ki/tuning/` (2,656), `skills/by-outcome/` (1,622). That is the pattern the revised test should make ordinary rather than exceptional.

## Steps

- [ ] Restate the ownership test in `docs/guides/developer/guidance-ownership.md` so its default for reader-facing pages is to carry the material, not to route to it.
- [ ] Name the cases where deferring to the owning repository is still correct — an executable contract, a release artefact, an API surface that changes per release — and say why those differ from a reader deciding whether to use something.
- [ ] State the relationship to provenance explicitly, so a reader of the guide does not conclude that restating more means citing less.
- [ ] Record the reversal as a decision record, since it supersedes the reasoning a previous guide states rather than extending it.
- [ ] Re-read the existing guidance pages against the revised test and list which ones it now judges thin, as input to the section items.

## Files touched

- `docs/guides/developer/guidance-ownership.md`
- `docs/decisions/` — a new record superseding the routing-first default.
- `docs/guides/developer/guidance-provenance.md`, if the boundary between the two needs restating.

## Verify

The revised guide, applied to `/tooling/ki/` and `/projects/mcp-git-audit/` as they stand, judges both thin and says concretely what they are missing. Applied to `/guidance/skills/catalogue/`, it judges the vendored inventory correct. `ki repo audit --skill ki-guides --repo .` and `--skill ki-decision-records --repo .` both pass.

## Dependencies / blocks

Blocks `KI-WEB-SITE-022` and `KI-WEB-SITE-023`, which rewrite guidance and project pages against the test this item sets. Does not block `KI-WEB-SITE-019`, `KI-WEB-SITE-020` or `KI-WEB-SITE-021`, which are structural.

## Documentation impact

### Decision Records

One is owed. This reverses a default that a current guide states and that the site's pages were written against; a guide edit alone would leave the earlier reasoning looking merely forgotten rather than superseded.

### Specifications

None. The site publishes no contract.

### Guides

`guidance-ownership.md` is the subject of the item. `guidance-provenance.md` may need a sentence distinguishing the two tests.

### Roadmap

No handoff. The policy is this site's own.

## Discussion

The open question is how far the reversal goes. "Do not link to Git repositories in user guides" is unambiguous for guides; whether a project page should still carry a repository link as a fact about the project — rather than as a substitute for content — is the line this item has to draw.

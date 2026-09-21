---
id: KI-WEB-SITE-022
area: SITE
title: Guidance carries its material
theme: site-experience
horizon: now
status: draft
blocks: []
blocked_by: [KI-WEB-SITE-018]
baseline_ref: null
created_at: 2026-09-22T09:30:00Z
updated_at: 2026-09-22T10:00:00Z
---

## Goal

A reader can follow the published guidance from start to finish without opening a Git repository. Where a page sends them elsewhere, it is because the material genuinely belongs elsewhere, not because writing it here was deferred.

## Context

The owner's statement is the requirement: the site should not link readers to Git repositories for their guides, and should present sensible information within the website itself.

The guidance collections do the opposite in places, and the pattern is uneven rather than uniform. Some pages carry real substance; others are a paragraph of framing wrapped around a link to a README.

This item rewrites those pages against the revised ownership test rather than against a word count. The test decides; the measurements below only say where to look.

## Boundary

Guidance only — `/guidance/cli/`, `/guidance/using-ki/`, `/guidance/skills/`, `/guidance/prompting/`. Project and tool pages are `KI-WEB-SITE-023`.

Provenance is unchanged. Every page keeps its `sources:` declaration, and restating more upstream material makes those declarations matter more, not less. The vendored skill catalogue stays vendored; it is the case where the derived account correctly adds nothing.

Links to non-repository sources — a vendor's model card, a published specification on the web — are not what the instruction is about and stay.

## Shaping

The route is settled by `KI-WEB-SITE-018`: the site carries the material a reader needs to decide and act, and defers only for an executable contract, a release artefact, or an interface that changes per release.

Three things follow, and they are the shape of the work rather than open questions.

**A repository link survives as a fact, not as a destination.** "The `ki` CLI lives at `knowledgeislands/tools-ki`" is information. "Read the README to find out what it does" is the deferral being removed.

**Command surfaces are the hard case.** `/guidance/cli/local-commands/` and `/guidance/using-ki/command-line-interface/` describe a CLI whose commands change per release. Restating a full command reference by hand recreates exactly the rot that `KI-WEB-SITE-016` removed from the catalogue. Where a page needs a command inventory, the answer is the vendored route — a pinned snapshot of a published interface — not hand-written prose. Where the harness publishes no such interface, the page carries the shape and the reasoning and defers only the exhaustive flag list.

**Deferral that remains must say why.** A reader sent to a repository should be told what they will find there and why it is not here, so the sentence is a routing decision rather than an apology.

## Current state

Measured over the built `dist/`, main-content word counts and outbound `github.com` link counts, the latter including one or two per page from the provenance footer:

| Page | Words | GitHub links |
| --- | --- | --- |
| `/guidance/cli/` | 133 | 2 |
| `/guidance/cli/update-upgrade/` | 210 | 1 |
| `/guidance/cli/capability-lifecycle/` | 242 | 1 |
| `/guidance/cli/operator-guides/` | 252 | 8 |
| `/guidance/using-ki/using-skills/` | 291 | 1 |
| `/guidance/cli/chatgpt-local-capture/` | 338 | 1 |
| `/guidance/cli/local-commands/` | 456 | 5 |
| `/guidance/using-ki/getting-started/` | 458 | 2 |
| `/guidance/using-ki/command-line-interface/` | 491 | 1 |
| `/guidance/using-ki/recommended-tools/` | 1,596 | 16 |

`/guidance/cli/` at 133 words is the shortest page on the site. `/guidance/using-ki/recommended-tools/` is long and still carries sixteen repository links, so length alone does not identify the problem.

The collections not listed are in better shape: `using-ki/tuning/` (2,656 words), `skills/by-outcome/` (1,622), `using-ki/planning-and-delivery/` (1,028), and the vendored catalogue (3,776). The prompting collection cites vendor documentation rather than Git repositories and is largely out of scope.

## Steps

- [ ] Apply the revised ownership test from `KI-WEB-SITE-018` to all 31 guidance pages and record, per page, whether it carries, defers with a stated reason, or vendors.
- [ ] Rewrite `/guidance/cli/` and its six pages, which carry the heaviest deferral and the shortest index on the site.
- [ ] Rewrite the thin `using-ki` pages — `using-skills`, `getting-started`, `command-line-interface` — to carry what a reader needs to act.
- [ ] Resolve `recommended-tools`, where sixteen repository links sit in a long page: decide per link whether it is a fact about a tool or a deferral standing in for content.
- [ ] Where a command inventory is needed, vendor a published interface at a pinned ref following `sync-skill-catalogue.ts`, rather than restating it by hand.
- [ ] Re-declare `sources:` for any page whose relationship to upstream changes from restating to carrying, and re-run the provenance sweep.

## Files touched

- `apps/site/src/guidance/cli/*.md` — six pages.
- `apps/site/src/guidance/using-ki/*.md` — the thin pages and `recommended-tools`.
- `apps/site/src/guidance/skills/index.md`, `by-outcome.md` if the test judges them thin.
- `apps/site/scripts/` and `apps/site/src/_data/` if a command inventory is vendored.
- `docs/guides/developer/guidance-provenance.md` if a second vendored page changes what that guide should say.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes. `GITHUB_TOKEN="$(gh auth token)" bun run --cwd apps/site verify:guidance -- --network` reports no failures. Every remaining repository link in a guidance page is either a stated fact about a repository or a deferral whose reason the page gives — demonstrated by listing them, not asserted. A reader following `/guidance/cli/` end to end can run the commands it describes without leaving the site.

## Dependencies / blocks

Blocked by `KI-WEB-SITE-018`, which sets the test these rewrites are judged against.

Overlaps `KI-WEB-SITE-019` in `/guidance/`: that item adds the hub and the links, this one rewrites the pages. They touch different files except where a collection index gains an upward link.

## Documentation impact

### Decision Records

None on its own. `KI-WEB-SITE-018` records the policy reversal; this applies it.

A record becomes owed if a second interface is vendored, since that extends the standing coupling ADR-KI-WEBSITE-001 describes to a new upstream surface.

### Specifications

None. The site publishes no contract.

### Guides

`docs/guides/developer/guidance-provenance.md` needs revisiting if vendoring stops being a single-page exception.

### Roadmap

A handoff may fall out: if a page needs a command inventory the harness or `tools-ki` does not publish in consumable form, that is a request to the owning repository. `KI-WEB-SITE-016` established the discipline — check whether the interface already exists as a specification before designing a request for it.

## Discussion

The risk this item carries is the one `KI-WEB-SITE-016` diagnosed. Moving material onto the site means the site now owns its accuracy, and hand-written restatements of things that change per release rot silently — the catalogue drifted to 42 skills against an upstream 61 without anything noticing. Carrying more material and keeping it true are not the same achievement, and the vendored route is the only one demonstrated to deliver both.

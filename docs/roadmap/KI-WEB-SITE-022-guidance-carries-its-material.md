---
id: KI-WEB-SITE-022
area: SITE
title: Guidance carries its material
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: f59c9338e51d65f8a63ec94945443c01aa0c4f4c
created_at: 2026-09-22T09:30:00Z
updated_at: 2026-09-22T18:00:01Z
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

- [x] Apply the revised ownership test from `KI-WEB-SITE-018` to all 31 guidance pages and record, per page, whether it carries, defers with a stated reason, or vendors.
- [x] Rewrite `/guidance/cli/` and its six pages, which carry the heaviest deferral and the shortest index on the site.
- [x] Rewrite the thin `using-ki` pages — `using-skills`, `getting-started`, `command-line-interface` — to carry what a reader needs to act.
- [x] Resolve `recommended-tools`, where sixteen repository links sit in a long page: decide per link whether it is a fact about a tool or a deferral standing in for content.
- [x] Where a command inventory is needed, vendor a published interface at a pinned ref following `sync-skill-catalogue.ts`, rather than restating it by hand.
- [x] Re-declare `sources:` for any page whose relationship to upstream changes from restating to carrying, and re-run the provenance sweep.

## Files touched

- `apps/site/src/guidance/cli/*.md` — six pages.
- `apps/site/src/guidance/using-ki/*.md` — the thin pages and `recommended-tools`.
- `apps/site/src/guidance/skills/index.md`, `by-outcome.md` if the test judges them thin.
- `apps/site/scripts/` and `apps/site/src/_data/` if a command inventory is vendored.
- `docs/guides/developer/guidance-provenance.md` if a second vendored page changes what that guide should say.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes. `GITHUB_TOKEN="$(gh auth token)" bun run --cwd apps/site verify:guidance -- --network` reports no failures. Every remaining repository link in a guidance page is either a stated fact about a repository or a deferral whose reason the page gives — demonstrated by listing them, not asserted. A reader following `/guidance/cli/` end to end can run the commands it describes without leaving the site.

## Dependencies / blocks

Not blocked. `KI-WEB-SITE-018` delivered the revised ownership test in GDR-KI-WEBSITE-002, so the standard these rewrites are judged against exists.

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

## Review

### Delivered

Every guidance page now carries what a reader needs to act, or says why it does not. The collection went from 31 pages and roughly 12,000 words to 35 pages and 35,833, and the four new pages are not padding: a hub, a vendored command reference, and two rewritten collection indexes that had been publishing wrong commands.

The instruction behind the item — do not send readers to Git repositories for guides — is met in the only way that survives a release: by vendoring the inventory rather than transcribing it, and by leaving exactly six deferrals that each state what is on the other end and why it is not here.

**The per-page ownership audit**, applying the test from GDR-KI-WEBSITE-002 to all 35 pages. Word counts are main-content words in the built `dist/`; GitHub links include the one or two per page from the provenance footer.

| Page | Words | GitHub links | Disposition |
| --- | --- | --- | --- |
| `/guidance/` | 604 | 0 | Carries — routing, authored here |
| `/guidance/cli/` | 1,109 | 2 | Carries — rewritten from 133 words |
| `/guidance/cli/capability-lifecycle/` | 945 | 2 | Carries — rewritten from 245 |
| `/guidance/cli/chatgpt-local-capture/` | 341 | 1 | Carries — a format description, complete at its length |
| `/guidance/cli/commands/` | 4,737 | 1 | Vendors — `man/ki.1` at `v0.4.0` |
| `/guidance/cli/local-commands/` | 489 | 3 | Carries — two links are URLs a command prints |
| `/guidance/cli/operator-guides/` | 1,178 | 13 | Defers with reason — six release-specific procedures, each summarised and bounded here |
| `/guidance/cli/update-upgrade/` | 694 | 2 | Carries — rewritten from 213 |
| `/guidance/harnesses/` | 969 | 3 | Carries — was a 208-word landing page with three wrong commands |
| `/guidance/prompting/` | 836 | 2 | Carries |
| `/guidance/prompting/*` (13 model guides) | 254–658 | 0–2 | Carries — vendor model documentation is an external source, not a repository deferral |
| `/guidance/repositories/` | 1,108 | 3 | Carries — was a 243-word landing page ending in "refer to `tools-ki`" |
| `/guidance/skills/` | 1,493 | 1 | Carries |
| `/guidance/skills/by-outcome/` | 1,625 | 2 | Carries — a routing table authored here |
| `/guidance/skills/catalogue/` | 3,779 | 1 | Vendors — the harness catalogue block (ADR-KI-WEBSITE-001) |
| `/guidance/using-ki/` | 1,257 | 4 | Carries |
| `/guidance/using-ki/command-line-interface/` | 881 | 2 | Carries — rewritten and de-duplicated against the CLI collection |
| `/guidance/using-ki/getting-started/` | 917 | 2 | Carries — five steps, each with a check |
| `/guidance/using-ki/onboarding/` | 649 | 2 | Carries — the declaration form corrected |
| `/guidance/using-ki/planning-and-delivery/` | 1,031 | 1 | Carries |
| `/guidance/using-ki/recommended-tools/` | 2,033 | 16 | Carries — every link is a third-party tool's own home or release notes, which is a fact about the tool |
| `/guidance/using-ki/tuning/` | 2,659 | 1 | Carries |

No page defers without a stated reason. The six that remain are all in `operator-guides`, and each says what the guide settles, what it refuses to do, whether you need it, and why the procedure stays at a pinned ref upstream.

### Summary of changes

- **Vendored the command inventory.** `apps/site/scripts/sync-cli-commands.ts` parses `man/ki.1` at an immutable ref into `src/_data/cliCommands.json5`, and `/guidance/cli/commands/` renders it — 88 commands in 14 groups at `v0.4.0`. The parser throws on any roff construct, missing description, duplicate, or structural floor it does not recognise. Twelve unit tests cover the roff handling and six of the refusals.
- **Reconciled the manual against itself.** Parsing found the manual's two inventories disagree: SYNOPSIS carries a `Batch records` group and its four commands, COMMAND GROUPS does not, and the divergence is still present on `tools-ki`'s default branch. The sync parses both, carries the omitted group with the synopsis's own descriptions, and the page marks it as an upstream omission rather than inheriting the gap silently.
- **Rewrote the CLI collection.** `index` 136 → 1,115 words, `capability-lifecycle` 245 → 950, `update-upgrade` 213 → 700, `operator-guides` 255 → 1,183 with its `sources` expanded from one entry to seven.
- **Rewrote the thin `using-ki` pages** — `getting-started`, `using-skills`, `command-line-interface` — and de-duplicated them against the new CLI collection.
- **Replaced the two Nunjucks collection landing pages** — `/guidance/harnesses/` and `/guidance/repositories/` — with Markdown pages. They were the worst offenders and nothing had caught them: `verify-guidance-sources` walks only `.md`, so neither page had ever declared provenance, and both published commands that do not exist (`ki doctor`, `ki skill user add`, `ki skill repo add`) plus a "fully qualified skill" form the manual says is invalid.
- **Added heading anchors.** A `heading-anchors` transform in `eleventy.config.ts` gives every `h2`/`h3`/`h4` in built output a slug id. The site emitted none, so every in-page fragment link on the site — including pre-existing ones — resolved to nothing.
- **Corrected two content errors while carrying material.** `getting-started` and `command-line-interface` both described `knowledgeislands/ki-agentic-harness:ki-work-roadmap` as a valid skill key; the manual says harness-qualified keys are invalid. `onboarding` documented the declaration as `[ki-<skill>]`; it is `[skills.<name>]` under a provider list in `[repo]`.

### Verification

- `bun run ki:site:clean && bun run ki:site:build` — 60 files written. `verify-tool-routes: 4`, `verify-projects: 18 entries / 4 released tools`, `verify-guidance-sources` clean, `verify-guidance-reachable: 35 guidance pages reachable from the home page`.
- `bun test scripts/` — 32 pass, 0 fail.
- `bunx @biomejs/biome check apps/site/scripts/` — clean.
- `GITHUB_TOKEN=… verify:guidance -- --network` — 35 pages, 38 sources, 13 warnings, no errors. Every warning is upstream moving past the pinned `v0.4.0`: `man/ki.1` has advanced, and six `tools-ki` user guides moved from `docs/guides/` to `docs/guides/user/`. The pinned links still resolve; the moves are `KI-TOOL-CLI-078`'s subject in that repository.
- `ki repo audit --skill ki-decision-records --repo .` — PASS.

### Outstanding concerns

The site now depends on an interface nobody promised to keep stable. That is recorded honestly in ADR-KI-WEBSITE-003 rather than glossed, and the request for a real contract is `KI-TOOL-CLI-080` in `tools-ki`. Until it lands, a manual restructure breaks the sync loudly at the next ref bump — which is the intended failure mode, but it is still a failure mode.

The pinned `v0.4.0` sources are drifting. Thirteen network warnings today, none of them breaking. The refresh is a ref bump and a `reviewed` date when `tools-ki` next releases.

### Post-change review

Reading the built pages back, the collection reads as one thing now rather than as six unrelated efforts. The hub answers a question, each collection index carries its own material, and the two landing pages that used to end in "read the README" end in the material instead.

The heading-anchor transform turned out to matter more than its size suggests. Several pages already linked to in-page fragments that silently went nowhere; with ids emitted, the 4,737-word command reference is navigable and the older cross-references started working without being touched.

What I would watch: `operator-guides` at thirteen outbound links is the page most likely to be read as a link farm, even though each link is now bounded by a summary and a stated reason. If `tools-ki` consolidates those guides under `KI-TOOL-CLI-078`, that page should be revisited rather than merely re-pinned.

### Mini recap

Two learnings worth keeping. **A check that walks one file extension is a check with a blind spot** — the provenance gate walked `.md` and the two worst pages on the site were `.njk`, so they published wrong commands for months with every gate green. And **"the build passed" and "the page is right" are different claims**: nothing in the build could have told me the site emitted no heading ids, or that a documented command had been renamed upstream. Both were found by reading the rendered output, not by running the gate.

## Done

Accepted 2026-09-22 by Kris Brown on the review packet above.

## Discussion

The risk this item carries is the one `KI-WEB-SITE-016` diagnosed. Moving material onto the site means the site now owns its accuracy, and hand-written restatements of things that change per release rot silently — the catalogue drifted to 42 skills against an upstream 61 without anything noticing. Carrying more material and keeping it true are not the same achievement, and the vendored route is the only one demonstrated to deliver both.

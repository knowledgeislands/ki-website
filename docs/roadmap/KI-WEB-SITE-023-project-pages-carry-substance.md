---
id: KI-WEB-SITE-023
area: SITE
title: Project pages carry substance
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: ea763de90158026beecdcf1cb04b2b0d84cbc612
created_at: 2026-09-22T09:35:00Z
updated_at: 2026-09-22T12:55:00Z
---

## Goal

A reader landing on a project page learns what the project does, whether it is for them, and how to start using it, without opening the repository.

## Context

Every project page today ends by disclaiming itself. `/projects/mcp-git-audit/` closes with "This page describes it; it does not stand in for it. Open the repository. Read README." The four tool pages close with "This page intentionally does not reproduce the executable contract. Read the manual."

Those lines were the site's ownership policy working exactly as designed. `KI-WEB-SITE-018` replaced that policy, so this item now rewrites against [GDR-KI-WEBSITE-002](../decisions/GDR-KI-WEBSITE-002-carrying-material-for-readers.md) rather than arguing the point again.

The pages are also generated from a registry through two templates, so the thinness is structural: a page can only be as deep as the registry fields the template renders. Adding depth means deciding what a project page should say, then giving the registry somewhere to say it.

## Boundary

Projects only, including the four released tools `KI-WEB-SITE-020` merged in. Guidance is `KI-WEB-SITE-022`.

Three registry entries are deliberately routeless and stay that way unless a page is warranted.

This does not turn a project page into documentation for the project. A reader deciding whether to adopt something needs different material from a reader operating it; the second still belongs upstream.

## Shaping

The registry-and-template shape is right and stays. Fifteen hand-written pages would drift apart in voice and completeness, which is the failure the template already prevents.

What changes is what the template has to work with. A project page should answer, in this order: what problem this solves, whether the reader has that problem, what state it is in, how to start, and what it does not do. The current registry carries roughly the first and the third.

Two decisions follow.

**Depth lives in the registry, not in prose files.** Adding a per-project Markdown body beside the registry entry would make the registry a partial description of something described twice. Extending the entry keeps one source per project and lets `verify-projects.ts` check that a published page has what a page needs.

**Completeness is gated, not hoped for.** `verify-projects.ts` already validates the registry; it should fail a routed entry missing the fields a reader needs. That is how the site avoids shipping fifteen pages where four were filled in properly.

The `/install/<slug>` contract and its `verify:routes` gate are untouched.

## Current state

Main-content word counts from the built `dist/`, with the two-per-page provenance footer included in the link counts:

| Page | Words |
| --- | --- |
| `/projects/ki/` | 205 |
| `/projects/git-almanac/` | 207 |
| `/projects/ki-techne-principal/` | 210 |
| `/projects/mgit/` | 211 |
| `/projects/rig/` | 212 |
| `/projects/ki-plugins/` | 220 |
| `/projects/ki-techne-harness/` | 223 |
| `/projects/ki-arcadia-principal/` | 226 |
| `/projects/homebrew-tap/` | 229 |
| `/projects/mcp-m365/` | 277 |
| `/projects/mcp-ki-kb-notion-mirror/` | 295 |
| `/projects/mcp-git-audit/` | 298 |
| `/projects/mcp-gsuite/` | 298 |
| `/projects/mcp-housekeeping-claude/` | 298 |
| `/projects/mcp-ki-kb-fs/` | 304 |

Fifteen pages between 205 and 304 words, every one of them ending in a pointer to a repository. The `/projects/` index at 693 words says more than any project it indexes.

Each page carries two outbound GitHub links, and each tool page five, of which the extra three are install and release routes rather than deferrals.

## Steps

- [x] Settle what a project page answers, per the five questions in Shaping, and write it down before editing any template.
- [x] Extend `projects.json5` with the fields that answer them, and populate all routed entries.
- [x] Extend `project.njk` to render the new fields alongside the install and release material `KI-WEB-SITE-020` already folded in.
- [x] Make `verify-projects.ts` fail a routed entry missing a required reader-facing field, so an unfilled page cannot reach `dist/`.
- [x] Rewrite the closing sections of every page so a repository link is a stated fact rather than a substitute for the content above it.
- [x] Re-check the three routeless entries against the revised test and decide whether any now warrants a page.

## Files touched

- `apps/site/src/_data/projects.json5` — the registry and its new fields.
- `apps/site/src/projects/project.njk`, `index.njk`.
- `apps/site/src/_data/projectPages.ts` if routing changes.
- `apps/site/scripts/verify-projects.ts` and its tests.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes. `verify:projects` fails when a routed entry is stripped of a required field, demonstrated by a deliberate negative test and restored afterwards. `verify:routes` still reports four installer routes resolving. No project page ends by telling the reader to go and read a README instead.

## Dependencies / blocks

Unblocked. `KI-WEB-SITE-020` merged the tool entries and the install block into `project.njk`, so the template is extended once rather than twice, and `KI-WEB-SITE-018` delivered the ownership test this work is judged against as GDR-KI-WEBSITE-002.

## Documentation impact

### Decision Records

None expected. `KI-WEB-SITE-020` recorded the section merge and the registry's widened role as ADR-KI-WEBSITE-002; adding reader-facing fields to entries that already exist does not change that decision.

### Specifications

None. `/install/<slug>` is unchanged, which the verification asserts rather than assumes.

### Guides

`docs/guides/developer/` needs the registry's required fields documented, since a contributor adding a project will otherwise meet the new gate as an error message.

### Roadmap

No handoff. The owning repositories are unaffected; this is the site describing them better.

## Review

### Delivered

Sixteen generated project pages answer the five questions in Shaping, in that order, and none of them ends by sending the reader to a README. Main-content word counts in the built `dist/`, measured the same way as the Current state table above:

| Page | Before | After |
| --- | --- | --- |
| `/projects/homebrew-tap/` | 229 | 440 |
| `/projects/ki-techne-harness/` | 223 | 449 |
| `/projects/ki-techne-principal/` | 210 | 468 |
| `/projects/ki-plugins/` | 220 | 478 |
| `/projects/ki-specifications/` | n/a | 485 |
| `/projects/mcp-m365/` | 277 | 523 |
| `/projects/ki-arcadia-principal/` | 226 | 539 |
| `/projects/mcp-ki-kb-notion-mirror/` | 295 | 555 |
| `/projects/mcp-ki-kb-fs/` | 304 | 571 |
| `/projects/mcp-housekeeping-claude/` | 298 | 579 |
| `/projects/mcp-git-audit/` | 298 | 584 |
| `/projects/git-almanac/` | 207 | 589 |
| `/projects/mgit/` | 211 | 604 |
| `/projects/mcp-gsuite/` | 298 | 606 |
| `/projects/rig/` | 212 | 636 |
| `/projects/ki/` | 205 | 659 |

The `/projects/` index moved 693 to 741 for a single rewritten paragraph, which is the measurement behaving as expected. `ki-specifications` has no Before figure because it was not a generated page when that table was taken: it declared a `route` into the specifications section that has since come off the site, which is also why the Boundary's three routeless entries are now two.

The depth is upstream material rather than padding. Each entry's `problem`, `audience`, `capabilities`, `state` and `limits` were written from the owning repository's own account of itself — Rig's catalogue and provider model, the plugin marketplace's paused status and its deferred MCP half, the specification registries being deliberately empty at KIP-000001, the access level each MCP server actually registers against. Two facts now on the site are ones a reader would otherwise have had to read source to find: `ki-plugins` is paused rather than merely quiet, and `mcp-gsuite` confines outbound mail to drafts by construction rather than by instruction.

### Summary of changes

- `apps/site/src/_data/projects.json5` — five reader-facing fields on all sixteen generated entries, with the field contract documented in the header comment. The two entries that declare a `route` are unchanged.
- `apps/site/src/projects/project.njk` — six sections in the order a reader asks the questions: problem and audience, capabilities and state, how to start with the install block folded in for released tools, boundaries and authority, then Nearby. The aside card's self-disclaiming paragraph is replaced by a statement of what the repository is and what it holds.
- `apps/site/scripts/verify-projects.ts` — `checkReaderFields` fails a generated entry missing any of the five, with floors of 80 characters for a prose field and three capability sentences of at least 20 characters each. An entry declaring a `route` is exempt from the requirement but not from the shape checks.
- `apps/site/src/projects/index.njk` — the closing paragraph no longer says the cards link out rather than trying to replace the repository.
- `docs/guides/developer/projects-directory.md` — a section carrying the field table, the floors, and the standing accuracy obligation.

### Verification

- `bun run ki:site:clean && bun run ki:site:build` passes, including `verify:routes` (4 installer routes), `verify:projects` (18 entries, 4 released tools), `verify:guidance` (35 pages) and `verify-guidance-reachable` (35 pages).
- Negative test: removing `problem` from the `mgit` entry fails the gate with `projects[6] (mgit): a generated page must declare "problem"` and exit 1. Restored, and the gate passes again.
- `bunx tsc --noEmit -p apps/site/tsconfig.json` clean, Biome clean on the changed script.
- Grepping the built `dist/` for the retired closing lines — read the README, does not stand in for it, intentionally does not reproduce — returns nothing.
- `ki repo audit` passes for `ki-authoring`, `ki-repo-website` and `ki-repo-website-content`. `ki-engineering` reports one warning, recorded below.

### Outstanding concerns

- **The drift question the Discussion raised is answered as no review date, deliberately.** These fields describe purpose, audience and posture, which move on the scale of a project's direction rather than a release, so a pinned ref would be pinning something that has no versions to pin. The obligation is stated in the developer guide instead, beside the contrast with the vendored guidance pages that do have a sweep. An entry found stale is evidence for revisiting that decision rather than proof it was wrong.
- **`ki-engineering` warns that `turbo.json` lacks `apps/site:typecheck` and `apps/site:test` task correspondence.** It predates this item, arriving with the move to `apps/site`, and is untouched here.
- **`tools-techne` is public and owns the `techne` operator command, but has no registry entry.** The `ki-techne-harness` page names it in prose. Whether it warrants an entry of its own, with release fields, is a directory-coverage question rather than a depth one.

### Post-change review

The gate is the part worth scrutinising, because a length floor is a crude proxy for a page being worth reading. It earns its place by catching the failure that actually happens — an entry added in a hurry with `problem` left as a restated `tagline` — and it cannot catch the one that matters more, a confident paragraph that has stopped being true. Nothing here pretends otherwise: the guide says so in the same breath as the floors.

The section order is the other decision use will test. Putting boundaries and authority last, after how to start, reads correctly for someone deciding whether to adopt something and slightly wrongly for someone who arrived to check where a responsibility sits. The directory index answers that second reader faster, and links accordingly.

### Mini recap

Delivered the reader-facing half of the project directory: sixteen pages that say what a project solves, who it is for, what it does, where it stands and what it refuses to do, in that order, with the repository link surviving as a stated fact rather than as a substitute for content. Verified by a full clean build through every gate, a demonstrated negative test on the new requirement, and three clean skill audits. Outstanding: a knowingly accepted drift risk recorded in the guide, one pre-existing Turborepo warning, and an open question about whether `tools-techne` belongs in the directory.

## Done

## Discussion

The question this item does not settle is how the material stays true. A project's purpose and state change more slowly than its command surface, so hand-written registry fields are a defensible risk where a hand-written command reference is not — but fifteen entries that nobody revisits will still drift. Whether that warrants a review date per entry, or a periodic sweep like the provenance one, is worth deciding during execution rather than assuming now.

---
id: KI-WEB-SITE-023
area: SITE
title: Project pages carry substance
theme: site-experience
horizon: now
status: draft
blocks: []
blocked_by: [KI-WEB-SITE-020]
baseline_ref: null
created_at: 2026-09-22T09:35:00Z
updated_at: 2026-09-22T10:00:00Z
---

## Goal

A reader landing on a project page learns what the project does, whether it is for them, and how to start using it, without opening the repository.

## Context

Every project page today ends by disclaiming itself. `/projects/mcp-git-audit/` closes with "This page describes it; it does not stand in for it. Open the repository. Read README." The four tool pages close with "This page intentionally does not reproduce the executable contract. Read the manual."

Those lines are the site's current ownership policy working exactly as designed, which is why this item waits on `KI-WEB-SITE-018` rather than arguing the point again.

The pages are also generated from a registry through two templates, so the thinness is structural: a page can only be as deep as the registry fields the template renders. Adding depth means deciding what a project page should say, then giving the registry somewhere to say it.

## Boundary

Projects only, including the four tools once `KI-WEB-SITE-020` merges them. Guidance is `KI-WEB-SITE-022`.

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
| `/tooling/ki/` | 205 |
| `/tooling/git-almanac/` | 207 |
| `/projects/ki-techne-principal/` | 210 |
| `/tooling/mgit/` | 211 |
| `/tooling/rig/` | 212 |
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

- [ ] Settle what a project page answers, per the five questions in Shaping, and write it down before editing any template.
- [ ] Extend `projects.json5` with the fields that answer them, and populate all routed entries.
- [ ] Extend `project.njk` to render the new fields, absorbing the install and release material `KI-WEB-SITE-020` brings across from `tool.njk`.
- [ ] Make `verify-projects.ts` fail a routed entry missing a required reader-facing field, so an unfilled page cannot reach `dist/`.
- [ ] Rewrite the closing sections of every page so a repository link is a stated fact rather than a substitute for the content above it.
- [ ] Re-check the three routeless entries against the revised test and decide whether any now warrants a page.

## Files touched

- `apps/site/src/_data/projects.json5` — the registry and its new fields.
- `apps/site/src/projects/project.njk`, `index.njk`.
- `apps/site/src/_data/projectPages.ts` if routing changes.
- `apps/site/scripts/verify-projects.ts` and its tests.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes. `verify:projects` fails when a routed entry is stripped of a required field, demonstrated by a deliberate negative test and restored afterwards. `verify:routes` still reports four installer routes resolving. No project page ends by telling the reader to go and read a README instead.

## Dependencies / blocks

Blocked by `KI-WEB-SITE-020`: extending `project.njk` before the tool fields arrive means extending it twice. The ownership test it is judged against was delivered by `KI-WEB-SITE-018` as GDR-KI-WEBSITE-002. It stays a draft in Now until the merge lands, since a blocked item is not awaiting execution.

## Documentation impact

### Decision Records

None expected on its own. If `KI-WEB-SITE-020` records the section merge, the registry's widened role belongs in that record.

### Specifications

None. `/install/<slug>` is unchanged, which the verification asserts rather than assumes.

### Guides

`docs/guides/developer/` needs the registry's required fields documented, since a contributor adding a project will otherwise meet the new gate as an error message.

### Roadmap

No handoff. The owning repositories are unaffected; this is the site describing them better.

## Discussion

The question this item does not settle is how the material stays true. A project's purpose and state change more slowly than its command surface, so hand-written registry fields are a defensible risk where a hand-written command reference is not — but fifteen entries that nobody revisits will still drift. Whether that warrants a review date per entry, or a periodic sweep like the provenance one, is worth deciding during execution rather than assuming now.

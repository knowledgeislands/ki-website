---
id: KI-WEB-SITE-033
area: SITE
title: Rename the provenance gate
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T10:39:48Z
updated_at: 2026-09-24T10:39:48Z
---

## Goal

The gate that checks a page's `sources` declaration is named for what it checks rather than for a directory that no longer exists, so the guide documenting it and the script implementing it share a vocabulary.

## Context

`KI-WEB-SITE-028` removed `apps/site/src/guidance/`. `KI-WEB-SITE-031` renamed the three developer guides that were named after it. What survives is the gate: `apps/site/scripts/verify-guidance-sources.ts` and `verify-guidance-reachable.ts`, run as `verify:guidance` and `verify:reachable`, plus the `Guidance provenance verified (34 pages).` line the build prints.

So `docs/guides/developer/page-provenance.md` opens by explaining a gate whose name it no longer shares, and a contributor reading the build output meets a word that names nothing on the site.

`KI-WEB-SITE-031` excluded this deliberately and said why: renaming a gate means touching `apps/site/package.json`, Turborepo's task graph in `turbo.json`, `AGENTS.md`, the guides, and several script header comments, which is a different kind of change from renaming a Markdown file nobody's build depends on. The exclusion was right at the time. It is recorded here so the question survives that item's prune.

## Boundary

This is a rename, not a change to what either check does. No page's `sources` contract changes, no failure message changes meaning, and no published route is involved.

It should settle both scripts together or neither: renaming one and leaving the other is how the collection got inconsistent in the first place.

Whether it is worth doing at all is the open question, not an assumption this item makes.

## Discussion

### The case against

A gate name is read by contributors, not readers, and this repository has exactly one contributor plus its agents. The cost is a coordinated edit across `package.json`, `turbo.json`, two script files, their headers, two guides and `AGENTS.md`, with a build that fails loudly if any reference is missed — so the risk is low but the ceremony is real, for a word nobody trips over twice.

### The case for

The site now has no directory, no navigation entry and no guide called "guidance". The gate is the last holdout, which makes it the one place where a person learning the codebase meets a term with no referent. That is precisely the tax `KI-WEB-SITE-031` argued is paid every time somebody looks something up.

`verify:provenance` and `verify:reachable` would be the obvious pair, and `verify:reachable` already has the better name, which suggests the shape.

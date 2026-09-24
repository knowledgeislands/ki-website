---
id: KI-WEB-SITE-035
area: SITE
title: Contain the developer guides
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 9d3d158b2094f508a315e308e4d79b65db1cb926
created_at: 2026-09-24T19:25:00Z
updated_at: 2026-09-24T19:45:00Z
---

## Goal

`docs/guides/developer/` reads completely without following a link. A maintainer handed the collection on its own — moved, published, or read in a checkout that does not have `docs/decisions/` open — loses nothing, because every guide states the substance it needs rather than pointing at where the substance lives.

## Context

`ki-guides` adopted a containment rule today: a guide MUST read completely without following any link, mirroring the same requirement on a Decision Record and for the same reason — the collection stays movable as a unit. The line is prose documents against code. A path to a script, a directory or a configuration key names the subject the guide explains and stays; a link to another Markdown document outside the collection is where the explanation went missing. Sibling guides are the exception the collection is navigated by. The rule is mechanical as `GUIDE-4` and graded by audience as `ROUTE-3` (harness commit `974627b6`).

This repository is the corpus that motivated the rule, and it fails it eleven times. `ki repo audit --skill ki-guides --repo .` names every one: ten links from five guides into `docs/decisions/`, and one from `tool-routes.md` into the root `AGENTS.md`.

None of them is a deferral in the `verify:guides` sense — the guides state their material and cite the record that decided it, which is exactly the honest form the site's own no-deferral rule asks for. They fail because a citation and a link are different things, and the collection can only travel if the citation is a name.

## Boundary

This item converts eleven links to prose names and adjusts the surrounding sentences so each still reads. It does not remove a citation: a developer guide may name `GDR-KI-WEBSITE-002` or `ADR-KI-WEBSITE-001`, and under `ROUTE-3` that is precisely the audience permitted to.

It does not touch `apps/site/src/`. The published pages are a different collection under a different contract — they are what `verify:guides` gates, and a published page's outbound links are governed by GDR-KI-WEBSITE-002, not by `ki-guides`.

It does not move material into `docs/guides/references/`. Nothing here needs a supporting document; the guides need sentences that stand on their own.

It does not change `docs/decisions/`, which links outward legitimately, and it does not touch `docs/roadmap/`.

## Current state

Eleven findings across six files, measured at the baseline:

- `page-provenance.md` — three, to `GDR-KI-WEBSITE-002` and twice to `ADR-KI-WEBSITE-001`
- `what-to-publish.md` — two, to `GDR-KI-WEBSITE-002` and `ADR-KI-WEBSITE-001`
- `projects-directory.md` — two, to `ADR-KI-WEBSITE-002` and `GDR-KI-FUNDAMENTALS-001`
- `tool-routes.md` — two, to `AGENTS.md` and `ADR-KI-WEBSITE-002`
- `page-reachability.md` — one, to `GDR-KI-WEBSITE-002`
- `project-guides.md` — one, to `ADR-KI-WEBSITE-003`

Every link into `apps/site/` source — scripts, data files, directories — passes untouched, which is the rule working as intended: those are the subjects the guides explain.

## Steps

- [x] Measure the collection against `GUIDE-4` and record every finding.
- [x] Convert each link to a prose name, rereading the sentence so it states the substance rather than the destination.
- [x] Reread the `AGENTS.md` reference in `tool-routes.md`, which names orientation rather than a decision and may need more than a name.
- [x] Confirm the collection passes `ki repo audit --skill ki-guides --repo .`.
- [x] Confirm nothing in `apps/site/` changed.

## Files touched

- `docs/guides/developer/page-provenance.md`
- `docs/guides/developer/what-to-publish.md`
- `docs/guides/developer/projects-directory.md`
- `docs/guides/developer/tool-routes.md`
- `docs/guides/developer/page-reachability.md`
- `docs/guides/developer/project-guides.md`
- `docs/roadmap/KI-WEB-SITE-035-contain-the-developer-guides.md`

## Verify

- `ki repo audit --skill ki-guides --repo .` passes with no `GUIDE-4` finding.
- `ki repo audit --skill ki-authoring --repo .` passes.
- `git diff --stat -- apps/` is empty, so nothing the build reads has changed.
- Each edited paragraph reads as a complete statement with the citation removed entirely, which is the test the rule is for.

## Dependencies / blocks

Depends on the `ki-guides` standard change, which has landed. Blocks nothing. `KI-WEB-SITE-033` and `KI-WEB-SITE-034` touch `page-provenance.md` if they are ever adopted, but neither is scheduled and neither conflicts with a citation becoming a name.

## Documentation impact

### Decision Records

None. The records being cited do not change; only how the guides refer to them does.

### Specifications

None.

### Guides

Six, and they are the deliverable.

### Roadmap

None beyond this record.

## Review

### Delivered

`docs/guides/developer/` reads completely without following a link. All eleven `GUIDE-4` findings are gone, and the collection can be handed to somebody who does not have `docs/decisions/` — or the rest of the repository — without losing anything it was relying on.

Every citation survived. Not one Decision Record reference was dropped; each became a name in prose, which is what `ROUTE-3` permits a guide written for somebody working in this repository.

### Change Summary

Ten links into `docs/decisions/` and one into the root `AGENTS.md`, across six guides, converted to prose names.

Nine were mechanical: `[GDR-KI-WEBSITE-002](../../decisions/…)` became `GDR-KI-WEBSITE-002` and the surrounding sentence already read correctly, because the guides were citing a decision rather than deferring to it. Two needed more.

`project-guides.md` opened its second paragraph with "… is [ADR-KI-WEBSITE-003]", where the link was doing the work of a verb; it now reads "… is decided by ADR-KI-WEBSITE-003".

`tool-routes.md` linked `AGENTS.md` for the cross-repository handoff convention, which is the one case where the link was genuinely load-bearing — the reader was being sent somewhere to find out what the convention is. That sentence now states the convention: the receiving repository owns its priority, plan and execution, and both sides record the originating item and whether the relationship blocks. `AGENTS.md` is named after the substance rather than instead of it.

### Verification

`ki repo audit --skill ki-guides --repo .` passes with no findings; it reported eleven before the change. `ki repo audit --skill ki-authoring --repo .` passes. `ki repo audit --skill ki-work-roadmap --repo .` passes.

`git diff --stat -- apps/` is empty. No build was run, and none was needed: nothing the build reads was touched, and `docs/guides/` is not an input to it.

Every link into `apps/site/` source survived untouched — `eleventy.config.ts`, `src/_data/projects.json5`, and the rest. That is the rule working as designed rather than an omission: those paths are the subjects the guides explain.

### Outstanding concerns

None with work attached.

Worth recording without an identifier: the rule's cost here was almost entirely in one sentence. Nine of eleven links were citations that read identically as names, which is evidence that the collection was already close to self-contained and that the containment rule mostly ratifies how these guides were being written. The remaining two are the interesting sample, and only one of those — the `AGENTS.md` reference — was actually hiding content behind a link.

### Post-change review

The item is small and finished as scoped. The estimate was accurate because the audit produced the complete work list before any editing started, which is the difference between this and `KI-WEB-SITE-031`, whose survey underestimated its reference repair by half. A mechanical finding list is a better plan than a grep and a memory.

The one judgment the audit could not make was `tool-routes.md`'s `AGENTS.md` link. `GUIDE-4` reports a link to a document outside the collection and cannot tell whether removing it loses a fact; a person reading the sentence can. That division is why the standard has both a mechanical item and a judgment one, and this item exercised both.

Risk introduced is nil. No route, permalink, published page, gate or generated file changed, and no published reader has a stale link, because none of these files is published.

### Mini recap

`KI-WEB-SITE-035` converted eleven document links in `docs/guides/developer/` to prose names, so the collection satisfies the `GUIDE-4` containment rule adopted in `ki-guides` earlier the same day. Ten pointed into `docs/decisions/` and one into `AGENTS.md`; every citation survived as a name, and the `AGENTS.md` sentence now states the handoff convention it used to point at. Links into `apps/site/` source are untouched by design. Three skill audits pass and `apps/` is unchanged.

## Discussion

### Why a name is not a worse citation than a link

The objection is that a reader loses a click. In a checkout, they do not: `GDR-KI-WEBSITE-002` is a filename prefix under `docs/decisions/`, and finding it is one completion away. What the link bought was convenience for a reader who already had the whole repository — which is to say, for the reader who least needed it. What it cost was the collection's ability to travel, and a guide whose last word on a subject is "it is over there".

### Where the boundary between collections falls

The published pages under `apps/site/src/` link outward constantly and should. A page that cites `v0.4.0` of an installer is carrying a fact its reader can verify, and GDR-KI-WEBSITE-002 governs when that is honest. `ki-guides` governs `docs/guides/` only. The two contracts coexist because they answer different questions: one asks whether a published page is carrying its own weight, the other asks whether a collection of maintainer documentation can be handed over intact.

---
id: KI-WEB-SITE-030
area: SITE
title: Consolidate the decision records
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 2cd4936ce75d7800014d0cd1d9219b401bcdb874
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:33:39Z
---

## Goal

Someone reading `docs/decisions/` top to bottom learns the shape the site actually has, once, from as few records as the subject honestly needs. Every independent decision has one authoritative record, the two that answer the same question become one, and the structural decision nobody wrote down gets written down.

## Context

The collection holds three ADRs and three GDRs. Two problems, pulling in opposite directions.

**One decision is missing.** `KI-WEB-SITE-025` moved nineteen pages under the projects that own them, introduced binding by directory data, and added a gate. It judged that no Decision Record was needed because `GDR-KI-WEBSITE-002` already stated the ownership test it implemented. That reasoning holds for the editorial half and not for the structural half: `GDR-KI-WEBSITE-002` decides how much the site says, not where a guide lives or what binds it to a project. `docs/guides/developer/project-guides.md` records the mechanism; nothing records why the site has no single guidance section. A reader who proposes reinstating one finds no record explaining what was tried.

**Two decisions answer one question.** `ADR-KI-WEBSITE-001` vendors the harness capability catalogue; `ADR-KI-WEBSITE-003` vendors the `ki` command inventory. Both conclude the same way — parse a published block at a pinned ref, fail loudly when its shape changes, refresh by advancing one ref — and `GDR-KI-WEBSITE-002` has already generalised that conclusion into a standing fourth outcome. ADR-003's real contribution is the distinction it draws in its own Context: the harness _specifies_ its catalogue block and `tools-ki` merely publishes its manual, so the parser owes more in the second case than the first. That is one decision with two cases, currently filed as two records with the second explaining how it differs from the first.

`ADR-KI-WEBSITE-002` also carries a claim that stopped being true this week. It states that two pages "become `/guidance/harnesses/` and `/guidance/repositories/`", addresses that no longer exist. The collection is present-state — records are living and read as if written today — so a stale address in a body is a defect rather than preserved history. This is distinct from the refs and URLs quoted as evidence in Context sections, which are dated observations and must not be rewritten.

## Boundary

This item reshapes the record set: it merges the two vendoring records, records the structural decision about where guides live, and corrects claims that are no longer true. It does not reverse, weaken, or renegotiate any decision — every conclusion currently recorded survives into the consolidated set. It does not touch `GDR-KI-FUNDAMENTALS-001`, which is shared ecosystem material this repository does not own. It does not rewrite refs, URLs, or measurements quoted as evidence of what was observed at the time. It does not consolidate the three GDRs, which have genuinely separate subjects. It does not change any gate, script, or published page.

## Current state

Delivered. Six records became six records covering one more decision: the two vendoring ADRs merged into one, and the structural decision nobody had written down was written.

```text
GDR-KI-WEBSITE-001       adopting decision records
GDR-KI-FUNDAMENTALS-001  ecosystem fundamentals (shared, not ours)
GDR-KI-WEBSITE-002       carrying material for readers
ADR-KI-WEBSITE-001       vendoring a published inventory
ADR-KI-WEBSITE-002       one section for every project
ADR-KI-WEBSITE-003       a page lives with what it is about
```

`GDR-KI-WEBSITE-002` moved ahead of `ADR-KI-WEBSITE-001` in the reading order, because the merge made the old order circular: the earlier half of the vendoring decision is what `GDR-KI-WEBSITE-002` generalised from, and the later half rests on `GDR-KI-WEBSITE-002`. One record cannot both precede and follow another, so the general rule now reveals first and the record that implements it follows — which is the better narrative anyway.

`ki repo audit --skill ki-decision-records --repo .` passes, and three records now carry `decision_depends_on` edges that the prose previously stated only in sentences.

## Steps

- [x] Merge `ADR-KI-WEBSITE-001` and `ADR-KI-WEBSITE-003` into a single record on vendoring a published inventory, carrying both cases: the specified block whose markers and fields an upstream rubric asserts, and the published-but-unspecified manual where the parser owes a cross-check because nothing upstream guarantees the shape. Keep the `v0.4.0` SYNOPSIS/COMMAND-GROUPS inconsistency as the evidence for that asymmetry.
- [x] Renumber whatever the merge leaves out of reveal order, rather than placing a record out of sequence — the freed `003` went to the new structural record, which reveals last.
- [x] Write the structural decision: guides belong to the project they are about, bound by the directory they sit in rather than by their own frontmatter, with no general guidance section for project-owned material. State what binding by directory buys and what a single guidance section cost.
- [x] Decide whether that record stands alone or extends `ADR-KI-WEBSITE-002` — it stands alone; it was drafted without restating ADR-002, which is the test the item set.
- [x] Correct `ADR-KI-WEBSITE-002`'s statement about `/guidance/harnesses/` and `/guidance/repositories/` so it describes where those pages are now, leaving its Context evidence untouched.
- [x] Add `decision_depends_on` edges so the dependency graph the prose describes is also machine-readable, checking it stays acyclic and that dependencies precede dependents in the index.
- [x] Rewrite `docs/decisions/README.md`'s reading order for the consolidated set, with a gloss per record.
- [x] Update every inbound link from `docs/guides/` and `AGENTS.md` to a record that moved or merged.

## Files touched

- `docs/decisions/ADR-KI-WEBSITE-001-vendoring-a-published-inventory.md` — new, replacing the two it merges
- `docs/decisions/ADR-KI-WEBSITE-001-vendoring-the-harness-capability-catalogue.md` and `docs/decisions/ADR-KI-WEBSITE-003-vendoring-an-unspecified-published-interface.md` — deleted
- `docs/decisions/ADR-KI-WEBSITE-003-a-page-lives-with-what-it-is-about.md` — new
- `docs/decisions/ADR-KI-WEBSITE-002-one-section-for-every-project.md`, `docs/decisions/GDR-KI-WEBSITE-002-carrying-material-for-readers.md`
- `docs/decisions/README.md`
- `docs/guides/developer/{guidance-ownership,guidance-provenance,project-guides}.md`
- `docs/roadmap/KI-WEB-SITE-030-consolidate-the-decision-records.md`

`AGENTS.md` turned out to cite no local record by identifier, so it needed no change.

## Verify

- `ki repo audit --skill ki-decision-records --repo .` passes, including the index, serial ascent and contiguity within each prefix, and the acyclic dependency graph.
- `ki repo audit --skill ki-authoring --repo .` passes.
- `bun run ki:site:clean && bun run ki:site:build` passes; nothing in `apps/site/` cites a record by filename, so the build was never at risk, but the run confirms it.
- Every relative link in `docs/` resolves; no file still names either retired filename outside `docs/roadmap/`, where the mentions are historical.
- No conclusion present before the change is absent after it — checked clause by clause against both retired records, including the `omittedFromReference` behaviour, the warning/failure severity split, and the `KI-TOOL-CLI-080` handoff.

## Dependencies / blocks

Nothing blocks this. `KI-WEB-SITE-028` may rename the residual guidance collection, which would change addresses this item also touches — doing this one first and letting 028 follow its own naming through is the cheaper order, but either works. `KI-WEB-SITE-031` renames guide files that these records link to, so running it after this item avoids editing the same links twice. Both are sequencing preferences, not build order.

## Documentation impact

### Decision Records

This item _is_ the Decision Record work. The merged vendoring record and the new structural record are its deliverables.

### Specifications

None. No published interface changes.

### Guides

`docs/guides/developer/guidance-ownership.md` links `ADR-KI-WEBSITE-001` for how vendoring works and follows the merge. `project-guides.md` gains a link to the structural record it implements.

### Roadmap

`KI-WEB-SITE-027` gains one step: `tools-ki`'s `KI-TOOL-CLI-080` cites `ADR-KI-WEBSITE-003` by identifier for the specified-versus-published distinction, and that identifier now names a different decision. The handoff item is the right place to carry the correction, since it is already writing to that repository.

## Review

### Delivered

The collection holds one authoritative record per independent decision. Two records that reached the same conclusion about two inputs are one record with two cases, and the structural decision that was implemented across two roadmap items and recorded in none of them now exists.

### Change Summary

`ADR-KI-WEBSITE-001` is rewritten as **Vendoring a Published Inventory**, covering both the harness capability catalogue and the `ki` command inventory. The asymmetry that was ADR-003's real contribution is promoted from a comparison to a rule: the decision states that the parse carries whatever burden the upstream interface does not, and then shows both cases — the catalogue's self-declared count, which is meaningful because the block is specified, and the manual's two inventory sections, which are reconciled against each other because nothing upstream asserts they agree. Every consequence from both records survives, including the one that matters most, that the two dependencies are not equally safe and must not be flattened.

`ADR-KI-WEBSITE-003` is new: **A Page Lives With What It Is About**. It records what `KI-WEB-SITE-025` and `KI-WEB-SITE-028` did and why — the seventy GitHub links and six `The full guide` anchors that made a guidance section into a routing layer, the binding by directory rather than by frontmatter, the required and unique `order`, and the two collections that belong to no project. It stands alone rather than extending `ADR-KI-WEBSITE-002`, on the test the item set: it was drafted without restating that record.

`GDR-KI-WEBSITE-002` moved to third in the reading order and stopped naming the vendoring record, because the merge made that citation circular. `ADR-KI-WEBSITE-002`'s claim that two pages "become `/guidance/harnesses/` and `/guidance/repositories/`" now states where they actually are. Three records carry `decision_depends_on` for the first time.

### Verification

The `ki-decision-records` audit passes. It found two real problems on the first attempt and both were worth finding. `DEPENDS-4` failed because `ADR-KI-WEBSITE-002` cited the new structural record, which is a forward citation of a same-type higher serial; the fix was to state the present addresses plainly rather than defer to a record a reader has not reached. `FILENAME-3` warned that the serial series was missing `003`, which settled a question this item had left open: the standard wants contiguity, so the freed serial is reused rather than retired.

That reuse has one cost, and it is named rather than absorbed. `tools-ki` cites `ADR-KI-WEBSITE-003` by identifier for the specified-versus-published distinction, and that identifier now names a different decision. The correction is a step on `KI-WEB-SITE-027`, which is already writing to that repository.

### Outstanding concerns

**The peer citation is wrong until `KI-WEB-SITE-027` lands.** Nothing breaks — it is prose in a roadmap item, not a link — but for as long as the gap is open, a reader of `KI-TOOL-CLI-080` who follows the identifier arrives at a record about where pages live.

**Reveal order and chronology now disagree by a day.** `GDR-KI-WEBSITE-002` is dated 2026-09-22 and reveals before a record dated 2026-09-21's decision. That is correct — reveal order is a build narrative, not a timeline, and the standard says so — but it is the first place in this collection where the two come apart, and somebody will read it as an error.

**The merged record is the longest in the collection.** Consolidation traded two records a reader could skip for one they cannot. That is the right trade when the two cases genuinely inform each other, and the asymmetry is exactly that; it would be the wrong trade if a third vendoring case arrived that shared only the mechanism.

### Post-change review

The goal is met, and the item's framing turned out to be right: the surplus record cost a reader time, and the missing one cost the next person the whole argument. The case for a single guidance section is intuitive, it was tried, and it failed for measurable reasons that until now were recorded only in a pruned roadmap item and a plan file. Somebody proposing to reinstate it now finds the evidence.

The useful finding is about what a merge costs that a rename does not. Merging two records collapsed a before-and-after: `ADR-KI-WEBSITE-001` was the evidence `GDR-KI-WEBSITE-002` generalised from, and `ADR-KI-WEBSITE-003` was an application of that generalisation, so the merged record sat on both sides of the governance record at once. The dependency graph made that visible as a cycle rather than letting it pass as prose. The fix — reveal the general rule first and let the record that implements it follow — is a better narrative than the one the collection had, which is worth noticing: the constraint did not just catch an error, it improved the reading.

### Mini recap

`KI-WEB-SITE-030` merged `ADR-KI-WEBSITE-001` and `ADR-KI-WEBSITE-003` into one record on vendoring a published inventory, carrying the specified-versus-published asymmetry as a rule rather than a comparison, and wrote the missing structural decision as the new `ADR-KI-WEBSITE-003`. `GDR-KI-WEBSITE-002` moved ahead of the vendoring record to break the cycle the merge created, `ADR-KI-WEBSITE-002`'s stale addresses were corrected, three records gained `decision_depends_on` edges, and the index was rewritten. The audit passes. One peer citation in `tools-ki` needs correcting, which is a step on `KI-WEB-SITE-027`.

## Discussion

### Why fewer records is the right instinct here

A collection earns its length from independent decisions, not from occasions. Two records reaching the same conclusion about two inputs are one decision applied twice, and filing them separately makes the reader derive the shared rule themselves — which is work the record should have done. The `ki-repo` review lens says it directly: overlapping records are consolidated so each independent decision has one authoritative record. The standard even names merging as the fix where two records cannot be reconsidered independently.

The limit is that compaction must not cost a distinction. The specified/unspecified asymmetry is a real one with a real consequence — the parser cross-checks SYNOPSIS against COMMAND GROUPS precisely because nothing upstream asserts they agree — and a merged record that flattens it into "the site vendors things" has traded two honest records for one vague one. The merge is worth doing only if the resulting record states the asymmetry more clearly than the pair does, which it can, because the pair currently states it as a comparison rather than as a rule.

### Standalone record or an extension of ADR-002

`ADR-KI-WEBSITE-002` decided that every public repository gets one section, and that "where is this repository described" has a single answer. Guides moving under `/projects/<slug>/` is that same principle reaching material the record did not consider — which argues for extending it, and gets the reader to the whole structural story in one place.

Against: the guides move introduced a mechanism ADR-002 has no view on. Binding by directory data rather than by page frontmatter is a decision about where authority for a page's identity sits, and it is the interesting half. A record that mixes "one section per repository" with "a directory owns the identity of the pages in it" is carrying two decisions again, which is the problem this item exists to fix.

Resolve it while writing: if the structural record can be drafted without restating ADR-002, it stands alone.

**Resolved: it stands alone.** The draft needed one sentence about ADR-002 — that the same question was settled one level up for repositories — and nothing else from it. The binding-by-directory half, which is the interesting one, has no counterpart in ADR-002 at all.

### What the renumbering costs

Renumbering is permitted and is the standard's own remedy when reveal order fights serials, but an ID that has been cited elsewhere becomes a dangling reference. Before renumbering, check what cites each record — `AGENTS.md`, the developer guides, and the peer repositories that may name a `ki-website` decision.

The check found exactly one external citation, `KI-TOOL-CLI-080` in `tools-ki`, and the first attempt at this item tried to protect it by retiring serial `003` and numbering the new record `004`. The gate warned that the series had a hole, which is a better rule than the instinct it overrode: a reused serial is a correction somebody can follow, while a permanent gap is a question every future reader has to ask and nobody can answer from the collection. So the serial is reused and the citation is corrected at its source. The general point is that a dangling reference is cheaper to repair than a permanent irregularity is to explain.

### Why the missing record matters more than the surplus one

A surplus record costs a reader time. A missing one costs the next person the whole argument: the case for a single guidance section is intuitive, it was tried, and it failed for reasons — thirty-five pages that read as a routing layer, seventy outbound links, a provenance table as the last thing on the page — that are currently recorded only in a roadmap item that has been pruned and in a plan file nobody will find. That is the decision most likely to be reversed by someone acting reasonably on incomplete information.

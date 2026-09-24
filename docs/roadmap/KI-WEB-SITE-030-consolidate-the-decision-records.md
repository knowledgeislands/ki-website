---
id: KI-WEB-SITE-030
area: SITE
title: Consolidate the decision records
theme: site-experience
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:06:42Z
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

```text
GDR-KI-WEBSITE-001  adopting decision records
GDR-KI-FUNDAMENTALS-001  ecosystem fundamentals (shared, not ours)
ADR-KI-WEBSITE-001  vendoring the harness capability catalogue
GDR-KI-WEBSITE-002  carrying material for readers
ADR-KI-WEBSITE-002  one section for every project
ADR-KI-WEBSITE-003  vendoring an unspecified published interface
```

`ki repo audit --skill ki-decision-records --repo .` passes. Every record has the required frontmatter, the index carries an ordered list in reveal order, and every relative link resolves. No record uses `decision_depends_on`, so the dependency edges that the prose states — ADR-003 building on ADR-001, both resting on GDR-002 — exist only in sentences.

The target is one fewer ADR than today while covering one more decision.

## Steps

- [ ] Merge `ADR-KI-WEBSITE-001` and `ADR-KI-WEBSITE-003` into a single record on vendoring a published inventory, carrying both cases: the specified block whose markers and fields an upstream rubric asserts, and the published-but-unspecified manual where the parser owes a cross-check because nothing upstream guarantees the shape. Keep the `v0.4.0` SYNOPSIS/COMMAND-GROUPS inconsistency as the evidence for that asymmetry.
- [ ] Renumber whatever the merge leaves out of reveal order, rather than placing a record out of sequence.
- [ ] Write the structural decision: guides belong to the project they are about, bound by the directory they sit in rather than by their own frontmatter, with no general guidance section for project-owned material. State what binding by directory buys and what a single guidance section cost.
- [ ] Decide whether that record stands alone or extends `ADR-KI-WEBSITE-002`, which already decided that one section answers "where is this repository described".
- [ ] Correct `ADR-KI-WEBSITE-002`'s statement about `/guidance/harnesses/` and `/guidance/repositories/` so it describes where those pages are now, leaving its Context evidence untouched.
- [ ] Add `decision_depends_on` edges so the dependency graph the prose describes is also machine-readable, checking it stays acyclic and that dependencies precede dependents in the index.
- [ ] Rewrite `docs/decisions/README.md`'s reading order for the consolidated set, with a gloss per record.
- [ ] Update every inbound link from `docs/guides/` and `AGENTS.md` to a record that moved or merged.

## Files touched

- `docs/decisions/*.md`
- `docs/decisions/README.md`
- `docs/guides/developer/*.md` where they cite a record
- `AGENTS.md` where it cites `ADR-KI-HARNESS-TOOLCHAIN-001` and any local record

## Verify

- `ki repo audit --skill ki-decision-records --repo .` passes, including the index, serial ascent within each prefix, and the acyclic dependency graph.
- `ki repo audit --skill ki-authoring --repo .` passes.
- Every relative link in `docs/` and `AGENTS.md` resolves.
- Read the index top to bottom as a stranger: each record is understandable from the ones above it, and no record asks for a decision on trust.
- No conclusion present before the change is absent after it.

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

None expected.

## Discussion

### Why fewer records is the right instinct here

A collection earns its length from independent decisions, not from occasions. Two records reaching the same conclusion about two inputs are one decision applied twice, and filing them separately makes the reader derive the shared rule themselves — which is work the record should have done. The `ki-repo` review lens says it directly: overlapping records are consolidated so each independent decision has one authoritative record. The standard even names merging as the fix where two records cannot be reconsidered independently.

The limit is that compaction must not cost a distinction. The specified/unspecified asymmetry is a real one with a real consequence — the parser cross-checks SYNOPSIS against COMMAND GROUPS precisely because nothing upstream asserts they agree — and a merged record that flattens it into "the site vendors things" has traded two honest records for one vague one. The merge is worth doing only if the resulting record states the asymmetry more clearly than the pair does, which it can, because the pair currently states it as a comparison rather than as a rule.

### Standalone record or an extension of ADR-002

`ADR-KI-WEBSITE-002` decided that every public repository gets one section, and that "where is this repository described" has a single answer. Guides moving under `/projects/<slug>/` is that same principle reaching material the record did not consider — which argues for extending it, and gets the reader to the whole structural story in one place.

Against: the guides move introduced a mechanism ADR-002 has no view on. Binding by directory data rather than by page frontmatter is a decision about where authority for a page's identity sits, and it is the interesting half. A record that mixes "one section per repository" with "a directory owns the identity of the pages in it" is carrying two decisions again, which is the problem this item exists to fix.

Resolve it while writing: if the structural record can be drafted without restating ADR-002, it stands alone.

### What the renumbering costs

Renumbering is permitted and is the standard's own remedy when reveal order fights serials, but an ID that has been cited elsewhere becomes a dangling reference. Before renumbering, check what cites each record — `AGENTS.md`, the developer guides, and the peer repositories that may name a `ki-website` decision.

### Why the missing record matters more than the surplus one

A surplus record costs a reader time. A missing one costs the next person the whole argument: the case for a single guidance section is intuitive, it was tried, and it failed for reasons — thirty-five pages that read as a routing layer, seventy outbound links, a provenance table as the last thing on the page — that are currently recorded only in a roadmap item that has been pruned and in a plan file nobody will find. That is the decision most likely to be reversed by someone acting reasonably on incomplete information.

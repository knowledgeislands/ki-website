---
id: KI-WEB-SITE-027
area: SITE
title: Hand over guide contract
theme: site-experience
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: deec9dff3be8c92b00b3b317fba03278282c0440
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:50:00Z
---

## Goal

The repositories that own their own guides learn what the website's guide contract turned out to be, and each decides for itself whether to adopt it. The contract stops being a local rule this site enforces on material other people wrote.

## Context

`KI-WEB-SITE-025` defined a guide contract and proved it mechanically: a guide is bound to its project by the directory it sits in, opens with a claim of at least 120 characters, may not use hand-off link text, and declares its provenance. `apps/site/scripts/verify-guides.ts` enforces all four during the build, and `docs/guides/developer/project-guides.md` states them.

That item's plan reserved a handoff — once the contract was proven here, `tools-ki` and `ki-agentic-harness` should be offered the same shape for their own `docs/guides/` — and recorded it in the Review rather than writing into those repositories. The record was then accepted and pruned, and the handoff went with it. Neither peer repository carries a record for it.

The two existing peer items that look related are not. `KI-HARNESS-GOV-083` and `KI-TOOL-CLI-078` were both raised on 2026-09-21 and concern audience-grouped guide directories under `ki-guides` — a taxonomy question, not the no-deferral and opening-claim contract this site now enforces.

The asymmetry worth naming is that the site's contract exists because a reader arriving at a published page has nowhere else to go. A guide inside `tools-ki` sits next to the code it describes, so a repository link there may be a legitimate pointer rather than an abdication. The handoff should offer the parts that travel and say plainly which parts do not.

## Boundary

This item writes one handoff record in each peer repository and nothing more. It does not implement the contract in either repository, change their guides, or install a gate there — each receiving repository owns its priority, plan, and execution. It does not promote the contract into a `ki-guides` standard; if that is the right home, the harness record can say so. It does not revisit `KI-HARNESS-GOV-083` or `KI-TOOL-CLI-078`, which are separate work.

## Current state

The contract is written and enforced in `ki-website` only. `docs/guides/developer/project-guides.md` states it in this site's terms — permalinks, project binding, the `guides` collection — much of which is Eleventy-specific and does not transfer. The transferable part is the pair of editorial rules: a page opens by saying what the reader can do, and its link text never stands in for its content.

Half delivered. `tools-ki` now carries `KI-TOOL-CLI-083`, which states both editorial rules, names `ki-website` as its `transferred_from` origin, and says plainly that it is a proposal that binds nothing and blocks nothing. It sits at `triage`, which is the honest horizon for intake another repository has not yet prioritised, and it argues the no-deferral rule's weaker case in a repository whose README is a document a reader should open.

Two corrections went with it. `KI-TOOL-CLI-080` cited `ADR-KI-WEBSITE-003` for the specified-versus-published vendoring distinction, and `KI-WEB-SITE-030` merged that record into `ADR-KI-WEBSITE-001`; the citation now resolves. `KI-TOOL-CLI-078` carried `### Summary of changes`, which the roadmap standard spells `### Change Summary`, and its own gate was failing on it.

**The `ki-agentic-harness` half is held.** That checkout had an active writer throughout this session — a dirty tree of in-flight skill work, and commits landing minutes and then seconds before each check, including one that touched `docs/roadmap/`. Adding a record there means creating a file and editing the shared `_ISSUES.md` ledger in a tree somebody else is committing from, which is the collision the one-writer-per-checkout rule exists to prevent. The handoff is not blocked on a decision or a dependency; it is waiting for a quiet checkout, and it is a single record's worth of work when one is available.

## Steps

- [x] Extract the runtime-neutral core of the contract from `project-guides.md` — the opening claim and the no-deferral rule — separated from the site-specific binding and permalink mechanics.
- [x] Check each peer repository for an active writer before adding a record to its checkout.
- [ ] Write a handoff record in `ki-agentic-harness` proposing the editorial rules for its `docs/guides/`, naming this item as the origin and stating that it does not block. **Held: that checkout has an active writer.**
- [x] Write the equivalent record in `tools-ki`, noting that its guides sit beside the code and that a repository link there may be legitimate where one here is not.
- [ ] Record the two identifiers here and keep the relationship reciprocal. One of the two exists.

## Files touched

- `tools-ki/docs/roadmap/KI-TOOL-CLI-083-guide-opening-and-deferral.md` and its `_ISSUES.md` — delivered, `tools-ki` commit `c4e1cd9`
- `tools-ki/docs/roadmap/KI-TOOL-CLI-080-command-inventory-contract.md` — its citation of `ADR-KI-WEBSITE-003` repointed to `ADR-KI-WEBSITE-001` after the merge in `KI-WEB-SITE-030`
- `tools-ki/docs/roadmap/KI-TOOL-CLI-078-consolidate-audience-centric-guides.md` — `### Summary of changes` renamed to `### Change Summary`, which its own roadmap gate was failing on
- `ki-agentic-harness/docs/roadmap/<new record>.md` and its `_ISSUES.md` — not written; see Current state
- `docs/roadmap/KI-WEB-SITE-027-hand-over-guide-contract.md`

## Verify

- `ki repo audit --skill ki-work-roadmap --repo .` passes in each of the three repositories.
- Each peer record names `knowledgeislands/ki-website` as its `transferred_from` origin and states the relationship as non-blocking in both directions.
- This record names both peer identifiers once they exist.

## Dependencies / blocks

Nothing blocks the handoff; the contract is already proven locally. Both peer repositories are separate checkouts that may have other writers, so the check in the Steps is a safety condition rather than a dependency. Neither peer item blocks any work here — the site's gate keeps running regardless of what either repository decides.

## Documentation impact

### Decision Records

None here. If a peer repository adopts the contract, the record of that decision belongs in that repository or in `ki-guides`, not in this one.

### Specifications

None. The contract is editorial, not an interface any machine consumes across a repository boundary.

### Guides

None expected. `project-guides.md` already states the contract; the handoff quotes it rather than changing it.

### Roadmap

Two new records, one in each peer repository, are the deliverable of this item.

## Discussion

### What actually transfers

The opening claim and the no-deferral rule are about what a guide owes its reader, and they hold wherever the guide sits. Everything else in `project-guides.md` — the directory data binding, the permalink shape, the `guides` collection, `verify:reachable` — is how a static site happens to implement ownership, and offering it to a CLI repository would be proposing a mechanism for a problem it does not have.

### Whether this belongs in `ki-guides` instead

The strongest version of this handoff is not two repository records but one standard. If the opening claim and the no-deferral rule are good rules for any guide, `ki-guides` is where they would bind every repository rather than the two this site happens to publish. Against that: the rules were derived from one corpus under one set of pressures, and promoting them estate-wide on that evidence is the mistake this repository made in the other direction when it let a version question decide how much the site should say. Raising them as proposals in two repositories first produces the evidence a standard would need.

### Why the handoff was lost

Worth naming because it will recur. The deferred work lived in the `## Review` of an accepted record, which is the correct place to record it at the time — and pruning removed the record along with everything in it. Acceptance and pruning are separate acts, and the gap between them is where a deferred concern has to be re-homed or it ceases to exist.

---
id: KI-WEB-SITE-027
area: SITE
title: Hand over guide contract
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: deec9dff3be8c92b00b3b317fba03278282c0440
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T19:20:00Z
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

Both halves are delivered. `tools-ki` carries `KI-TOOL-CLI-083`, which states both editorial rules, names `ki-website` as its `transferred_from` origin, and says plainly that it is a proposal that binds nothing and blocks nothing. It sits at `triage`, which is the honest horizon for intake another repository has not yet prioritised, and it argues the no-deferral rule's weaker case in a repository whose README is a document a reader should open.

Two corrections went with it. `KI-TOOL-CLI-080` cited `ADR-KI-WEBSITE-003` for the specified-versus-published vendoring distinction, and `KI-WEB-SITE-030` merged that record into `ADR-KI-WEBSITE-001`; the citation now resolves. `KI-TOOL-CLI-078` carried `### Summary of changes`, which the roadmap standard spells `### Change Summary`, and its own gate was failing on it.

The `ki-agentic-harness` half was held for most of the session and is now delivered. That checkout had an active writer — a dirty tree of in-flight skill work, and commits landing minutes and then seconds before each check, including one that touched `docs/roadmap/`. Adding a record there means creating a file and editing the shared `_ISSUES.md` ledger in a tree somebody else is committing from, which is the collision the one-writer-per-checkout rule exists to prevent. The tree went quiet later the same day and the record went in: `KI-HARNESS-GOV-091`, harness commit `e2ba941d`.

That record is framed differently from its `tools-ki` sibling, because the harness is not merely a recipient. `ki-guides` lives there, so a decision to adopt either editorial rule binds every repository and a decision to refuse does the same. The record says so, and carries the evidence caution this item's Discussion argues for.

## Steps

- [x] Extract the runtime-neutral core of the contract from `project-guides.md` — the opening claim and the no-deferral rule — separated from the site-specific binding and permalink mechanics.
- [x] Check each peer repository for an active writer before adding a record to its checkout.
- [x] Write a handoff record in `ki-agentic-harness` proposing the editorial rules for its `docs/guides/`, naming this item as the origin and stating that it does not block.
- [x] Write the equivalent record in `tools-ki`, noting that its guides sit beside the code and that a repository link there may be legitimate where one here is not.
- [x] Record the two identifiers here and keep the relationship reciprocal: `KI-TOOL-CLI-083` and `KI-HARNESS-GOV-091`.

## Files touched

- `tools-ki/docs/roadmap/KI-TOOL-CLI-083-guide-opening-and-deferral.md` and its `_ISSUES.md` — delivered, `tools-ki` commit `c4e1cd9`
- `tools-ki/docs/roadmap/KI-TOOL-CLI-080-command-inventory-contract.md` — its citation of `ADR-KI-WEBSITE-003` repointed to `ADR-KI-WEBSITE-001` after the merge in `KI-WEB-SITE-030`
- `tools-ki/docs/roadmap/KI-TOOL-CLI-078-consolidate-audience-centric-guides.md` — `### Summary of changes` renamed to `### Change Summary`, which its own roadmap gate was failing on
- `ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-091-guide-opening-and-deferral.md` and its `_ISSUES.md` — delivered, harness commit `e2ba941d`
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

## Review

### Delivered

Both peer repositories carry a record for the guide contract, each framed for what that repository actually decides. `KI-TOOL-CLI-083` asks `tools-ki` whether to adopt the two editorial rules locally. `KI-HARNESS-GOV-091` asks `ki-agentic-harness` a larger question, because `ki-guides` lives there: adopting either rule binds every repository in the estate and refusing either does the same. Both name `knowledgeislands/ki-website` as their `transferred_from` origin, both sit at `triage`, and both say in terms that they bind nothing and block nothing.

The handoff that was lost when `KI-WEB-SITE-025` was pruned now exists in the repositories that would act on it, which is the only place it survives.

### Change Summary

Three records in two peer repositories and two corrections that came with them.

`KI-TOOL-CLI-083` states the opening-claim rule and the no-deferral rule, separates them from the Eleventy mechanics that do not travel, and argues the no-deferral rule's weaker case in a repository whose `README.md` is a document a reader should open. `KI-TOOL-CLI-080` had cited `ADR-KI-WEBSITE-003` for the specified-versus-published vendoring distinction, which `KI-WEB-SITE-030` merged into `ADR-KI-WEBSITE-001`; the citation was repointed. `KI-TOOL-CLI-078` carried `### Summary of changes` where the roadmap standard spells `### Change Summary`, failing that repository's own gate; renamed.

`KI-HARNESS-GOV-091` states the same two rules and then departs from its sibling, because the harness owns `ki-guides`. It records that a third rule from the same review has already landed there as a standard — a guide reads completely without following a link, mechanical as `GUIDE-4` and graded by audience as `ROUTE-3` — and holds that up as the precedent for how these two would land if adopted. It carries the evidence caution this item's Discussion argues for: one corpus under one set of pressures is thin ground for a rule that binds every repository.

### Verification

`ki repo audit --skill ki-work-roadmap --repo .` passes in all three repositories. `tools-ki` commit `c4e1cd9`; harness commit `e2ba941d`; this record at the head of `ki-website`.

Both peer records were read back after landing and each names the origin, the reciprocal non-blocking relationship, and the sibling record in the other repository. The `ki-agentic-harness` checkout was confirmed quiet before writing — clean tree, last commit hours earlier — which is what the held step was waiting for.

### Outstanding concerns

**This repository now fails the containment standard eleven times.** `GUIDE-4` landed in `ki-guides` while this item was open, and `ki repo audit --skill ki-guides --repo .` names ten links from `docs/guides/developer/` into `docs/decisions/` and one into the root `AGENTS.md`. Carried by `KI-WEB-SITE-035`, which is executing.

**The two editorial rules are still one corpus wide.** Neither peer has decided, and neither is scheduled — `KI-TOOL-CLI-083` and `KI-HARNESS-GOV-091` both sit at `triage`, which is honest for intake nobody has prioritised, and both may be answered "no". That is the outcome this item was built to make possible rather than a gap in it. Neither identifier depends on this record surviving.

### Post-change review

The item took longer than its own Boundary suggests because the held half was a scheduling problem, not a work problem, and scheduling problems are invisible in a plan. Writing two records took under an hour of the session between them; waiting for a checkout to go quiet took most of a day. The Steps recorded the hold with its reason, which is why the work resumed cleanly rather than being rediscovered.

The framing difference between the two records was not anticipated when the item was written and is the more useful part of what it delivered. Treating `ki-agentic-harness` as a peer recipient would have been wrong: it is where the standard would live, so the question it receives is categorically larger than the one `tools-ki` receives. A handoff that sends the same text everywhere is a handoff that has not read its recipients.

The risk introduced is nil. Three records were created, two headings and one citation were corrected, and nothing executable changed in any repository.

### Mini recap

`KI-WEB-SITE-027` wrote the guide contract's two editorial rules into the two repositories that own their own guides, as proposals that bind nothing: `KI-TOOL-CLI-083` in `tools-ki` and `KI-HARNESS-GOV-091` in `ki-agentic-harness`, the second framed as an estate-wide standard question because `ki-guides` lives there. Two unrelated defects in `tools-ki` records were fixed in passing. The harness half was held for most of a day behind an active writer in that checkout and delivered once it went quiet. A third rule from the same review — guide containment — landed separately as a `ki-guides` standard and now fails this repository's own guides eleven times, which `KI-WEB-SITE-035` is fixing.

## Discussion

### What actually transfers

The opening claim and the no-deferral rule are about what a guide owes its reader, and they hold wherever the guide sits. Everything else in `project-guides.md` — the directory data binding, the permalink shape, the `guides` collection, `verify:reachable` — is how a static site happens to implement ownership, and offering it to a CLI repository would be proposing a mechanism for a problem it does not have.

### Whether this belongs in `ki-guides` instead

The strongest version of this handoff is not two repository records but one standard. If the opening claim and the no-deferral rule are good rules for any guide, `ki-guides` is where they would bind every repository rather than the two this site happens to publish. Against that: the rules were derived from one corpus under one set of pressures, and promoting them estate-wide on that evidence is the mistake this repository made in the other direction when it let a version question decide how much the site should say. Raising them as proposals in two repositories first produces the evidence a standard would need.

### Why the handoff was lost

Worth naming because it will recur. The deferred work lived in the `## Review` of an accepted record, which is the correct place to record it at the time — and pruning removed the record along with everything in it. Acceptance and pruning are separate acts, and the gap between them is where a deferred concern has to be re-homed or it ceases to exist.

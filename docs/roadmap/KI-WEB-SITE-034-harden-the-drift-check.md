---
id: KI-WEB-SITE-034
area: SITE
title: Harden the drift check
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: e1659627913d42a1c0580a23125fd38208561dba
created_at: 2026-09-24T10:39:48Z
updated_at: 2026-09-24T21:40:00Z
---

## Goal

The upstream drift sweep cannot report a page as current when its source has in fact moved on. Two cases where it can are closed, or are recorded as accepted with a reason.

## Context

`KI-WEB-SITE-026` made `checkDrift` compare a pinned tag against the newest published release rather than against the default branch, which removed a permanent warning on every correctly-pinned source. It left two ways for the check to be quietly wrong, both recorded in that item and neither reachable by any source the site declares today.

**A source pinned to a commit still gets the default-branch comparison.** That is the old behaviour, and it produces the same permanent warning `KI-WEB-SITE-026` removed for tags, in a repository that publishes releases. No current `sources` entry pins a commit. Forcing tags instead would be a change to the `sources` contract rather than to the check.

**`releases/latest` means the newest non-prerelease release.** A repository whose newest useful artefact is a prerelease is reported as current when it is not. The site pins `v0.4.0`-style tags against repositories that do not currently publish prereleases.

Both are latent: they describe what the check would do, not what it does against this corpus. That is exactly why they are easy to lose — nothing fails, and the sweep prints a clean result.

## Boundary

This item decides what the check should do in each case and either implements it or records the decision as deliberate. It does not change the `sources` frontmatter contract, and it does not widen the sweep to new source kinds.

Neither case is a defect in the site's current output, so nothing here is urgent. It is worth an identifier because the failure mode is a check that reports success.

## Current state

Both cases were re-measured against the code rather than against the earlier record, and one of them turned out not to be a defect.

The drift comparison for a commit pin is a **per-file blob comparison**, not a branch-head comparison. It reports that the exact document a page cites has changed upstream, which is a question a commit pin can always act on by advancing to a newer commit. That is categorically different from the tag case `KI-WEB-SITE-026` fixed, where the warning fired on any unreleased upstream commit and could not be cleared by refreshing, because there was nothing newer to pin to.

It is also not latent. One source on this site is pinned to a commit — `knowledgeislands/ki-agentic-harness` at `7dcee9dc`, cited by five pages — and a `--network` sweep warns on all five, correctly, because `skills/README.md` has moved since.

The `releases/latest` case is real but splits in two. A page pinned to the newest stable tag while a prerelease sits above it is reported as current, which is the answer the site wants: it recommends what upstream stands behind, and a prerelease is not that. But `tagPattern` also admits prerelease-shaped tags, so a page **may** pin one — and comparing such a page against `releases/latest` returns an older stable tag and warns that a refresh is owed. That warning points backwards. No page pins a prerelease today.

## Steps

- [x] Re-read `checkDrift` and establish what each case actually does rather than what the earlier record recorded.
- [x] Measure the commit-pin case against the live corpus with a `--network` sweep.
- [x] Guard the release comparison so a prerelease pin is never compared against `releases/latest`.
- [x] Record both accepted limits in the guide a person reads before trusting the sweep.

## Files touched

- `apps/site/scripts/verify-provenance.ts` — a `prereleasePattern` and the guard on the release comparison
- `docs/guides/developer/page-provenance.md` — a new `### What a clean sweep does not prove`
- `docs/roadmap/KI-WEB-SITE-034-harden-the-drift-check.md`

## Verify

- `bun run --cwd apps/site typecheck` passes.
- `bun run --cwd apps/site verify:provenance -- --network` still warns on the five commit-pinned pages and nothing else.
- `ki repo audit --skill ki-engineering --repo .`, `--skill ki-guides --repo .` and `--skill ki-authoring --repo .` pass.

## Dependencies / blocks

Nothing. `KI-WEB-SITE-033` renamed this script and landed first, so this item is written against the new filename.

## Documentation impact

### Decision Records

None. Neither limit is a decision about what the site publishes; both are limits of a check, which is guide material.

### Specifications

None.

### Guides

`docs/guides/developer/page-provenance.md` gains the section recording what a clean sweep does not prove.

### Roadmap

None beyond this record.

## Review

### Delivered

The sweep can no longer report a refresh that points backwards, and the two cases where it can be quietly right-looking are written down in the guide a person reads before trusting its output.

One of the two recorded cases was not a defect, and establishing that is part of what this item delivered. A concern that survives a prune on a mistaken premise is worse than one that is dropped, because it keeps asking for work that should not be done.

### Change Summary

One guard and one guide section.

`verify-provenance.ts` gained `prereleasePattern`, and the release comparison now runs only for a stable tag. A prerelease pin falls through to the file comparison, which asks the question that pin can act on. The comment says why, because the reason is not visible from the code.

`page-provenance.md` gained `### What a clean sweep does not prove` under `## The sweep`, recording both accepted limits: a prerelease above the newest stable release is deliberately invisible, and a commit pin is compared per file against the default branch because that is the right question for it.

### Verification

`bun run --cwd apps/site typecheck` passes. `ki repo audit` passes for `ki-engineering`, `ki-guides`, `ki-authoring` and `ki-work-roadmap`.

A live `--network` sweep reports warnings on exactly the five pages that cite `skills/README.md` at `7dcee9dc`, and nothing else before GitHub's unauthenticated limit stops the remaining checks. That is the evidence the commit-pin path behaves as described; the guard cannot be exercised against this corpus, because no page pins a prerelease, which is also why it was worth adding before one does.

### Outstanding concerns

None with work attached.

The prerelease guard is untested by the corpus. That is inherent to the case — it is a guard against a pin nobody has written yet — and the alternative, a test file for a network-dependent script that currently has none, is a larger decision about what this repository's tests cover than this item should take.

### Post-change review

The useful finding is methodological. `KI-WEB-SITE-026` recorded two blind spots accurately as it understood them, and one of the two did not survive contact with the code: the commit-pin comparison was described as the branch comparison that had just been removed for tags, when it is a per-file comparison with an entirely different failure profile. Nothing was wrong with recording the concern; what was missing was re-measurement before acting on it.

That is the cost of a deferred concern generally. It is written at the moment of highest context and read at the moment of lowest, and the reader has no way to tell which parts were measured and which were reasoned. Re-measuring took one `--network` run and one reading of thirty lines.

Risk introduced is low. The guard narrows a comparison rather than widening it, and the narrowed path was reachable only by a pin no page holds.

### Mini recap

`KI-WEB-SITE-034` re-measured the two drift-check blind spots `KI-WEB-SITE-026` recorded. The commit-pin case turned out not to be a defect — it is a per-file comparison that a commit pin can always act on, and it warns correctly on the five pages that hold this site's one commit pin. The `releases/latest` case split: a prerelease above the newest stable release stays deliberately invisible, and a page pinned to a prerelease is no longer compared against the release list, because that comparison reported a refresh backwards. Both accepted limits are now recorded in `page-provenance.md`.

## Done

Accepted 2026-09-24 by Kris Brown on the review packet above.

## Discussion

### Whether "accepted with a reason" is a real outcome

It is, and it may be the right one for both. A check that has a known blind spot documented in the guide is more honest than one whose blind spots are undiscovered, and the cost of handling a case no source exercises is a branch nobody tests. The trap is accepting it silently: `docs/guides/developer/page-provenance.md` is where either decision belongs, because that is what a person reads before trusting the sweep's output.

### Why this is not `KI-WEB-SITE-026` reopened

That item delivered its goal and was accepted on it. These are the limits of what it delivered, which its `### Outstanding concerns` recorded correctly and which would have been deleted with the record at the prune.

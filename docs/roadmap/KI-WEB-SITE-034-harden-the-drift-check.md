---
id: KI-WEB-SITE-034
area: SITE
title: Harden the drift check
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

The upstream drift sweep cannot report a page as current when its source has in fact moved on. Two cases where it can are closed, or are recorded as accepted with a reason.

## Context

`KI-WEB-SITE-026` made `checkDrift` compare a pinned tag against the newest published release rather than against the default branch, which removed a permanent warning on every correctly-pinned source. It left two ways for the check to be quietly wrong, both recorded in that item and neither reachable by any source the site declares today.

**A source pinned to a commit still gets the default-branch comparison.** That is the old behaviour, and it produces the same permanent warning `KI-WEB-SITE-026` removed for tags, in a repository that publishes releases. No current `sources` entry pins a commit. Forcing tags instead would be a change to the `sources` contract rather than to the check.

**`releases/latest` means the newest non-prerelease release.** A repository whose newest useful artefact is a prerelease is reported as current when it is not. The site pins `v0.4.0`-style tags against repositories that do not currently publish prereleases.

Both are latent: they describe what the check would do, not what it does against this corpus. That is exactly why they are easy to lose — nothing fails, and the sweep prints a clean result.

## Boundary

This item decides what the check should do in each case and either implements it or records the decision as deliberate. It does not change the `sources` frontmatter contract, and it does not widen the sweep to new source kinds.

Neither case is a defect in the site's current output, so nothing here is urgent. It is worth an identifier because the failure mode is a check that reports success.

## Discussion

### Whether "accepted with a reason" is a real outcome

It is, and it may be the right one for both. A check that has a known blind spot documented in the guide is more honest than one whose blind spots are undiscovered, and the cost of handling a case no source exercises is a branch nobody tests. The trap is accepting it silently: `docs/guides/developer/page-provenance.md` is where either decision belongs, because that is what a person reads before trusting the sweep's output.

### Why this is not `KI-WEB-SITE-026` reopened

That item delivered its goal and was accepted on it. These are the limits of what it delivered, which its `### Outstanding concerns` recorded correctly and which would have been deleted with the record at the prune.

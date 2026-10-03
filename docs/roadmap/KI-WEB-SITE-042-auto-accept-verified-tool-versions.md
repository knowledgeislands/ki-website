---
id: KI-WEB-SITE-042
area: SITE
title: Auto-accept verified tool versions
theme: site-experience
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-03T03:56:54Z
updated_at: 2026-10-03T03:56:54Z
---

## Goal

Automatically accept a verified, exact version-only update for an existing website tool entry after required checks pass, while keeping first-time entries and editorial changes under human review.

## Context

The tap dispatches a tool-release event only after its formula update reaches `main`. The website receiver verifies the source release and opens or updates a pull request, but currently leaves every PR for review. GitHub currently reports auto-merge disabled and no required-check branch protection or ruleset. Existing KI release-update PRs have failing checks, so enabling auto-merge before fixing the gate would either be ineffective or unsafe.

## Boundary

The website owns its registry, CI and acceptance policy; the tool and tap retain release and formula authority. Automatic acceptance applies only to an existing entry with an exact version change supported by immutable source-release and tap evidence. A first-time entry, maturity or route change, unexpected diff, failed check, or ambiguous evidence remains human-reviewed. Do not bypass required checks or treat a dispatched event or opened PR as an accepted update.

## Current state

The receiver validates release evidence and opens version-update PRs. It does not merge them, and GitHub has no required-check rule for `main`.

## Steps

- [ ] Diagnose and fix failing checks on existing release-update PRs without weakening source verification.
- [ ] Test exact version-only changes and rejection of first-time, maturity, route, or other unexpected diffs.
- [ ] Require passing website CI on `main` without App bypass, then enable guarded auto-merge for qualifying PRs.
- [ ] Verify successful routine and rejected exceptional handoffs, and update website release guidance.

## Files touched

- `.github/workflows/update-tool-release.yml` and CI configuration
- `apps/site/scripts/` receiver and tests as needed
- Website tool-route and developer release guidance
- This roadmap record and GitHub branch rules

## Verify

Run website CI, focused release-sync tests, and positive/negative PR-shape tests. Inspect required-check and App-bypass settings through GitHub. Confirm a qualifying PR merges only after checks pass and an exceptional PR remains open for human review.

## Dependencies / blocks

Fix current failing checks before enabling auto-merge. A future tap-validated immutable tool release is required to prove a live event; `BREW-007` owns the preceding formula automation, but existing tap events can test this receiver independently.

## Documentation impact

### Decision Records

Record any material branch-rule or App-permission choice not covered by the shared release policy.

### Specifications

Specify version-only eligibility, CI gating and exceptional rejection in the website's tool-release contract.

### Guides

Update the website tool-route and release-operation guides to distinguish automated version-only acceptance from first-time and editorial review.

### Roadmap

Record implementation and live verification evidence here.

## Discussion

### Implementation preparation

Resolve the current failing release-update PR checks and add a focused regression test for the event-produced PR shape. Require passing CI on `main`, ensure the App cannot bypass it, then allow auto-merge solely for the exact version-only PR. Verify both successful routine merging and fail-closed exceptions. Reconcile the release guide and website tool-route guide with the observed behaviour after activation.

### Source release chain

The upstream immutable release gives standing authority for this matching receiver update only after the tap validates and merges its formula. Tap-side intake and formula gates are tracked separately in `homebrew-tap` `BREW-007`.

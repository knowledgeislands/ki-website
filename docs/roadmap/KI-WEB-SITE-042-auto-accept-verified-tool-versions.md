---
id: KI-WEB-SITE-042
area: SITE
title: Auto-accept verified tool versions
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-03T03:56:54Z
updated_at: 2026-10-05T12:00:00Z
---

## Goal

Automatically accept a verified, exact version-only update for an existing website tool entry after required checks pass, while keeping first-time entries and editorial changes under human review.

## Context

The tap dispatches a tool-release event only after its formula update reaches `main`. The website receiver verifies the source release and opens or updates a pull request, but currently leaves every PR for review. GitHub currently reports auto-merge disabled and no required-check branch protection or ruleset. Existing KI release-update PRs have failing checks, so enabling auto-merge before fixing the gate would either be ineffective or unsafe.

## Boundary

The website owns its registry, CI and acceptance policy; the tool and tap retain release and formula authority. Automatic acceptance applies only to an existing entry with an exact version change supported by immutable source-release and tap evidence. A first-time entry, maturity or route change, unexpected diff, failed check, or ambiguous evidence remains human-reviewed. Do not bypass required checks or treat a dispatched event or opened PR as an accepted update.

## Current state

The receiver validates release evidence and opens or updates version-update PRs (`.github/workflows/update-tool-release.yml`); it does not request merging. The corrected CI (job `build` in `.github/workflows/ci.yml`) is green on `main` and on release PR #7 (check run `37201130000`). As of 2026-10-05 GitHub reports `allow_auto_merge: false`, no rulesets and no branch protection on `main`. Kris approved the ruleset and auto-merge shape on 2026-10-05 (see Discussion); no setting has yet been changed.

## Steps

- [x] Diagnose the existing KI release-update PR failure and correct the linked-executable CI assertion without weakening source verification.
- [x] Test exact version-only changes and rejection of first-time or other unexpected version-bearing fields; retain maturity and route unchanged.
- [x] Publish the CI fix and verify passing checks on an updated release PR.
- [ ] Add a `main` ruleset requiring the `build` status check and pull requests, with the repository-admin role as the only bypass actor (the GitHub App is not a bypass actor), and enable repository auto-merge. Record the resulting ruleset and `allow_auto_merge` through `gh api`.
- [ ] Extend the receiver to request auto-merge only for an exact version-only update to an existing entry; first-time, maturity, route or other unexpected changes leave the PR open for human review. Add focused tests for both shapes.
- [ ] Verify a routine handoff (a qualifying PR, such as refreshed PR #7, merges only after `build` passes) and an exceptional one (a non-qualifying PR stays open). If no qualifying live release PR is available, record the live proof as pending a future tap-validated release rather than fabricating one.
- [ ] Update the website tool-route and release-operation guidance, then assemble the review packet and set the record to `awaiting-review`.

## Files touched

- `.github/workflows/update-tool-release.yml` and CI configuration
- `apps/site/scripts/` receiver and tests as needed
- Website tool-route and developer release guidance
- This roadmap record and GitHub branch rules

## Verify

Run website CI, focused release-sync tests, and positive/negative PR-shape tests. Inspect through `gh api` that the `main` ruleset requires `build` and pull requests, lists only the repository-admin role as a bypass actor, and that `allow_auto_merge` is true. Run `ki repo audit --progress never`. Confirm a qualifying PR merges only after checks pass and an exceptional PR remains open for human review.

## Dependencies / blocks

No blocking dependency: the corrected CI is green and the owner settings decision is made. Live end-to-end proof of a newly dispatched release needs a future tap-validated immutable tool release; `BREW-007` owns the preceding formula automation and is not a prerequisite for the settings and receiver steps.

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

### Local preparation

The failing PR build expected KI's wrapper path in diagnostic output, but linked KI reports its resolved source path. CI now compares that path with the wrapper's resolved target. The synchronizer's exact-four-pin gate prevents incidental matching text in an existing entry from being silently rewritten. Hosted check results and protected auto-merge remain unproved.

### Checkpoint - 2026-10-04

Step 3 is evidenced: `main` CI is green again (`6e5aabf` moved CI to `ki diag --full`; `tools-ki` `5f7ee0f` moved the harness pin), and updating release PR #7 (`ki` v0.5.1, a one-file `projects.json5` change) from `main` produced passing check run `37201130000`. PR #7 and the superseded v0.5.0 PR #5 remain open for human review; neither was merged or closed.

Step 4 now waits for an owner decision, not for evidence. GitHub reports `allow_auto_merge: false`, no rulesets and no branch protection on `main`. Requiring the build check on `main` changes how every contributor and agent lands work - this repository currently pushes directly to `main` - so the ruleset's shape (required check only, or also pull requests; who may bypass, with the App explicitly excluded) and enabling auto-merge are repository-setting choices for the owner. Once decided, the receiver change and the live routine and exceptional handoffs in Step 5 can proceed.

### Owner question - 2026-10-05

Triaged by the Fable reviewer as needing Kris: Step 4 is a repository-settings and security choice. GitHub still reports `allow_auto_merge: false` and no rulesets; PR #7's build is green, so only the settings decision blocks Step 4. Step 5's live proof also needs a future tap-validated release, so the item returns to waiting-for after the answer.

**Question for Kris:** May I add a `main` ruleset requiring the `build` check and pull requests, with the repository-admin role as the only bypass actor (so direct pushes keep working and the GitHub App explicitly cannot bypass), and enable repository auto-merge? Recommended: yes. The alternative - required check only, with no bypass - would reject every direct push to `main`, which is how this repository currently lands work.

### Owner decision - 2026-10-05

Answered: Kris said yes. The `main` ruleset requires the `build` check and pull requests, repository admins are the only bypass actor (the GitHub App cannot bypass), and repository auto-merge is enabled. Admin bypass keeps direct pushes to `main` working for the owner's account. The settings change is applied during implementation under this decision, not during planning; the earlier expectation that the item returns to `waiting-for` is superseded by Kris's direction to make it ready at `now`.

---
id: KI-WEB-SITE-042
area: SITE
title: Auto-accept verified tool versions
theme: site-experience
horizon: waiting-for
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-03T03:56:54Z
updated_at: 2026-10-04T12:10:18Z
---

## Goal

Automatically accept a verified, exact version-only update for an existing website tool entry after required checks pass, while keeping first-time entries and editorial changes under human review.

## Context

The tap dispatches a tool-release event only after its formula update reaches `main`. The website receiver verifies the source release and opens or updates a pull request, but currently leaves every PR for review. GitHub currently reports auto-merge disabled and no required-check branch protection or ruleset. Existing KI release-update PRs have failing checks, so enabling auto-merge before fixing the gate would either be ineffective or unsafe.

## Boundary

The website owns its registry, CI and acceptance policy; the tool and tap retain release and formula authority. Automatic acceptance applies only to an existing entry with an exact version change supported by immutable source-release and tap evidence. A first-time entry, maturity or route change, unexpected diff, failed check, or ambiguous evidence remains human-reviewed. Do not bypass required checks or treat a dispatched event or opened PR as an accepted update.

## Current state

The receiver validates release evidence and opens version-update PRs. Its local CI path assertion and exact-four-pin tests are updated, but the corrected CI has not yet run on the existing PRs. It does not merge them, and GitHub has no required-check rule for `main`.

## Steps

- [x] Diagnose the existing KI release-update PR failure and correct the linked-executable CI assertion without weakening source verification.
- [x] Test exact version-only changes and rejection of first-time or other unexpected version-bearing fields; retain maturity and route unchanged.
- [x] Publish the CI fix and verify passing checks on an updated release PR.
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

Waiting for the corrected CI to run on a release-update PR, `main` to require its passing build check with no App bypass, and the repository to allow auto-merge. The receiver must then enable auto-merge only for exact version-only PRs and prove a successful routine merge and an exceptional human-review case. A future tap-validated immutable tool release is required for live end-to-end proof; `BREW-007` owns the preceding formula automation.

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

---
id: KI-WEB-SITE-042
area: SITE
title: Auto-accept verified tool versions
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: edb569ac29bb17bae495ba946c2305bb57fecf3c
created_at: 2026-10-03T03:56:54Z
updated_at: 2026-10-06T21:20:15Z
---

## Goal

Automatically accept a verified, exact version-only update for an existing website tool entry after required checks pass, while keeping first-time entries and editorial changes under human review.

## Context

The tap dispatches a tool-release event only after its formula update reaches `main`. The website receiver verifies the source release and opens or updates a pull request, but currently leaves every PR for review. GitHub currently reports auto-merge disabled and no required-check branch protection or ruleset. Existing KI release-update PRs have failing checks, so enabling auto-merge before fixing the gate would either be ineffective or unsafe.

## Boundary

The website owns its registry, CI and acceptance policy; the tool and tap retain release and formula authority. Automatic acceptance applies only to an existing entry with an exact version change supported by immutable source-release and tap evidence. A first-time entry, maturity or route change, unexpected diff, failed check, or ambiguous evidence remains human-reviewed. Do not bypass required checks or treat a dispatched event or opened PR as an accepted update.

## Current state

Delivered on 2026-10-05. `main` carries ruleset `24496358` requiring pull requests and the `build` check with the repository-admin role as the only bypass actor, `allow_auto_merge` is `true`, and the receiver requests squash auto-merge on every bot PR it opens or updates. PR #7 (`ki` v0.5.1) merged through auto-merge after `build` passed; superseded PR #5 is closed.

## Steps

- [x] Diagnose the existing KI release-update PR failure and correct the linked-executable CI assertion without weakening source verification.
- [x] Test exact version-only changes and rejection of first-time or other unexpected version-bearing fields; retain maturity and route unchanged.
- [x] Publish the CI fix and verify passing checks on an updated release PR.
- [x] Add a `main` ruleset requiring the `build` status check and pull requests, with the repository-admin role as the only bypass actor (the GitHub App is not a bypass actor), and enable repository auto-merge. Record the resulting ruleset and `allow_auto_merge` through `gh api`.
- [x] Extend the receiver to request auto-merge only for an exact version-only update to an existing entry; first-time, maturity, route or other unexpected changes leave the PR open for human review. Add focused tests for both shapes. (Per owner decision (d), every bot PR auto-merges: the synchronizer's existing refusals and tests already prevent any non-qualifying shape from producing a bot PR.)
- [x] Verify a routine handoff (a qualifying PR, such as refreshed PR #7, merges only after `build` passes) and an exceptional one (a non-qualifying PR stays open). If no qualifying live release PR is available, record the live proof as pending a future tap-validated release rather than fabricating one.
- [x] Update the website tool-route and release-operation guidance, then assemble the review packet and set the record to `awaiting-review`.

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

## Review

### Delivered

Approved boundary: the `main` ruleset and repository auto-merge setting, receiver auto-merge for tool-release bot PRs under owner decision (d), guidance and decision record, and the live handoff for PRs #5 and #7. Excluded: PR #6 (first-time `techne` entry, left open for human review), tap-side `BREW-007`, and any App permission change. Immutable baseline `edb569ac29bb17bae495ba946c2305bb57fecf3c`; resulting evidence `f935585` (implementation) and `987f252` (PR #7 squash merge).

### Change Summary

- GitHub settings (via `gh api`): ruleset `24496358` "main: require build and pull requests" on `~DEFAULT_BRANCH`, `enforcement: active`, rules `pull_request` (0 required approvals) and `required_status_checks` (`build`, integration `15368` GitHub Actions, taken from the check run on `edb569a`); sole bypass actor `RepositoryRole` 5 (admin), `bypass_mode: always`. `allow_auto_merge: true`.
- `.github/workflows/update-tool-release.yml`: after creating or editing the bot PR, runs `gh pr merge "$pr" --auto --squash` with the `ki-tools-release-bot` App token; PR body states the immutable release is the human gate.
- `docs/guides/developer/tool-routes.md`: automated path now CI-gated auto-merge; first-time, maturity and editorial changes never produce a bot PR and arrive as human PRs.
- `docs/decisions/ODR-KI-WEBSITE-001-tool-release-updates-auto-merge.md` and the decisions README.
- Deviation approved by decision (d): no separate per-PR eligibility classifier. The synchronizer's existing refusals (unregistered slug, non-tool, repository mismatch, downgrade, not exactly four pins) and the workflow's single-path check already make every bot PR an exact version-only update; their existing tests (`refuses first-time entry and unexpected version-bearing field`, `leaves maturity and routes unchanged during version update`) cover both shapes.

### Verification

- `ki repo audit --progress never`: PASS (exit 0).
- `bun test apps/site/scripts/sync-tool-release.test.ts`: 10 pass, 0 fail. `actionlint` 1.7.12 on the workflow: clean.
- `gh api` ruleset `24496358` and repository settings read back as above.
- Routine handoff: PR #7 updated from `main` (head `0f4cae7`), auto-merge (squash) enabled, state `BLOCKED` until `build` run `37296694182` succeeded at 10:27:46Z; merged at 10:28:13Z as `987f252`. CI on `main` succeeded for `f935585` (run `37296658405`) and `987f252` (run `37296781215`).
- Exceptional handoff: PR #6 (human-authored first-time entry) remains open with no auto-merge request. PR #5 closed with a supersession comment.
- Direct push of `f935585` to `main` succeeded through the admin bypass (GitHub reported the `build` expectation as bypassed).

### Outstanding concerns

- The new workflow step has not yet run live: PR #7's auto-merge was enabled manually because it predates the change. End-to-end proof of the bot itself requesting auto-merge awaits the next tap-validated release (`BREW-007`).
- Non-admin contributors and agents without admin credentials must now land through PRs that pass `build`.

### Post-change review

The goal - verified version-only releases reach the site without manual merging while CI cannot be bypassed by the App - is met, with scope held to the website. Regression risk is low: human-authored PRs are unaffected beyond needing `build`, and admin pushes continue. Ready for acceptance, with the live bot run noted as pending future release evidence.

### Mini recap

Ruleset and auto-merge enabled, receiver requests auto-merge, PR #5 closed, PR #7 auto-merged after green `build`, guide and `ODR-KI-WEBSITE-001` updated; audit PASS. Learning route: the App inventory is recorded in Arcadia (`KI-ARCADIA-GOV-014`).

## Done

Accepted 2026-10-06 by Kris Brown on the review packet above.

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

### Owner decision (d) - 2026-10-05

Kris decided that tool-release PRs auto-merge because the immutable release is the human gate. After opening or updating the bot PR, the receiver runs `gh pr merge --auto --squash` with its `ki-tools-release-bot` App token. Eligibility remains structural: the synchronizer refuses first-time, non-tool, mismatched, downgrade and non-four-pin shapes, and the workflow fails on any path other than the registry, so no non-qualifying change yields a bot PR. Recorded as `ODR-KI-WEBSITE-001`. Superseded PR #5 (`ki` v0.5.0) is closed in favour of PR #7 (`ki` v0.5.1), whose merge deploys the site with Kris's acceptance.

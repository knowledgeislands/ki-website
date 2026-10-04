---
id: KI-WEB-SITE-041
area: SITE
title: Realign the harness pin
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: ee4a09df3dce6aa30adb0dfb6f14059883ffb762
created_at: 2026-09-25T15:40:00Z
updated_at: 2026-10-04T12:08:27Z
---

## Goal

CI and a contributor's terminal audit this repository against the same rubric, so a green local audit predicts a green build and a red one names a defect that actually exists.

## Context

CI has failed on every push to `main` since 2026-09-22 — five consecutive runs, each in about twenty seconds, each with `FAIL=2` out of eighteen skills. Neither failure is a defect in this repository. Both are the same drift, seen twice.

`ki repo audit` resolves its rubric from the installed harness. In CI that harness is not a clone of the default branch: released `ki` carries an immutable pin, `canonicalHarnessRelease` in `src/core/storage/registry.ts`, which for `v0.4.0` names `knowledgeislands/ki-agentic-harness` at commit `bcdc9919` (2026-09-18) together with its archive digest. The workflow installs `v0.4.0` explicitly and asserts the version, so CI audits against a rubric frozen on 2026-09-18. A contributor's `ki` resolves the local harness checkout instead, which tracks `main`. The two have drifted by six days and two rules.

The rule that renames a heading is `ITEM-3`. Harness commit `a522253c` (2026-09-24) renamed the review-packet section from `### Summary of changes` to `### Change Summary`. The accepted navigation delivery carried the new heading, passed locally, and failed in CI; `KI-WEB-SITE-036` failed the same way on 2026-09-24 before this session began, which is the evidence that the cause is the pin rather than the item.

The rule that moves a file is `WCF-26`. The pinned rubric wants `docs/guides/cloudflare.md`; current `main` wants `docs/guides/developer/cloudflare.md`, which is where this repository's developer guides live and where the file already is, linked from `docs/guides/developer/README.md`. Nothing is missing. The harness moved the path deliberately, under its own hand-over commit `2634a273`, so that the guide stays inside the audience route `ki-guides` governs.

The failure mode worth naming is that **a green local audit stopped predicting a green build, and nothing said so.** The audit is the same command with the same name and the same output shape in both places; only the rubric underneath it differs, and that difference is invisible at the call site.

## Boundary

This item makes CI's rubric and a contributor's rubric the same rubric. It does not change a review heading to match a stale vocabulary, and it does not move the Cloudflare guide out of `docs/guides/developer/`: both would make the repository wrong in order to make a frozen checker happy, and would have to be undone when the pin moves.

It does not narrow `ki repo audit --repo .` in the workflow to a subset of skills. A gate dropped so a build goes green removes a decision's enforcement while leaving the decision written down, which is the failure `KI-WEB-SITE-040` argues against for the site scripts and is no better here.

The pin itself belongs to `tools-ki`. This repository owns which `ki` version its workflow installs; it does not own what that version pins, and it cannot patch the pin locally — `readHarnessRegistry` refuses a configured release whose `id` is the canonical harness, by design, so there is no repository-level override to reach for.

## Current state

Five CI runs, all red, all `PASS=16 WARN=0 FAIL=2`:

| Rule | Pinned rubric expects | Current harness expects | Moved by |
| --- | --- | --- | --- |
| `ITEM-3` | `### Summary of changes` | `### Change Summary` | `a522253c`, 2026-09-24 |
| `WCF-26` | `docs/guides/cloudflare.md` | `docs/guides/developer/cloudflare.md` | `2634a273` hand-over |

`.github/workflows/ci.yml` installs `tools-ki` at `v0.4.0` from a pinned `install.sh` URL and asserts `ki --version` equals `0.4.0`. `.ki.toml` declares `harnesses = ["knowledgeislands/ki-agentic-harness"]` and pins no revision, because the revision is not the repository's to pin.

The harness fix for both rules is already on `knowledgeislands/ki-agentic-harness` `main`. No unreleased `ki` version carries a pin that includes it, so no version bump available today closes this.

## Steps

- [x] Confirm with `tools-ki` that its canonical harness pin carries the current rules, and record which revision carries it.
- [x] Make CI resolve that pin rather than a frozen installer release, and keep its diagnostic assertions current.
- [x] Re-run CI on `main` and confirm the audit passes with no failures.
- [x] Record in `AGENTS.md` that a local audit and CI can resolve different rubrics, and how to tell.

## Files touched

- `.github/workflows/ci.yml` - the linked KI source and its diagnostic assertions
- `AGENTS.md` - the note about which rubric an audit resolved

## Verify

- `gh run list --limit 1` shows `success` for a push to `main`.
- `gh run view <id> --log-failed` is empty, and the audit summary reads `PASS` with no failures.
- A local `ki repo audit --repo .` and the CI run agree on the same commit.

## Dependencies / blocks

Formerly blocked by `tools-ki`, which owns `canonicalHarnessRelease`; that handoff was met by `tools-ki` `5f7ee0f` on 2026-10-04. A future rule change in the harness can recur the drift until `tools-ki` moves the pin again, which is what the `AGENTS.md` note explains how to recognise.

Nothing in this repository blocks on this item. The two failures are checker drift, not defects, so no content work waits behind them. The accepted navigation delivery exposed the mismatch during review, which remains useful evidence for this pin realignment.

## Documentation impact

### Decision Records

None. No decision changes; the same rules apply, from one source instead of two.

### Specifications

None.

### Guides

None directly. The Cloudflare guide stays where `ki-guides` puts it.

### Roadmap

None beyond this record.

## Review

### Delivered

The Goal: CI and a contributor's terminal audit against the same rubric when the `tools-ki` pin is current, and a contributor can tell when they do not. Baseline `ee4a09df3dce6aa30adb0dfb6f14059883ffb762`. Earlier evidence inside the replanned scope: `6e5aabf` (CI diagnostic command), `tools-ki` `5f7ee0f` (pin bump, delivered by `tools-ki`), and the green CI run `37200483963`. Excluded: any change to the pin itself, which `tools-ki` owns.

### Change Summary

- `AGENTS.md` - new section "Which rubric an audit resolved": where CI's rubric comes from, how to read it from the job log, how `ki diag --full` shows a local harness's mode, and the rule that a CI-only failure from a newer harness rule is a `tools-ki` pin bump rather than a local workaround.
- `.github/workflows/ci.yml` (`6e5aabf`, earlier in this session) - `ki manage diag` replaced by `ki diag --full` after `tools-ki` retired the `manage` group.
- Deviation: the original Steps (pin an installer release) were superseded by `ee7df49`; the replan in Discussion records the rewritten Steps.
- Review round 1 (`CHANGES`): the archive digest is printed by `ki bootstrap`, not `ki harness list`; `AGENTS.md` corrected, and the Verify literal `FAIL=0` updated to the current audit summary shape.

### Verification

- `gh run list`: run `37200483963` on `2e4cdf6` succeeded, with `ki repo audit --repo .` passing all skills; the earlier `FILES-6` failure (run `37199430440`) cleared once `tools-ki` `5f7ee0f` landed.
- Local `ki repo audit --repo .` passes on the same tree (22 skills), so local and CI agree.
- `bunx rumdl check AGENTS.md` clean.

### Outstanding concerns

The drift will recur whenever a harness rule lands before `tools-ki` moves its pin; this item makes that recognisable, it does not prevent it. Run `37200455941` failed on a mid-session roadmap section-order slip (`ITEM-3`), fixed by `2e4cdf6`, and is unrelated to the pin.

### Post-change review

The Goal holds on current evidence: same rubric, same verdict, and a written way to tell when they diverge. Scope stayed within this repository; the pin change was a handoff. Regression risk is nil for the site. Ready for review.

### Mini recap

CI green again after a diag-command fix and a `tools-ki` pin bump; `AGENTS.md` now explains rubric resolution. Possible learning route: `ki-repo` CI guidance could name the pin-drift diagnosis generally; not promoted.

## Done

Accepted 2026-10-04 on an independent re-review that returned `ACCEPT`, under the owner's delegated acceptance authority for this session. The first review asked for one correction - the harness archive digest comes from `ki bootstrap`, not `ki harness list` - fixed in `d416c3e`. The re-review confirmed CI run `37200979277` on `d416c3e` green with `tools-ki` `5f7ee0f`, and a local `ki repo audit --repo .` agreeing at `PASS` across 22 skills.

## Discussion

### Replan - 2026-10-04

Adopted from Triage into Now under the owner's delegated session authority. The original Steps assumed CI would keep installing a pinned `ki` release; `ee7df49` instead made CI link `tools-ki` `main` from source, so the rubric CI audits is `canonicalHarnessRelease` on `tools-ki` `main`. The drift recurred in that shape on 2026-10-04: `main` pinned harness `0cad602` (2026-10-02), which predates the `tmp/` ignore block (`654bc4f`, GOV-132) this repository had already adopted, so CI failed `FILES-6` while a local audit passed. On handoff, `tools-ki` `5f7ee0f` moved the pin to harness `b426da8`. Separately, `tools-ki` retired the `ki manage` group, and `6e5aabf` moved CI to the root `ki diag --full`. CI run `37200483963` on `2e4cdf6` passed. The first three Steps are rewritten to that reality and complete; the `AGENTS.md` note remains.

### Pickup checkpoint — 2026-09-28

At inspected local `main` `d025e8ef22c5cf3ff485149b2cabc67fbae0149b`, `1cb41ea` changed `.github/workflows/ci.yml` to install and assert `tools-ki` `v0.4.1`. The local `tools-ki` `v0.4.1` tag pins harness commit `6378206cd6575e11aad482cf26b30f23f9e08a40` in `src/core/storage/registry.ts`; that commit descends from the two harness fixes this record cites, `a522253c` and `2634a273`. This verifies the new pin contains those rule changes and supersedes the historical claim that no suitable release exists. It does not prove parity with a contributor's moving local harness checkout or that CI reran with `FAIL=0`; no CI run result was checked here. The `AGENTS.md` explanation required by the final Step is still absent. Reconcile the destination branch, linked tasks, and retained worktrees before resuming, then verify the current CI result and contributor rubric source and complete the guidance. This checkpoint is pickup guidance, not an execution block or authority grant; absent evidence does not release any owner or lift a hold. This audit leaves `next`/`draft` and Step checkboxes unchanged; closure requires independent verification, explicit owner acceptance, and retention until explicit pruning selection.

### The pin is right and the drift is the cost of it

An immutable commit plus an archive digest is the correct way to acquire a harness: it makes an audit reproducible and refuses a substituted archive. The cost is that a rubric improvement reaches contributors the day it is pushed and reaches CI only when a new `ki` is released. That gap is inherent, not a bug, and the answer is to keep the gap short rather than to loosen the pin.

### A checker that disagrees with itself teaches the wrong lesson

The practical damage is not the red build; it is that a contributor who trusts the local audit ships something CI rejects, and a contributor who trusts CI edits a correct file to satisfy a rule that no longer exists. The second is worse, because it writes the drift into the repository, where it will have to be reverted. Both CI failures currently invite exactly that edit, which is why this item forbids it in its Boundary rather than leaving it to judgement.

### Why this was not caught when the headings changed

Nothing looks at whether the two rubrics agree. The same omission has appeared twice in this repository in one week: `verify-reachable` passed while checking a third of the site because its scope was a list of directory names that a move invalidated, and a local audit passes while checking a six-day-old rulebook because its source is a pin that a push does not update. In both cases the check reported success, the number it reported was the only clue, and nobody was reading it.

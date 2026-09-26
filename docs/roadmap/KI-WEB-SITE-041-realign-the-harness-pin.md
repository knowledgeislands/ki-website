---
id: KI-WEB-SITE-041
area: SITE
title: Realign the harness pin
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T15:40:00Z
updated_at: 2026-09-26T18:18:00Z
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

- [ ] Confirm with `tools-ki` that a release bumping `canonicalHarnessRelease` past `a522253c` is planned, and record which version carries it.
- [ ] Bump the pinned installer version and the `ki --version` assertion in `.github/workflows/ci.yml` to that version.
- [ ] Re-run CI on `main` and confirm `FAIL=0` across all eighteen skills.
- [ ] Record in `AGENTS.md` that a local audit and CI can resolve different rubrics, and how to tell.

## Files touched

- `.github/workflows/ci.yml` — the pinned installer URL and the version assertion
- `AGENTS.md` — the note about which rubric an audit resolved

## Verify

- `gh run list --limit 1` shows `success` for a push to `main`.
- `gh run view <id> --log-failed` is empty, and the audit line reads `FAIL=0`.
- A local `ki repo audit --repo .` and the CI run agree on the same commit.

## Dependencies / blocks

Blocked by `tools-ki`, which owns `canonicalHarnessRelease` and the release that would move it. That is a handoff to `tools-ki` rather than work this repository can do: nothing here can change what a released `ki` pins, and the registry actively refuses a local override of the canonical harness.

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

## Discussion

### The pin is right and the drift is the cost of it

An immutable commit plus an archive digest is the correct way to acquire a harness: it makes an audit reproducible and refuses a substituted archive. The cost is that a rubric improvement reaches contributors the day it is pushed and reaches CI only when a new `ki` is released. That gap is inherent, not a bug, and the answer is to keep the gap short rather than to loosen the pin.

### A checker that disagrees with itself teaches the wrong lesson

The practical damage is not the red build; it is that a contributor who trusts the local audit ships something CI rejects, and a contributor who trusts CI edits a correct file to satisfy a rule that no longer exists. The second is worse, because it writes the drift into the repository, where it will have to be reverted. Both CI failures currently invite exactly that edit, which is why this item forbids it in its Boundary rather than leaving it to judgement.

### Why this was not caught when the headings changed

Nothing looks at whether the two rubrics agree. The same omission has appeared twice in this repository in one week: `verify-reachable` passed while checking a third of the site because its scope was a list of directory names that a move invalidated, and a local audit passes while checking a six-day-old rulebook because its source is a pin that a push does not update. In both cases the check reported success, the number it reported was the only clue, and nobody was reading it.

---
id: KI-WEB-SITE-017
title: Repair moved guidance links
area: SITE
theme: site-experience
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T16:40:00Z
---

## Goal

No published guidance page links a document that no longer exists upstream, and the provenance sweep's first report is acted on rather than accumulated.

## Context

The provenance sweep found real rot on its first run. Two harness documents linked from published pages are absent from `ki-agentic-harness` on its default branch:

- `docs/guides/developer/retiring-repository-vendored-ki.md`, linked from `using-ki/getting-started.md` and `using-ki/onboarding.md` as the maintainer retirement guide.
- `docs/diagrams/skills-map.svg`, linked from `skills/index.md`.

Both are linked at `main`, so they are live broken links for readers today, not merely stale citations.

The sweep separately reports that `tools-ki` `docs/guides/vscode-management.md` no longer resolves on its default branch. That one is a move rather than a deletion — the guide is now at `docs/guides/user/vscode-management.md` — and the site's link is pinned at `v0.4.0`, so it still resolves. It is a signal about the next refresh, not a break.

These are the cases the mechanism was built to surface, and leaving the first report unactioned would teach everyone to ignore the second.

## Boundary

This is repair of the site's own links and citations. Whether the harness should restore, relocate, or formally retire those documents is the harness's decision, and this item should not assume an answer.

## Shaping

- Establish what happened to the two harness documents: renamed, retired, or absorbed. Decide from that whether the site relinks, rewrites the passage, or drops it.
- Decide whether the site should link harness documents at `main` at all, given both broken links are `main` links while every pinned link still resolves.
- Advance the `tools-ki` citations to the current release and its `docs/guides/user/` paths as part of an ordinary refresh.
- Re-run `bun run --cwd apps/site verify:guidance -- --network` and confirm the remaining warnings are refreshes owed rather than breaks.

## Current state

The provenance sweep's first `--network` run reports two harness documents that are absent from `ki-agentic-harness` on its default branch and are linked from published pages at `main`, so they are broken for readers today. It separately reports `tools-ki` `docs/guides/vscode-management.md` as absent, which is a move the site's `v0.4.0` pin still resolves through. No repair has been made.

## Steps

- [ ] Establish what happened to `docs/guides/developer/retiring-repository-vendored-ki.md` and `docs/diagrams/skills-map.svg`: renamed, retired, or absorbed.
- [ ] Relink, rewrite, or drop the affected passages in `using-ki/getting-started.md`, `using-ki/onboarding.md`, and `skills/index.md` according to that answer.
- [ ] Decide whether the site should link harness documents at `main` at all, given both breaks were `main` links while every pinned link held.
- [ ] Advance the `tools-ki` citations to the current release and its `docs/guides/user/` paths as an ordinary refresh, moving `ref` and `reviewed` together.
- [ ] Re-run the sweep and confirm the remaining reports are refreshes owed rather than breaks.

## Files touched

`apps/site/src/guidance/using-ki/getting-started.md`, `apps/site/src/guidance/using-ki/onboarding.md`, `apps/site/src/guidance/skills/index.md`, and the `tools-ki`-sourced pages under `apps/site/src/guidance/cli/`.

## Verify

`bun run --cwd apps/site verify:guidance -- --network` reports no failures, and every remaining warning is a refresh owed rather than an unresolvable link. `bun run ki:site:build` passes.

## Dependencies / blocks

Not blocked. Whether the harness restores, relocates, or formally retires those two documents is the harness's decision; this item repairs the site's links against whatever is true, and does not wait for the harness to act.

## Documentation impact

### Decision Records

No decision record is needed. This is repair against an existing mechanism.

### Specifications

No behaviour-level contract changes.

### Guides

`docs/guides/developer/guidance-provenance.md` gains whatever the `main`-linking decision concludes, since it currently governs `sources` refs but says nothing about links in prose.

### Roadmap

None expected. If the harness documents turn out to have been retired deliberately, saying so may be worth a handoff item there, but the site's repair does not depend on it.

## Discussion

Shaping settles how the two links are repaired, not whether. Worth noting that the pinned links all held and both failures were unpinned — evidence for the discipline the provenance guide already recommends.

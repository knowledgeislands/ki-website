---
id: KI-WEB-SITE-017
area: SITE
title: Repair guidance links to moved upstream documents
theme: site-experience
blocks: []
blocked_by: []
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T15:44:00Z
horizon: triage
status: draft
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

## Discussion

Review before deciding. Worth noting that the pinned links all held and both failures were unpinned — evidence for the discipline the provenance guide already recommends.

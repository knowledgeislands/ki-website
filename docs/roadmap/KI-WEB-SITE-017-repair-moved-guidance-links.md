---
id: KI-WEB-SITE-017
title: Repair moved guidance links
area: SITE
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T17:45:00Z
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

The provenance sweep's first `--network` run reports two harness documents absent from `ki-agentic-harness` on its default branch, both linked from published pages at `main`, so they are broken for readers today. Shaping established what happened to each:

- `docs/guides/developer/retiring-repository-vendored-ki.md` was **retired** on 2026-08-10 by `2a19ce8a` ("docs: remove legacy migration guidance"), which deleted 171 lines alongside a retired checkpoint and a superseded decision record. No replacement exists, and none is intended — the guidance was legacy migration material.
- `docs/diagrams/skills-map.svg` was **replaced** on 2026-08-13 by `9e09b943` ("feat(harness): publish skill discovery guide"), which deleted the diagram and its `.dot` source and created `docs/guides/skills-by-outcome.md` in the same commit. The site already publishes its own account of that document at `/guidance/skills/by-outcome/`.

Two further findings changed the plan. `v0.4.0` is still the latest `tools-ki` tag, so there is no release to advance the citations to; the `docs/guides/user/` move is `main`-only and the existing pins resolve. And the class is wider than the two breaks: guidance prose carries 13 unpinned `main` links to `knowledgeislands` repositories, of which the other 11 currently resolve. Nothing checks them, which is why these two rotted unnoticed.

## Steps

- [x] Establish what happened to both documents: one retired, one replaced. Recorded in Current state.
- [ ] Drop the retirement-guide link from `using-ki/getting-started.md` and `using-ki/onboarding.md`, keeping the advice, which remains sound without it.
- [ ] Rewrite the `skills/index.md` sentence to cite the outcome guide rather than a diagram, dropping the description of visual properties that no longer exist.
- [ ] Extend `verify-guidance-sources.ts` to resolve prose links to `knowledgeislands` repositories under `--network`, so this class of rot is caught rather than these two instances repaired.
- [ ] Record in `guidance-provenance.md` what the prose-link check covers and why it warns rather than fails.
- [ ] Re-run the sweep and confirm the remaining reports are refreshes owed rather than breaks.
- [ ] Leave the `tools-ki` pins at `v0.4.0`: no newer release exists, so there is nothing to advance to.

## Files touched

`apps/site/src/guidance/using-ki/getting-started.md`, `apps/site/src/guidance/using-ki/onboarding.md`, `apps/site/src/guidance/skills/index.md`, `apps/site/scripts/verify-guidance-sources.ts`, and `docs/guides/developer/guidance-provenance.md`.

## Verify

`bun run --cwd apps/site verify:guidance -- --network` reports no unresolvable prose link and no failure, and every remaining warning is a refresh owed. `bun run ki:site:build` passes. `ki repo audit --skill ki-engineering --repo .` and `--skill ki-authoring --repo .` pass.

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

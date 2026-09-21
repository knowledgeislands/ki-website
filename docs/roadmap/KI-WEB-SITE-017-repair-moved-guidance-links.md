---
id: KI-WEB-SITE-017
title: Repair moved guidance links
area: SITE
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: db72348500c905b88c053cea2849512186fba8d6
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T19:20:00Z
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
- [x] Drop the retirement-guide link from `using-ki/getting-started.md` and `using-ki/onboarding.md`, keeping the advice, which remains sound without it.
- [x] Rewrite the `skills/index.md` sentence to cite the outcome guide rather than a diagram, dropping the description of visual properties that no longer exist.
- [x] Extend `verify-guidance-sources.ts` to resolve prose links to `knowledgeislands` repositories under `--network`, so this class of rot is caught rather than these two instances repaired.
- [x] Record in `guidance-provenance.md` what the prose-link check covers and why it warns rather than fails.
- [x] Re-run the sweep and confirm the remaining reports are refreshes owed rather than breaks.
- [x] Leave the `tools-ki` pins at `v0.4.0`: no newer release exists, so there is nothing to advance to.

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

`docs/guides/developer/guidance-provenance.md` gained a "Links the prose makes" section: what the check resolves, why an unresolvable link warns rather than fails, and why prose links may point at `main` when a `sources` ref may not. Its sweep section also records the `GITHUB_TOKEN` requirement.

### Roadmap

No handoff to the harness is warranted: both documents were retired deliberately and the harness is entitled to retire its own material. A site-local refresh item is owed once `tools-ki` releases a tag containing its `docs/guides/user/` reorganisation, which the sweep already reports as drift.

## Review

### Delivered

Both broken links are gone, and the class they belong to is now checked mechanically rather than found by hand.

The two harness documents were established from Git history, not inference. `docs/guides/developer/retiring-repository-vendored-ki.md` was **retired** on 2026-08-10 by `2a19ce8a` ("docs: remove legacy migration guidance"), deleted alongside a retired checkpoint and a superseded ADR — no replacement was intended, so the site drops the link and keeps the advice, which stands without it. `docs/diagrams/skills-map.svg` was **replaced** on 2026-08-13 by `9e09b943` ("feat(harness): publish skill discovery guide"), which deleted the `.svg` and its `.dot` source and created `docs/guides/skills-by-outcome.md` in their place; the site's sentence now routes readers to the outcome guide and no longer describes visual properties that do not exist.

`verify-guidance-sources.ts` now resolves prose links under `--network`, so the next retirement is reported rather than discovered. The `tools-ki` pins stayed at `v0.4.0` as planned: it is still the latest tag, so there is nothing to advance to.

### Summary of changes

- `apps/site/src/guidance/using-ki/getting-started.md` and `using-ki/onboarding.md` — retirement-guide link dropped, surrounding advice retained.
- `apps/site/src/guidance/skills/index.md` — the diagram sentence now cites `/guidance/skills/by-outcome/`.
- `apps/site/scripts/verify-guidance-sources.ts` — prose-link extraction and resolution; a shared rate-limit-aware GitHub client; `GITHUB_TOKEN` support; per-target deduplication.
- `docs/guides/developer/guidance-provenance.md` — a "Links the prose makes" section covering what the check resolves, why it warns, and why prose links may point at `main` when `sources` may not.

### Verification

- `ki repo audit --skill ki-engineering --repo .` — PASS.
- `ki repo audit --skill ki-authoring --repo .` — PASS.
- `bun run ki:site:build` — 59 files written; `verify:routes`, `verify:projects`, and `verify:guidance` all clean.
- `GITHUB_TOKEN="$(gh auth token)" bun run --cwd apps/site verify:guidance -- --network` — 31 pages, 21 repository sources and 15 prose links resolved. Every prose link resolves. The ten remaining warnings are all refreshes owed, no breaks.

### Outstanding concerns

Two, both genuine and both outside this item's boundary.

`tools-ki` reorganised its guides into audience folders on 2026-09-20 (`c37ede8`), moving six documents under `docs/guides/user/`. The site's `cli/local-commands.md` declares one of them at its pre-move path, which the sweep correctly reports as drift. The refresh cannot be done yet: `v0.4.0` predates the move and no newer tag exists, so re-pinning would mean pinning a bare commit on a repository that does release. This is the first evidence of the consolidation roadmap items landing upstream, and the site will owe a refresh pass once `tools-ki` cuts its next release.

Separately, the network sweep needs more than sixty GitHub requests and so needs `GITHUB_TOKEN` to run clean. That is documented, but it means the `--network` leg is a person's command rather than something CI could adopt unchanged.

### Post-change review

Adding the prose-link check surfaced a pre-existing bug it would have been easy to miss: `checkDrift` called `fail()` on any non-OK response to a pinned ref, so a 403 rate limit was reported as "upstream does not serve this document" — and, being a failure rather than a warning, would have broken the build for a reason having nothing to do with the repository. The first unauthenticated run did exactly that. All network calls now route through one client that treats 403 and 429 as "no verdict", warns once, and skips the rest. A check that invents breakages is worse than no check, because it trains its reader to ignore it.

The scope grew slightly beyond the shaped steps as a result — the client, token support, and deduplication were not in the plan. Deduplication earned its place immediately: fifteen distinct targets were linked from twenty-four places.

### Mini recap

The shaping step that asked whether the site should link harness documents at `main` resolved the opposite way from what the item's Discussion anticipated. The Discussion noted that both failures were unpinned links while every pinned link held, reading that as evidence for pinning prose too. Working through it, the inference does not hold: pinned links held because a pin cannot rot, not because pinning is right for prose. A reader following a link into a repository wants the current document, and pinning would freeze their view at whatever ref the page was last revised. The failure was never that the links were unpinned — it was that nothing checked them. So the check was the answer, and prose links stay on `main` deliberately, with the reasoning written into the guide so the question is settled rather than rediscovered.

## Discussion

Shaping settles how the two links are repaired, not whether. Worth noting that the pinned links all held and both failures were unpinned — evidence for the discipline the provenance guide already recommends.

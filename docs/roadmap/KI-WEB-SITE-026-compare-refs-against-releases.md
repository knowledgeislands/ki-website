---
id: KI-WEB-SITE-026
area: SITE
title: Refresh pinned CLI citations
theme: site-experience
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:06:42Z
---

## Goal

A reader following the site's account of what `ki` can do sees the current release, not a snapshot taken at `v0.4.0`. The vendored command inventory and the pages that cite it advance together to one newer ref, and the provenance sweep stops reporting drift it cannot resolve.

## Context

Twelve published pages and two data files under `apps/site/src/` cite `tools-ki` at `v0.4.0`: the nine `ki` project guides, three `ki-agentic-harness` guides, `src/_data/cliCommands.json5`, and the `manual` field in `src/_data/projects.json5`.

`bun run --cwd apps/site verify:guidance -- --network` reported this as a warning during `KI-WEB-SITE-025` and the concern was deferred there as separate work. The record was accepted and pruned, so the concern currently exists nowhere.

The pages are not wrong. Each declares the ref it was written from, which is exactly what `verify:guidance` requires, so the site is honestly stale rather than quietly false. The cost is that a reader deciding whether `ki` suits them is reading an older command surface than the one they would install, and `ADR-KI-WEBSITE-003` accepted vendoring specifically on the understanding that refreshing is a deliberate act someone performs.

The refresh is not a bulk `sed`. `sync:cli` reparses `man/ki.1` at the new ref, and `ADR-KI-WEBSITE-003` records that the manual is published but unspecified — its SYNOPSIS and COMMAND GROUPS sections had already drifted from each other at `v0.4.0`. A newer manual may have changed shape, and the parser is meant to fail loudly when it does. That failure is the work, not an obstacle to it.

## Boundary

This item advances citations of `tools-ki` to one chosen newer ref. It does not change the vendoring mechanism, the parser's contract, or `ADR-KI-WEBSITE-003`. It does not introduce a build-time network fetch — the reproducible-`dist/` constraint stands. It does not refresh `ki-agentic-harness` citations beyond the three pages that name a `tools-ki` ref, and it does not rewrite refs quoted in `docs/decisions/` or `docs/roadmap/`, where they are historical statements.

## Current state

`src/_data/cliCommands.json5` holds a snapshot parsed from `man/ki.1` at `v0.4.0`. The `ki` registry entry's `manual` field points at the same tag. Fourteen source files name that version in prose or data. The network sweep reports the upstream has moved; nothing in the repository records which newer ref the site should adopt or what changed between them.

## Steps

- [ ] Choose the target `tools-ki` release ref and record why that one — a tag the site can cite immutably, not a branch.
- [ ] Re-run `bun run --cwd apps/site sync:cli` at the chosen ref and read the diff to `cliCommands.json5` as evidence of what the release changed.
- [ ] Resolve any parser failure the newer manual causes, or record it as a handoff to `tools-ki` if the manual's shape regressed rather than the parser.
- [ ] Update the `manual` field in `projects.json5` and the prose citations and `sources` refs across the twelve affected pages.
- [ ] Reread the pages whose command counts or group names the diff changed, so prose and data agree.

## Files touched

- `apps/site/src/_data/cliCommands.json5`
- `apps/site/src/_data/projects.json5`
- `apps/site/src/projects/ki/*.md`
- `apps/site/src/projects/ki-agentic-harness/{installing-a-harness,onboarding,repositories}.md`

## Verify

- `bun run ki:site:clean && bun run ki:site:build` passes with every in-build gate.
- `bun run --cwd apps/site verify:guidance -- --network` reports no `tools-ki` drift.
- `grep -rl 'v0\.4\.0' apps/site/src` returns nothing.
- Spot-read the command inventory page against the chosen release's manual for group and count agreement.

## Dependencies / blocks

No local item blocks this. It depends on `tools-ki` having published a release worth adopting, which it has. If the newer manual proves unparseable for reasons the manual owns, the fix belongs in `tools-ki` and this item records the handoff rather than working around it locally.

## Documentation impact

### Decision Records

None expected. `ADR-KI-WEBSITE-003` already records the vendoring contract and states that refreshing means advancing one ref; performing that refresh does not change the decision. A Decision Record becomes necessary only if the parser must be loosened to accept a shape the manual no longer guarantees.

### Specifications

None. The `/install/<slug>` contract and the release-advance machinery are untouched.

### Guides

`docs/guides/developer/guidance-provenance.md` describes the refresh sweep and needs no change unless the sync procedure itself changes.

### Roadmap

A handoff item in `tools-ki` only if the manual's shape, rather than the site's parser, is what broke.

## Discussion

### Why this is not a find-and-replace

The version string is the visible part; the inventory behind it is the substance. Replacing `v0.4.0` with a newer tag everywhere would produce a site claiming to describe a release it has not read — the precise failure `ADR-KI-WEBSITE-001` was written about, where hand-written prose described 42 skills against an upstream 61. The sync runs first, the diff is read, and the prose follows the data.

### How often this should recur

Open question worth settling while doing it. A refresh triggered by a person noticing a warning is a refresh that happens when someone happens to look. Whether the site should instead track releases on a cadence, or accept staleness as the honest cost of a reproducible build, is a policy question this item can inform but should not decide unilaterally.

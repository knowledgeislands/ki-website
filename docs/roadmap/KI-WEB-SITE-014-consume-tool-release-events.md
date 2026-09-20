---
id: KI-WEB-SITE-014
area: SITE
title: Consume tool release events
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 664846a67ef123e70c2c61a6d8ecdf08879a56ae
created_at: 2026-09-19T17:39:47Z
updated_at: 2026-09-20T07:17:44Z
---

# Consume Tool Release Events

## Goal

The website should consume verified release notifications from a shared Knowledge Islands tools release bot without making website publication the bot's only purpose.

## Context

The existing receiver correctly validates a `tool-release-published` event and opens a reviewable registry pull request, but its credential names and guide describe a website-specific bot. The Homebrew tap is being generalized to fan the same verified event out to an opt-in consumer registry for any `tools-*` formula.

## Boundary

This item does not change the website registry schema, validation policy, public routes, merge authority, or deployment behaviour. It does not configure live GitHub App credentials.

## Current state

The event contract is already provider-neutral, but workflow settings use `KI_RELEASE_BOT_*` and documentation says the app is installed only on `ki-website`.

## Steps

- [x] Rename website workflow settings to the shared `KI_TOOLS_RELEASE_BOT_*` identity.
- [x] Document the website as one opt-in consumer of the generic release event and preserve its independent verification and pull-request boundary.
- [x] Run focused workflow, synchronizer, site, and repository verification.

## Files touched

- `.github/workflows/update-tool-release.yml`
- `docs/guides/tool-routes.md`
- `docs/roadmap/_ISSUES.md`
- `docs/roadmap/KI-WEB-SITE-014-consume-tool-release-events.md`

## Verify

```sh
bun test site/scripts/sync-tool-release.test.ts
bun run ki:site:clean
bun run ki:site:build
mise x actionlint@1.7.12 -- actionlint .github/workflows/update-tool-release.yml
ki repo audit --skill ki-authoring --repo .
ki repo audit --skill ki-work-roadmap --repo .
```

## Dependencies / blocks

The Homebrew tap must publish the same event through its generic consumer fan-out. Live delivery still depends on repository settings for the shared GitHub App, but missing credentials must fail closed.

## Documentation impact

### Decision Records

No new decision record is required; this retains the existing source, tap, and consumer authority boundaries.

### Specifications

No portable specification changes are required. The website remains one consumer of an existing event contract.

### Guides

Update the tool-routes guide to distinguish the shared release bot from the website's consumer-specific response.

### Roadmap

Coordinate with Homebrew tap item `BREW-004`; no further website work is expected once the generic event is proven reviewable.

## Review

### Delivered

Delivered the approved consumer generalization from baseline `664846a67ef123e70c2c61a6d8ecdf08879a56ae`, with implementation evidence at `effe558464dbda61873954107439f1cdf2bf67e3`. KI Website now identifies the shared tools release bot while preserving its existing verified event and reviewable registry-update behaviour.

### Summary of changes

Renamed workflow settings and commit identity to `KI_TOOLS_RELEASE_BOT_*` and `ki-tools-release-bot`; updated the tool-routes guide to make the tap's explicit fan-out and consumer autonomy clear. No registry schema, public route, synchronizer, merge, or deployment behaviour changed.

### Verification

The synchronizer suite passed 7 tests. Actionlint 1.7.12 passed the receiver workflow. The clean site build generated and verified all four tool routes. Focused `ki-authoring` and `ki-work-roadmap` audits passed. KI Website PR #3 `build` passed in GitHub Actions.

### Outstanding concerns

Live receipt and pull-request creation remain intentionally unavailable until the shared GitHub App is installed and `KI_TOOLS_RELEASE_BOT_APP_ID` plus `KI_TOOLS_RELEASE_BOT_PRIVATE_KEY` are configured in repository settings.

### Post-change review

The change leaves the website fail-closed and independently authoritative over its registry. The generic event still triggers only deterministic validation and a review branch; it cannot merge, deploy, or add a previously unknown tool.

### Mini recap

KI Website is now the first explicit consumer of the shared tools release bot rather than the bot's hard-coded destination. Local gates and hosted build CI pass; operational App provisioning remains the only live cutover step.

## Done

Accepted 2026-09-20 by Kris Brown on the review packet above, with authority to complete the operational cutover and prune the retained record after this closure lands.

The record was reviewed as `KI-WEB-SITE-013` and mechanically renumbered to `KI-WEB-SITE-014` during integration because remote `main` independently allocated `013`; its goal, delivered scope, and acceptance evidence did not change.

## Discussion

### Consumer ownership

The shared bot carries verified release evidence. Each consumer owns what it does with that evidence. The website will continue to revalidate the source release and tap formula before proposing a registry change.

### Credential identity

A generic credential name makes clear that the same narrowly installed GitHub App may dispatch to multiple opted-in repositories and let each consumer prepare its own bounded change.

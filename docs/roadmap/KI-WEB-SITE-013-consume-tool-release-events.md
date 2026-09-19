---
id: KI-WEB-SITE-013
area: SITE
title: Consume tool release events
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-19T17:39:47Z
updated_at: 2026-09-19T17:39:47Z
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

- [ ] Rename website workflow settings to the shared `KI_TOOLS_RELEASE_BOT_*` identity.
- [ ] Document the website as one opt-in consumer of the generic release event and preserve its independent verification and pull-request boundary.
- [ ] Run focused workflow, synchronizer, site, and repository verification.

## Files touched

- `.github/workflows/update-tool-release.yml`
- `docs/guides/tool-routes.md`
- `docs/roadmap/_ISSUES.md`
- `docs/roadmap/KI-WEB-SITE-013-consume-tool-release-events.md`

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

## Discussion

### Consumer ownership

The shared bot carries verified release evidence. Each consumer owns what it does with that evidence. The website will continue to revalidate the source release and tap formula before proposing a registry change.

### Credential identity

A generic credential name makes clear that the same narrowly installed GitHub App may dispatch to multiple opted-in repositories and let each consumer prepare its own bounded change.

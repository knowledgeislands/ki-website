---
id: KI-WEB-SITE-012
area: SITE
title: Automate release registry
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-19T09:26:42Z
updated_at: 2026-09-19T09:26:42Z
---

# Automate Tool Release Registry

## Goal

Verified Knowledge Islands tool releases should produce a reviewable website registry pull request with exact immutable version pins, without requiring a person to rewrite the same release URLs.

## Context

The website registry still advertises `ki` v0.3.6 after v0.4.0 was published and packaged in the Homebrew tap. The existing route verifier can report drift against GitHub's latest release, but it neither updates the registry nor creates a review boundary. The approved operating model makes the source tool repository release authority, uses a successful tap formula update as the downstream trigger, and leaves the website responsible for independently validating and publishing its registry.

## Boundary

The website will not resolve moving release state for visitors, accept unverified arbitrary repositories, merge its own pull request, or treat the Homebrew tap as release authority. GitHub App installation and secret provisioning remain repository settings rather than committed credentials.

## Current state

`site/src/_data/tools.json5` owns immutable installer, manual, and changelog pins. `site/scripts/verify-tool-routes.ts` validates those pins and can warn about newer releases. No workflow receives a verified tap event or prepares a registry pull request.

## Steps

- [ ] Add a typed, testable registry synchronizer that validates the tool, tag, source release, and tap formula before changing exact pinned URLs.
- [ ] Add a repository-dispatch and manual receiver workflow that uses a GitHub App token to create or update one deterministic pull request without committing directly to `main`.
- [ ] Advance the current `ki` registry and public guidance to v0.4.0 without retaining stale release claims.
- [ ] Document the credential, verification, review, and retry contract.
- [ ] Run focused tests, the full site build, and applicable repository audits.

## Files touched

- `.github/workflows/update-tool-release.yml`
- `site/scripts/sync-tool-release.ts`
- `site/scripts/sync-tool-release.test.ts`
- `site/src/_data/tools.json5`
- `site/src/guidance/cli/local-commands.md`
- `docs/guides/tool-routes.md`
- `docs/roadmap/_ISSUES.md`
- `docs/roadmap/KI-WEB-SITE-012-automate-tool-release-registry.md`

## Verify

```sh
bun test site/scripts/sync-tool-release.test.ts
bun run ki:site:clean
bun run ki:site:build
ki repo audit --skill ki-engineering --repo .
ki repo audit --skill ki-authoring --repo .
ki repo audit --skill ki-work-roadmap --repo .
```

Also exercise the synchronizer in check-only mode against the committed `ki` v0.4.0 release and Homebrew formula commit.

## Dependencies / blocks

The Homebrew tap dispatcher is coordinated follow-up work and must not be enabled until this receiver exists. Live dispatch requires a GitHub App installed on `knowledgeislands/ki-website` with repository contents and pull-request write permissions; absence of that repository setting must fail closed without weakening validation.

## Documentation impact

### Decision Records

No new Decision Record is required: this applies the existing source-labelled authority model and immutable installer-route contract rather than changing either decision.

### Specifications

No portable specification changes: the automation is website release operation, not executable behaviour.

### Guides

Update the tool-route guide with the event payload, GitHub App settings, verification order, pull-request boundary, and recovery procedure.

### Roadmap

Coordinate the receiver with the Homebrew tap's separately owned dispatcher item. No further website work is expected once the pull-request path is proven.

## Discussion

### Why build-time automation

The generated website must remain reproducible and available without a live GitHub API dependency. Automation therefore updates committed immutable data before deployment; visitors never resolve “latest” at request time.

### Why a pull request

A bot-authored pull request preserves a human review point, runs the ordinary website checks from an app-authored branch, and leaves deployment coupled to the existing merge path. A direct bot commit would make a distribution signal bypass the website's own review authority.

### Trigger authority

The tap event says that a formula commit passed its own checks. The receiver still verifies the exact source release and formula content. The event is evidence to inspect, not authority to publish arbitrary data.

---
id: KI-WEB-SITE-012
area: SITE
title: Automate release registry
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 96428b86a7c5599a62fb18eafcdd0a087c732e06
created_at: 2026-09-19T09:26:42Z
updated_at: 2026-09-19T09:53:50Z
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

- [x] Add a typed, testable registry synchronizer that validates the tool, tag, source release, and tap formula before changing exact pinned URLs.
- [x] Add a repository-dispatch and manual receiver workflow that uses a GitHub App token to create or update one deterministic pull request without committing directly to `main`.
- [x] Advance the current `ki` registry and public guidance to v0.4.0 without retaining stale release claims.
- [x] Document the credential, verification, review, and retry contract.
- [x] Run focused tests, the full site build, and applicable repository audits.

## Files touched

- `.github/workflows/update-tool-release.yml`
- `.github/workflows/ci.yml`
- `site/scripts/sync-tool-release.ts`
- `site/scripts/sync-tool-release.test.ts`
- `site/src/_data/tools.json5`
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

## Review

### Delivered

Delivered the approved receiver boundary from baseline `96428b86a7c5599a62fb18eafcdd0a087c732e06`, with implementation evidence at `467445dd64821b28adb0dc80ebca9a7fbba5cf14`. The website validates immutable source-release and exact Homebrew formula evidence, prepares one deterministic registry change, and opens or updates a reviewable pull request without committing to `main` or deploying.

### Summary of changes

Added `.github/workflows/update-tool-release.yml` and the typed synchronizer and tests under `site/scripts/`; advanced the `ki` registry and CI bootstrap pins to v0.4.0; and documented verification, credentials, retry, and review ownership in `docs/guides/tool-routes.md`. The receiver remains fail-closed and changes only an existing registry entry's immutable versioned URLs.

### Verification

`bun test site/scripts/sync-tool-release.test.ts` passed 7 tests; pinned Actionlint 1.7.12 passed both changed workflows; `bun run ki:site:clean` and `bun run ki:site:build` passed and verified four tool routes; focused `ki-engineering`, `ki-authoring`, and `ki-work-roadmap` audits passed. A whole-repository audit from the temporary worktree reported only runtime-activation and local-registry findings caused by the temporary physical root rather than repository content.

### Outstanding concerns

The GitHub App variable, private-key secret, installation permissions, and first live repository-dispatch run cannot be proven locally. Their absence fails the workflow closed and remains an operational setup step documented in the guide.

### Post-change review

The implementation stays within the approved repository-dispatch, verification, deterministic branch, and pull-request boundary. Focused tests cover malformed identities, conflicting formula evidence, immutable/latest release checks, idempotence, and downgrade refusal; the site build confirms the committed registry remains publishable. The item is ready for acceptance subject to the stated live-credential concern.

### Mini recap

KI Website now has a tested, review-preserving receiver for verified Homebrew release events and advertises `ki` v0.4.0. Verification is clean apart from environment-only findings in the temporary worktree; no additional durable learning route is required beyond the updated guide.

## Discussion

### Why build-time automation

The generated website must remain reproducible and available without a live GitHub API dependency. Automation therefore updates committed immutable data before deployment; visitors never resolve “latest” at request time.

### Why a pull request

A bot-authored pull request preserves a human review point, runs the ordinary website checks from an app-authored branch, and leaves deployment coupled to the existing merge path. A direct bot commit would make a distribution signal bypass the website's own review authority.

### Trigger authority

The tap event says that a formula commit passed its own checks. The receiver still verifies the exact source release and formula content. The event is evidence to inspect, not authority to publish arbitrary data.

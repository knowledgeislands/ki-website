---
id: KI-WEB-SITE-005
area: SITE
title: Scope site development scripts
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: f9927cd91730c2e02f3221142af241a4f90badc7
created_at: 2026-09-08T22:42:07Z
updated_at: 2026-09-08T22:42:07Z
---

# Scope site development scripts

## Goal

The content-site development implementation should use the capability-owned package-local command family while preserving the repository's public website command.

## Context

The website standard changed in `ki-agentic-harness` commit `e1b2595dbbbecfa2d838d82edb339153c9ba0357`. It now requires the selected Eleventy package to own `ki:site:dev`, `ki:site:dev:css` and `ki:site:dev:serve`, with the root public command delegating to the package's same key. This removes incidental bare development names from the package implementation.

## Boundary

This item changes only development-script names and their direct invocations. It retains bare package-local `build` and `clean`, adds no compatibility aliases, and does not change Cloudflare, deploy, preview or upload commands.

## Current state

The selected package exposes bare `dev`, `dev:css` and `dev:serve`, while the root `ki:site:dev` delegates to the bare package-local `dev`.

## Steps

- [x] Rename the package-local development family to `ki:site:dev*` and update its internal fan-out.
- [x] Make the root public command delegate to package-local `ki:site:dev`.
- [x] Check current direct references for the retired package-local names.
- [x] Run the engineering, website, content, roadmap, stale-reference, build and diff gates.

## Files touched

`package.json`, `site/package.json`, this work record and `docs/roadmap/_ISSUES.md`.

## Verify

Run focused `ki-engineering`, `ki-repo-website`, `ki-repo-website-content` and `ki-work-roadmap` audits; assert the retired bare development keys and active references are absent; build through `ki:site:build`; and run `git diff --check`.

## Dependencies / blocks

The governing contract is available in `ki-agentic-harness` commit `e1b2595dbbbecfa2d838d82edb339153c9ba0357`. No local build-order blocker remains.

## Documentation impact

### Decision Records

No local Decision Record is needed because the harness Decision Record and website standards own the cross-repository command contract.

### Specifications

No behaviour-level specification changes; the public development command and generated site behaviour remain stable.

### Guides

No guide change is needed because the documented public `ki:site:dev` command is unchanged and no current guide exposes the package-local implementation names.

### Roadmap

This receiver-local record captures the bounded rollout and its review evidence.

## Review

### Delivered

Against baseline `f9927cd91730c2e02f3221142af241a4f90badc7`, the selected package now owns the complete `ki:site:dev*` implementation family and the root public command delegates to its package-local counterpart. Bare package-local `build` and `clean` remain unchanged; no compatibility, Cloudflare, deploy, preview or upload change was made.

### Summary of changes

- Renamed `site/package.json` development keys and their internal fan-out to `ki:site:dev*`.
- Updated the root `ki:site:dev` delegation.
- Added this receiver-local work record and advanced the `SITE` issue ledger.

### Verification

- `ki repo audit --skill ki-engineering --repo .` passed.
- `ki repo audit --skill ki-repo-website --repo .` passed.
- `ki repo audit --skill ki-repo-website-content --repo .` passed.
- `ki repo audit --skill ki-work-roadmap --repo .` passed.
- Exact JSON assertions and current-orientation stale-reference searches passed.
- `bun run ki:site:build` and `git diff --check` passed.

### Outstanding concerns

None within this bounded migration.

### Post-change review

The change meets the approved command contract without altering the public entry point or adjacent lifecycle and hosting commands. Regression risk is limited to the renamed package-local development implementation, which is checked structurally and remains wired through the root seam. The item is ready for acceptance review.

### Mini recap

The Knowledge Islands content package and root now share the governed `ki:site:dev` seam, retired active references are absent, and every scoped gate passes. No follow-on work was identified within this item.

## Discussion

### Public and package seams

The root keeps the stable `ki:site:dev` entry point. Reusing that key in the selected package makes its implementation ownership explicit without changing the public interface.

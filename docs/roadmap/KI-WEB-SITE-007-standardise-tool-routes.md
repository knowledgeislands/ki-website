---
id: KI-WEB-SITE-007
area: SITE
title: Standardise tool routes
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-17T06:42:45Z
updated_at: 2026-09-17T06:42:45Z
---

# KI-WEB-SITE-007: Standardise tool routes

## Goal

Give every released Knowledge Islands command-line tool a consistent website page and stable installation endpoint without moving release authority out of its source repository.

## Context

KI Website owns the public tooling guide, but its current routes treat `ki` as a special case: `/tooling/cli/` is its product page and `/harness/install` redirects to the `tools-ki` installer. The live installer route still targets v0.2.6 while `tools-ki` has released v0.3.6, demonstrating that a manually maintained special route can drift from the tool release.

The canonical human route should be `/tooling/<tool>/`, with `/tooling/ki/` replacing `/tooling/cli/`. The canonical machine route should be `/install/<tool>`. The first complete set covers the four released tools already distributed through `knowledgeislands/homebrew-tap`: `ki`, `rig`, `mgit`, and `git-almanac`.

A single website-owned tool registry should provide each tool's identity, description, source repository, published version, Homebrew formula, installer target, maturity, manual, and changelog links. Website pages, navigation, tool cards, and installation redirects should derive from that declaration where practical. Each tool's release workflow should hand off its new immutable version and installer target to the website so the stable route advances deliberately and can be verified.

## Boundary

This work does not make KI Website the authority for executable behaviour, release artifacts, checksums, installers, package-manager state, or personal Rig publications. Those remain with the tool repository, GitHub release, Homebrew tap, or individual publisher respectively.

Do not retain compatibility routes for `/harness/install` or `/tooling/cli/`; remove them when their canonical replacements ship. Do not add website routes for unreleased or internally operated tools merely because their repositories use a `tools-*` name.

## Discussion

### Route contract

Use `/tooling/ki/`, `/tooling/rig/`, `/tooling/mgit/`, and `/tooling/git-almanac/` for human-readable product pages. Use `/install/ki`, `/install/rig`, `/install/mgit`, and `/install/git-almanac` for scriptable installer redirects. Documentation should prefer Homebrew when a formula exists and present the website installer endpoint as the stable curl route.

### Authority and trust

The website route is a discoverability and indirection layer, not a new artifact host. Each machine endpoint should redirect only to an installer from an explicit immutable release version. Verification should prove that the target exists and reports the registry's declared version; it should not follow `main` or silently select an upstream latest release.

### Release handoff

Updating the website registry should become a named release follow-up for each participating tool. The handoff must carry the exact version and immutable installer target, while website CI verifies the declared route data before deployment. The implementation should decide whether generated `_redirects` or another data-driven build surface provides the smallest auditable mechanism.

### Related guidance work

`KI-WEB-SITE-002` owns broad consolidation of public explanatory guidance. This item owns the narrower product discovery and installation route contract and can be delivered independently without blocking that future migration.

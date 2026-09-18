---
id: KI-WEB-SITE-011
area: SITE
title: Publish Rig v0.2 routes
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T06:46:03Z
updated_at: 2026-09-18T06:46:03Z
---

# KI-WEB-SITE-011: Publish Rig v0.2 routes

## Goal

Make the released Rig `v0.2.0` discoverable through the Knowledge Islands website's stable tool and installer routes.

## Context

`knowledgeislands/tools-rig` published `v0.2.0` on 2026-09-18. Its immutable installer is `https://raw.githubusercontent.com/knowledgeislands/tools-rig/v0.2.0/install.sh`, and its release page is `https://github.com/knowledgeislands/tools-rig/releases/tag/v0.2.0`.

Rig's release guide assigns public registry and stable-route ownership to this website. The intended routes are `/tooling/rig/` for people and `/install/rig` for installer indirection.

## Boundary

Website-only. This item publishes the registry page and installer route; it does not change Rig, republish its artifacts, own the `rig.midnight.ninja` renderer, or introduce compatibility routes for `/tooling/cli/` or `/harness/install`.

## Current state

The versioned release and Homebrew formula are published and verified. This website currently contains no Rig registry entry, `/tooling/rig/` page, or `/install/rig` route.

## Discussion

### Candidate steps

- [ ] Add a `/tooling/rig/` product page that describes the catalogue-led tool and advertises exactly `v0.2.0`.
- [ ] Add `/install/rig` as the stable installer route targeting the immutable `v0.2.0` installer.
- [ ] Link the GitHub release, source repository, manual or command documentation, and Homebrew installation path without copying source-owned documentation.
- [ ] Verify both routes return successful responses and resolve or advertise the same exact release.

### Dependencies / blocks

No prerequisite remains. This receiving-site handoff is non-blocking for the already published release.

### Documentation impact

The product page and installer route become the website-owned public orientation for Rig. Detailed command and schema documentation remains source-owned by `tools-rig`.

---
id: 'SITE-001'
title: Publish the KI user guide
status: in-progress
roadmap: site-experience/publish-the-ki-user-guide
blocks: —
blocked-by: —
baseline-ref: 5c1c0748016e9f4e3d56305d29b4369d3259943c
---

## Context

Knowledge Islands users need one public, navigable guide rather than separate copies in the harness and tool repositories.

The Website is the publication layer for the five-repository ecosystem and should own that guide's prose, information architecture, and stable `/tooling/` routes.

The guide must distinguish released behaviour from planned work, link to the owning contract or implementation where precision matters, and avoid becoming a competing executable or normative source.

## Current state

The Website now publishes a `/tooling/` entry point with focused pages for the KI CLI, compatible harnesses, and repository guidance. The global navigation and sitemap point to the new public guide.

Each page links to its owner for precision: `tools-ki` owns released CLI behaviour, installer detail, help, and release artefacts; the KI Agentic Harness owns its reusable capabilities and user guides; KI Specifications remains the owner of portable normative contracts.

The obsolete `/harness/` orientation page is removed from the source and clean generated output. Its stable installer and bootstrap redirects remain public routes; the guide uses the installer route without presenting the legacy bootstrap script as the CLI contract.

The source repositories already have the entry points this guide needs, so no outbound implementation brief is required. The authoring configuration was conformed to clear its pre-existing audit drift.

## Steps

1. ✓ Confirm the public `/tooling/` information architecture and source-of-truth boundaries across the Website, harness, and `tools-ki`; do not expand KI Specifications work.
2. ✓ Replace the `/harness/` orientation page with `/tooling/`, then create task-oriented pages for the CLI, compatible harnesses, and user guidance that distinguish shipped commands from genuinely planned work.
3. ✓ Write the public guide in the Website guide area from source-labelled current-state material, linking to the owning executable or contract where precision matters rather than copying it.
4. ✓ Confirm that no source-repository entry-point change is needed, so no outbound implementation brief is required. Each recipient retains ownership of any future documentation work.

The obsolete `/harness/` page and its shell-facing installation framing have no preservation or redirect requirement. The `/tooling/` guide will describe current executable behaviour without presenting legacy bootstrap scripts as a public contract.

## Files touched

- `site/src/tooling/`, the removed `site/src/harness/` page, and Website navigation or data files
- `.markdownlint-cli2.jsonc`, conformed to the house authoring configuration
- `docs/roadmap/site-experience/ROADMAP.md` and this plan

## Verify

- `ki repo audit --skill ki-roadmap`
- `ki repo audit --skill ki-authoring`
- `bun run ki:site:build`
- Check that every outbound brief names its recipient, source item, ownership boundary, and adoption condition

## Dependencies / blocks

The required native CLI command and multi-harness surfaces are shipped and remain the executable source of truth for this guide.

The stable installer redirect already targets the released `tools-ki` installer. SITE-001 must not present the legacy harness bootstrap script as the current public CLI contract.

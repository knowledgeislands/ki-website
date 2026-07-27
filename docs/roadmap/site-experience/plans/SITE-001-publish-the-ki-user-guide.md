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

The Website's existing `/harness/` page is an orientation to the KI Agentic Harness, but it is too narrow for the `ki` CLI platform, compatible harnesses, and task-oriented user guidance.

The harness has a `docs/guides/user/` tree of user-facing material, while `tools-ki` owns the shipped executable behaviour and HELP.

The Website has no `/tooling/` guide routes, tooling navigation, or public user-guide content.

The shared ecosystem decision already assigns public tooling-guide prose and routes to the Website, so no ownership-record change remains.

## Steps

1. Confirm the public `/tooling/` information architecture and source-of-truth boundaries across the Website, harness, and `tools-ki`; do not expand KI Specifications work.
2. Replace the `/harness/` orientation page with `/tooling/`, then create task-oriented pages for the CLI, compatible harnesses, and user guidance that distinguish shipped commands from genuinely planned work.
3. Write the public guide in the Website guide area from source-labelled current-state material, linking to the owning executable or contract where precision matters rather than copying it.
4. Send focused implementation briefs to the harness and `tools-ki` for any source-repository entry-point changes. Each recipient decides whether and when to adopt its own documentation work.

The obsolete `/harness/` page and its shell-facing installation framing have no preservation or redirect requirement. The `/tooling/` guide will describe current executable behaviour without presenting legacy bootstrap scripts as a public contract.

## Files touched

- `site/src/tooling/`, the removed `site/src/harness/` page, and Website navigation or data files
- `docs/roadmap/site-experience/ROADMAP.md` and this plan
- `-/_HANDOFFS/ki-agentic-harness/` and `-/_HANDOFFS/tools-ki/`

## Verify

- `ki repo audit --skill ki-roadmap`
- `ki repo audit --skill ki-authoring`
- `bun run ki:site:build`
- Check that every outbound brief names its recipient, source item, ownership boundary, and adoption condition

## Dependencies / blocks

The required native CLI command and multi-harness surfaces are shipped and are the executable source of truth for this guide.

SITE-002 owns the later installer redirect as separate recipient work. SITE-001 can build the guide before the first verified release, but must not publish the legacy harness installer as the current contract.

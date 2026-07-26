---
id: 'SITE-001'
title: Publish the KI user guide
status: open
roadmap: site-experience/publish-the-ki-user-guide
blocks: —
blocked-by: —
baseline-ref: —
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
3. Move or rewrite the public-facing harness guide material into the Website guide area without retaining copied user-guide prose in source repositories.
4. Reduce the harness to maintainer and contributor guidance, and replace public-guide references in the harness and `tools-ki` with links to the Website.

The obsolete `/harness/` page and its shell-facing installation framing have no preservation or redirect requirement. The `/tooling/` guide will describe current executable behaviour without presenting legacy bootstrap scripts as a public contract.

## Files touched

- `site/src/tooling/`, the removed `site/src/harness/` page, and Website navigation or data files
- `docs/roadmap/site-experience/ROADMAP.md` and this plan
- Relevant user-guide and entry-point documents in `ki-agentic-harness` and `tools-ki`

## Verify

- `ki repo audit --skill ki-repo-roadmap`
- `ki repo audit --skill ki-authoring`
- `bun run ki:site:build`
- Focused source-repository documentation audits and link checks for each edited repository

## Dependencies / blocks

The required native CLI command and multi-harness surfaces are shipped and are the executable source of truth for this guide.

CLI-006 owns the verified public release installer and the later install-redirect change. SITE-001 can build the guide before that release, but must not publish the legacy harness installer as the current contract.

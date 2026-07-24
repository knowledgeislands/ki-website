---
id: 'SITE-001'
title: Publish the KI user guide
status: open
roadmap: site-experience/publish-the-ki-user-guide
blocks: —
blocked-by: —
---

## Context

Knowledge Islands users need one public, navigable guide rather than separate copies in the harness and tool repositories.

The Website is the publication layer for the five-repository ecosystem and should own that guide's prose, information architecture, and stable `/tooling/` routes.

The guide must distinguish released behaviour from planned work, link to the owning contract or implementation where precision matters, and avoid becoming a competing executable or normative source.

## Current state

The Website's existing `/harness/` page is an orientation to the KI Agentic Harness, but it is too narrow for the `ki` CLI platform, compatible harnesses, and task-oriented user guidance.

The harness has a `docs/guides/user/` tree of user-facing material, including the target `ki` command surface, while `tools-ki` owns executable behaviour and HELP.

The Website has no `/tooling/` guide routes, tooling navigation, or public user-guide content.

## Steps

1. Confirm the public `/tooling/` information architecture and source-of-truth boundaries across the Website, harness, `tools-ki`, and KI Specifications.
2. Replace the `/harness/` orientation page with `/tooling/`, then create logical task-oriented pages for the CLI, compatible harnesses, and user guidance with clear current-versus-planned command availability.
3. Move or rewrite the public-facing harness guide material into the Website guide area without retaining copied user-guide prose in source repositories.
4. Reduce the harness to maintainer and contributor guidance, and replace public-guide references in the harness and `tools-ki` with links to the Website.
5. Update the ecosystem ownership record if needed so that public user-guide prose is explicitly Website-owned while behaviour, portable contracts, and reusable capabilities remain with their respective owners.

The obsolete `/harness/` page has no preservation or redirect requirement.

The existing `/harness/install` and `/harness/bootstrap` shell-facing installer endpoints are outside this page-route migration and remain governed by their own published contract.

## Files touched

- `site/src/tooling/`, the removed `site/src/harness/` page, and Website navigation or data files
- `docs/roadmap/site-experience/ROADMAP.md` and this plan
- Relevant user-guide and entry-point documents in `ki-agentic-harness` and `tools-ki`
- The shared ecosystem decision record only if the ownership wording requires correction

## Verify

- `bun .ki-meta/bin/aggregate.ts audit --skill ki-repo-roadmap`
- `bun run ki:authoring:audit`
- `bun run ki:site:build`
- Focused source-repository documentation audits and link checks for each edited repository

## Dependencies / blocks

The work is independent of implementation of the planned native CLI commands.

The guide will document released commands as current and clearly mark the multi-harness, scoped-skill target as planned until `tools-ki` ships it.

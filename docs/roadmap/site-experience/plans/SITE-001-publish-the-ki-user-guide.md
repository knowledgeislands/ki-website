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

The Website is the publication layer for the five-repository ecosystem and should own that guide's prose, information architecture, and stable routes.

The guide must distinguish released behaviour from planned work, link to the owning contract or implementation where precision matters, and avoid becoming a competing executable or normative source.

## Current state

The Website has no user-guide routes, guide navigation, or active guide plan.

The harness has a `docs/guides/user/` tree of user-facing material, including the target `ki` command surface, while `tools-ki` owns executable behaviour and HELP.

The public Website route model currently covers installation and repository bootstrap only.

## Steps

1. Confirm the public guide information architecture and source-of-truth boundaries across the Website, harness, `tools-ki`, and KI Specifications.
2. Create a Website guide area with a stable entry route, logical task-oriented pages, navigation, and clear current-versus-planned command availability.
3. Move or rewrite the public-facing harness guide material into the Website guide area without retaining copied user-guide prose in source repositories.
4. Reduce the harness to maintainer and contributor guidance, and replace public-guide references in the harness and `tools-ki` with links to the Website.
5. Update the ecosystem ownership record if needed so that public user-guide prose is explicitly Website-owned while behaviour, portable contracts, and reusable capabilities remain with their respective owners.

## Files touched

- `site/src/guides/` and Website navigation or data files
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

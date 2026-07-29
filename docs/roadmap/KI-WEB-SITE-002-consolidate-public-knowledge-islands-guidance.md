---
id: KI-WEB-SITE-002
title: Consolidate public Knowledge Islands guidance
theme: site-experience
horizon: future
status: open
candidate: true
blocks: []
blocked-by: []
baseline-ref: null
transferred-from: KI-HARNESS-GOV-006
---

## Context

Make the KI Website the coherent public home for user, prompting, and cross-skill-composition guidance across the six primary public Knowledge Islands repositories.

The primary public repositories are `ki-arcadia-principal`, `ki-agentic-harness`, `ki-plugins`, `ki-specifications`, `ki-website`, and `tools-ki`.

The current distributed guide footprint is small but fragmented: `ki-agentic-harness` contains user, prompting, and developer guides; `tools-ki` contains user and developer guides; the other four primary public repositories have no `docs/guides/` tree today.

The website should explain journeys rather than merely list repositories or skill families. The first exemplar is the repository-delivery composition: `ki-recap` identifies state, `ki-next` selects and shapes work, `ki-plan` makes it executable with `ki-delegate`, and a future `ki-batch` coordinates a human-authorised multi-plan preparation and implementation cycle.

The initial inventory must classify all public material in the six primary public repositories and assess the remaining organisation repositories: website guidance, repository-local developer documentation, executable reference, or material to retire. The resulting site information architecture should make a coherent story from first installation through repository activation, skill composition, planning, autonomous batches, plugins, and model/prompting guidance.

## Boundary

This is a wholesale, source-owned consolidation rather than piecemeal copying. The website becomes canonical for public explanatory guidance only after each coherent area has migrated and its old source has been removed or reduced to a durable pointer.

Repository-local developer guidance remains with its codebase and moves directly under `docs/developer/` when `docs/guides/` no longer has a public purpose. CLI help, the `tools-ki` manual, generated reference, capability contracts, SKILL.md instructions, and repository governance standards remain owned by their existing repositories; the website must link to them rather than duplicate volatile or executable detail.

The originating harness item is `KI-HARNESS-GOV-006`; this item does not block it. It may inventory and design the presentation while the harness establishes the canonical skill-composition and batch-authorisation model.

## Discussion

### Intended site structure

Start with task-oriented routes rather than a mirror of repository folders: getting started; install and operate KI; govern a repository; skill journeys; prompting and model selection; and contributor/developer off-ramps to the owning repositories.

### Migration discipline

Each migration slice must identify the website source file, old canonical path, links to preserve, owner of future refresh, and the exact deletion or pointer replacement. Do not leave two competing explanatory documents silently diverging.

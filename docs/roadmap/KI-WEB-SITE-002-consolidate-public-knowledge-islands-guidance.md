---
id: KI-WEB-SITE-002
area: SITE
title: Consolidate public guidance
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T11:42:36Z
updated_at: 2026-09-18T04:44:30Z
transferred_from: KI-HARNESS-GOV-006
---

# Consolidate public guidance

## Goal

Make the KI Website the coherent public home for user, prompting, and cross-skill-composition guidance across the six primary public Knowledge Islands repositories.

## Context

The primary public repositories are `ki-arcadia-principal`, `ki-agentic-harness`, `ki-plugins`, `ki-specifications`, `ki-website`, and `tools-ki`.

Public explanatory guidance has accumulated wherever it was first written rather than where a reader would look for it. A person who wants to know how to start using Knowledge Islands, which skill serves an outcome, or how to adopt the specifications has no single address, and the repositories that hold those explanations are the ones a reader is least likely to open.

The website already carries a substantial guidance corpus — `guidance/using-ki/`, `guidance/cli/`, `guidance/skills/`, and fourteen model pages under `guidance/prompting/`. What it lacks is a deliberate account of what still lives elsewhere and why, so consolidation can proceed from evidence rather than from impression.

The originating harness item is `KI-HARNESS-GOV-006`.

## Boundary

This is a wholesale, source-owned consolidation rather than piecemeal copying. The website becomes canonical for public explanatory guidance only after each coherent area has migrated and its old source has been removed or reduced to a durable pointer.

**This item delivers the first two steps only — the inventory and the migration design.** Step three, the migration itself, is gated by this item's own wording: each area migrates only once approved, and each migration needs a change in the repository that currently owns the source. Those are cross-repository, source-owned edits that this record cannot authorise, so each approved slice becomes its own item with a handoff to the owning repository.

The originating harness item is `KI-HARNESS-GOV-006`; this item does not block it. It may inventory and design the presentation while the harness establishes the canonical skill-composition and batch-authorisation model.

## Current state

No inventory exists. The six repositories have never been read against each other for overlapping or misplaced public explanation, so neither the size of the consolidation nor its correct destination is known.

## Steps

- [ ] Inventory the public explanatory material across the six primary repositories and classify each source's durable owner.
- [ ] Propose the task-oriented website information architecture and source-by-source migration slices.
- [ ] Migrate one approved guidance area at a time, leaving a pointer or removing the superseded source before requesting review.

## Files touched

- This work record, which carries the inventory and the migration design.
- One new roadmap record per proposed migration slice.
- Website guidance, navigation, and page-content files — only under an approved slice, not under this item.
- Source-repository guidance only through separately approved, source-owned changes.

## Verify

- Every public explanatory document in the six repositories appears in the inventory with exactly one classified durable owner.
- Each proposed slice names its source, its destination route, the links to preserve, and the exact deletion or pointer replacement.
- Each migrated area has one canonical public explanatory home and retained links remain valid.
- The website build, lint, and authored-content checks pass.

## Dependencies / blocks

This item is informed by `KI-HARNESS-GOV-006` and does not block it. The slices it proposes each depend on the owning repository accepting a handoff, so none can complete inside this repository alone.

## Documentation impact

### Decision Records

None yet. If a slice moves a document whose location is itself contested, that slice records the rationale; the inventory does not need one.

### Specifications

None. Consolidation moves explanation, not behaviour.

### Guides

None under this item. Slices that land guidance on the website change page content rather than `docs/guides/`.

### Roadmap

This record carries the inventory and the migration design, and spawns one record per slice.

## Discussion

### Intended site structure

Start with task-oriented routes rather than a mirror of repository folders: getting started; install and operate KI; govern a repository; skill journeys; prompting and model selection; and contributor/developer off-ramps to the owning repositories.

### Migration discipline

Each migration slice must identify the website source file, old canonical path, links to preserve, owner of future refresh, and the exact deletion or pointer replacement. Do not leave two competing explanatory documents silently diverging.

### Why the migration is not delivered here

The item was written as a single consolidation, but its third step already carries an approval gate and every slice needs an edit in a repository this one does not own. Delivering the inventory and the slice design gives that approval something concrete to act on, and keeps each cross-repository change reviewable on its own terms rather than buried in a large undifferentiated migration.

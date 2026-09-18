---
id: KI-WEB-SITE-002
area: SITE
title: Consolidate public guidance
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 6a88d252af609e1d00df3a1c6b3cc3653da56440
created_at: 2026-07-29T11:42:36Z
updated_at: 2026-09-18T04:52:00Z
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

**This item delivers the inventory and the migration design only.** The migration itself is gated by this item's own wording: each area migrates only once approved, and each migration needs a change in the repository that currently owns the source. Those are cross-repository, source-owned edits that this record cannot authorise, so each approved slice becomes its own item with a handoff to the owning repository.

The originating harness item is `KI-HARNESS-GOV-006`; this item does not block it. It may inventory and design the presentation while the harness establishes the canonical skill-composition and batch-authorisation model.

## Current state

The inventory is complete. Every public explanatory document in the six repositories has been read against the others and classified to exactly one durable owner.

| Repository | Public explanatory material | Durable owner |
| --- | --- | --- |
| `ki-agentic-harness` | `docs/guides/skills-by-outcome.md` | **Website** — outcome→skill routing is reader-facing and pairs with the site's skill catalogue.† |
| `ki-agentic-harness` | `docs/docs.md`, `docs/guides/developer/*`, `docs/diagrams/*` | Harness — already declares the split; contributor mechanics and generated diagrams are source-coupled. |
| `ki-specifications` | `docs/{adoption-guide,specification-process,numbering,versioning,architecture-context}.md` | Specifications — each is an informative section of the KIS corpus, versioned with it and anchored to `GOVERNANCE.md`. |
| `tools-ki` | `docs/guides/*` (seven operator guides) and `docs/guides/developer/*` | `tools-ki` — each describes a specific CLI version and several cite `docs/specs/`. |
| `ki-plugins` | `README.md`, `CLAUDE.md` only | `ki-plugins` — nothing to migrate. |
| `ki-arcadia-principal` | `Streams/`, `Pillars/`, `Resources/` | `ki-arcadia-principal` — a knowledge base, not public explanation. |
| `ki-website` | `guidance/{using-ki,cli,prompting,skills}` — 8 using-KI pages, 14 prompting model pages | Website — already canonical. |

† The harness keeps its generated capability catalogue in `skills/README.md`; that is source-owned inventory and stays.

## Steps

- [x] Inventory the public explanatory material across the six primary repositories and classify each source's durable owner.
- [x] Propose the task-oriented website information architecture and source-by-source migration slices.
- [x] Spawn one roadmap record per proposed slice, each carrying its own approval and, where needed, its handoff to the owning repository.

## Files touched

- This work record, which carries the inventory and the migration design.
- `docs/roadmap/KI-WEB-SITE-008-migrate-skill-outcome-routing.md`, `-009-add-specifications-adoption-page.md`, `-010-index-cli-operator-guides.md`.
- `docs/roadmap/_ISSUES.md`, advanced to `SITE: 10`.
- No website guidance, navigation, or page content is changed under this item, and no source repository is touched.

## Verify

- Every public explanatory document in the six repositories appears in the inventory with exactly one classified durable owner.
- Each proposed slice names its source, its destination route, and whether it needs a source-repository change.
- The website build, lint, and authored-content checks pass.

## Dependencies / blocks

This item is informed by `KI-HARNESS-GOV-006` and does not block it. `KI-WEB-SITE-008` depends on `ki-agentic-harness` accepting a handoff, so it cannot complete inside this repository alone; `009` and `010` are website-only.

## Documentation impact

### Decision Records

None. The inventory records classifications, not contested rationale; a slice that moves a document whose location is itself disputed records its own.

### Specifications

None. Consolidation moves explanation, not behaviour.

### Guides

None. `docs/guides/` covers operating this repository; the material inventoried here is site page content.

### Roadmap

This record carries the inventory and the migration design. Three slice records were spawned into Triage.

## Review

### Delivered

A complete cross-repository inventory of public explanatory material, each source classified to one durable owner, and three proposed migration slices captured as records that each carry their own approval gate.

The headline finding is that the consolidation surface is far smaller than the item assumed. Of the six repositories, four hold nothing that should move: `ki-plugins` has only a README, `ki-arcadia-principal` is a knowledge base, `ki-website` is already canonical, and `ki-specifications` holds informative sections that are versioned with the corpus they describe. The material that looked like a consolidation backlog is mostly correctly placed already — what is missing is routes into it from the website.

That reframes the work: one genuine migration (`skills-by-outcome.md`), and two link-and-index slices that need no source repository to change at all.

### Summary of changes

- Rewrote this record with the inventory table, the durable-owner classification, and the reason the migration is not delivered here.
- Added `KI-WEB-SITE-008` (migrate skill outcome routing), `009` (specifications adoption page), and `010` (index CLI operator guides) as `horizon: triage`, `status: draft`.
- Advanced `docs/roadmap/_ISSUES.md` to `SITE: 10`.

### Verification

- The inventory was taken by reading each repository's documentation roots directly, not from memory of them.
- Roadmap shape checked with `ki repo audit --skill ki-work-roadmap --repo .`.
- No site source changed, so the build gates are unaffected by this item.

### Outstanding concerns

`KI-WEB-SITE-008` cannot complete without `ki-agentic-harness` accepting a handoff. If the website publishes the outcome routing before the harness reduces its copy, the two diverge silently — the exact failure this item exists to prevent. The slice record says so, but the ordering depends on whoever adopts it honouring that.

The three slices are captured in Triage, which needs no approval. Adopting any of them into Now does.

### Post-change review

The item's original framing — "wholesale, source-owned consolidation" — implied a large migration and no inventory existed to test that. Reading the repositories first turned a vague backlog into three named slices, two of which are trivial. Doing the inventory before proposing any move was worth more than the move would have been.

The one structural thing worth keeping: the classification test that settled most entries was not "is this public?" but "does this document age with a version?". Everything in `ki-specifications` and `tools-ki` fails that test for the website and so stays put.

### Mini recap

Inventory and design delivered; three slices proposed in Triage. No guidance moved, and none can until each slice is approved and its owning repository agrees.

## Discussion

### Intended site structure

Start with task-oriented routes rather than a mirror of repository folders: getting started; install and operate KI; govern a repository; skill journeys; prompting and model selection; and contributor/developer off-ramps to the owning repositories.

### Migration discipline

Each migration slice must identify the website source file, old canonical path, links to preserve, owner of future refresh, and the exact deletion or pointer replacement. Do not leave two competing explanatory documents silently diverging.

### Why the migration is not delivered here

The item was written as a single consolidation, but its final step already carries an approval gate and the one true migration needs an edit in a repository this one does not own. Delivering the inventory and the slice design gives that approval something concrete to act on, and keeps each cross-repository change reviewable on its own terms rather than buried in a large undifferentiated migration.

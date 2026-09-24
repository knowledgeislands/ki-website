---
id: ADR-KI-WEBSITE-003
title: 'A Page Lives With What It Is About'
date: 2026-09-24
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
decision_depends_on: ['GDR-KI-WEBSITE-002', 'ADR-KI-WEBSITE-002']
---

# ADR-KI-WEBSITE-003: A Page Lives With What It Is About

## Context

The site had a top-level **Guidance** section holding thirty-five pages about how to use Knowledge Islands. It was the obvious arrangement and it produced a routing layer.

Measured across the built output: seventy links into GitHub across those thirty-five pages, six of them anchors whose entire text was `The full guide`, and a `## Sources` table as the last thing a reader met on nearly every page. The reader's final impression of a guidance page was that the real material was elsewhere — precisely the outcome [GDR-KI-WEBSITE-002](GDR-KI-WEBSITE-002-carrying-material-for-readers.md) was written to stop. A section named for a purpose had filled with pages that served it badly, and nothing in the arrangement made that visible, because a directory named `guidance` accepts anything anyone calls guidance.

The corpus split cleanly by owner when anyone asked the question: eight pages were `ki` material, twelve were `ki-agentic-harness` material, and fifteen belonged to no project at all — fourteen prompting guides for other vendors' models plus one page about a reader's own machine. The section had been holding three unrelated collections and describing them with one word.

[ADR-KI-WEBSITE-002](ADR-KI-WEBSITE-002-one-section-for-every-project.md) had already settled the same question one level up: every public repository gets one section, so "where is this repository described" has a single answer. It did not consider the pages _about_ a repository, which were in a different section entirely.

## Decision

**A page lives with the thing it is about.**

A guide to a project is a page of that project, at `apps/site/src/projects/<slug>/<page>.md`, published at `/projects/<slug>/<page>/` and listed by the project's own page. There is no general section for project-owned material, because a general section is what let those pages become a routing layer: a page filed under `guidance` is accountable to nothing in particular, while a page filed under `ki` is accountable to the reader who came to learn `ki`.

**The binding is the directory, not the page's frontmatter.** `src/projects/ki/ki.json5` sets `project` and `layout` for every page beside it. A guide is owned, styled, listed and given its way back up because of where it lives, not because somebody remembered a line. The alternative — each page declaring its own project — makes ownership something a page can get wrong in a way that renders perfectly.

**A page that belongs to no project lives with its own kind, under a name that says what that is.** `apps/site/src/prompting/` holds the model prompting guides; `apps/site/src/optional-tools/` holds the page about a reader's machine. They are separate because they are not one collection, and neither is named `guidance`, because a name that accepts anything is how the first section filled.

**The gate is the contract.** `apps/site/scripts/verify-guides.ts` requires of every project guide: a directory whose slug the registry lists, a directory data file that binds it, an opening claim in prose before the first heading, no anchor whose text names a destination rather than a fact, and an `order` that is a positive integer unique within its project. `verify-reachable.ts` holds all three published trees to the same standard: a page nothing links to fails the build.

## Consequences

- A reader looking for help with a project finds it on that project, one click from the page that told them the project exists. A reader looking for prompting guidance finds a section named for prompting.
- **The gate encodes the editorial judgement, so the judgement survives the author.** "No link text that hands the reader off" is the mechanical half of [GDR-KI-WEBSITE-002](GDR-KI-WEBSITE-002-carrying-material-for-readers.md)'s ownership test, and it is the half that keeps holding when nobody is watching. The half a machine cannot judge — whether the prose actually carries the material — still needs a person.
- **Reading order is a decision the build insists on.** `order` is required and unique per project because Eleventy sorts an unpositioned page last, so every guide added without one appends itself and a project's sequence decays toward the order things were written. The failure was silent, which is what made it worth gating.
- Moving a page is not a way to shed its provenance. `verify:provenance` reads all three published trees, so the `sources` declaration follows the page wherever it goes.
- **Two pages `ADR-KI-WEBSITE-002` relocated moved again.** The task guidance it took out of `/tooling/` now lives at `/projects/ki-agentic-harness/installing-a-harness/` and `/projects/ki-agentic-harness/repositories/`, which is where this decision puts material about the harness. That record's addresses for them are superseded by this one; its decision — that they were task guidance rather than tool pages — is not.
- Every retired address redirects. `/guidance/<collection>/<page>/` to the project that now owns the page, `/guidance/prompting/*` to `/prompting/`, `/guidance/recommended-tools` to `/optional-tools/`, and `/guidance` itself to `/prompting/`.
- The contract is worth adopting in `tools-ki` and `ki-agentic-harness`, whose own `docs/guides/` have the same failure available to them. That is a handoff to those repositories rather than something this one changes on their behalf.
- **The site can no longer file a page it has not decided about.** A page with no project and no collection of its own has nowhere to go, which forces the question at the point it is cheapest to answer.

## References

- [ADR-KI-WEBSITE-002](ADR-KI-WEBSITE-002-one-section-for-every-project.md) — one section per repository, the principle this extends from repositories to their pages.
- [GDR-KI-WEBSITE-002](GDR-KI-WEBSITE-002-carrying-material-for-readers.md) — the ownership test whose failure in the guidance section prompted this.
- [Project guides](../guides/developer/project-guides.md) — the contract each page meets, and the gate that enforces it.
- [Page reachability](../guides/developer/page-reachability.md) — the walk that proves every published page is on the far end of a link.

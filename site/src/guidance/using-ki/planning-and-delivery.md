---
layout: layouts/base.njk
title: Plan and deliver governed work
description: Turn a deep audit or transferred concern into implementation-ready, governed roadmap work.
permalink: /guidance/using-ki/planning-and-delivery/
---

# Plan and deliver governed work

The reusable pattern is a "deep audit to implementation-ready roadmap" request. It does not depend on legal work, Knowledge Islands, Streams, or even a software repository.

This is a reusable request template, not a competing planning standard. `ki-roadmap` owns repository-roadmap and work-item structure; `ki-plan` owns the current work-item lifecycle; `ki-delegate` owns delegation-ready execution.

## Live work lifecycle

The process skills form one continuous route from a live session into governed delivery:

```text
ki-recap → identifies unfinished or newly transferred work
     ↓
ki-next → triages, prioritises, and materialises it
     ↓
ki-plan → enriches the detailed work item and currently carries it through delivery
     ↓
ki-roadmap → owns horizons, work-item shape, links, and transition rules
```

The arrows show responsibility passing between processes; `ki-roadmap` is the governance foundation each process reads rather than merely the final execution step.

The intended process boundary is narrower: `ki-plan` will prepare an item to `ready`, planned `ki-implement` will take it from `ready` through `in-progress` to `acceptance`, and planned `ki-accept` will take accepted work to `done`. Those two skills are not shipped yet, so `ki-plan` remains the current lifecycle authority.

`ki-next` checks the current repository's `+/_HANDOFFS/` inbox automatically while grounding the portfolio. An unreviewed handoff, or a parked handoff whose named review trigger has fired, is presented for an adopt, park, clarify, decline, or supersede decision before ordinary work selection. A parked handoff whose trigger has not fired is acknowledged and skipped. No separate handoff invocation is required.

Adoption creates a recipient-owned work item at its honest horizon. Where transferred detail should be preserved, enrich that same item and name its origin without promoting it into the immediate queue. The inbox copy is then removed; the sender may remove its corresponding outbound copy once the durable destination is confirmed. Agent or model-tier delegation is a separate concern recorded in the item's `## Delegation` section and executed through `ki-delegate`.

## Generic principles

- Inspect the existing system thoroughly before proposing changes.
- Define an explicit scope and exclusions.
- Separate planning from implementation: change only the planning artefacts.
- Identify what already works and should be preserved.
- Find duplication, conflicting ownership, stale state, unclear status, and missing structure.
- Establish a target operating model with clear responsibilities and sources of truth.
- Record reasoning and rejected alternatives so implementers do not reopen settled decisions.
- Separate judgment-heavy decisions from mechanical execution.
- Decompose the migration into dependency-ordered, bounded plans.
- Make each plan executable by a cold, lower-reasoning agent.
- Include exact inputs, outputs, boundaries, escalation conditions, and pass/fail checks.
- Preserve existing information until a conservation or migration manifest proves nothing will be lost.
- Test the plans by giving them to someone without the original context.
- Continue around non-blocking uncertainty; record unresolved areas as explicit follow-up work.
- For long work, write regular checkpoints and create recoverable commits where appropriate.

## Reusable prompt

```text
I want a deep, planning-only audit of [topic, system, repository, process, or body of work].

The priority scope is:

- [area one]
- [area two]
- [shared or cross-cutting areas]

The following is out of scope:

- [exclusions]

Start by examining the current structure, conventions, documentation, workflows, status information, and active work. Spend enough time scanning to understand how the system actually operates, including places where practice differs from the documented model.

Do not implement the proposed changes. You may create or update only the dedicated planning footprint at [location or output format].

Before the main audit, raise any genuinely important questions or permission requirements. After that, work autonomously. If something cannot be resolved, continue with the parts that can be completed and record the unresolved area, its impact, and the follow-up needed.

Produce:

1. A proposal explaining:
   - what is working well and should be preserved;
   - what is unclear, duplicated, stale, overloaded, or missing;
   - the underlying causes rather than only the symptoms;
   - the recommended target model;
   - clear ownership and source-of-truth boundaries;
   - rejected alternatives and why they were rejected;
   - risks, safeguards, and migration principles;
   - measurable acceptance criteria.

2. A dependency-ordered roadmap showing:
   - foundational decisions and governance first;
   - work that can run concurrently;
   - migration and consolidation stages;
   - integration, cutover, and final acceptance;
   - anything deliberately deferred or out of scope.

3. A set of implementation-ready plans suitable for cold, lower-reasoning agents.

Each plan must state:

- the outcome and definition of done;
- dependencies and blockers;
- locked decisions that must not be reopened;
- questions that must be escalated;
- exact permitted inputs, outputs, and change boundaries;
- ordered implementation steps;
- which steps are judgment-heavy and which are mechanical;
- safe parallelisation and file or ownership boundaries;
- conservation or rollback safeguards;
- objective pass/fail verification;
- the handoff package for the next plan.

Do not let implementers infer unknown state, silently expand scope, or discard existing information. Unknowns must be verified, escalated, or explicitly preserved.

Test at least the foundation plans by giving them to a cold lower-tier reviewer with no inherited context. Revise them until that reviewer can execute them without rediscovering the architecture.

For a long-running filesystem task, write progress to the planning artefacts regularly and make stable, explicitly scoped checkpoint commits where authorised. Do not include unrelated changes.
```

A useful short name for this style of request is **planning-only architecture audit with cold-agent implementation handoffs**.

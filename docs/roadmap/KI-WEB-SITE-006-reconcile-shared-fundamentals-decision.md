---
id: KI-WEB-SITE-006
area: SITE
title: Reconcile Shared Fundamentals Decision
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 6b909e38b6167603e6de0e1234c96c10b97be239
created_at: 2026-09-16T09:08:39Z
updated_at: 2026-09-16T21:36:41Z
---

# Reconcile Shared Fundamentals Decision

## Goal

Reconcile KI Website's copy of `GDR-KI-FUNDAMENTALS-001` with the approved canonical shared-decision projection.

## Context

`KI-HARNESS-GOV-063` defines shared identity as a deterministic projection of Decision Record-owned fields and body, excludes only Knowledge Base `note_type`, and fails closed on unknown frontmatter. The common decision body now uses the current `ki-specifications` and `ki-website` repository names and states the projection contract.

## Boundary

Update only the KI Website copy after independent review. Do not add repository-local metadata, change the portable projection contract from this repository, or claim estate-wide reconciliation. Verification must compare the approved canonical projection and preserve receiver acceptance authority.

## Current state

KI Website retained the original 2026-08-06 projection and contains no repository-local frontmatter. The approved Harness projection updates the living decision date and replaces raw-copy wording with a deterministic shared-identity contract.

## Steps

- [x] Compare the KI Website Decision Record with the approved Harness projection.
- [x] Apply every decision-owned field and the complete body without adding repository-local metadata.
- [x] Verify Decision Record, authoring, and roadmap conformance.

## Files touched

- `docs/decisions/GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md`
- this roadmap record

## Verify

- The complete Decision Record is byte-identical to the Harness canonical projection.
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `git diff --check`

## Dependencies / blocks

No build-order dependency remains. The approved Harness projection is present and the user explicitly authorised receiver reconciliation on 2026-09-16.

## Documentation impact

### Decision Records

Reconcile the shared fundamentals decision in place with no receiver-local projection fields.

### Specifications

No portable specification changes; the record allocates repository authority rather than changing website behaviour.

### Guides

No guide changes; this reconciliation changes durable decision wording only.

### Roadmap

Advance this receiver record to Awaiting review and expose its accepted revision later to `KI-HARNESS-GOV-069`.

## Review

### Delivered

From immutable baseline `6b909e38b6167603e6de0e1234c96c10b97be239`, reconciled the KI Website shared fundamentals decision to the approved canonical projection without changing website content or behaviour.

### Summary of changes

Updated the living decision date and shared-identity wording. The full receiver record now matches the Harness canonical projection byte for byte.

### Verification

- Canonical projection comparison - PASS.
- `ki repo audit --skill ki-decision-records --repo .` - PASS.
- `ki repo audit --skill ki-authoring --repo .` - PASS.
- `ki repo audit --skill ki-work-roadmap --repo .` - PASS.
- `git diff --check` - PASS.

### Outstanding concerns

None inside the approved receiver boundary. Estate-wide completion remains owned by `KI-HARNESS-GOV-069` after human acceptance.

### Post-change review

The receiver copy now exactly matches the approved shared identity. The change is narrow, reversible through Git, and ready for acceptance.

### Mini recap

KI Website's decision projection is aligned, verified, and awaiting review; no site implementation changed.

## Done

Accepted 2026-09-16 by Kris Brown on the review packet above.

## Discussion

Origin: `KI-HARNESS-GOV-063`. This receiver work neither blocks nor is blocked by the Harness implementation. Completion should record the accepted KI Website revision for the later six-repository observation in `KI-HARNESS-GOV-069`.

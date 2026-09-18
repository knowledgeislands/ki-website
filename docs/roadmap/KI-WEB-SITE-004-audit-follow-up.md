---
id: KI-WEB-SITE-004
area: SITE
title: Resolve website audit
theme: site-experience
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-04T08:18:09Z
updated_at: 2026-09-18T04:44:30Z
---

# Resolve Website Audit

## Goal

Decide the disposition of the estate audit findings this candidate recorded, resolve any that are still real, and leave the repository auditing clean against its declared skills.

## Context

The estate audit of 2026-09-04 reported configuration, package ownership, Cloudflare guide, and roadmap metadata gaps. The candidate deliberately recorded them without treating any as accepted work, so each finding still needs an explicit disposition: a real gap to close, or a finding that no longer applies.

Several have since been closed by named items rather than by this one. `KI-WEB-SITE-003` settled upload ownership, `KI-WEB-SITE-005` scoped the development script family, and `KI-WEB-SITE-006` reconciled the shared fundamentals decision. That leaves this item responsible for the remainder and for the closing evidence that nothing is outstanding.

## Boundary

This item resolves repository-local audit findings only. It does not authorise deployment, Cloudflare dashboard changes, or any other remote mutation, and it does not reopen a finding another item has already accepted and closed.

Where a finding turns out to be a governance choice rather than a defect, the choice is recorded here and made in `.ki.toml`; it is not deferred to a new item.

## Current state

The repository declares eighteen skills and audits clean against all of them. The findings that remained after `003`, `005` and `006` were `COV-1` (a `docs/guides/**` collection with no `[skills.ki-guides]` declaration), `FILES-6` (unreconciled managed ignore blocks) and `IDX-1` (a missing agent memory index), all three closed in `ec0524c`.

## Steps

- [ ] Re-run the unscoped repository audit at all reporter levels and capture the finding set.
- [ ] Record each originally reported finding against its disposition: closed here, closed by a named item, or no longer applicable.
- [ ] Confirm no finding remains that would need promoting into separate work.

## Files touched

This work record only. The repository changes that resolved the findings landed under their own commits.

## Verify

`ki repo audit --repo .` reports `PASS` across every declared skill, and the same audit at `--reporter-levels all` emits no `FAIL` or `WARN`.

## Dependencies / blocks

No blocker remains. `KI-WEB-SITE-003`, `005` and `006` closed ahead of this item and have been pruned.

## Documentation impact

### Decision Records

None. Opting the guides collection into governance applies an existing harness standard; it establishes no new local rationale.

### Specifications

None. No observable site behaviour changes.

### Guides

None beyond `docs/guides/README.md`, which `ec0524c` added as the collection index the guides standard requires.

### Roadmap

This record carries the disposition and the closing evidence.

## Discussion

Review the exact findings, decide which represent real repository gaps, and separately promote any accepted work.

### Why the findings were closed rather than promoted

Each remaining finding was a small, mechanical conformance gap with an owning standard already declared or ready to declare. Promoting them into separate items would have cost more ceremony than the fixes themselves, and would have left the repository auditing dirty in the meantime for no gain.

---
id: KI-WEB-SITE-004
area: SITE
title: Resolve website audit
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: ca41f9a69c68da628066c7925f1f032f063287cb
created_at: 2026-09-04T08:18:09Z
updated_at: 2026-09-18T04:47:00Z
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

- [x] Re-run the unscoped repository audit at all reporter levels and capture the finding set.
- [x] Record each originally reported finding against its disposition: closed here, closed by a named item, or no longer applicable.
- [x] Confirm no finding remains that would need promoting into separate work.

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

## Review

### Delivered

Every finding the estate audit of 2026-09-04 recorded now has an explicit disposition, and the repository audits clean against all eighteen declared skills with no finding at any reporter level.

| Reported gap | Disposition |
| --- | --- |
| Configuration | Closed in `ec0524c`. `COV-1` wanted `[skills.ki-guides]` declared for the existing `docs/guides/**` collection; `FILES-6` wanted the managed ignore blocks reconciled. |
| Package ownership | Closed by `KI-WEB-SITE-003` (upload ownership) and `KI-WEB-SITE-005` (the `ki:site:dev` family). Both accepted and pruned. |
| Cloudflare guide | No longer applicable. `docs/guides/cloudflare.md` records the dashboard-owned settings, and its build and deploy command pair was confirmed correct against a live Workers Build in `01503f8`. |
| Roadmap metadata | Closed by `KI-WEB-SITE-006`, and by the `## Done` heading repair in `6f475b0` that `ITEM-3` required of accepted records. |

### Summary of changes

- No repository change was needed under this item. The three findings that were still open when it was promoted had already been closed in `ec0524c`, under the repository governance work that preceded this delivery.
- This record now carries the disposition table and the closing evidence.

### Verification

- `ki repo audit --repo .` reports `PASS` across 18 skills.
- The same audit at `--reporter-levels all` emits no `FAIL` and no `WARN`.

### Outstanding concerns

None. Nothing in the finding set warranted promoting into separate work.

One observation rather than a concern: the agent memory index that `IDX-1` wanted is outside the repository, under the local Claude project directory. It is real state that the audit reads, but it is not versioned here, so a fresh checkout on another machine will report that finding again until that machine's index exists.

### Post-change review

The candidate was right to record the findings without accepting them. Read four weeks later, most had already been resolved by named items, and the residue was three mechanical conformance gaps rather than the design questions the original wording implied. The cost of the delay was one audit that stayed dirty; the benefit was that no finding was promoted into an item before anyone knew whether it was real.

### Mini recap

The estate audit findings are fully dispositioned and the repository audits clean. No follow-on work was identified.

## Discussion

Review the exact findings, decide which represent real repository gaps, and separately promote any accepted work.

### Why the findings were closed rather than promoted

Each remaining finding was a small, mechanical conformance gap with an owning standard already declared or ready to declare. Promoting them into separate items would have cost more ceremony than the fixes themselves, and would have left the repository auditing dirty in the meantime for no gain.

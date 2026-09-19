---
id: KI-WEB-SITE-011
area: SITE
title: Publish Rig v0.2 routes
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: de5db12e5a6e17f0b6fdf4d15486a55b23694adb
created_at: 2026-09-18T06:46:03Z
updated_at: 2026-09-19T09:00:00Z
---

# Publish Rig v0.2 routes

## Goal

Make the released Rig `v0.2.0` discoverable through the Knowledge Islands website's stable tool and installer routes.

## Context

`knowledgeislands/tools-rig` published `v0.2.0` on 2026-09-18. Its immutable installer is `https://raw.githubusercontent.com/knowledgeislands/tools-rig/v0.2.0/install.sh`, and its release page is `https://github.com/knowledgeislands/tools-rig/releases/tag/v0.2.0`.

Rig's release guide assigns public registry and stable-route ownership to this website. The intended routes are `/tooling/rig/` for people and `/install/rig` for installer indirection.

## Boundary

Website-only. This item publishes the registry entry the routes are generated from; it does not change Rig, republish its artifacts, own the `rig.midnight.ninja` renderer, or introduce compatibility routes for `/tooling/cli/` or `/harness/install`.

It does not restate Rig's command or schema documentation. Those stay source-owned and are reached by link.

## Current state

The received handoff states that the website has no Rig registry entry, `/tooling/rig/` page, or `/install/rig` route. That is no longer accurate: `site/src/_data/tools.json5` already carries a `rig` entry and both routes are generated, but the entry advertises `v0.1.0`.

So the work is a version advance across the entry's four pinned fields, not a new route. The tap formula is already at `v0.2.0`, and `man/rig.1`, `README.md`, `CHANGELOG.md`, and `install.sh` all exist at that tag.

The tagline, description, icon, accent, and `preview` maturity remain accurate for `v0.2.0` and are left alone.

## Steps

- [x] Advance `version`, `installer`, `manual`, and `changelog` on the `rig` registry entry to `v0.2.0`.
- [x] Rebuild and confirm the generated page, installer route, and sitemap entry all advertise the same release.
- [x] Run the routes gate with `--network` to confirm the installer target resolves and no drift remains for Rig.

## Files touched

- `site/src/_data/tools.json5` — one registry entry, four fields.

## Verify

- `bun run ki:site:build` succeeds; the routes gate it runs reports no failure.
- `bun run --cwd site verify:routes -- --network` reaches the `v0.2.0` installer and reports no upstream drift for `rig`.
- `/tooling/rig/` and the `/install/rig` redirect both name `v0.2.0`.

## Dependencies / blocks

None. The release, its tag, and the Homebrew formula are already published, so this receiving-site handoff is non-blocking.

## Documentation impact

### Decision Records

None. Advancing a registry entry applies the existing tool-routes contract.

### Specifications

None.

### Guides

None. `docs/guides/tool-routes.md` already describes this handoff; it needs no change to cover another instance of it.

### Roadmap

This record, received from `tools-rig`.

## Review

### Delivered

`/tooling/rig/` and `/install/rig` now advertise and resolve `v0.2.0`. One registry entry changed; the page, the installer redirect, and the sitemap entry are all generated from it, so they cannot disagree.

The handoff described this as publishing new routes. It was not: the routes already existed at `v0.1.0`, and the real work was a four-field version advance. Checking that before acting is what kept this from becoming a duplicate entry.

### Summary of changes

- `site/src/_data/tools.json5` — the `rig` entry's `version`, `installer`, `manual`, and `changelog` advanced from `v0.1.0` to `v0.2.0`.

Tagline, description, icon, accent, and `preview` maturity were left as they were. The v0.2.0 changelog describes the same catalogue-led tool with the same pre-1.0 shape, so none of them had gone stale.

### Verification

- `bun run ki:site:build` exits 0 and its routes gate reports no failure.
- `bun run --cwd site verify:routes -- --network` reaches the `v0.2.0` installer and reports no drift for `rig`.
- `dist/tooling/rig/index.html` names `v0.2.0` and no other version; `dist/_redirects` carries `/install/rig` to the `v0.2.0` installer; the sitemap has its one entry.
- The tap formula at `homebrew-tap/Formula/rig.rb` is already on `v0.2.0`, so the two installation paths agree.

### Outstanding concerns

None for Rig.

The routes gate still warns that `ki` advertises `v0.3.6` against a published `v0.4.0`. That predates this item and belongs to `tools-ki`; it is noted only because the gate output appears in this item's evidence.

### Post-change review

The one lesson worth carrying: a received handoff describes the sending repository's release accurately and the receiving repository's state only by assumption. This record's "current state" was wrong in a way that would have produced a second `rig` entry had it been taken at face value. Future tool handoffs should have their current-state claim checked against the registry first — it costs one `grep`.

### Mini recap

Rig advanced to `v0.2.0` across both routes; verified against the live installer.

## Done

Accepted 2026-09-19 by Kris Brown on the review packet above.

## Discussion

The received record was written as though the routes did not exist. Worth noting for future tool handoffs: the sending repository knows its release, not the website's current registry state, so a handoff's "current state" is a claim to check rather than a fact to act on.

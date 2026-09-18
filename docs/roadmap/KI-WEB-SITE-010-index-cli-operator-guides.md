---
id: KI-WEB-SITE-010
area: SITE
title: Index CLI operator guides
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: d0c40b2b6b8ae499e5525eef3c0a5c17b2f5ce8e
created_at: 2026-09-18T04:50:00Z
updated_at: 2026-09-18T06:05:00Z
---

# Index CLI operator guides

## Goal

Make the `tools-ki` operator guides reachable from the website's CLI guidance without copying them.

## Context

`tools-ki/docs/guides/` holds seven operator guides — batch records, repository-local governance, Agora references, Granola acquisition, standing knowledge intake, VS Code management, and the collection index. The `KI-WEB-SITE-002` inventory classified all of them as source-owned: each describes behaviour of a specific CLI version and several cite `tools-ki/docs/specs/`, so the website cannot hold a copy that stays true.

The site already links `vscode-management.md` from `/guidance/cli/local-commands/`, which shows the pattern works; it is just applied to one guide out of seven.

## Boundary

Website-only. This adds an index that links the `tools-ki` guides at their released version; it copies none of them and changes nothing in `tools-ki`.

Guides for tools other than `ki` are out of scope until those tools have operator guides worth linking.

## Current state

`tools-ki` publishes six operator guides plus a collection index. `/guidance/cli/` links none of them; `/guidance/cli/local-commands/` links exactly one, `vscode-management.md`, and links it at `main` — a branch, which the tool-routes contract rejects for exactly the reason it applies here.

The registry advertises `ki` at `v0.3.6`. Only `repository-local-governance.md` existed at that tag; the other five landed by `v0.4.0`, which is released but not yet advertised.

## Steps

- [x] Add an operator-guides index under `/guidance/cli/` linking all six guides at an explicit release tag.
- [x] Repoint the existing `main` link in `/guidance/cli/local-commands/` at the same tag.
- [x] Record the registry drift rather than advancing the registry here.

## Files touched

- `site/src/guidance/cli/operator-guides.md` — new.
- `site/src/guidance/cli/index.md` — one link.
- `site/src/guidance/cli/local-commands.md` — one link repointed.

## Verify

- `bun run ki:site:build` emits `/guidance/cli/operator-guides/` and the routes gate passes.
- Every linked guide exists at the pinned tag.
- No link in the added or edited pages follows a branch.

## Dependencies / blocks

Advancing the `ki` registry entry is owned by `tools-ki` and is currently entangled with its in-flight release-governance work. This item does not wait on it and does not do it.

## Documentation impact

### Decision Records

None.

### Specifications

None.

### Guides

None. `docs/guides/` here covers operating this repository.

### Roadmap

This record only.

## Review

### Delivered

`/guidance/cli/operator-guides/` indexes all six `tools-ki` operator guides with a line each, linked from `/guidance/cli/`. Every documentation link on the pages this item touched now points at an explicit release tag; none follows a branch.

### Summary of changes

- `site/src/guidance/cli/operator-guides.md` — new index page.
- `site/src/guidance/cli/index.md` — one link added; the `ki(1)` manual link repointed off `main`.
- `site/src/guidance/cli/local-commands.md` — the `vscode-management.md` link repointed off `main`.

### Verification

- Every linked guide was confirmed present at `v0.4.0` with `git ls-tree`.
- `bun run ki:site:build` succeeds and emits `dist/guidance/cli/operator-guides/`.
- `bun run --cwd site verify:routes -- --network` passes with one warning, quoted below.
- `ki repo audit --repo .` reports `PASS` across 18 skills.

### Outstanding concerns

The `ki` registry entry is stale, and the routes gate says so:

```text
warning: ki: the registry advertises v0.3.6 but knowledgeislands/tools-ki has published v0.4.0;
advance the registry when that release is ready to be recommended
```

This matters here because five of the six guides did not exist at `v0.3.6`. The links are therefore pinned at `v0.4.0` — a real, immutable, released tag — while the site still recommends installing `v0.3.6`. A reader on the recommended version may find a guide describing behaviour they do not have.

The website did not advance the registry, deliberately. Advancing it is a release follow-up owned by `tools-ki`, and that repository has in-flight release-governance work at `KI-TOOL-CLI-074` covering exactly this cutover. Advancing it from here would pre-empt a decision this repository does not own, on a question another writer is actively working.

### Post-change review

The slice looked like pure link plumbing and turned out to be the one item that found a real defect: three site links following `main`, and a registry a release behind. The pinning rule in the tool-routes contract is what surfaced both — applying it to ordinary prose links, not just registry fields, was worth doing.

The unresolved tension is honest rather than fixed: pinned-at-`v0.4.0` documentation against a `v0.3.6` recommendation. Pinning at `v0.3.6` would have shipped five broken links, and pinning at `main` is what this item set out to remove.

### Mini recap

Six operator guides indexed and every touched link pinned; registry drift recorded, not resolved.

## Done

Accepted 2026-09-18 by Kris Brown on the review packet above.

## Discussion

Website-only. Link at the version the registry advertises rather than `main`, for the same reason `/install/<tool>` pins its target: a link that follows a branch silently stops describing the release a reader has installed.

Originating item: `KI-WEB-SITE-002`.

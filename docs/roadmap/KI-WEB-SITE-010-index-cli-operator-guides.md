---
id: KI-WEB-SITE-010
area: SITE
title: Index CLI operator guides
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T04:50:00Z
updated_at: 2026-09-18T04:50:00Z
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

## Discussion

Website-only. Link at the version the registry advertises rather than `main`, for the same reason `/install/<tool>` pins its target: a link that follows a branch silently stops describing the release a reader has installed.

Originating item: `KI-WEB-SITE-002`.

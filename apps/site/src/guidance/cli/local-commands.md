---
title: Local utility commands
description: Manage local KI capabilities, documentation locations, and supported machine projections.
permalink: /guidance/cli/local-commands/
sources:
  - repository: knowledgeislands/tools-ki
    path: man/ki.1
    ref: v0.4.0
    governs: 'The ki manage command surface and its local-only boundary'
    reviewed: '2026-09-21'
  - repository: knowledgeislands/tools-ki
    path: docs/guides/vscode-management.md
    ref: v0.4.0
    governs: 'The chezmoi ownership boundary and fail-closed behaviour of ki manage vscode'
    reviewed: '2026-09-21'
---

# Local utility commands

`ki manage search`, `ki manage cleanup`, and `ki manage docs` operate only on local KI state or fixed public documentation locations.

They do not discover a repository, fetch content, contact a registry, launch a browser, or activate a skill.

Use `ki manage search --help`, `ki manage cleanup --help`, and `ki manage docs --help` for exact grammar supported by the installed version.

## Search installed capabilities

Run `ki manage search <query>` with one non-empty query.

KI inspects only verified installed harnesses and matches the query case-insensitively against each harness identifier, capability kind, and capability name.

It prints matching capabilities in harness identifier, capability kind, and capability name order.

For example, `ki manage search bootstrap` can report the installed `ki-bootstrap` skill.

When no capability matches, the command succeeds and prints `No matching installed capabilities.`

## Report managed stale state

Run `ki manage cleanup` to report stale state that KI has explicitly recorded in a persisted, versioned KI-owned format.

V1 defines no such artifact format, so the command prints `No eligible managed stale state.` and does not change files.

It never treats cache contents, transaction-looking directories, unconfigured harnesses, links, or unknown files as stale merely from their names or locations.

## Print documentation locations

Run `ki manage docs [topic]` to print canonical public URLs.

With no topic, KI prints every location with an `Overview:`, `Site:`, `Manual:`, or `Roadmap:` prefix.

The supported single-location topics are `overview`, `site`, `manual`, and `roadmap`.

- `ki manage docs overview` prints this site's `ki` product page. `tools-ki` owns that string, and every released version of it is now out of date: up to `v0.3.6` it printed `/tooling/cli/`, and `v0.4.0` prints `/tooling/ki/`. Both redirect. The canonical page is [`/projects/ki/`](/projects/ki/), because a released tool is a project that ships a binary rather than a section of its own.
- `ki manage docs site` prints `https://knowledgeislands.info/`.
- `ki manage docs manual` prints `https://github.com/knowledgeislands/tools-ki/blob/main/man/ki.1`.
- `ki manage docs roadmap` prints `https://github.com/knowledgeislands/tools-ki/blob/main/ROADMAP.md`.

`ki manage docs` only prints the URL; it does not launch a browser or retrieve its content.

## Reconcile a VS Code projection

When a chezmoi source owns the machine's VS Code workspace files and shared agent trusted-folder inventory, `ki manage vscode check` compares that source state with the local KI repository registry without writing.

`ki manage vscode sync` previews a reconciliation. Add `--write` only after reviewing the plan, then review the resulting source changes with `chezmoi diff`. The command never runs `chezmoi apply`.

`ki manage vscode source create <repository>` similarly previews an opt-in OneDrive source store; add `--write` to create and associate it after review. See the [tools-ki VS Code projection management guide](https://github.com/knowledgeislands/tools-ki/blob/v0.4.0/docs/guides/vscode-management.md) for the ownership boundary and fail-closed behaviour.

{% include "partials/sources.njk" %}

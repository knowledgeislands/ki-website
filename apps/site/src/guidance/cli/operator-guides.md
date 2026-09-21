---
layout: layouts/base.njk
title: Operator guides
description: Index of the tools-ki operator guides, linked at the release they describe.
permalink: /guidance/cli/operator-guides/
sources:
  - repository: knowledgeislands/tools-ki
    path: docs/guides/README.md
    ref: v0.4.0
    governs: 'The operator guide collection this page indexes and links at a pinned tag'
    reviewed: '2026-09-21'
---

# Operator guides

`tools-ki` publishes its own operator guides for the workflows that need more than a `--help` page. They live with the executable because each describes a specific release and several cite the CLI's accepted-behaviour specifications, so this page links them rather than copying them.

The links below are pinned to `v0.4.0`. A guide describes the release it shipped with; following a branch would silently republish whatever `main` happens to hold.

- [Manage local VS Code projections](https://github.com/knowledgeislands/tools-ki/blob/v0.4.0/docs/guides/vscode-management.md) — the ownership boundary when a chezmoi source owns the machine's workspace files and trusted-folder inventory, and the fail-closed behaviour of `ki manage vscode`.
- [Repository-local governance](https://github.com/knowledgeislands/tools-ki/blob/v0.4.0/docs/guides/repository-local-governance.md) — using a repository-local `ki-self` skill for auditable rules that are specific to one repository and do not belong in a portable Harness skill.
- [Canonical batch records](https://github.com/knowledgeislands/tools-ki/blob/v0.4.0/docs/guides/batch-records.md) — the file mechanics `ki batch` provides around an already-approved set of Ready items, and the authority it deliberately does not grant.
- [Acquire Granola meetings](https://github.com/knowledgeislands/tools-ki/blob/v0.4.0/docs/guides/granola-acquisition.md) — activating the repository adapter, running read-only imports, and recovering resumable state safely.
- [Standing knowledge intake](https://github.com/knowledgeislands/tools-ki/blob/v0.4.0/docs/guides/standing-knowledge-intake.md) — the reciprocal grant that lets one repository retain a narrow class of another's knowledge without an itemised trade each time.
- [Associate external Agora references](https://github.com/knowledgeislands/tools-ki/blob/v0.4.0/docs/guides/agora-references.md) — declaring an ordinary Git repository that belongs in the working set without making it a Knowledge Islands member.

The [collection index](https://github.com/knowledgeislands/tools-ki/blob/v0.4.0/docs/guides/README.md) also covers the contributor guides for developing and releasing `tools-ki` itself.

{% include "partials/sources.njk" %}

---
layout: layouts/base.njk
title: Command-line interface
description: Understand what the KI CLI owns and where to find authoritative command help.
permalink: /guidance/using-ki/command-line-interface/
---

# Command-line interface

`ki` is the end-user Knowledge Islands command-line interface. It installs compatible harnesses, activates their capabilities in explicit scopes, and hosts native repository operations.

This page explains the command groups and their ownership boundaries. The installed command's `ki help` output and the [KI CLI page](/tooling/cli/) are the authority for exact, version-specific grammar.

## Bootstrap and diagnostics

`ki bootstrap` establishes the user environment: it detects supported local agent runtimes, creates the KI configuration when needed, installs the verified canonical harness, and activates the core user skills. It does not declare governance for a repository.

Use `ki bootstrap --refresh` to reconcile detected runtimes and recorded installed state. Use `ki diag` to inspect installation mode and paths, and `ki doctor` to check configuration, agents, harnesses, and user skills.

## Harness installation

The `ki harness` group manages the verified installed compatible-harness set. The canonical `knowledgeislands/ki-agentic-harness` is installed during bootstrap and cannot be uninstalled.

Installing another harness makes its registered capabilities available for explicit activation. It does not activate every capability or change a repository automatically.

## Skill activation

Skill activation always has an explicit scope:

- **User scope** makes a skill discoverable across configured user agent runtimes.
- **Repository scope** declares a skill in one repository's `.ki-config.toml` and creates only the managed runtime-discovery links required there.

A fully qualified capability name identifies both the provider and skill:

```text
knowledgeislands/ki-agentic-harness:ki-change-management-roadmap
```

A bare skill name is accepted only when exactly one installed harness provides it. Removal only reverses state whose ownership KI can prove; it does not uninstall the providing harness.

## Repository operations

The repository commands operate on capabilities declared by the selected repository:

```text
ki repo educate
ki repo audit
ki repo conform
```

- `educate` renders maintenance guidance for declared rubrics.
- `audit` runs their registered read-only operations.
- `conform` applies registered safe mechanical changes; its dry-run mode reports proposed changes without publishing them.

The host resolves operations only from verified installed harnesses. It does not execute repository-local wrappers, copied rubric runners, package aliases, or arbitrary skill scripts.

## Rubric publication and harness development

Harness maintainers can verify or refresh a skill's generated rubric publication through the `ki skill rubric` command group.

Local harness development is explicit. `ki dev on <path>` selects a validated checkout; `ki dev off` restores the verified canonical archive. A nearby checkout is never used implicitly.

## Installation and user-owned locations

Install the released CLI with Homebrew:

```bash
brew install knowledgeislands/tap/ki
```

KI data, configuration, cache, and state follow their KI-specific environment variables when set, then the corresponding XDG locations, then standard home-directory defaults.

## Errors and recovery

Commands refuse unknown options, ambiguous capabilities, unsafe paths, and unfamiliar managed state. Follow the recovery route named by the command rather than manually replacing or deleting KI-managed files.

Use:

```bash
ki help
ki help <command>
```

for the delivered grammar and [Install and get started](/guidance/using-ki/getting-started/) for the end-to-end setup path.

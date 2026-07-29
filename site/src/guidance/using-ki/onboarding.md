---
layout: layouts/base.njk
title: Onboard a repository
description: Connect a repository to native KI governance with explicit capability declarations, trusted harnesses, and CI.
permalink: /guidance/using-ki/onboarding/
---

# Onboard a repository to native KI governance

Knowledge Islands repository governance resolves declared capabilities from verified installed compatible harnesses and executes them through the native `ki` host.

The governing contract is [ADR-KI-HARNESS-012](https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md).

## Trust and installation

Each user has a KI XDG configuration and an installed compatible-harness set. `ki bootstrap` creates the configuration, installs the canonical `knowledgeislands/ki-agentic-harness`, and activates the core user skills for detected runtimes.

`ki harness install <harness-id>` adds another verified compatible harness. Installing a harness does not activate all of its capabilities or change a repository.

`ki` uses the standard XDG data, configuration, cache, and state locations. It does not define a separate KI home variable.

## Repository declaration and activation

A KI repository carries a regular `.ki-config.toml` at its Git worktree root. Each `[ki-<skill>]` table declares one governance capability.

Activate a repository skill with:

```bash
ki skill repo add <skill> --repo <repository>
```

The command resolves one installed provider, updates the repository declaration, and creates managed runtime-discovery links. It refuses ambiguous providers and unfamiliar destination state.

`ki skill repo remove` reverses only the declaration and links whose ownership KI can prove. User activation is separate and uses `ki skill user add` or `ki skill user remove`.

`ki-repo` owns the judgment about which capabilities a repository should declare.

## Native repository maintenance

The native operations are:

```bash
ki repo educate --repo <repository>
ki repo audit --repo <repository>
ki repo conform --repo <repository> --dry-run
```

They physically resolve the selected repository, read `.ki-config.toml`, validate declared dependencies, and load registered compatible operations from verified installed harnesses.

AUDIT is read-only. CONFORM applies only registered safe mechanical changes; `--dry-run` validates and reports without publishing. EDUCATE renders the declared rubric guidance.

Missing, incompatible, undeclared, ambiguous, or untrusted capabilities fail before an operation runs. `--skill <skill>` narrows an operation to one declared capability without changing repository coverage.

The host never invokes copied rubric runners, repository-local wrappers, a nearby checkout, or an ad hoc child-process fallback. Harness contributors select a local checkout explicitly with `ki dev on <path>`.

## CI and automation

CI must establish a compatible released `ki` and its required verified harness inventory before running:

```bash
ki repo audit --repo .
```

The governance audit runs before the repository test suite. Automation fails when acquisition, verification, registry loading, operation availability, or declared-skill resolution fails; it does not bootstrap a checkout-local executor.

The harness's pre-commit hook audits a complete staged snapshot when governed skill sources change. That snapshot includes unchanged siblings, shared providers, and the repository-local `ki-self` source where applicable.

## Existing repository-vendored state

The former models created `.ki/` or `.ki-meta/` executors and regular-file skill copies under repository runtime-discovery directories.

That material is now migration evidence, not an executor or a managed runtime link. Use the maintainer [retirement guide](https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/guides/developer/retiring-repository-vendored-ki.md) to map every consumer to its native replacement, prove generated ownership, and replace unchanged runtime copies through `ki skill repo`.

If legacy state is altered, partial, unfamiliar, linked, dangling, escaping, or concurrently changed, preserve it and stop. A passing legacy runner does not prove that native governance is available.

## Scope and recovery

User-owned state comprises the XDG configuration, installed harnesses, and managed user-runtime links. Repository-owned state comprises `.ki-config.toml`, managed repository-runtime links, the committed repository-local `ki-self` source, and writes proposed by registered native operations.

Use `ki doctor` for environment health, `ki diag` for installation mode and paths, `ki bootstrap --refresh` to reconcile configured inventory, and `ki help <command>` for exact grammar.

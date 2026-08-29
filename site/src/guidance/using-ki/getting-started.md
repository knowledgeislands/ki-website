---
layout: layouts/base.njk
title: Install and get started
description: Install the KI CLI, bootstrap compatible harnesses, activate skills, and govern a repository.
permalink: /guidance/using-ki/getting-started/
---

# Install and get started

Knowledge Islands uses the `ki` command to install verified compatible harnesses, activate skills in explicit scopes, and run repository governance.

## 1. Install `ki`

Install the released CLI with Homebrew:

```bash
brew install knowledgeislands/tap/ki
```

Confirm the executable and its paths:

```bash
ki --version
ki diag
```

The [optional tools](/guidance/using-ki/recommended-tools/) guide covers machine-level additions such as chezmoi, headroom-ai, and mcporter.

## 2. Bootstrap the user environment

Run:

```bash
ki bootstrap
```

`ki bootstrap` detects supported local agent runtimes, creates the KI XDG configuration, installs the verified canonical `knowledgeislands/ki-agentic-harness`, and activates the core user skills.

Use `ki bootstrap --refresh` later to redetect agents and reconcile the recorded installed inventory. `ki doctor` reports the current environment and gives recovery guidance.

## 3. Install another harness when needed

The canonical harness is installed by bootstrap. Add another compatible harness only when a required capability comes from it:

```bash
ki harness install <harness-id>
ki harness list
ki harness info <harness-id>
```

Installing a harness makes its registered capabilities available for explicit activation; it does not activate all of them.

## 4. Activate a skill in the right scope

Use user scope when a skill should be available across configured agent runtimes:

```bash
ki skill user add <harness-id>:<skill-name>
```

Use repository scope when a skill governs one existing KI repository:

```bash
ki skill repo add <harness-id>:<skill-name> --repo <repository>
```

The repository command updates that repository's `.ki.toml` and creates only the managed runtime-discovery links for the selected skill. A bare skill name is accepted when exactly one installed harness provides it.

## 5. Govern a repository

A repository declares its coverage in `.ki.toml`. Run:

```bash
ki repo educate --repo <repository>
ki repo audit --repo <repository>
ki repo conform --repo <repository> --dry-run
```

`ki repo educate` explains the declared rubrics. `ki repo audit` runs their registered read-only operations. `ki repo conform --dry-run` validates and reports safe proposed changes without publishing them; omit `--dry-run` only after reviewing the proposal.

Use `--skill <skill>` to narrow any repository operation to one declared capability.

The native host resolves declared capabilities from verified installed harnesses. It does not execute repository-local wrappers, copied rubric runners, nearby checkouts, or package aliases.

## Existing repositories with `.ki/`

Former repository-vendored `.ki/` state is migration evidence, not an execution fallback.

Keep unfamiliar legacy state in place until the maintainer [retirement guide](https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/guides/developer/retiring-repository-vendored-ki.md) proves its native replacement and ownership. Do not recreate it or remove it piecemeal.

## Start using skills

Once a required skill is active in the relevant scope, describe what you need in plain language or use the runtime's skill invocation mechanism.

[Use skills](/guidance/using-ki/using-skills/) explains both approaches. [Onboard a repository](/guidance/using-ki/onboarding/) gives the detailed trust, activation, CI, and migration boundaries.

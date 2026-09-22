---
title: Guidance
description: Every published Knowledge Islands guide, grouped by the question it answers — installing a harness, governing a repository, using the CLI, choosing a skill, and prompting a specific model.
permalink: /guidance/
sources: original
---

# Guidance

Thirty-three pages of it, in six collections. Each collection answers a different question, and the fastest way through is to find yours below rather than to read in order.

## Start here

**I have nothing installed yet.** [Harnesses](/guidance/harnesses/) covers `ki bootstrap` — what it detects, what it installs, and why activation stays something you decide rather than something that happens to you. [Getting started](/guidance/using-ki/getting-started/) picks up from there.

**I want to put a repository under governance.** [Repositories](/guidance/repositories/) covers activating a skill in repository scope and the `educate` / `audit` / `conform` cycle that makes a repository's declared governance inspectable and safely fixable.

**I know what I want to achieve but not what does it.** [Choose a skill by outcome](/guidance/skills/by-outcome/) routes a plain-language goal to the smallest capability that serves it.

## The collections

### [Using KI](/guidance/using-ki/) — how the day-to-day actually works

Eight pages on working this way once the tools are in place: onboarding a person or a repository, planning and delivery, tuning an agent's behaviour, using skills, the command-line interface, and which tools are worth having alongside. This is the collection to read through rather than dip into.

### [Skills and journeys](/guidance/skills/) — what the harness can do

Three pages. [Skills and journeys](/guidance/skills/) explains what a skill is, the two kinds — governance skills that hold a standard, process skills that drive a lifecycle — and how the repository-delivery set passes work from one to the next. [Choose a skill by outcome](/guidance/skills/by-outcome/) is the routing table. [The skill catalogue](/guidance/skills/catalogue/) is the full inventory of every published capability, taken verbatim from the harness's own generated block at a pinned commit, so it cannot describe a skill that is not there.

The catalogue is the longest page on this site and the one most often looked for. If you are hunting for a skill name, go straight to it.

### [KI CLI](/guidance/cli/) — what the commands do

Six pages on the `ki` command surface: the capability lifecycle, the local repository operations, keeping an installation current with `update` and `upgrade`, the operator guides, and capturing a local ChatGPT export. The installed `ki --help` is always the authority for exact grammar at your version; these pages are for understanding what each group of commands is _for_.

### [Prompting](/guidance/prompting/) — getting good work out of a specific model

Fourteen pages: an index and thirteen model-specific guides, covering both frontier and open-weight models — the Claude family, GPT-5, Gemini 3, DeepSeek, Qwen, Llama, Mistral, GLM, and Gemma. Each says how that model responds to instruction, where it needs more structure, and where it needs less. Governance config names portable model _types_ rather than vendor model names, so these guides describe behaviour you can map onto whatever you are running.

### [Harnesses](/guidance/harnesses/) and [Repositories](/guidance/repositories/) — the two setup tasks

One page each, both task-shaped: install a compatible harness and activate capabilities in an explicit scope; then make one repository's governance explicit and inspectable.

## Where this material comes from

These pages restate things other repositories own — the harness owns capability content, `tools-ki` owns the command surface, the principal knowledge bases own the reasoning. Every page here declares the upstream documents it was written from and the commit or tag it read them at, published at the foot of the page, and a build-time check refuses a page that declares neither sources nor authorship of its own. Where the material is an inventory that changes with every release, this site vendors the upstream block rather than paraphrasing it.

That is deliberate, and it is the reason these pages try to answer your question here rather than sending you to a repository to find it.

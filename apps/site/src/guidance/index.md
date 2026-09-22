---
title: Guidance
description: The guidance that belongs to no single project — how to prompt thirteen frontier and open-weight models, and which optional tools are worth having on the machine alongside Knowledge Islands.
permalink: /guidance/
sources: original
---

# Guidance

Two collections live here: prompting guides for the models you actually run, and the optional tools worth having on the machine alongside them. Neither belongs to a Knowledge Islands project, which is why they are here rather than there.

Everything about using a project — the `ki` command surface, installing a harness, governing a repository, choosing a skill — is written on that project's own pages. [`ki`](/projects/ki/) carries the command-line guides; [`ki-agentic-harness`](/projects/ki-agentic-harness/) carries the capability and governance guides. A guide sits with the thing it is about, and the project page lists its own.

## [Prompting](/guidance/prompting/) — getting good work out of a specific model

Fourteen pages: an index and thirteen model-specific guides, covering both frontier and open-weight models — the Claude family, GPT-5, Gemini 3, DeepSeek, Qwen, Llama, Mistral, GLM, and Gemma. Each says how that model responds to instruction, where it needs more structure, and where it needs less.

The index is the part to read first. It maps the portable model _types_ that governance configuration names — `frontier`, `reasoning`, `standard`, `fast` — onto the vendor models available today, so a repository can declare the shape of work it needs without naming a model that will be superseded.

## [Optional tools](/guidance/recommended-tools/) — what else is worth having

One page, covering the machine-level tools that make this way of working easier without being part of it: dotfile management, context compression, MCP server consolidation, and the managed alternatives where a vendor already solves the same problem. None is required, each is independently useful, and the page says what each one costs as well as what it gives.

## Why these two are here

The rest of this site is organised by what owns a thing. These two collections have no owner in that sense: they describe models published by OpenAI, Google, Anthropic, Mistral, DeepSeek, Alibaba, Meta and Z.ai, and tools published by their own authors. The material is written here, from vendor documentation read at a stated date, and each page names what it was written from at the foot.

That is a different relationship from a project guide, which restates something a Knowledge Islands repository owns. Both declare where they came from; only one has somewhere else to live.

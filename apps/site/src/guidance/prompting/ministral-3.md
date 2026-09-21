---
title: Prompting Ministral 3 (Mistral edge models)
description: Model-specific prompting guidance for the Ministral 3 family.
sources:
  - url: https://huggingface.co/mistralai/Ministral-3-14B-Instruct-2512
    title: 'Ministral-3-14B-Instruct-2512 (Hugging Face)'
    governs: 'Instruct sampling, system prompt, serving'
    reviewed: '2026-07-09'
  - url: https://huggingface.co/mistralai/Ministral-3-14B-Reasoning-2512
    title: 'Ministral-3-14B-Reasoning-2512 (Hugging Face)'
    governs: 'Reasoning sampling, `[THINK]` blocks, output length'
    reviewed: '2026-07-09'
  - url: https://mistral.ai/news/mistral-3/
    title: 'Introducing Mistral 3'
    governs: 'Family overview, sizes, licence'
    reviewed: '2026-07-09'
---

# Prompting Ministral 3 (Mistral edge models)

How to prompt Mistral's Ministral 3 (2512) family — the 3B/8B/14B edge models, in base, instruct, and reasoning variants, under Apache 2.0. Read the shared [Prompting guides](/guidance/prompting/) principles first; this guide carries only what is distinctive to them. This is reference for when you run Ministral locally, target it, or evaluate it. (The larger Mistral Small sits above this line; the 14B Instruct is roughly comparable to it.)

## When to reach for it

Ministral 3 is Mistral's local/edge line — small enough for a laptop or single GPU, permissively licensed, with image understanding and a 256k context. Reach for it when data stays on-device or cost rules out a hosted model; pick the reasoning variant for multi-step problems, the instruct variant for everything else.

## Prompting principles

- **Always use a system prompt — and load Mistral's.** These models adhere strongly to system prompts. Append the official `SYSTEM_PROMPT.txt` (loaded from the model repo, not hardcoded) to your own; for agentic use it defines the environment and how to use tools. For date-sensitive work, format the current date into it.
- **Set temperature by variant.** Instruct: low — `~0.15`, and below `0.1` for production determinism. Reasoning: `1.0` per the official card (top-p `0.95`), higher latitude for creative use. These differ sharply, so pick per variant rather than sharing one default.
- **Reasoning variant uses `[THINK]` blocks.** Its chain-of-thought runs inside `[THINK]…[/THINK]`; keep multi-turn thinking traces in context across turns. Size output generously — ~32k tokens for reasoning, ~16k for instruct.
- **Keep the tool set minimal.** For agentic use, define tools tightly and limit their number to what the task needs — don't overload it.
- **Serve with the Mistral tokenizer.** Reliability depends on the runtime: use vLLM with `--tokenizer_mode mistral --config_format mistral --load_format mistral` (and the Mistral tool-call parser) rather than a generic template.

{% include "partials/sources.njk" %}

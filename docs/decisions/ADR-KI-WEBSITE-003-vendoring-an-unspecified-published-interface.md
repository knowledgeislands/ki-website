---
id: ADR-KI-WEBSITE-003
title: 'Vendoring an Unspecified Published Interface'
date: 2026-09-22
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-WEBSITE-003: Vendoring an Unspecified Published Interface

## Context

`/guidance/cli/` was the shortest page on the site: 133 words and a link to `tools-ki`. A reader who wanted to know what `ki` can do had to leave the site. [The ownership test](../guides/developer/guidance-ownership.md#the-test) says the site should carry that, and GDR-KI-WEBSITE-002 says a repository link survives as a fact rather than as a destination.

Writing the inventory out by hand was the option to reject. Eighty-eight commands across fourteen groups change every release, and that is exactly the material that rotted in the skill catalogue — 42 entries published against an upstream 61, with nothing noticing. ADR-KI-WEBSITE-001 settled that case by vendoring the harness's marker-delimited catalogue block.

This case is different in one way that matters. The harness _specifies_ its catalogue block: `ki-repo-harness` names the markers, fixes the fields, and its own rubric tests assert them, so the site consumes a contract. `tools-ki` publishes `man/ki.1`, which is a complete grouped inventory and is shipped with every release — but nothing names it as an interface, nothing fixes its structure, and no test upstream asserts that its shape holds. It is published, not specified.

The manual also proved to be internally inconsistent at `v0.4.0`. Its SYNOPSIS lists fourteen command groups; its COMMAND GROUPS reference section lists thirteen, omitting Batch records and its four commands entirely, and the two sections had drifted on at least one command's options. A parse of the reference section alone would have published a page claiming to list every command while being four commands short, with nothing to say so.

## Decision

The site vendors `man/ki.1` at a pinned release anyway, and makes the parse carry the burden that a specification would otherwise carry.

`apps/site/scripts/sync-cli-commands.ts` fetches the manual at an immutable ref, parses both inventory sections, reconciles them, and writes `apps/site/src/_data/cliCommands.json5`. Three properties do the work a contract would have done:

- **It refuses rather than degrades.** Every roff construct the parser does not recognise throws, as does a group without a purpose, a command without a description, a duplicate, or a total below a structural floor. A manual whose shape changed stops the sync; it does not quietly publish half an inventory.
- **It reconciles the two sections rather than trusting one.** A group present in SYNOPSIS and absent from COMMAND GROUPS is carried with the synopsis's own descriptions and marked `omittedFromReference`, and the page says so in place of that group's purpose. The site publishes the upstream gap rather than inheriting it silently.
- **It vendors only the inventory.** The framing, the routing, and the judgement about which commands matter stay site-authored prose that regeneration cannot overwrite.

## Consequences

- The command reference cannot describe a command that no longer exists, or omit one that does, without the next `sync:cli` run failing or showing the difference.
- The site takes a standing dependency on an interface nobody promised to keep stable. That is the cost of the decision, accepted knowingly: a manual restructure breaks the sync loudly at the next ref bump, and the page keeps publishing the last good pinned snapshot until someone looks. This is strictly weaker than the ADR-KI-WEBSITE-001 case and should not be mistaken for it.
- A handoff to `tools-ki` is therefore owed, and unlike the catalogue case it is a real request rather than a formality: a machine-readable command projection, or a named and tested contract over the manual's structure, would let this parse become a consumer of a specified interface. It is recorded as `KI-TOOL-CLI-080` in `tools-ki`, which owns its priority.
- The site now reports an upstream documentation defect to its own readers. That is the right side to err on — a reader who sees "the reference section does not carry this group" knows more than a reader who sees nothing — but it does mean site output is shaped by upstream quality in a way ordinary prose is not.
- Vendoring is no longer a single-page exception. Two pages are now generated from upstream data, and [the provenance guide](../guides/developer/guidance-provenance.md) describes the pattern rather than the instance.

## References

- [ADR-KI-WEBSITE-001](ADR-KI-WEBSITE-001-vendoring-the-harness-capability-catalogue.md) — the specified-interface case this extends.
- [GDR-KI-WEBSITE-002](GDR-KI-WEBSITE-002-carrying-material-for-readers.md) — the ownership test that makes carrying the inventory the requirement.
- [Guidance provenance](../guides/developer/guidance-provenance.md) — declaration, the sweep, and the vendored case.
- `KI-WEB-SITE-022` — the item that delivered the vendored reference; `KI-TOOL-CLI-080` in `tools-ki` — the handoff it raised.

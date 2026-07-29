---
layout: layouts/base.njk
title: Skill catalogue
description: Browse every capability in the canonical Knowledge Islands harness and learn when to use it.
permalink: /guidance/skills/catalogue/
---

# Skill catalogue

Every skill in the harness, grouped by [source domain](/guidance/skills/#the-skill-domains). Each entry says what the skill governs and when to reach for it.

## Agentic systems

### `ki-harness`

Audits, conforms, and scaffolds a **harness repository** — the container that bundles the other parts: the five-part `skills/` / `subagents/` / `mcp/` / `evals/` / `hooks/` layout, the root `CLAUDE.md` / `ROADMAP.md` / `package.json` script families / `.ki-config.toml` table, and the delivery conventions that make its components available. Governs the **container, not the contents**: it depends on `ki-skills`, `ki-subagents`, `ki-decision-records`, and `ki-roadmap`, while coverage separately selects `ki-mcp`, `ki-engineering`, and `ki-repo` when their concerns apply. Empty shelves are valid — a shelf is not a gap.

### `ki-mcp`

Audits, conforms, and scaffolds workspace MCP servers against the "workspace MCP" standard (layout, config injection, `<app>_<resource>_<action>` tool naming, access-level gate, security invariants, Bun/Node, tooling) across the `mcp-*` repos.

### `ki-plugins`

Audits, conforms, and scaffolds a Knowledge Islands **plugin-marketplace** repo — the generated Claude plugin marketplace that projects the harness's skills and agents onto the Cowork surface (`knowledgeislands/ki-plugins`, `ADR-KI-HARNESS-002`). It governs the on-disk projection (the `marketplace.json` / `plugin.json` manifests, the verbatim `skills/` copy and flattened `subagents/`, the MCP-deferred rule, and the generated-not-hand-edited invariant). Generation and Cowork enablement stay with `ki-binding-claude`.

### `ki-subagents`

Audits, writes, and conforms **Claude Code subagent definitions** against a checkable rubric — mechanical checks (frontmatter, `name` uniqueness across the set, link resolution) plus the judgment ones applied by reading (the `description` as delegation signal, the system-prompt role/lane, own-vs-defer, least-privilege tools). The **agents twin of `ki-skills`**: that one governs a `SKILL.md`, this one a subagent definition. Governs the agents that land under `subagents/`.

## Environment

### `ki-binding`

Governs the portable MCP binding contract: the single renderer-neutral `mcp-servers.yaml` source, its schema and `clients:` targeting, and the vendor-neutral mcporter projection. Runtime-native configuration belongs to `ki-binding-claude` and `ki-binding-codex`; the chezmoi render path remains a separate concern.

### `ki-binding-claude`

Composes `ki-binding` with the Claude-specific delta: Claude Code and Desktop JSON surfaces, the claude.ai convention, Cowork settings, and generation of the Cowork plugin marketplace projection. It owns the safe Claude writer and is activated only for repositories supporting Claude Code.

### `ki-binding-codex`

Composes `ki-binding` with Codex's native `[mcp_servers]` TOML surface. Its conformer uses `codex mcp add` as the safe merge boundary rather than rewriting the live application configuration, and it is activated only for repositories supporting Codex.

### `ki-binding-chezmoi`

The **chezmoi render path** for the cross-surface binding — a composition skill (`ki-depends-on:` `ki-binding` + `ki-dotfiles-chezmoi`) that supplies what the renderer-neutral `ki-binding` deliberately omits: rendering the canonical `mcp-servers.yaml` source through chezmoi templates + `chezmoi apply` so the file-editable surfaces are generated from the single source. Its AUDIT runs the `ki-dotfiles-chezmoi` and `ki-binding` checkers in sequence, then adds the render-wiring delta. Installed only by chezmoi users; a non-chezmoi setup uses `ki-binding` alone. The composition-not-fork shape follows `ADR-KI-HARNESS-SKILLS-004`.

### `ki-dotfiles-chezmoi`

Codifies, audits, and conforms the **chezmoi dotfiles-management standard** — naming-prefix semantics (`dot_`/`executable_`/`private_`/`.tmpl`), edit-source-not-target discipline, shell-loader layering, the bin/ dispatcher pattern, app-mutated-config handling (surgical patch, native fragment binding, or full-template reverse-merge), single-source-to-multi-target config templating, CLAUDE.md/agent-instruction layering, and chezmoi-specific repo-shape and OS gotchas. It governs any git repo that is a chezmoi source-state directory (detected via `.chezmoiroot`/`.chezmoi.toml.tmpl`/`.chezmoidata`/root-level `dot_*` files), additive to `ki-repo`'s generic file-presence checks rather than restating them. Derived from a single case-study repo (n=1) — its judgment criteria stay provisional until more repos are audited against it. **Composes on** `ki-authoring`.

### `ki-housekeeping-claude`

Governs the hygiene of accumulated **Claude state** across all its areas — memory, sessions, artifacts, and storage that pile up across Claude Desktop / Cowork, Claude Code (`~/.claude/`), and VSCode. It pairs with the `mcp-claude-housekeeping` server on one principle: the skill is the standard and judgment; the server is the tools (`ADR-KI-HARNESS-SKILLS-007`). Its in-skill memory audit is limited to the selected repository's physical auto-memory directory and never enumerates another repository's state. There is no empty Codex counterpart: one should be created only when Codex exposes a supported selected-repository identity and safe housekeeping contract.

### `ki-tokenomics`

Owns portable agent-context tokenomics: standing-surface attribution, guide-rail budgets, the portable model-purpose taxonomy, and the `["knowledgeislands/ki-agentic-harness:ki-tokenomics"]` configuration table. It does not inspect a vendor's private runtime state; runtime evidence comes from the matching adapter.

### `ki-tokenomics-claude`

Composes `ki-tokenomics` with bounded Claude Code evidence for the selected repository and user layer: instructions, settings, installed skills, MCP configuration, auto-memory, Headroom wiring, and effective versus default model where documented.

### `ki-tokenomics-codex`

Composes `ki-tokenomics` with documented Codex evidence for the selected repository and bounded user configuration: instructions, skills, MCP declarations, memory, and subagent surfaces. It reports structure without reading or exposing secrets and makes no claim about unavailable billing or transcript metrics.

## Governance

### `ki-authoring`

The house authoring conventions the other skills build on — Markdown (wide tables → footnotes, link style) and TOML formatting style — and the single source of truth a repo's or base's `CLAUDE.md` points to.

### `ki-decision-records`

Governs **Decision Records** in any Knowledge Islands repo, code or KB — the typed ID prefixes (`GDR` / `ADR` / `KDR` / …), the five-section format, the living-record principle (edited in place, no status lifecycle or supersession), and placement (`docs/decisions/` in a code repo, `Admin/Governance/Decisions/` in a KB). Defers to `ki-kb` for the island structure and the KI-wide frontmatter standard, and to `ki-kb-streams` for the Enactment Process by which a change is ratified.

### `ki-engineering`

The shared **engineering toolchain** every TS/Bun repo builds on — native repository audit wiring, direct code-tool execution, `tsconfig`/`biome`, the Bun-install / Node-run split, a runner-neutral bare `test` entrypoint, the config-gated Vitest profile with 100% coverage, and the build/cli-chmod rule. The toolchain twin of `ki-authoring`; coverage selects it alongside artifact skills such as `ki-mcp` when a repository uses this toolchain. The shared mode and rubric rules are owned separately by `ki-skills`.

### `ki-feature-definitions`

Governs **Feature Definitions** — the behaviour-level "what" of a system, the third leg of the `docs/` triad (decisions = why, features = what, guides = how). Definitions live in `docs/features/`, flat one-file-per-area, with an `index.md` defining the ID scheme and an areas table. Each requirement is a `### <PREFIX>-NNN — title` heading carrying one RFC-2119 (`MUST` / `SHOULD` / `MAY`) statement and a `_Verify:_` test hook; IDs are append-only, and an unnumbered `## Gaps` section holds the backlog. Off-ramps the governing decisions a requirement cites to `ki-decision-records`.

### `ki-git`

Governs portable Knowledge Islands Git working and commit conventions: the Conventional Commit vocabulary, direct-main versus branch choice, safe Git hygiene, and the stale-lock guard's semantics. Its initial native rubric is deliberately judgment-only; repository GitHub settings stay with `ki-repo`, hook payload layout with `ki-harness`, and runtime-specific hook registration with `ki-dotfiles-chezmoi`.

### `ki-roadmap`

Governs **forward work in non-KB repositories** through flat canonical work items directly under `docs/roadmap/` and a concise root `ROADMAP.md` orientation. Each item has a stable `<REPO>-<THEME>-<NNN>` identifier, explicit theme grouping, horizon, lifecycle state, and dependencies. A concise item is enriched in place with execution detail when work is planned; it never gains a duplicate plan file. The CLI reports the canonical items; the root file deliberately does not repeat their queue. It owns readiness rules for authored horizon transitions; `ki-next` applies those rules to select and promote work, while `ki-plan` drives individual work-item lifecycles. Knowledge Bases use `ki-kb-streams` instead; repository-roadmap artefacts do not apply there.

### `ki-specifications`

Audits, conforms, and scaffolds the deliberately minimal **KI Specifications** repository shape: a keyless `["knowledgeislands/ki-agentic-harness:ki-specifications"]` marker and the established `proposals/`, `specifications/`, `schemas/`, `templates/`, `examples/`, `docs/`, and `tooling/` areas. It remains a thin structural delta over `ki-repo`; deeper KIP/KIS rules remain in the canonical Specifications repository until they are stable enough to factor into reusable governance.

## Keystone

### `ki-bootstrap`

Explains first-time Knowledge Islands activation through the `ki` CLI: bootstrap a user, select a verified compatible harness, distinguish user skills from repository declarations, and route exact command behaviour to `ki help`. It is guidance-only; the CLI owns installation, activation, and repository-operation mechanics. The user-facing starting point is [Install and get started](/guidance/using-ki/getting-started/); local harness selection is contributor-only machinery.

### `ki-repo`

Audits, conforms, and onboards any **Knowledge Islands–compliant** git repo (one carrying a `.ki-config.toml`) against the repo standard — local files, GitHub settings, and security. Owns the cross-cutting **`.ki-config.toml` contract** and discovers repos from a local tree or a whole org. Its human-led `REVIEW` mode examines repository architecture and implementation, interviews material uncertainty, and routes evidence-backed findings without turning them into compliance rules or automatic verdicts.

### `ki-skills`

Audits, writes, and conforms Agent Skills against a checkable rubric — mechanical checks plus judgment ones applied by reading, and a tracked source list it revisits. `REVIEW` examines an existing skill's architecture and automation opportunities beyond the rubric; `EXTRACT` examines an explicitly named repository and only explicitly selected history inputs for candidate skills, scripts, references, agents, or hooks. Both modes produce evidence-backed proposals, reconcile them with the canonical roadmap, and stop for confirmation rather than silently creating durable work. It also owns the shared enforcement framework and checker contract used by governance skills.

## Knowledge bases

### `ki-kb`

Interacts with a Knowledge Islands knowledge base over the standard zone model: the note-ops **DIGEST / EXTRACT / QUERY / SAVE / UPDATE**, plus **AUDIT / CONFORM / EDUCATE** to check a base against the structure model, bring it into line, or scaffold a new one. Only store-level bindings come from the host base. Delegates the **`Streams` zone** to `ki-kb-streams`.

### `ki-kb-activities`

Governs **Activity notes** — the operational record of work adopted in a base, kept under `Admin/Operations/Activities/` (naming, frontmatter, realization type, and the index). Checks that an activity declared as a slash command has a backing skill, and that scheduled ones are flagged for the external scheduler. `ki-kb` delegates this focused capability and supplies the wider zone structure.

### `ki-kb-live-artifacts`

Governs **Live Artifacts** — operational documents that track island state (dashboards, boards, queues, trackers) as a `.md` source paired with a rendered `.html`, kept under `Admin/Operations/Live Artifacts/` with an index, plus the sync rules between the two halves. `ki-kb` delegates this focused capability and supplies the wider zone structure.

### `ki-kb-streams`

Owns the **`Streams` zone** — the base's working copy ("plan mode") — and the **Enactment Process** that governs it: the lifecycle modes **PROPOSE / ITERATE / READY / ROLLOUT / REVIEW / SETTLE / REJECT**, plus **AUDIT / CONFORM** of a base's Streams structure (Focus lifecycle, the `Proposal` suffix, leaf/parent layout, proposal frontmatter). `ki-kb` delegates the zone here, so the heavier process loads only when working in `Streams`.

## Process

### `ki-delegate`

Prepares and runs **delegation-ready, round-sequenced execution** across sub-agents. The planner banks the reasoning once in cold-agent-ready worker briefs: locked-versus-escalate decisions, a pass/fail definition of done, bounded scope, an explicit minimum-viable per-spawn model, a verification gate, and a completion checkpoint. It then **classifies** each task as judgment / mechanical / research, **assigns** it to an agent and model, **sequences** dependency-ordered rounds, and **gates** every result through orchestrator review, with an adversarial pass for auto-executing output. It draws model cost/selection policy from `ki-tokenomics` without restating it. The method is runtime-neutral, with Claude Code mechanics tagged `CC`. Installable globally alongside `ki-bootstrap` and never declared via a `.ki-config.toml` table. It owns execution delegation, not cross-repository transfer.

### `ki-next`

Selects the next work, or a small compatible batch, in the repository's local forward-work structure. In a non-KB repository it grounds the generated roadmap index and canonical work-item dependency graph, evaluates Blocking and Next first, then uses separately confirmed horizon transitions. In a Knowledge Base it grounds Streams, evaluates Blocking and Active first, then uses the equivalent Focus transitions and existing proposal Checklists. A batch contains only independently ready work and preserves each item's execution or proposal boundary. It applies the readiness rules owned by `ki-roadmap` or `ki-kb-streams`, and stops for work-item or proposal review rather than implementation. A recent `ki-recap` can provide current-session context but is never required; `ki-next` does not mine historical transcripts. Installable globally, cross-repo, alongside `ki-bootstrap` — and like `ki-bootstrap`, never declared via a `.ki-config.toml` table.

### `ki-plan`

Drives the **work-item lifecycle** for a non-KB repository — `ready` / `execute` / `accept` / `done` / `prune` / `new` / `promote` / `status`. It reads format and methodology from `ki-roadmap`, enriches the canonical `<REPO>-<THEME>-<NNN>` item in place, preserves the `blocks`/`blocked-by` graph, applies explicit readiness and acceptance gates, retains done records, and prunes only an explicit completed batch. `/ki-plan promote` turns a current authenticated Claude Code Plan Mode scratch plan into that same governed item; the discovery bridge is Claude-Code-only while the file-oriented lifecycle is runtime-neutral. In a Knowledge Base, the same entrypoint dispatches to `ki-kb-streams` and its native proposal Checklist lifecycle. Installable globally alongside `ki-bootstrap` — and like `ki-bootstrap`, never declared via a `.ki-config.toml` table.

### `ki-recap`

Drives a live-session recap: **summarise** what happened (changes, decisions, files touched), **surface what is outstanding** (unfinished threads, deferred fixes — a ROADMAP item added this session is "what happened", not outstanding), and **harvest the learnings**, routing each to its proper home (a `CLAUDE.md` learned-pattern entry via `headroom learn`, a skill fix or rubric criterion, a new agent, a hook, memory, or a `ki-plan`/ROADMAP item), confirming before writing anywhere durable. When a grounded action needs a portfolio decision, it may offer `ki-next` as an optional current-session handoff; that never writes or invokes `ki-next` automatically. An optional **compress** leg writes a carry-forward digest — true in-context compression is the native / PreCompact-hook path, not something a skill can do. Installable globally, cross-repo, alongside `ki-bootstrap` — and like `ki-bootstrap`, never declared via a `.ki-config.toml` table.

## Tooling

### `ki-homebrew-tap`

Audits, conforms, and scaffolds the **Homebrew tap** repo (`homebrew-tap`) that packages the `ki-tools` CLIs, by **wrapping Homebrew's external standard** — `Formula/*.rb` shape (`class`/`desc`/`url`/`sha256`/`license`/`install`/`test do`), versioned-tarball sourcing, the README formulae table. It delegates to `brew audit --strict` / `brew style`, and REFRESH tracks the Homebrew Formula Cookbook. The repo name is fixed by Homebrew; the skill governs shape, not name.

### `ki-tools`

Audits, conforms, and scaffolds a **standalone command-line tool** repo (`tools-*`) — one CLI per repo, distributed via a `curl | bash` installer and a companion Homebrew tap formula (`tools-mgit` is the reference). It governs the container shape language-agnostically (`bin/<tool>` executable, `--version` + a version marker, `install.sh` contract, `tests/` + CI present, keep-a-changelog + semver, `vX.Y.Z` tags → a GitHub release), with lint/test as capability conditionals (shell → shellcheck + bats; a `package.json` defers to `ki-engineering`). Rides `ki-repo`, not `ki-engineering`.

## Websites

### `ki-website`

Audits, conforms, and scaffolds static websites against the house build standard — **Eleventy 3 + Nunjucks + Markdown, TypeScript run natively on Bun, Tailwind 4 config-less with design tokens** — that compile to a portable `dist/`. Owns the **site-build delta**; coverage separately selects `ki-engineering` for the toolchain and `ki-authoring` for Markdown, while `ki-website-cloudflare` depends on this skill and consumes the built `dist/`.

### `ki-website-cloudflare`

Audits, conforms, and scaffolds the house convention for serving a built site on **Cloudflare Workers + Static Assets** (not Pages): one `wrangler.jsonc` pointing `assets.directory` at the site's `dist/`, custom-domain routes, observability, and the `ki:site:deploy` script family. Owns the **hosting delta** for the site Worker; the `dist/` is the seam from `ki-website`. Companion Workers (bots, ingress) route to the generic `cloudflare` / `wrangler` skills.

Where the set is going next is in the roadmap.

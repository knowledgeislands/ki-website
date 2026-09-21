---
id: KI-WEB-SITE-015
area: SITE
title: Align website workspace layout
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T07:38:11Z
updated_at: 2026-09-21T07:38:11Z
---

# Align website workspace layout

## Goal

KI Website is laid out the way the house currently delivers websites: the site lives at the canonical `apps/site` workspace, and Turborepo owns the task graph so a gate run rebuilds only what changed. Someone moving between KI website repositories finds the same shape in each.

## Context

Two house standards have moved past this repository, and neither gap is mechanically detectable, so the audits report a clean pass while the drift persists.

`ki-repo-website` makes `apps/site` the canonical site root: omitting `site-root` from `[skills.ki-repo-website]` selects it, and an explicit key is only for an override. This repository declares `site-root = "site"`. That is a legal override and the audit accepts it, but it is off the default, and the key exists only to say so.

`ki-engineering` is stronger. Turborepo owns the task graph in any repository with a `workspaces` array, on the grounds that Bun workspaces supply no task graph, no input hashing, and no notion of a target being up to date — so root scripts chaining `bun run --cwd <workspace> build` rebuild workspaces nobody touched on every gate run, every dev start, and every CI job. The threshold is stated as having workspaces at all, not a package or step count. This repository declares `"workspaces": ["site"]`, has no `turbo.json`, and its root scripts are exactly the chained `bun run --cwd site …` form the standard names. `ki-engineering` has no rubric check for this, which is why the gate passes.

Estate evidence confirms the direction rather than contradicting it. `5g-emerge-testbed-website` is already on `apps/site` with the `site-root` key correctly omitted. `kit-midnight.ninja` is furthest along — `apps/*` plus `packages/*`, a `turbo.json`, a root `build` of `turbo run build`, and `ki:site:*` aliases kept as the public seam over `self:site:<site>:<verb>` scripts. `vallearmonia-website` shares this repository's older `site/` shape.

## Boundary

No change to rendered output, routes, or content. No change to the public `ki:site:*` seam that `ki-repo-website` owns and Cloudflare invokes — the aliases keep their names and only their delegation targets move.

This item does not adopt multi-site mode, add a `packages/*` tier, or split anything out of the site workspace. It does not enable Turborepo remote caching, which the standard requires to be an explicit and separately visible decision. It does not touch the static-analysis reconciliation in [KI-WEB-SITE-013](KI-WEB-SITE-013-reconcile-static-analysis-warnings.md) beyond renaming the workspace key its configuration uses.

## Discussion

### Why this is cheaper than it looks

The Cloudflare deployment does not reference the site directory. Per the [Cloudflare guide](../guides/cloudflare.md), Workers Builds is configured with the repository root as its root directory and the root aliases `bun run ki:site:build` and `bun run ki:site:deploy` as its commands. The public seam absorbs the move entirely, so no dashboard setting changes and no deploy-time coordination is needed. That removes the main risk a directory rename would normally carry.

What does move: `site/` to `apps/site`, the `workspaces` array, the `site-root` key in `.ki.toml` — deleted rather than re-pointed, since `apps/site` is the default — the root script delegation targets, the workspace key in `knip.json`, `tsconfig` references, and the `clean` script's path glob. `site/wrangler.jsonc` travels with the directory and keeps `assets.directory: "dist"` unchanged, because that path is relative to the config.

### Turborepo scope

The standard is specific about the traps. `inputs` are load-bearing: a task whose `inputs` miss a file it reads reports green it never earned, and a miss must be proven by editing each declared input with random content rather than assumed — a fixed repeated probe hits cache on the second run because it recreates byte-identical state. For a deployable's build the guidance is to hash the whole workspace with `inputs: ["$TURBO_DEFAULT$"]` rather than maintaining an explicit glob list, precisely because a site's input set is large and implicit: content, assets, routes, and configuration. Workspace packages must stay out of the root manifest's dependencies or the graph flattens and says nothing.

For a single-workspace repository the immediate win is modest — there is nothing to parallelise and one build to skip. The argument for doing it now is the standard's own: the threshold is having workspaces at all, and a repository that grows past it gets migrated at the least convenient moment instead.

### Alternatives

Declaring `site-root = "site"` permanently and staying with chained scripts is defensible on cost alone and is what the repository does today. It leaves two standards unmet with no mechanical gate to surface that, which is how drift becomes permanent.

Splitting the two halves into separate items would let the directory move land without the task runner. They touch the same files — root `package.json`, `.ki.toml`, `knip.json` — so splitting means doing that edit twice.

### Open questions

- Should this repository adopt `self:site:<site>:<verb>` scripts as `kit-midnight.ninja` does, or are those only meaningful in multi-site mode?
- `ki-engineering` has no rubric check for Turborepo adoption, and `vallearmonia-website` and `5g-emerge-testbed-website` have the same gap. Is that a harness handoff so the standard becomes detectable, rather than something each repository rediscovers?
- Does the `tsconfig` project-reference layout need to change, or does it survive a pure path move?

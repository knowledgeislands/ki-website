---
id: KI-WEB-SITE-015
area: SITE
title: Align website workspace layout
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 3a89d1e46ffc9baebb7b895b2cbb02c9ab6d70af
created_at: 2026-09-21T07:38:11Z
updated_at: 2026-09-21T10:41:09Z
---

# Align website workspace layout

## Goal

KI Website is laid out the way the house currently delivers websites: the site lives at the canonical `apps/site` workspace, and Turborepo owns the task graph so a gate run rebuilds only what changed. Someone moving between KI website repositories finds the same shape in each.

## Context

Two house standards have moved past this repository, and neither gap is mechanically detectable, so the audits report a clean pass while the drift persists.

`ki-repo-website` makes `apps/site` the canonical site root: omitting `site-root` from `[skills.ki-repo-website]` selects it, and an explicit key is only for an override. This repository declares `site-root = "site"`. That is a legal override and the audit accepts it, but it is off the default, and the key exists only to say so.

`ki-engineering` is stronger. Turborepo owns the task graph in any repository with a `workspaces` array, on the grounds that Bun workspaces supply no task graph, no input hashing, and no notion of a target being up to date — so root scripts chaining `bun run --cwd <workspace> build` rebuild workspaces nobody touched on every gate run, every dev start, and every CI job. The threshold is stated as having workspaces at all, not a package or step count. This repository declares `"workspaces": ["site"]`, has no `turbo.json`, and its root scripts are exactly the chained `bun run --cwd site …` form the standard names. `ki-engineering` has no rubric check for this, which is why the gate passes.

Estate evidence confirms the direction rather than contradicting it. `5g-emerge-testbed-website` is already on `apps/site` with the `site-root` key correctly omitted. `kit-midnight.ninja` is furthest along — `apps/*` plus `packages/*`, a `turbo.json`, a root `build` of `turbo run build`, and `ki:site:*` aliases kept as the public seam. `vallearmonia-website` shares this repository's older `site/` shape.

## Boundary

No change to rendered output, routes, or content. No change to the public `ki:site:*` seam that `ki-repo-website` owns and Cloudflare invokes — the aliases keep their names and only their delegation targets move.

This item does not adopt multi-site mode, add a `packages/*` tier, or split anything out of the site workspace. It does not enable Turborepo remote caching, which the standard requires to be an explicit and separately visible decision. It does not add a `typecheck` or `test` task: the standard wants one per workspace, but neither script exists anywhere in this repository today, so creating them is new capability rather than alignment.

## Current state

The site occupies `site/`, declared as `"workspaces": ["site"]` and pinned by `site-root = "site"` in `.ki.toml`. Every root `ki:site:*` script is a `bun run --cwd site <verb>` chain. There is no `turbo.json` and no task graph; each invocation rebuilds unconditionally.

The move is bounded by what actually names the directory: `package.json`, `.ki.toml`, `knip.json`, `biome.json`, `tsconfig.json`, `CLAUDE.md`, three guides, the tool-release workflow, and two files inside the workspace. `.turbo/` is already in the `ki-engineering` block of the managed `.gitignore`, so nothing there needs adding.

Cloudflare is unaffected. Per the [Cloudflare guide](../guides/cloudflare.md), Workers Builds is configured with the repository root as its root directory and the root aliases `bun run ki:site:build` and `bun run ki:site:deploy` as its commands, so the public seam absorbs the move with no dashboard change. `site/wrangler.jsonc` travels with the directory and keeps `assets.directory: "dist"`, because that path is relative to the config.

## Steps

- [x] Move `site/` to `apps/site` with `git mv`, preserving rename detection.
- [x] Set `workspaces` to `["apps/*"]`, delete the `site-root` key from `.ki.toml` rather than re-pointing it, and repoint the root script delegation targets.
- [x] Add `turbo.json` with `remoteCache.enabled` set explicitly, `globalDependencies` for the files governing every workspace, and a `build` task hashing the whole workspace.
- [x] Add a root `build` of `turbo run build` and route `clean` through Turborepo.
- [x] Update the workspace key in `knip.json`, the file globs in `biome.json`, and the exclusion in `tsconfig.json`.
- [x] Update `CLAUDE.md`, the three guides that name the directory, the tool-release workflow, and the two in-workspace path references.
- [x] Prove the `build` task's `inputs` by editing each representative input with random content and confirming the task reruns.
- [x] Confirm the generated `dist/` is byte-identical to a build of the baseline commit.

## Files touched

- `package.json`, `turbo.json`, `.ki.toml`, `knip.json`, `biome.json`, `tsconfig.json`, `bun.lock`
- `site/**` moved to `apps/site/**`, with `apps/site/eleventy.config.ts` and `apps/site/scripts/sync-tool-release.ts` edited in place
- `CLAUDE.md`, `docs/guides/cloudflare.md`, `docs/guides/projects-directory.md`, `docs/guides/tool-routes.md`
- `.github/workflows/update-tool-release.yml`

## Verify

- `ki repo audit` passes for `ki-engineering`, `ki-repo`, `ki-repo-website`, `ki-repo-website-content`, `ki-repo-website-cloudflare`, `ki-authoring`, `ki-work-roadmap`, and `ki-git`.
- `bunx @biomejs/biome check .` and `bunx knip --no-config-hints` are clean.
- `bun run build` succeeds cold, and a second run reports `FULL TURBO`.
- A random-content edit to each representative input causes the `build` task to rerun.
- `diff -r` between the generated `apps/site/dist` and a build of the baseline commit reports no differences.
- `bun test apps/site/scripts/sync-tool-release.test.ts` passes.

## Dependencies / blocks

Nothing blocks this and it blocks nothing, so both fields are empty.

[KI-WEB-SITE-013](KI-WEB-SITE-013-reconcile-static-analysis-warnings.md) landed first by preference rather than constraint: its Knip probing was done against the `site/` layout, so running it first kept those findings valid and cost only a one-line workspace-key rename here.

[KI-HARNESS-GOV-079](https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/roadmap/KI-HARNESS-GOV-079-detect-turborepo-task-graph-adoption.md) is the reciprocal harness item for making this standard mechanically detectable. It does not block this work — it exists so the next repository does not have to rediscover the gap.

## Documentation impact

### Decision Records

None. The layout and task runner are both house standards this repository is adopting rather than local choices it is making, so the authority and rationale already live in `ki-repo-website` and `ki-engineering`.

### Specifications

None. Nothing here is a portable normative contract.

### Guides

Three guides name the site directory in paths and links — `cloudflare.md`, `projects-directory.md`, and `tool-routes.md` — and all three were updated. `cloudflare.md` needed no change to the dashboard settings it documents, because the root directory and build commands it records are unchanged.

### Roadmap

Closing this leaves no follow-on item in this repository. The detection gap is routed to `KI-HARNESS-GOV-079`, and the two remaining website repositories with the same layout drift are theirs to schedule.

## Review

### Delivered

The approved boundary held. Rendered output, routes, and content are unchanged, and the `ki:site:*` seam keeps every name it had. Multi-site mode, a `packages/*` tier, remote caching, and new `typecheck` or `test` tasks were all excluded and remain absent.

Baseline `3a89d1e46ffc9baebb7b895b2cbb02c9ab6d70af`. The site is at `apps/site`, `.ki.toml` no longer overrides `site-root`, and `turbo.json` owns the task graph.

### Summary of changes

- `git mv site apps/site` — 67 paths, recorded as renames.
- `package.json` — `workspaces` is `["apps/*"]`; added `turbo` and a root `build` of `turbo run build`; `clean` runs `turbo run clean` before removing `node_modules` and `.turbo`.
- `turbo.json` — new. `remoteCache.enabled` is explicitly `false`, `globalDependencies` covers `tsconfig.json` and `biome.json`, and `build` uses `inputs: ["$TURBO_DEFAULT$"]` with `outputs: ["dist/**"]`. The non-cacheable tasks — `clean`, `deploy`, `upload`, and the persistent `ki:site:dev` and `preview` — are declared rather than left to default.
- `.ki.toml` — `site-root` deleted, which selects the `apps/site` default.
- `knip.json`, `biome.json`, `tsconfig.json` — workspace key, file globs, and exclusion repointed.
- `CLAUDE.md`, three guides, `.github/workflows/update-tool-release.yml`, `apps/site/eleventy.config.ts`, `apps/site/scripts/sync-tool-release.ts` — path references updated.

One material decision reversed mid-implementation. The `ki:site:*` scripts were first pointed at `turbo run <task>`, on the reasoning that Turborepo should own every path to a build. `ki-repo-website` `SITE-4/5/6` and `ki-repo-website-cloudflare` `WCF-13/14/25` reject that: the seam must be the exact `bun run --cwd <site-root> <verb>` command or one `self:site` alias hop, and `WCF-25` fails rather than warns. The scripts were restored to exact delegation and Turborepo now sits behind the root `build` and `clean`, which is the shape `kit-midnight.ninja` already uses. See the Discussion below for what this costs.

### Verification

- `ki repo audit` — PASS for `ki-engineering`, `ki-repo` (3 skills), `ki-repo-website`, `ki-repo-website-content` (2 skills), `ki-repo-website-cloudflare` (2 skills), `ki-authoring`, `ki-work-roadmap`, and `ki-git`.
- `bunx @biomejs/biome check .` — clean across 19 files. `bunx knip --no-config-hints` — exit 0.
- `bun run build` — cold build 572ms, 1 task successful; second run `FULL TURBO` at 20ms. `bun run ki:site:build` through the seam also succeeds.
- Inputs proven, not assumed. A random 16-byte hex value appended to each of `src/index.njk`, `src/assets/css/main.css`, `src/_data/site.ts`, `src/_data/projects.json5`, `eleventy.config.ts`, `scripts/verify-projects.ts`, and `package.json` caused the task to rerun in all seven cases; each file was restored afterwards and no probe residue remains. Random content was used specifically because a fixed repeated probe recreates byte-identical state and reads as the tool ignoring the file.
- `globalDependencies` proven the same way: random edits to `tsconfig.json` and `biome.json` each forced a rerun.
- `diff -r` between `apps/site/dist` and a build of the baseline commit — identical, both after a cached build and after a cold one with `.turbo` removed.
- `bun test apps/site/scripts/sync-tool-release.test.ts` — 7 pass, 0 fail.

### Outstanding concerns

Two, neither blocking.

The deployment path does not use the cache. Workers Builds invokes `bun run ki:site:build`, which the website standards require to be exact delegation, so the Cloudflare build bypasses Turborepo entirely. Pointing Workers Builds at `bun run build` instead would close the gap, but that is a dashboard change outside this item's boundary and is the user's call. Until then the caching benefit is local and CI-side only.

Lockfile invalidation was not independently proven. Appending whitespace to `bun.lock` hit cache, which is expected — Turborepo hashes the resolved dependency closure rather than the file's bytes — but it means the lockfile path rests on documented behaviour rather than a measurement here. Any real dependency change also edits a workspace `package.json`, which is proven to invalidate, so the practical exposure is small.

### Post-change review

The goal is met on both counts: the site is at the canonical root with the override key deleted rather than re-pointed, and Turborepo owns the task graph with its `inputs` demonstrated rather than asserted. Scope did not creep — no `typecheck` task was invented, no remote caching was enabled, and no content moved.

Regression risk is low and directly measured. The risk of a directory move is a stale path reference, and the failure would be a broken build or a wrong link rather than something subtle; every gate, the full build, the workflow's own test, and a byte-level `dist` comparison all pass. The residual risk is a path named somewhere no grep reached — most plausibly in the Cloudflare dashboard, which the guide says does not name the directory, or in another repository linking into this one's tree.

Ready for acceptance.

### Mini recap

Moved the site to the canonical `apps/site` workspace and put Turborepo over the task graph, closing both standards this repository had drifted from. `dist` is byte-identical to baseline, cold and cached, and the `build` task's `inputs` were proven with random-content edits across seven files rather than assumed. Eight audits pass.

Two things worth routing rather than promoting. `ki-repo-website` and `ki-engineering` pull in opposite directions at the `ki:site:*` seam — one wants an exact literal command, the other wants the task runner to own every path — and the resolution leaves the Cloudflare build uncached; whether Workers Builds should call `bun run build` is a decision, not an oversight. And the detection gap that allowed this drift is now `KI-HARNESS-GOV-079`, where three other repositories are still exposed to it.

## Done

Accepted 2026-09-21 by Kris Brown on the review packet above.

## Discussion

### The seam and the task graph disagree

The two standards meet at `ki:site:*` and want different things. `ki-engineering` says Turborepo owns the task graph in any repository with workspaces, and names `bun run --cwd <workspace> <verb>` as the anti-pattern. `ki-repo-website` and `ki-repo-website-cloudflare` say the `ki:site:*` scripts must be exactly that command, or one `self:site` alias hop from it, and enforce it mechanically — `WCF-25` at FAIL.

Both are defensible. The seam is a contract invoked by things outside the repository, including a Cloudflare dashboard nobody wants to reason about, so it being a literal, greppable command has real value. The task graph wants to be the only route to a build, so nothing can skip it.

The resolution here is the estate's: the seam stays literal, and `turbo run` sits behind the root `build` and `clean`. The cost is that the one build that matters most — the deploy — is the one that does not use the cache. That is a live gap rather than a resolved tension, and it is recorded as an outstanding concern rather than papered over.

### Why a single-workspace repository bothers

The immediate win is modest: one workspace, nothing to parallelise, one build to skip. The standard's threshold is having workspaces at all, and its argument is about when the migration happens rather than what it saves today — a repository that grows past a threshold gets migrated at the least convenient moment.

The measured effect is a cold build of 572ms against a cached 20ms. That is not the point. The point is that `turbo.json` now exists with its `inputs` proven, so a second workspace inherits a working task graph instead of prompting a second migration.

### What the probe method is for

Every `inputs` claim here was tested by appending a random 16-byte value and watching for a rerun, then restoring the file. The alternative — appending fixed text and repeating — silently recreates byte-identical state on the second run, hits cache, and reads exactly like Turborepo ignoring the file. That would have produced a confident, wrong conclusion about the one configuration whose failure mode is a green nobody earned.

`$TURBO_DEFAULT$` makes most of this true by construction, since the whole workspace is hashed. It was still worth proving, because the assumption being tested was that the deployable's inputs are all inside the workspace, and `globalDependencies` is where that assumption is false.

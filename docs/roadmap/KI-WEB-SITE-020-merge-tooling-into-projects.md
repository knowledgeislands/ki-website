---
id: KI-WEB-SITE-020
area: SITE
title: Merge tooling into projects
theme: site-experience
horizon: now
status: draft
blocks: []
blocked_by: [KI-WEB-SITE-018]
baseline_ref: null
created_at: 2026-09-22T09:10:00Z
updated_at: 2026-09-22T09:10:00Z
---

## Goal

The site has one section covering what Knowledge Islands has built. `/tooling/` is gone and the released command-line tools are projects alongside the rest.

## Context

The owner's instruction is direct: merge tooling into projects, removing tooling.

The sections do not in fact duplicate each other in data — the registries are disjoint, with 14 project repositories and 4 tool repositories (`tools-ki`, `tools-mgit`, `tools-git-almanac`, `tools-rig`), and no repository has a page in both. But they are indistinguishable in voice. Both are registry-driven stubs of 200–300 words that end by disclaiming themselves and pointing at a repository, and they cross-link, so reading them in sequence gives the impression of the same section twice. The split asks a reader to hold a distinction the site never states.

One section removes the question.

## Boundary

The `/install/<slug>` routes are a separate contract, carried in `dist/_redirects` and gated by `verify:routes`. They survive this item untouched.

`/tooling/harnesses/` and `/tooling/guidance/` are not tool pages. They are task guidance — how to bootstrap a harness, how to activate a skill in a scope — and they move to `/guidance/`, not to `/projects/`.

## Current state

`/tooling/` publishes six routes: an index, four tool pages built from `tools.json5` through `tool.njk`, and the two guidance pages named above. `/projects/` publishes an index and eleven pages built from `projects.json5` through `project.njk` and `projectPages.ts`; three of the fourteen registry entries are deliberately routeless.

The two page templates differ mainly in that the tool template carries install instructions and a release version. That is a fact about a project that ships a binary, not a reason for a separate section.

`verify:projects` currently reports "14 project entries verified alongside 4 released tools", so it already understands both registries at once.

## Steps

- [ ] Decide whether the four tools join `projects.json5` as entries carrying release and install fields, or stay in `tools.json5` as a registry the projects section reads. Prefer whichever keeps `sync:tools` and `verify:routes` working unchanged.
- [ ] Extend the project page template to render install and release material when an entry has it, so a tool page loses nothing by becoming a project page.
- [ ] Give the projects index a way to see the released tools as a group, since "what can I install today" is a real question and was the tooling section's one genuine job.
- [ ] Move `/tooling/harnesses/` and `/tooling/guidance/` into `/guidance/`, handing the hub placement to `KI-WEB-SITE-019`.
- [ ] Remove the tooling routes and templates, drop the navigation entry, and redirect `/tooling/` and `/tooling/<slug>/` to their new homes rather than letting them 404.
- [ ] Update the pages that link to `/tooling/`, and rewrite the merged pages against the revised ownership test from `KI-WEB-SITE-018`.
- [ ] Run `bun run ki:site:clean` before the build, since removing routes leaves stale output otherwise.

## Files touched

- `apps/site/src/tooling/` — removed, after its two guidance pages move.
- `apps/site/src/projects/project.njk`, `index.njk`, `apps/site/src/_data/projects.json5`, `tools.json5`, `projectPages.ts`.
- `apps/site/scripts/verify-projects.ts`, `verify-tool-routes.ts`.
- `apps/site/src/_data/site.ts` — navigation.
- `dist/_redirects` source — the retired routes.
- The five source files that link to `/tooling/`.

## Verify

`bun run ki:site:clean && bun run ki:site:build` passes with no `dist/tooling/` output. `verify:routes` still reports four installer routes resolving. `/install/ki` still redirects to the published installer. The four tools appear under `/projects/` with their install instructions intact, and `/tooling/ki/` redirects rather than 404s.

## Dependencies / blocks

Blocked by `KI-WEB-SITE-018`: the merged pages are rewritten against the revised ownership test, and doing that before the test is settled means writing them twice.

Hands `/tooling/harnesses/` and `/tooling/guidance/` to `KI-WEB-SITE-019`.

## Documentation impact

### Decision Records

Likely one. Retiring a top-level section and redirecting its routes is a structural change with a standing consequence for anyone holding a `/tooling/` URL.

### Specifications

None. The `/install/<slug>` contract is unchanged, which is worth stating explicitly in the record.

### Guides

`docs/guides/developer/` needs the registry arrangement restated if `tools.json5` changes role.

### Roadmap

No handoff. The owning repositories are unaffected.

## Discussion

The one thing genuinely lost is a single page answering "what can I install right now". Folding tools into a 14-entry project list buries that unless the index surfaces it deliberately, which is why that is a step rather than a consequence.

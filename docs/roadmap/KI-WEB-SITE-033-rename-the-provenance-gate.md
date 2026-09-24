---
id: KI-WEB-SITE-033
area: SITE
title: Rename the provenance gate
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 34cdffd8a97e76ac0b55aa295d00e3aec04a7fe5
created_at: 2026-09-24T10:39:48Z
updated_at: 2026-09-24T21:40:00Z
---

## Goal

The gate that checks a page's `sources` declaration is named for what it checks rather than for a directory that no longer exists, so the guide documenting it and the script implementing it share a vocabulary.

## Context

`KI-WEB-SITE-028` removed `apps/site/src/guidance/`. `KI-WEB-SITE-031` renamed the three developer guides that were named after it. What survives is the gate: `apps/site/scripts/verify-guidance-sources.ts` and `verify-guidance-reachable.ts`, run as `verify:guidance` and `verify:reachable`, plus the `Guidance provenance verified (34 pages).` line the build prints.

So `docs/guides/developer/page-provenance.md` opens by explaining a gate whose name it no longer shares, and a contributor reading the build output meets a word that names nothing on the site.

`KI-WEB-SITE-031` excluded this deliberately and said why: renaming a gate means touching `apps/site/package.json`, Turborepo's task graph in `turbo.json`, `AGENTS.md`, the guides, and several script header comments, which is a different kind of change from renaming a Markdown file nobody's build depends on. The exclusion was right at the time. It is recorded here so the question survives that item's prune.

## Boundary

This is a rename, not a change to what either check does. No page's `sources` contract changes, no failure message changes meaning, and no published route is involved.

It should settle both scripts together or neither: renaming one and leaving the other is how the collection got inconsistent in the first place.

Whether it is worth doing at all is the open question, not an assumption this item makes.

## Current state

The word "guidance" survives in five places, all of them executable or read by somebody running a build.

- `apps/site/scripts/verify-guidance-sources.ts` and `verify-guidance-reachable.ts` — the two script files.
- `apps/site/package.json` — `verify:guidance` maps to the first; `verify:reachable` already has the right name but maps to the second. Both appear in the `build` chain.
- Build output — `Guidance provenance verified (N pages).` and `verify-guidance-reachable: N unreachable guidance page(s)`.
- Header comments in `verify-guides.ts` and `sync-skill-catalogue.ts`, each naming a sibling script by its filename.
- Prose: `AGENTS.md` twice, `page-provenance.md` three times, `page-reachability.md` twice, `project-guides.md` twice, `what-to-publish.md` once, `sources.njk` once, and two Decision Records.

Nothing in `turbo.json` names either script; the root delegates `ki:site:build` to the workspace `build`, which is where the chain lives. That removes the task-graph edit `KI-WEB-SITE-031` expected and makes this smaller than it looked.

Neither script has a test file, so no test name changes.

## Steps

- [x] Survey every reference, including script header comments and generated-file comments.
- [x] `git mv` both scripts to names that say what they check.
- [x] Repoint `apps/site/package.json`, including the `build` chain.
- [x] Rename the strings the build prints, so the output matches the script a reader would go looking for.
- [x] Repoint prose and Decision Records, leaving `docs/roadmap/` alone.
- [x] Rebuild clean and confirm the gate still fails for the right reasons.

## Files touched

- `apps/site/scripts/verify-guidance-sources.ts` → `apps/site/scripts/verify-provenance.ts`
- `apps/site/scripts/verify-guidance-reachable.ts` → `apps/site/scripts/verify-reachable.ts`
- `apps/site/package.json`
- `apps/site/scripts/verify-guides.ts` and `apps/site/scripts/sync-skill-catalogue.ts` — header comments only
- `apps/site/src/_includes/partials/sources.njk`
- `AGENTS.md`
- `docs/guides/developer/page-provenance.md`, `page-reachability.md`, `project-guides.md`, `what-to-publish.md`
- `docs/decisions/GDR-KI-WEBSITE-002-carrying-material-for-readers.md`, `ADR-KI-WEBSITE-003-a-page-lives-with-what-it-is-about.md`
- `docs/roadmap/KI-WEB-SITE-033-rename-the-provenance-gate.md`

## Verify

- `bun run ki:site:clean && bun run ki:site:build` passes, and its output names `verify-provenance` and `verify-reachable`.
- `grep -rn 'verify:guidance\|verify-guidance' --include='*.ts' --include='*.json' --include='*.njk' --include='*.md' .` returns hits only under `docs/roadmap/`, where the old names are historical statements.
- `ki repo audit --skill ki-engineering --repo .`, `--skill ki-authoring --repo .` and `--skill ki-guides --repo .` pass.
- `git diff --stat -- docs/roadmap/` shows only this record.

## Dependencies / blocks

Nothing. `KI-WEB-SITE-034` edits `page-provenance.md`, which this item also edits, so the two should not run concurrently — but neither blocks the other and 034 is a decision rather than a change.

## Documentation impact

### Decision Records

Two are repointed, not rewritten. `GDR-KI-WEBSITE-002` and `ADR-KI-WEBSITE-003` each name the gate in passing; a Decision Record is a living present-state document and does want the current name.

### Specifications

None.

### Guides

Four, all repointed. `page-provenance.md` opens by explaining a gate whose name it no longer shares, which is the defect this item exists to remove.

### Roadmap

None beyond this record.

## Review

### Delivered

The site has no gate, script, script name or build line called "guidance". `verify:provenance` checks the `sources` declaration and `verify:reachable` checks that a published page can be navigated to, and both are named for what they check. A contributor reading build output meets `Provenance verified (34 pages).` and `verify-reachable: 52 published page(s) reachable from the home page` — two sentences that name files they can open.

`page-provenance.md` no longer opens by explaining a gate whose name it does not share.

### Change Summary

Two `git mv` renames — `verify-guidance-sources.ts` to `verify-provenance.ts`, `verify-guidance-reachable.ts` to `verify-reachable.ts` — and then the vocabulary inside both, which was the part the survey nearly missed. A rename that leaves `const guidanceDirs` and a `Guidance provenance check failed` string behind has moved the word rather than removed it.

Inside the scripts: `guidanceDirs` became `publishedDirs`; the reachability tally became `publishedPages`; four header sentences and three console strings lost the word. One historical sentence keeps it — `dist/guidance/` no longer exists — because that names a directory that did exist, and the sentence is explaining why the walk covers three trees instead of one.

Outside: `apps/site/package.json` (the `build` chain and both script entries), two sibling script header comments, `sources.njk`, `AGENTS.md` twice, four developer guides, and two Decision Records. `docs/roadmap/` was deliberately untouched; its references to `verify:guidance` are statements about what the gate was called at the time.

### Verification

`bun run ki:site:clean && bun run ki:site:build` passes end to end, exercising both renamed gates in the chain.

`grep -rn 'verify:guidance\|verify-guidance'` across `*.ts`, `*.json`, `*.njk` and `*.md` returns hits only under `docs/roadmap/`.

Five skill audits pass: `ki-engineering`, `ki-authoring`, `ki-guides`, `ki-decision-records`, `ki-work-roadmap`. `git diff --stat -- docs/roadmap/` shows this record and nothing else.

Two defects were caught by the build rather than by review, which is the point of renaming something the build depends on. `const reachable = all.filter(…)` collided with an existing `reachable()` function and failed to parse — renamed to `publishedPages`. And `syncpack` failed `PropertyIsNotSortedAz` because `verify:provenance` sorts differently from `verify:guidance`; `bunx syncpack format` fixed it.

### Outstanding concerns

None with work attached.

`KI-WEB-SITE-031` predicted this rename would need `turbo.json`, and it does not: the root delegates `ki:site:build` to the workspace `build` script, and the chain lives there. The item was smaller than the exclusion that deferred it assumed, which is worth knowing the next time a cost estimate defers something.

### Post-change review

The interesting finding is that the rename's real surface was inside the scripts, not around them. The survey in `## Current state` listed five categories of reference and got the count right, but the work was in the sixth thing it recorded almost in passing — the identifiers and strings the scripts use about themselves. Renaming a file is a `git mv`; renaming a concept means reading the file.

`KI-WEB-SITE-031` made the same discovery in the opposite direction: its survey underestimated inbound references by half because it looked only in prose. Between them the lesson is that a rename has two surfaces, what points at the thing and what the thing says about itself, and a survey that covers one reliably misses the other.

Risk is low but not nil, unlike 031. This changed an executable chain: a script name in `package.json` that nothing else calls, gate output a person reads, and two files the build resolves by path. The clean build is the evidence, and it failed twice before it passed.

### Mini recap

`KI-WEB-SITE-033` renamed `verify-guidance-sources.ts` to `verify-provenance.ts` and `verify-guidance-reachable.ts` to `verify-reachable.ts`, with the `verify:guidance` script becoming `verify:provenance`, and removed the word "guidance" from both scripts' identifiers, headers and output. Eleven prose and configuration files were repointed; `docs/roadmap/` was left as history. `turbo.json` turned out not to be involved. A clean build and five skill audits pass, after the build caught an identifier collision and a script-ordering failure.

## Done

Accepted 2026-09-24 by Kris Brown on the review packet above.

## Discussion

### The case against

A gate name is read by contributors, not readers, and this repository has exactly one contributor plus its agents. The cost is a coordinated edit across `package.json`, `turbo.json`, two script files, their headers, two guides and `AGENTS.md`, with a build that fails loudly if any reference is missed — so the risk is low but the ceremony is real, for a word nobody trips over twice.

### The case for

The site now has no directory, no navigation entry and no guide called "guidance". The gate is the last holdout, which makes it the one place where a person learning the codebase meets a term with no referent. That is precisely the tax `KI-WEB-SITE-031` argued is paid every time somebody looks something up.

`verify:provenance` and `verify:reachable` would be the obvious pair, and `verify:reachable` already has the better name, which suggests the shape.

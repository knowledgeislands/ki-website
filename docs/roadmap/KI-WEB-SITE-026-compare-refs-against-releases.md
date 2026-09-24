---
id: KI-WEB-SITE-026
area: SITE
title: Compare refs against releases
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 4d4d80ecaf7af3e01ab216428f61764d5cab1e6a
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:34:10Z
---

## Goal

The provenance sweep reports a refresh as owed when one genuinely is, and stays quiet when the site already cites the newest release. A maintainer who runs it can trust that a warning means work, so the sweep is worth running.

## Context

This item was opened to refresh twelve pages and two data files pinned to `tools-ki` at `v0.4.0`, on the evidence that `bun run --cwd apps/site verify:guidance -- --network` reported drift there. Checking the premise before acting on it showed the refresh does not exist to be done: `v0.4.0` is `tools-ki`'s latest release, published 2026-09-18. The site is correctly pinned to the newest thing upstream has shipped.

The warning was real but was measuring something else. `verify-guidance-sources.ts` compared the pinned ref's blob against the same path on the upstream **default branch**. Those differ — `man/ki.1` is `7a53b86` at `v0.4.0` and `d9f729f` on `main` — because upstream has merged work since it released. That is what a release tag means.

The consequence is that the warning was unconditional. Any page pinned to any tag warns from the moment its upstream merges anything, and the warning cannot be cleared by doing what it asks, because there is nothing newer to pin to. A sweep that always reports drift teaches its reader that its output is noise, which is worse than not running it: the genuine case — a page left on `v0.3.6` after `v0.4.0` shipped — arrives in the same undifferentiated list as the permanent one.

This is the session's recurring shape in a new place. A check that passes tells you the check ran, not that the property holds; a check that always warns tells you nothing at all.

## Boundary

This item changes what the drift comparison asks. It does not change the warning's severity — drift stays a warning and never fails the build, for the reason the guide already gives. It does not change the offline checks, the prose-link resolution, the `sources` schema, or the vendoring scripts. It does not refresh any citation, because none is behind. It does not add a release check to `verify:routes`, which already has its own. It does not introduce a build-time network call.

## Current state

Delivered. `checkDrift` branches on the pinned ref's form. A tag is compared against the repository's newest published release and warns only when a later one exists; a commit ref keeps the default-branch comparison, since no release corresponds to it. A repository that publishes no releases falls through to the old behaviour. The latest release is resolved once per repository and cached, so a sweep across a dozen pages of one repository spends one request rather than twelve against the unauthenticated limit of sixty an hour.

## Steps

- [x] Check the premise: establish whether a newer `tools-ki` release exists before refreshing anything against one.
- [x] Identify why the sweep reported drift — default-branch comparison against a release-pinned source.
- [x] Branch the drift check on the ref's form, comparing a tag against the newest release and a commit against the default branch.
- [x] Cache the latest release per repository so the change does not cost rate limit.
- [x] Prove both directions: silent on the newest release, warning by name when genuinely behind.
- [x] Correct `docs/guides/developer/guidance-provenance.md`, which described the old comparison.

## Files touched

- `apps/site/scripts/verify-guidance-sources.ts`
- `docs/guides/developer/guidance-provenance.md`
- `docs/roadmap/KI-WEB-SITE-026-compare-refs-against-releases.md`

## Verify

- `GITHUB_TOKEN="$(gh auth token)" bun run --cwd apps/site verify:guidance -- --network` resolves 35 pages, 38 repository sources and 13 prose links with zero warnings.
- Repointing one page to `v0.3.6` produces exactly one warning naming `v0.4.0` as the release owed; the page is then restored.
- `bunx tsc --noEmit -p apps/site/tsconfig.json` passes.
- `bun run ki:site:clean && bun run ki:site:build` passes.

## Dependencies / blocks

Nothing blocks this and it blocks nothing. `KI-WEB-SITE-027` hands the guide contract to `tools-ki`; if that repository later publishes a machine-readable command projection, this sweep is unaffected, because it compares refs rather than content.

## Documentation impact

### Decision Records

None. `ADR-KI-WEBSITE-003` records that refreshing means deliberately advancing one ref and is unchanged by making the prompt to do so accurate. No decision about vendoring, provenance, or severity is revisited.

### Specifications

None. No published interface or machine route is involved.

### Guides

`docs/guides/developer/guidance-provenance.md` described the default-branch comparison and now describes the release comparison, including why a commit-pinned source still uses the branch.

### Roadmap

None. The refresh this item was opened to perform does not exist; when `tools-ki` next releases, the sweep will say so by name.

## Review

### Delivered

A drift check that distinguishes unreleased upstream change from a refresh the site actually owes. A page pinned to a release tag is now measured against the newest release rather than the upstream default branch, so it reports work only when work exists. The original scope — advancing twelve pages and two data files past `v0.4.0` — was found on inspection to have no target and was not performed.

### Change Summary

`verify-guidance-sources.ts` gained `latestRelease`, a per-repository cached lookup of the newest published release, and `checkDrift` now branches on whether the pinned ref matches `tagPattern`. A tag with a newer release warns and names it; a tag that is the newest release returns without reporting; a repository publishing no releases, or a source pinned to a commit, keeps the default-branch comparison unchanged. A refusal from GitHub is not cached as an answer. `guidance-provenance.md` replaced the sentence describing the old comparison.

### Verification

The authenticated sweep resolves 35 pages, 38 repository sources and 13 prose links with zero warnings, where the same sweep previously reported `tools-ki` drift. Repointing `src/projects/ki/commands.md` to `v0.3.6` produced exactly one warning — `cites knowledgeislands/tools-ki/man/ki.1 at v0.3.6, but v0.4.0 is released; a refresh is owed` — and the page was restored, confirmed by `git diff --stat` showing only the script changed. `bunx tsc --noEmit` and the full build pass.

### Outstanding concerns

The release lookup adds one request per repository per sweep, which is cheap but is still a network call the unauthenticated limit counts. Running the sweep without `GITHUB_TOKEN` was already impractical at this corpus size and remains so.

A repository that publishes releases but pins a source to a commit rather than a tag still gets the default-branch comparison, and so still gets the permanent warning this item removed for tags. No current source is in that position, and forcing tags would be a schema change the `sources` contract does not currently make.

The check trusts GitHub's `releases/latest`, which means the newest non-prerelease release. A repository whose newest useful artefact is a prerelease would be reported as current when it is not.

Both of those are cases where the check reports success while being wrong, so they are `KI-WEB-SITE-034` rather than three sentences that vanish when this record is pruned.

### Post-change review

The goal is met: the sweep is quiet on a correctly pinned corpus and specific when a citation falls behind, and both states were demonstrated rather than reasoned about. The change is read-only against upstream, confined to one script and one guide sentence, and cannot affect the build, because drift remains a warning. The risk it introduces is under-reporting — a repository using prereleases, or a commit-pinned source — which is stated above rather than hidden, and is a smaller failure than the unconditional warning it replaces.

The wider lesson is the one worth keeping: the item's stated premise was wrong, and the only thing that caught it was checking whether the release it assumed existed actually did before editing fourteen files against it.

### Mini recap

`KI-WEB-SITE-026` opened as a refresh and delivered a measurement fix, because the refresh had no target — `v0.4.0` is the newest `tools-ki` release. The drift sweep now compares release-pinned sources against the newest release instead of the default branch, so it warns only when a newer release exists. Proven in both directions; the guide follows the code. Prerelease handling and commit-pinned sources are named as limits rather than solved.

## Done

Accepted 2026-09-24 by Kris Brown on the review packet above.

## Discussion

### Why the premise check mattered more than the work

Acting on the item as written would have produced a `sed` across fourteen files advancing a version string to a release that does not exist, or — marginally better — a sync against a branch, pinning the site to a moving target and breaking the immutability `ADR-KI-WEBSITE-003` rests on. The warning was evidence that something was worth looking at, not evidence of what.

### What a permanent warning costs

Nothing measurable, which is the problem. The sweep still passes, the build still succeeds, and the output still scrolls past. The cost is paid later, when a real warning appears in a list the reader has learned to skim.

### Prereleases

Left unhandled deliberately. `releases/latest` excludes prereleases, which is the right default for a site whose readers install what is published. If a Knowledge Islands repository starts shipping prereleases as its usable artefact, the comparison needs a policy — follow them, or keep citing the last stable release and say so — and that is a decision rather than a fix.

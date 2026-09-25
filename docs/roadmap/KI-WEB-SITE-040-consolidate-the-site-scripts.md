---
id: KI-WEB-SITE-040
area: SITE
title: Consolidate the site scripts
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T14:10:00Z
updated_at: 2026-09-25T14:10:00Z
---

## Goal

The nine scripts under `apps/site/scripts/` share one GitHub client, one directory walker and one frontmatter reader, so a fix to any of them is a fix everywhere rather than in whichever copy the next person finds.

## Context

The question that prompted this was whether the site still needs all of them. Measured: nine scripts, 2,388 lines, plus 489 lines of tests across three test files. Six of the nine are build gates and they run in **1.79 seconds in total**, so runtime is not an argument for removing any.

Nor is redundancy. Each gate traces to a recorded decision and each has caught something real — `verify-prose-coverage` found 1,482 unstyled inline `code` elements, `verify-reachable` found 31 orphaned pages and now holds a 60-page tree together, `verify-docs-sections` is the mechanical half of `GDR-KI-WEBSITE-002`'s ownership test. **The answer to "do we need all of these" is yes.** The answer to "should there be this much of them" is no, and that is a different problem.

The duplication is measurable. **Six separate GitHub clients**, one per script that reaches the network, of which two — `sync-cli-commands.ts:311` and `sync-skill-catalogue.ts:186` — call bare `fetch(url)` with no token and no `User-Agent`. They will hit the same sixty-requests-an-hour unauthenticated limit that `verify-provenance.ts:201` handles properly, reports clearly and that `docs/guides/developer/page-provenance.md` documents. The two that will fail are the two that say nothing about why. **Five recursive directory walkers**, one per script that reads a tree. **Three frontmatter readers**, each with its own regex.

## Boundary

This extracts shared helpers into `apps/site/scripts/lib/` and repoints the nine scripts at them. It does not delete a gate, weaken a check, or change what any script concludes — the test for the change is that every gate reports exactly what it reported before.

It does not touch `tools-ki`'s or the harness's own scripts, and it does not make the shared code a package. A local `lib/` directory inside the workspace that already owns these scripts is the right size for the problem.

## Current state

Nine scripts, 2,388 lines, plus 489 lines of tests across three files. Six are build gates wired into `apps/site/package.json`'s `build`; three are sync tools run by hand.

| Duplicated thing | Copies | Where |
| --- | --- | --- |
| GitHub HTTP client | 6 | `sync-cli-commands`, `sync-skill-catalogue`, `sync-tool-release`, `verify-projects`, `verify-provenance`, `verify-tool-routes` |
| Recursive directory walker | 5 | `verify-docs-sections`, `verify-prose-coverage`, `verify-provenance`, `verify-reachable`, `verify-tool-routes` |
| Frontmatter reader | 3 | `sync-skill-catalogue`, `verify-docs-sections`, `verify-provenance` |

Only two of the six set both a token and a `User-Agent`: `sync-tool-release.ts:125` and `verify-provenance.ts:201`. Two set neither — `sync-cli-commands.ts:311` and `sync-skill-catalogue.ts:186` both call bare `fetch(url)`.

The six gates together take 1.79 seconds.

## Steps

- [ ] Take `baseline_ref` before any edit.
- [ ] Capture each gate's current output verbatim, so the change can be proved to alter nothing.
- [ ] Extract `scripts/lib/github.ts` — one client, one token resolution, one `User-Agent`, one rate-limit message.
- [ ] Extract `scripts/lib/walk.ts` — one recursive walker taking an extension filter.
- [ ] Extract `scripts/lib/frontmatter.ts` — one reader returning the block and the body.
- [ ] Repoint all nine scripts, one at a time, re-running its gate after each.
- [ ] Add tests for the shared helpers, and keep the existing script tests passing unchanged.
- [ ] Diff each gate's output against the capture from step two.

## Files touched

- `apps/site/scripts/lib/` — new
- `apps/site/scripts/*.ts` — all nine, repointed
- `apps/site/scripts/lib/*.test.ts` — new

## Verify

- `bun run ki:site:clean && bun run ki:site:build` passes, and every gate prints what it printed before, line for line.
- `bun test apps/site/scripts` passes, with the three existing test files unchanged.
- `bunx tsc --noEmit` clean.
- `bun run --cwd apps/site sync:cli` and `sync:skills` both succeed against a rate-limited endpoint with `GITHUB_TOKEN` set, which is the behaviour neither has today.
- `ki repo audit --skill ki-engineering --repo .` passes.

## Dependencies / blocks

Nothing blocks this and it blocks nothing. It is deliberately independent of any content or structural work, because a refactor that changes no conclusion should never be sequenced against something that changes conclusions.

## Documentation impact

### Decision Records

None. No decision changes; the same checks run against the same rules.

### Specifications

None.

### Guides

`docs/guides/developer/page-provenance.md` documents the unauthenticated rate limit and how to lift it. Once every client handles the token the same way, that paragraph describes all of them rather than one.

### Roadmap

None.

## Discussion

### The token gap is the part with teeth

Four of the five clients differ only in ceremony. Two of them differ in behaviour: they will start failing when someone runs a sync sixty-one times in an hour, or once from an IP that has, and the failure will arrive as an unexplained HTTP status rather than as the sentence `verify-provenance.ts` already knows how to write. Consolidating is tidiness; consolidating fixes that as a side effect, which is the reason to do it rather than to note it.

### Consolidation is not deletion, and the distinction is worth stating plainly

The instinct when a scripts directory grows is to ask which ones can go. That instinct is right about most directories and wrong about this one, because these scripts are the mechanical half of decisions the repository has already made — and a gate removed for tidiness removes a decision's enforcement while leaving the decision written down, which is worse than never having gated it. What grew here is not the number of things being checked but the number of times the same plumbing was written to check them.

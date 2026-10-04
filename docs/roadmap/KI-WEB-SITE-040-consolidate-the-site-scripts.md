---
id: KI-WEB-SITE-040
area: SITE
title: Consolidate the site scripts
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 006c465a48a7acb3f46c9058be42581ae867065b
created_at: 2026-09-25T14:10:00Z
updated_at: 2026-10-04T11:51:26Z
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

- [x] Take `baseline_ref` before any edit.
- [x] Capture each gate's current output verbatim, so the change can be proved to alter nothing.
- [x] Extract `scripts/lib/github.ts` — one client, one token resolution, one `User-Agent`, one rate-limit message.
- [x] Extract `scripts/lib/walk.ts` — one recursive walker taking an extension filter.
- [x] Extract `scripts/lib/frontmatter.ts` — one reader returning the block and the body.
- [x] Repoint all nine scripts, one at a time, re-running its gate after each.
- [x] Add tests for the shared helpers, and keep the existing script tests passing unchanged.
- [x] Diff each gate's output against the capture from step two.

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

## Review

### Delivered

The approved boundary: three shared helpers under `apps/site/scripts/lib/` and every duplicated client, walker and frontmatter reader in the nine scripts repointed at them, with no gate deleted, weakened or changed in what it concludes. Baseline `006c465a48a7acb3f46c9058be42581ae867065b`; the resulting change is the commit that carries this packet.

### Change Summary

- `apps/site/scripts/lib/github.ts` - one GitHub client: token from `GITHUB_TOKEN` then `GH_TOKEN`, one `User-Agent` (`ki-website-scripts`), the API media type only for `api.github.com`, the token only for GitHub-owned hosts, and one rate-limit sentence. `githubFetchOk` throws with that sentence on 403/429.
- `apps/site/scripts/lib/walk.ts` - one recursive walker taking an extension filter; `apps/site/scripts/lib/frontmatter.ts` - one reader returning `none`, `unterminated` or the block and body.
- Repointed: `sync-cli-commands.ts` and `sync-skill-catalogue.ts` (bare `fetch` replaced, so both now send a token and `User-Agent` and explain a refusal), `sync-tool-release.ts`, `verify-projects.ts`, `verify-tool-routes.ts`, `verify-provenance.ts` (client, walker, reader), `verify-docs-sections.ts` (walker, reader), `verify-reachable.ts` and `verify-prose-coverage.ts` (walker).
- New tests: `lib/github.test.ts`, `lib/walk.test.ts`, `lib/frontmatter.test.ts`. The three existing test files are unchanged.
- `docs/guides/developer/page-provenance.md` - the rate-limit paragraph now describes the one client rather than one script.
- Deviation, recorded rather than approved separately: `sync-skill-catalogue.ts` no longer reads frontmatter (it parses the harness catalogue between markers), so the reader replaced two copies, not three. `sync-tool-release.ts` now also honours `GH_TOKEN` and identifies itself with the shared `User-Agent`.

### Verification

- `bun run ki:site:clean && bun run ki:site:build` passes; the six gates' outputs, captured before any edit and again after, are identical line for line (`diff` empty).
- `bun test scripts` in `apps/site`: 45 pass, 0 fail across 6 files (34 before, all still passing).
- `bunx tsc --noEmit` in `apps/site` clean; `bunx biome check apps/site/scripts` clean.
- With `GITHUB_TOKEN` set, `sync:cli -- --ref v0.4.0` and `sync:skills -- --ref 77ec746d…` both succeed and regenerate byte-identical data files; `verify:provenance`, `verify:projects` and `verify:routes` with `--network` complete with the same warnings as before.
- `ki repo audit --skill ki-engineering --repo .` and `--skill ki-authoring` pass.

### Outstanding concerns

- A rate-limited sync run was proved by unit test with a stubbed 403/429, not against live GitHub.
- The shared reader accepts CRLF files that `verify-provenance.ts` previously reported as having no frontmatter; no published page uses CRLF, so no conclusion changes today.
- Hosted CI is red on `main` for an unrelated pinned-harness drift (`FILES-6`), tracked by `KI-WEB-SITE-041`.

### Post-change review

The goal holds: each piece of plumbing now exists once, and the two scripts that called bare `fetch` gained the token handling the item named as the real defect. Scope stayed inside `apps/site/scripts/` plus the one guide paragraph. Regression risk is low - unchanged gate output and unchanged existing tests are the item's own acceptance test. Ready for review.

### Mini recap

Nine scripts repointed at three helpers (240 lines with tests), 88 duplicated lines removed, gate output unchanged. Possible learning route: `ki-engineering` could name `scripts/lib/` as the home for shared site-script plumbing; not promoted.

## Discussion

### The token gap is the part with teeth

Four of the five clients differ only in ceremony. Two of them differ in behaviour: they will start failing when someone runs a sync sixty-one times in an hour, or once from an IP that has, and the failure will arrive as an unexplained HTTP status rather than as the sentence `verify-provenance.ts` already knows how to write. Consolidating is tidiness; consolidating fixes that as a side effect, which is the reason to do it rather than to note it.

### Consolidation is not deletion, and the distinction is worth stating plainly

The instinct when a scripts directory grows is to ask which ones can go. That instinct is right about most directories and wrong about this one, because these scripts are the mechanical half of decisions the repository has already made — and a gate removed for tidiness removes a decision's enforcement while leaving the decision written down, which is worse than never having gated it. What grew here is not the number of things being checked but the number of times the same plumbing was written to check them.

### Readiness check - 2026-10-04

Adopted from Triage into Now under the owner's delegated session authority and re-grounded against `main` at `6e5aabf`. The duplication table still holds: bare `fetch(url)` at `sync-cli-commands.ts:311` and `sync-skill-catalogue.ts:186`, token and `User-Agent` at `sync-tool-release.ts:126` and `verify-provenance.ts:201`, walkers in the five named gates, and frontmatter readers in the three named scripts. `verify-tool-routes.ts:217` fetches a tool's installer URL rather than the GitHub API, so the shared client should expose the common headers for it without forcing an API base URL. The scripts now total 2,894 lines including tests.

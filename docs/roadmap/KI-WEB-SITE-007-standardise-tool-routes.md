---
id: KI-WEB-SITE-007
area: SITE
title: Standardise tool routes
theme: site-experience
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: a0bb455a6a28acda03c62d47e16e7a0fa29e972d
created_at: 2026-09-17T06:42:45Z
updated_at: 2026-09-17T07:01:42Z
---

# KI-WEB-SITE-007: Standardise tool routes

## Goal

Give every released Knowledge Islands command-line tool a consistent website page and stable installation endpoint without moving release authority out of its source repository.

## Context

KI Website owns the public tooling guide, but its current routes treat `ki` as a special case: `/tooling/cli/` is its product page and `/harness/install` redirects to the `tools-ki` installer. The live installer route still targets v0.2.6 while `tools-ki` has released v0.3.6, demonstrating that a manually maintained special route can drift from the tool release.

The canonical human route should be `/tooling/<tool>/`, with `/tooling/ki/` replacing `/tooling/cli/`. The canonical machine route should be `/install/<tool>`. The first complete set covers the four released tools already distributed through `knowledgeislands/homebrew-tap`: `ki`, `rig`, `mgit`, and `git-almanac`.

A single website-owned tool registry should provide each tool's identity, description, source repository, published version, Homebrew formula, installer target, maturity, manual, and changelog links. Website pages, navigation, tool cards, and installation redirects should derive from that declaration where practical. Each tool's release workflow should hand off its new immutable version and installer target to the website so the stable route advances deliberately and can be verified.

## Boundary

This work does not make KI Website the authority for executable behaviour, release artifacts, checksums, installers, package-manager state, or personal Rig publications. Those remain with the tool repository, GitHub release, Homebrew tap, or individual publisher respectively.

Do not retain compatibility routes for `/harness/install` or `/tooling/cli/`; remove them when their canonical replacements ship. Do not add website routes for unreleased or internally operated tools merely because their repositories use a `tools-*` name.

## Current state

`/tooling/cli/` is a hand-written product page for `ki` alone, and `site/src/_redirects` is a hand-maintained static file whose `/harness/install` line still points at the `tools-ki` `v0.2.6` installer while the tool has released `v0.3.6`. `rig`, `mgit` and `git-almanac` are released and packaged in `knowledgeislands/homebrew-tap` but have no website presence. Nothing in the build checks that a declared installer target exists or names an immutable release.

## Steps

- [x] Add the website-owned tool registry `site/src/_data/tools.json5` declaring identity, description, source repository, published version, Homebrew formula, installer target, maturity, manual and changelog for `ki`, `rig`, `mgit` and `git-almanac`.
- [x] Generate a `/tooling/<tool>/` product page per registry entry and retire the hand-written `/tooling/cli/` page.
- [x] Generate `_redirects` from the registry so each `/install/<tool>` resolves to its declared immutable installer target; retire `/harness/install` and retain `/harness/bootstrap`.
- [x] Derive the tooling index tool cards and the sitemap tooling entries from the registry rather than from hand-written route lists.
- [x] Add the `site/scripts/verify-tool-routes.ts` gate covering registry shape, immutable-ref discipline, version and tag agreement, generated-redirect coverage, and an opt-in network check of each installer target and published release, and run it as part of the site build.
- [x] Update the remaining in-repo references to the retired routes and document the per-tool release handoff in `docs/guides/tool-routes.md`.

## Files touched

`site/src/_data/tools.json5`, `site/src/tooling/tool.njk`, `site/src/tooling/index.njk`, `site/src/tooling/cli/index.njk` (removed), `site/src/_redirects` (removed), `site/src/redirects.njk`, `site/src/sitemap.njk`, `site/eleventy.config.ts`, `site/scripts/verify-tool-routes.ts`, `site/package.json`, `knip.json`, `site/src/guidance/cli/local-commands.md`, `site/src/guidance/using-ki/command-line-interface.md`, `README.md`, `docs/guides/tool-routes.md` and this work record.

## Verify

Run the route gate offline and with `--network`; run `bun run ki:site:clean` then `bun run ki:site:build` and assert that `dist/tooling/<tool>/index.html` exists for each registry entry, that `dist/_redirects` carries an `/install/<tool>` line per entry, and that `dist/tooling/cli/` and any `/harness/install` line are absent; run `bunx @biomejs/biome check`, `bunx tsc --noEmit -p site` and `bunx rumdl check`; and run `git diff --check`.

## Dependencies / blocks

None. `KI-WEB-SITE-002` owns the broader guidance consolidation and is independent of this route contract.

## Documentation impact

### Decision Records

No local Decision Record is needed: `GDR-KI-FUNDAMENTALS-001` already assigns release authority to each tool repository, and this work adds a discoverability layer beneath that authority rather than changing it.

### Specifications

No behaviour-level specification changes. The route contract is documented as a guide because the website is not the authority for installer behaviour.

### Guides

`docs/guides/tool-routes.md` records the registry fields, the route contract, and the release handoff each participating tool repository performs.

### Roadmap

This record carries the bounded delivery and its review evidence.

## Review

### Delivered

The approved boundary: one website-owned tool registry, generated `/tooling/<tool>/` pages and `/install/<tool>` redirects for `ki`, `rig`, `mgit` and `git-almanac`, registry-derived cards and sitemap entries, a verification gate, and removal of `/tooling/cli/` and `/harness/install`.

Excluded as stated: no artefact hosting, checksum, installer behaviour or package-manager state moved to the website; no routes were added for unreleased or internally operated tools; no compatibility alias was retained for either retired route; `/harness/bootstrap` was left untouched because it is a harness-owned bootstrap script rather than a tool installer.

Immutable baseline `a0bb455a6a28acda03c62d47e16e7a0fa29e972d`. The resulting evidence is the generated `site/dist/` content quoted under Verification below.

### Summary of changes

`site/src/_data/tools.json5` is the new registry. `site/src/tooling/tool.njk` paginates it into `/tooling/<slug>/`, replacing the deleted `site/src/tooling/cli/index.njk`. `site/src/redirects.njk` generates `_redirects` at build time, replacing the hand-maintained `site/src/_redirects` and its passthrough copy in `site/eleventy.config.ts`. `site/src/tooling/index.njk` and `site/src/sitemap.njk` now derive their tool cards and tooling URLs from the registry. `site/scripts/verify-tool-routes.ts` is the new gate, wired into the site workspace `build` script and exposed as `verify:routes`; `knip.json` registers it as an entry point. `docs/guides/tool-routes.md` documents the contract, the registry fields and the per-tool release handoff. `README.md`, `site/src/guidance/using-ki/command-line-interface.md` and `site/src/guidance/cli/local-commands.md` were updated for the new routes.

Three decisions are worth naming.

The verification gate runs inside `ki:site:build` rather than behind a new `ki:site:verify` script. The first attempt added that script and the `ki-engineering` audit correctly rejected it: every `ki:` key must be owned by a declared capability, and the website seam declares `build`, `dev` and `clean` only. Folding the gate into `build` also satisfies the item's requirement that route data is verified before deployment more directly than a separate command would, because `preview` and `deploy` both run through it.

Upstream release drift is reported as a warning rather than a failure. The item asks for endpoints that advance deliberately; making a build fail the moment a tool cuts a release would force the website to follow upstream, which is the behaviour the item rules out. A broken or unreachable installer target is still a hard failure.

The retired-route check matches link and redirect targets, not any occurrence. `site/src/guidance/cli/local-commands.md` legitimately names `/tooling/cli/` in prose to record that `ki` releases up to `v0.3.6` still print that address; a blunt substring check made accurate documentation impossible.

One incidental fix: `site/src/tooling/index.njk` called `kiIcon("terminal")` and `kiIcon("layers")`, neither of which `macros/icons.njk` defines, so both rendered as nothing. The surviving card now uses `archipelago`, and the gate rejects any registry entry naming an undefined icon.

### Verification

`bun run ki:site:clean` then `bun run ki:site:build` — pass; 45 files written, and the folded-in gate reported `4 tool route(s) verified`.

`bun run --cwd site verify:routes -- --network` — pass, no warnings: all four installer targets returned content, and each declared version matched the repository's published latest release (`ki v0.3.6`, `mgit v0.12.0`, `git-almanac v0.1.0`, `rig v0.1.0`).

Generated output inspected directly: `dist/tooling/{ki,mgit,git-almanac,rig}/index.html` exist, `dist/tooling/cli/` is absent, `dist/_redirects` carries one `/install/<tool>` line per entry plus `/harness/bootstrap`, and no `/harness/install` line, and `dist/sitemap.xml` lists the four tool URLs.

`ki repo audit` — `ki-authoring` PASS, `ki-repo-website` and `ki-repo-website-content` PASS, `ki-work-roadmap` PASS, `ki-engineering` PASS (after the script-namespace correction described above).

`bunx @biomejs/biome check` — no errors; 7 warnings, all pre-existing CSS specificity advisories in the unmodified `site/src/assets/css/main.css`. `bunx tsc --noEmit -p site` — clean. `bunx rumdl check` — 54 files, no issues. `bunx knip` — no unused files or dependencies. `git diff --check` — clean.

### Outstanding concerns

Two, both cross-repository and both outside this item's authority to resolve.

`ki manage docs overview` in `tools-ki` up to `v0.3.6` prints the now-retired `https://knowledgeislands.info/tooling/cli/`. Retiring the route without an alias was the item's explicit instruction, so that printed URL is dead until `tools-ki` ships a release naming `/tooling/ki/`. `site/src/guidance/cli/local-commands.md` states this plainly rather than claiming otherwise. A handoff to `tools-ki` is needed.

None of the four installers pins the version it installs. Each is served from an immutable tag, so the _script_ the endpoint serves cannot change underneath a caller, but every script resolves the repository's latest release at run time. The registry's advertised version therefore describes the installer, not necessarily what lands on disk. Closing that gap means changing installer behaviour, which the boundary assigns to each tool repository; a handoff proposing a version-pinning argument or environment variable would be the way to raise it.

The per-tool release handoff described in `docs/guides/tool-routes.md` is documented here but not yet filed as an item in `tools-ki`, `tools-rig`, `tools-mgit` or `tools-git-almanac`. Writing into four other repositories exceeds this record's scope and was deliberately left for an explicit decision.

### Post-change review

The goal is met: every released tool now has the same two routes, generated from one declaration, with release authority untouched. Scope held — the only deviation from the written plan was replacing the planned `ki:site:verify` script with an in-build gate, forced by a governance audit and recorded above.

Regression risk is low but not nil. The two retired routes are genuinely gone, so any external caller of `https://knowledgeislands.info/harness/install` breaks on deploy; that was the instruction, and `README.md` was the only in-repo reference. `_redirects` is now generated, so a future edit to `site/src/_redirects` would silently do nothing — the generated file carries a header saying so. The build now fails when the registry is malformed, which is intended but makes a bad registry edit a build-stopper rather than a quiet content bug.

Acceptance readiness: ready, provided the reviewer accepts the two cross-repository concerns as follow-ups rather than blockers, and decides whether the release-handoff items should be filed into the four tool repositories.

### Mini recap

Delivered the two-route contract for the four released KI tools from one registry at `site/src/_data/tools.json5`, with pages, cards, sitemap entries and `/install/` redirects all generated from it and gated by `site/scripts/verify-tool-routes.ts` inside the site build. `/tooling/cli/` and `/harness/install` are gone with no alias.

Verification: full build plus the route gate offline and networked, the `ki-authoring`, `ki-repo-website`, `ki-repo-website-content`, `ki-work-roadmap` and `ki-engineering` audits, Biome, `tsc`, rumdl, knip and `git diff --check` — all clean.

Concerns: `tools-ki` still prints the retired `/tooling/cli/` address; no installer pins the version it installs; the per-tool release handoff is documented but not filed into the four tool repositories.

Learning routes, proposed only: the `ki:` script namespace is capability-owned, so a new gate belongs inside an existing lifecycle command rather than in a new `ki:` key — worth a line in the repository's engineering notes. The "immutable installer target" idea splits into two properties, an immutable _script_ and a pinned _installed version_, and only the first is achievable from the website side — worth raising with the tool repositories before the phrase is reused in another item.

## Discussion

### Route contract

Use `/tooling/ki/`, `/tooling/rig/`, `/tooling/mgit/`, and `/tooling/git-almanac/` for human-readable product pages. Use `/install/ki`, `/install/rig`, `/install/mgit`, and `/install/git-almanac` for scriptable installer redirects. Documentation should prefer Homebrew when a formula exists and present the website installer endpoint as the stable curl route.

### Authority and trust

The website route is a discoverability and indirection layer, not a new artifact host. Each machine endpoint should redirect only to an installer from an explicit immutable release version. Verification should prove that the target exists and reports the registry's declared version; it should not follow `main` or silently select an upstream latest release.

### Release handoff

Updating the website registry should become a named release follow-up for each participating tool. The handoff must carry the exact version and immutable installer target, while website CI verifies the declared route data before deployment. The implementation should decide whether generated `_redirects` or another data-driven build surface provides the smallest auditable mechanism.

### Related guidance work

`KI-WEB-SITE-002` owns broad consolidation of public explanatory guidance. This item owns the narrower product discovery and installation route contract and can be delivered independently without blocking that future migration.

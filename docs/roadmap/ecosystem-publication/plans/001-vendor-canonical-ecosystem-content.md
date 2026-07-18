---
id: '001'
title: Vendor canonical ecosystem content
status: in-progress
roadmap: ecosystem-publication/vendor-canonical-content-from-the-three-source-repositories
blocks: —
blocked-by: —
---

## Context

The website needs a governed, source-labelled way to publish material from Arcadia Principal, the KI Agentic Harness, and KI Specifications while remaining independently deployable. The first delivery also establishes the stable public bootstrap address.

## Current state

The website has draft working-tree changes for its ecosystem role, a harness landing page, navigation, Decision Records, and a Workers Static Assets redirect. It needs a Specifications publication surface and the four-repository decision topology before its governance and build can be fully audited.

## Steps

1. [x] Establish the website's mirrored GDR001/GDR002 foundations and four-repository README orientation.
2. [x] Add the public Harness and Specifications landing pages, navigation entries, and source-controlled edge redirect for the stable bootstrap address.
3. [x] Add the shared progress-update, verified-unit commit, and lightweight choreography conventions to runtime-neutral guidance.
4. [x] Re-bootstrap the website, then audit its Decision Records and project-roadmap support.
5. [x] Build the website and verify that the redirect directive and both ecosystem pages appear in `site/dist/`.
6. [ ] Verify `curl -fsSL https://knowledgeislands.info/harness/install` resolves to the harness bootstrap script after deployment.

## Files touched

- `.ki-config.toml`
- `README.md`
- `AGENTS.md`
- `ROADMAP.md`
- `docs/decisions/`
- `docs/roadmap/`
- `site/eleventy.config.ts`
- `site/src/_data/site.ts`
- `site/src/_redirects`
- `site/src/harness/index.njk`
- `site/src/specifications/index.njk`

## Verify

`bun run ki:audit` and `bun run ki:site:build` pass in `ki-website`; `site/dist/_redirects` contains the installer redirect; the deployed URL returns the bootstrap script when followed with curl.

## Dependencies / blocks

The bootstrap/audit refresh waits for the in-flight harness bootstrap changes to settle. The deployed redirect verification waits for a Cloudflare deployment or zone rule update.

---
id: '001'
title: Publish stable harness installation entry points
status: in-progress
roadmap: site-experience/publish-stable-harness-installation-entry-points
blocks: —
blocked-by: —
---

## Context

The Website owns the stable public installation routes, while the KI Agentic Harness owns the scripts they resolve to. Publish the two routes from the FND-001 hand-off so users can install the harness once or bootstrap a repository without depending on a raw GitHub URL.

## Current state

`site/src/_redirects` contains only `/harness/install`, and it points to the now-obsolete combined `bootstrap.sh` script. The Harness page describes that route solely as repository bootstrap, and the Website's public-route references name only the one route. The target contract is now distinct: `/harness/install` resolves to `user-install.sh`; `/harness/bootstrap` resolves to `repo-bootstrap.sh`.

At execution start, both target paths returned HTTP 404 on the harness `main` branch, while the local harness worktree contained the new scripts as uncommitted files. The Website owner has explicitly accepted this staged rollout because the routes are not yet in use; the Website may publish its stable bindings before the Harness paths become available.

The local static Worker preview returns the intended 302 locations for both routes. Production deployment remains pending because the current environment has no `CLOUDFLARE_API_TOKEN`; no live route was changed by the attempted deploy.

## Steps

1. ✓ Record the exact intended upstream paths and the accepted staged rollout: the Website publishes its stable contract now, while the Harness completes publication of the target scripts.
2. ✓ Replace the obsolete redirect binding in `site/src/_redirects` with 302 routes for `/harness/install` → `user-install.sh` and `/harness/bootstrap` → `repo-bootstrap.sh`, keeping the friendly Website URLs as the only documented public contract.
3. ✓ Rewrite the Harness installation guidance to distinguish the one-time user installation from repository-scoped bootstrap, show each stable URL, and preserve any documented pinned-ref argument form exactly as accepted by its upstream script.
4. ✓ Update the Website README and mirrored ecosystem decision so their route ownership language names both public entry points and maintains the Website/Harness responsibility boundary.
5. ✓ Build and inspect the deployable `dist/_redirects` file, then use the local Workers preview to assert each friendly path returns the intended 302 `Location`.
6. After deployment, repeat the two assertions against `knowledgeislands.info`.

## Files touched

- `site/src/_redirects`
- `site/src/harness/index.njk`
- `README.md`
- `docs/decisions/GDR-KI-ARCADIA-002-knowledge-islands-ecosystem-fundamentals.md`

## Verify

Run `bun run ki:site:build`, inspect `site/dist/_redirects`, and run `bun run ki:site:preview` with HTTP header checks for both routes. Run `bun run ki:website:audit`, `bun run ki:website-cloudflare:audit`, and `bun run ki:project-roadmap:audit`.

## Dependencies / blocks

This is the independently executable, non-blocking Website hand-off from `ki-agentic-harness` FND-001. It requires only that the named upstream scripts are available at the verified ref before the Website publishes its bindings; it creates no new Website responsibility or route subsystem.

---
id: 'SITE-002'
title: Redirect public installer to verified tools-ki release
status: in-progress
roadmap: site-experience/redirect-the-public-installer-to-the-verified-tools-ki-release
blocks: —
blocked-by: —
baseline-ref: 2b64dac693c0edb079d1ffdf0d202bad476181e2
transferred-from: knowledgeislands/tools-ki:CLI-006
---

## Context

The stable public `/harness/install` URL is a Website route, so the Website owns its redirect configuration and public presentation.

`tools-ki` owns the released installer and its verification evidence. CLI-006 transferred the redirect detail after its own local release work, but the Website must decide and deliver the route change in its own repository.

## Current state

`site/src/_redirects` now sends `/harness/install` to the immutable `v0.2.6` `tools-ki` installer. `/harness/bootstrap` remains the harness bootstrap script.

`tools-ki` published its verified, signed `v0.2.6` release after the successful three-platform release workflow and independent installer proof. The public harness page now distinguishes the tools-owned executable from the harness-owned reusable capabilities.

## Steps

1. ✓ Confirm that `tools-ki` has published a verified, signed release artifact and recorded the end-to-end installer proof required by CLI-006.
2. ✓ Review the released installer entry point with its owner, then replace the `/harness/install` redirect with the approved `tools-ki` target without changing `/harness/bootstrap`.
3. ✓ Update any Website public guidance that names the installer so it describes the released current state and points to the owning `tools-ki` material for executable detail.
4. ✓ Build the site and inspect the generated `_redirects` output before deployment.

## Files touched

- `site/src/_redirects`
- Relevant Website public tooling guidance once it exists
- `docs/roadmap/site-experience/ROADMAP.md` and this plan

## Verify

- `bun run ki:site:build`
- Inspect `site/dist/_redirects` and confirm `/harness/install` names only the approved `tools-ki` installer target
- `ki repo audit --skill ki-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`

## Dependencies / blocks

The external condition is satisfied by `tools-ki` `v0.2.6` and its successful release proof. This plan is now independently executable in the Website repository.

The Website may publish its broader user guide independently, provided it does not present the legacy harness installer as the current public contract.

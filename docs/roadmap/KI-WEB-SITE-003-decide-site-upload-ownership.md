---
id: KI-WEB-SITE-003
title: Decide site upload ownership
area: SITE
theme: site-experience
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
---

## Goal

Decide whether KI Website should retain `ki:site:upload` as a governed Workers version-upload operation or remove the unclaimed package script.

## Context

`KI-HARNESS-GOV-007` requires every supported package script to have one exact skill owner or be removed unless it is genuinely repository-owned external tooling. KI Website currently runs `cd site && bunx wrangler versions upload`; repository history identifies Workers Builds preview uploads as its intended purpose.

Current Cloudflare documentation confirms that `wrangler versions upload` creates a Worker version without deploying it, and Workers Builds uses the command for preview builds. The command still changes remote Cloudflare state and requires credentials, so its safety and authority boundary cannot be inferred from the `ki:site:*` namespace.

## Boundary

Do not run Wrangler, upload a version, deploy a Worker, change Cloudflare settings, or decide the Harness skill contract on behalf of its owner. This item decides the Website's desired supported surface and supplies exact evidence for either a Harness claim or receiver-owned script removal.

## Current state

The package manifest retains `ki:site:upload` beside the governed build, development, preview, and deployment lifecycle. No checked-in caller proves it is needed, but its introducing history and current Workers Builds documentation establish a credible preview-upload use rather than an accidental alias.

## Steps

- [ ] Inspect the introducing commit, current Workers Builds configuration, CI callers, and operator documentation for the version-upload use case.
- [ ] Compare `versions upload` with `deploy`, including credentials, remote-state effects, preview URLs, failure behaviour, and whether an uploaded version can remain undeployed.
- [ ] Decide one outcome: retain it as a proposed `ki-repo-website-cloudflare` operation with an explicit remote-effect authority boundary, or remove it from the Website without an alias.
- [ ] If retained, return the exact command, purpose, safety checks, and verification proposal to `KI-HARNESS-GOV-007`; do not edit the Harness here.
- [ ] If rejected, remove the script and update any exact local documentation or CI reference in the same change.
- [ ] Verify the Website build and repository audits without performing any remote operation.

## Files touched

- `package.json` only if the command is rejected
- Exact local CI or documentation references if they exist
- `docs/roadmap/KI-WEB-SITE-003-decide-site-upload-ownership.md`

## Verify

- `bun run ki:site:build`
- `bun run test` when a test entrypoint exists
- `ki repo audit --skill ki-engineering --repo .`
- `ki repo audit --skill ki-repo-website-cloudflare --repo .`
- Confirm no Wrangler upload, deployment, push, or release occurred during evaluation.

## Dependencies / blocks

No dependency blocks the decision. Retaining the command creates a downstream Harness contract proposal; removing it is independently executable in this repository.

## Documentation impact

### Decision Records

No Decision Record is required unless the outcome changes the Website's deployment strategy rather than one package-script surface.

### Specifications

No product specification change is expected.

### Guides

Update operator guidance only if it currently promises the upload command or if the retained safety boundary needs a supported workflow.

### Roadmap

Return the disposition to `KI-HARNESS-GOV-007`. A retained command remains unimplemented in the Harness until separately accepted there.

## Discussion

The current Cloudflare distinction is useful: uploading creates a version, while deployment chooses what serves traffic. That makes the operation less destructive than deployment but not read-only; a skill claim must still state who may authorize it and how a dry evaluation avoids remote effects.

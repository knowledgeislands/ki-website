---
id: KI-WEB-SITE-003
title: Decide site upload ownership
area: SITE
theme: site-experience
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: 7be731fc987d87aea3e245b6ef163abaf07bf7b9
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

- [x] Inspect the introducing commit, current Workers Builds configuration, CI callers, and operator documentation for the version-upload use case.
- [x] Compare `versions upload` with `deploy`, including credentials, remote-state effects, preview URLs, failure behaviour, and whether an uploaded version can remain undeployed.
- [x] Decide one outcome: retain it as a proposed `ki-repo-website-cloudflare` operation with an explicit remote-effect authority boundary, or remove it from the Website without an alias.
- [x] If retained, return the exact command, purpose, safety checks, and verification proposal to `KI-HARNESS-GOV-007`; do not edit the Harness here.
- [x] If rejected, remove the script and update any exact local documentation or CI reference in the same change.
- [x] Verify the Website build and repository audits without performing any remote operation.

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

## Decision

Retain `ki:site:upload` as the Website-owned invocation of a proposed `ki-repo-website-cloudflare` operation. Commit `64744124e036ebf90ebd78e387afbd994a1452f3` introduced the exact command to route Workers Builds through the repository's site role, and neither checked-in CI nor operator guidance calls it directly. That absence is consistent with an externally configured Workers Builds command, not evidence that the script is unused.

The downstream Harness proposal is exact:

- **Command:** `cd site && bunx wrangler versions upload`.
- **Purpose:** create a Cloudflare Worker version and its preview endpoint for an intentional Workers Builds preview without selecting that version to serve production traffic.
- **Remote effect:** the command authenticates to Cloudflare and creates remote account state. It is less traffic-affecting than `wrangler deploy`, but it is not read-only and an uploaded version may remain undeployed.
- **Authority boundary:** only an explicitly authorised operator or Cloudflare build service may execute it with credentials for the intended Worker. Repository audits, conformance, local builds, tests, and dry evaluation must inspect the manifest without invoking the command.
- **Failure boundary:** authentication, configuration, compilation, or upload failure must fail the caller; no audit may probe those conditions against a live account.
- **Safe verification:** assert the exact manifest value, run the ordinary local site build, and audit `ki-engineering`, `ki-repo-website-cloudflare`, and `ki-authoring`. Do not execute Wrangler.

The distinction follows Cloudflare's [Versions and Deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/) contract and the [`wrangler versions upload` command reference](https://developers.cloudflare.com/workers/wrangler/commands/#versions-upload). No package, CI, guide, or deployment-strategy change is needed in Website.

## Documentation impact

### Decision Records

No Decision Record is required unless the outcome changes the Website's deployment strategy rather than one package-script surface.

### Specifications

No product specification change is expected.

### Guides

Update operator guidance only if it currently promises the upload command or if the retained safety boundary needs a supported workflow.

### Roadmap

Return the disposition to `KI-HARNESS-GOV-007`. A retained command remains unimplemented in the Harness until separately accepted there.

## Review

### Delivered

Against immutable baseline `7be731fc987d87aea3e245b6ef163abaf07bf7b9`, decided to retain `ki:site:upload` and supplied the exact purpose, remote-effect authority boundary, failure boundary, and safe local verification proposal needed by `KI-HARNESS-GOV-007`. No package script or external configuration changed.

### Summary of changes

The record now distinguishes an externally configured Workers Builds hook from a checked-in caller, connects its provenance to commit `64744124e036ebf90ebd78e387afbd994a1452f3`, and classifies version upload as a credentialed remote mutation that does not itself select production traffic. It explicitly prohibits Wrangler execution during audits and dry evaluation.

### Verification

`bun run ki:site:build`, `ki repo audit --skill ki-engineering --repo .`, `ki repo audit --skill ki-repo-website-cloudflare --repo .`, and `ki repo audit --skill ki-authoring --repo .` passed. A manifest-only assertion confirmed the exact upload command without executing it. This repository has no `test` script, so no absent entrypoint was invoked.

### Outstanding concerns

The Harness does not yet claim this operation; `KI-HARNESS-GOV-007` remains the owning contract decision. Website's actual Workers Builds setting is external Cloudflare state and was deliberately not inspected or changed. Those are downstream ownership and deployment concerns, not defects in this local disposition.

### Post-change review

The retained command has a credible platform purpose and an explicit non-read-only boundary. The change introduces no public contract, package dependency, generated output, remote state, or hidden alias. No remedial Website work is required before acceptance.

### Mini recap

`KI-WEB-SITE-003` is ready to close under `KI-WEB-BATCH-001`: retain the exact upload command, never run it during safe verification, and return its proposed ownership contract to the Harness. Closure recheck must confirm the review packet, local audits, and absence of any Wrangler upload, deployment, push, or release.

## Done

Accepted at `2026-08-29T23:01:30Z` under the exact closure grant in `KI-WEB-BATCH-001`. The canonical review packet, roadmap and authoring audits, unchanged manifest assertion, and absence of any Wrangler upload, deployment, push, or release were rechecked immediately before closure.

## Discussion

The current Cloudflare distinction is useful: uploading creates a version, while deployment chooses what serves traffic. That makes the operation less destructive than deployment but not read-only; a skill claim must still state who may authorize it and how a dry evaluation avoids remote effects.

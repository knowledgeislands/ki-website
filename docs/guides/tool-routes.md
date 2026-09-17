# Tool routes

How the website publishes a page and an installation endpoint for each released Knowledge Islands command-line tool, and what each tool repository hands over when it releases.

## The contract

Every released tool has exactly two public routes.

| Route | Audience | What it is |
| --- | --- | --- |
| `/tooling/<tool>/` | People | The product page: what the tool is for, how to install it, and where its owner lives. |
| `/install/<tool>` | Machines | A `302` to the installer published at the tool's declared immutable release tag. |

Both are generated from one declaration, so a tool's page, its endpoint, and the version it advertises cannot drift apart. The routes are a discoverability and indirection layer. The website hosts no artefact, computes no checksum, and makes no promise about what an installer does once it runs — the tool repository, its GitHub release, and the [Homebrew tap](https://github.com/knowledgeislands/homebrew-tap) keep those authorities.

A tool earns routes by being released and generally usable. A `tools-*` repository name is not sufficient: unreleased tools and internally operated tools stay off the site.

## The registry

[`site/src/_data/tools.json5`](../../site/src/_data/tools.json5) is the single declaration. Each entry carries:

| Field | Meaning |
| --- | --- |
| `slug` | The route segment for both `/tooling/<slug>/` and `/install/<slug>`. |
| `name` | The executable as a user types it. |
| `tagline` | One sentence, used on cards and as the page headline. |
| `description` | A fuller paragraph for the product page. |
| `repository` | The canonical source repository. |
| `version` | The published release the site currently advertises. |
| `maturity` | `stable`, `preview`, or `experimental`.† |
| `formula` | The Homebrew formula in `knowledgeislands/tap`, or `null` when the tool is not tapped. |
| `installer` | The immutable installer target the machine route redirects to. |
| `manual` | The human manual at the declared version. |
| `changelog` | The release history at the declared version. |
| `icon` | A KI symbol name defined in `src/_includes/macros/icons.njk`. |
| `accent` | The card accent: `gold`, `teal`, or `forest`. |

† `stable` means a `1.x` or later release its owner recommends for general use; `preview` means a pre-`1.0` tool with an established shape whose interface may still move; `experimental` means an early release published mainly for evaluation.

`installer`, `manual`, and `changelog` must all read from the same explicit tag as `version`. A `main`, `master`, or bare-branch URL is rejected: an endpoint that follows a branch stops being a deliberate recommendation and silently republishes whatever the tool's default branch happens to hold.

## Adding or advancing a tool

Advancing the registry is a **named release follow-up owned by the releasing repository**, not something the website discovers. After a tool publishes a release it intends to recommend, it hands the website an item naming the exact version and the immutable installer target, following the cross-repository convention in [AGENTS.md](../../AGENTS.md).

The website then edits the registry entry — `version`, `installer`, `manual`, `changelog`, and `maturity` if it changed — and ships. Nothing else needs touching: the page, the card, the sitemap entry, and the redirect are all generated.

Because the handoff is explicit, a newer upstream release does not change the site until someone decides it should. That is the point: the endpoint is a recommendation, and recommendations advance deliberately.

## Verification

`bun run ki:site:build` runs the gate automatically after Eleventy writes `dist/`, so a broken declaration fails the build that a deployment is cut from. Run it directly from the site workspace when iterating on the registry:

```bash
bun run --cwd site verify:routes              # registry shape and immutable-ref discipline
bun run --cwd site verify:routes -- --network # additionally reach each installer and report upstream drift
```

Offline, the gate checks that every entry is complete and well-formed, that slugs are unique, that versions are exact `v`-prefixed semantic versions, that every URL is pinned to the declared tag under the `knowledgeislands` owner, that each icon name actually exists in the icon macro, and that no page still names a retired route. When `dist/` is present it also checks that every tool page and `/install/<tool>` line was generated, and that the retired `/tooling/cli/` directory and `/harness/install` line are gone.

With `--network` it fetches each installer target — a failure means the declared route is broken — and compares the declared version against the repository's published latest release. Upstream drift is reported as a **warning**, not a failure, so a tool releasing does not break the website build; it tells whoever is looking that a handoff is outstanding.

## Retired routes

`/harness/install` and `/tooling/cli/` are gone; `/install/ki` and `/tooling/ki/` replace them. No compatibility redirect is kept, because a permanent alias for a route that was only ever special-cased would preserve exactly the inconsistency the contract removes.

`/harness/bootstrap` is unaffected. It is a repository-bootstrap script owned by the KI Agentic Harness rather than a tool installer, so it is not part of this contract and keeps its own route.

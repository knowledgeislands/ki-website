# Cloudflare

The KI Website is deployed as a Cloudflare Worker serving the static files generated in `site/dist/`. The versioned Worker configuration lives in `site/wrangler.jsonc`; this guide records the complementary settings owned by the Cloudflare dashboard.

## Workers Builds

Configure the Git-connected Workers Build from the repository root with these exact values:

- Production branch: `main`
- Build command: `bun run ki:site:build`
- Deploy command: `bun run ki:site:deploy`
- Root directory: repository root

Do not configure a Pages deploy directory. The `assets.directory` field in `site/wrangler.jsonc` selects the generated output.

## Domains

The canonical domain is `knowledgeislands.info`. The Worker also receives `www.knowledgeislands.info`; configure a permanent Cloudflare redirect from `www` to the canonical apex while preserving the request path and query string.

Keep the `workers.dev` route disabled for the production service unless an operator explicitly decides to retain it as a diagnostic endpoint.

## Operations

Pushing `main` triggers Workers Builds. Local build, audit, and conformance commands must not execute `ki:site:deploy` or `ki:site:upload`; both are credentialed remote mutations and require explicit operator authority.

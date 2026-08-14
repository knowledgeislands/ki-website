# CLAUDE.md — ki-website

Always-loaded orientation for an agent working in this repo. The full picture is in [README.md](README.md); this file is the short anchor.

Read [AGENTS.md](AGENTS.md) first for the shared runtime-neutral progress and commit convention.

## What this repo is

The public-facing **Knowledge Islands** website — a static site built with the house web stack: **Eleventy 3 + Nunjucks + Markdown, TypeScript run natively on Bun, Tailwind 4 (config-less, semantic design tokens)** — compiled to a portable `dist/` that can be served from any root.

## Working here

- **The neutral website seam** follows `ki-repo-website`: the root exposes the `ki:site:build`, `ki:site:dev`, and `ki:site:clean` lifecycle and the site emits a reproducible `site/dist/`.
- **The content implementation** follows `ki-repo-website-content` — the Eleventy/Nunjucks/Tailwind layout, the `src/_includes/{layouts,partials}/` structure, `tokens.css` design tokens, the portable-`dist/` URL transform, and SEO. Run `ki repo audit --skill ki-repo-website-content --repo .` before shipping a structural change.
- **The toolchain** (package.json scripts, `tsconfig`, `biome`) follows `ki-engineering`; the `bun run ki:lint:*` family is the gate.
- **Markdown / TOML style** follows `ki-authoring`; `ki repo audit --skill ki-authoring --repo .` is the mechanical Markdown gate.
- **The repo shape** is a **monorepo** (`ki-engineering` §0): the root `package.json` declares `"workspaces": ["site"]` and the site lives in the `site/` workspace (`site/eleventy.config.ts`, `site/src/`, `site/tsconfig.json`). The generated output is `site/dist/`; root site scripts carry the `ki:site:` prefix.
- **Hosting** follows `ki-repo-website-cloudflare` (Workers Static Assets serving `site/dist/`); `wrangler.jsonc` lives in `site/` (`assets.directory: "dist"`), and the `ki:site:deploy` / `ki:site:preview` / `ki:site:clean` scripts are the entry points.

## Toolchain

[Bun](https://bun.sh) for install/dev.

```bash
bun install         # install deps and wire the husky pre-commit hook
bun run ki:site:dev    # Tailwind watch + Eleventy serve on http://localhost:3000
bun run ki:site:build  # compile the site to dist/
bun run ki:lint:check  # Biome (TypeScript + JSON)
ki repo audit --skill ki-authoring --repo .  # rumdl check for authored Markdown
bun run ki:lint:types  # tsc --noEmit -p site
```

<!-- headroom:learn:start -->

- When removing or renaming a route, run `bun run ki:site:clean` before `bun run ki:site:build`; an ordinary Eleventy build can retain obsolete output in `site/dist/`.

<!-- headroom:learn:end -->

# CLAUDE.md — arcadia-website

Always-loaded orientation for an agent working in this repo. The full picture is in [README.md](README.md); this file is the short anchor.

## What this repo is

The public-facing **Knowledge Islands** website — a static site built with the house web stack: **Eleventy 3 + Nunjucks + Markdown, TypeScript run natively on Bun, Tailwind 4 (config-less, semantic design tokens)** — compiled to a portable `dist/` that can be served from any root.

## Working here

- **The build standard** is the `knowledgeislands-11ty-websites` skill — the Eleventy/Nunjucks/Tailwind layout, the `src/_includes/{layouts,partials}/` structure, `tokens.css` design tokens, the portable-`dist/` URL transform, and SEO. Run its AUDIT before shipping a structural change.
- **The toolchain** (package.json scripts, `tsconfig`, `biome`) follows `knowledgeislands-engineering`; the `bun run ki:lint:*` family is the gate.
- **Markdown / TOML style** follows `knowledgeislands-authoring`; `bun run ki:lint:md` is the mechanical gate.
- **The repo shape** is a **monorepo** (`knowledgeislands-engineering` §0): the root `package.json` declares `"workspaces": ["site"]` and the site lives in the `site/` workspace (`site/eleventy.config.ts`, `site/src/`, `site/tsconfig.json`). `dist/` is built to the repo root; all site scripts carry the `site:` prefix.
- **Hosting** follows `knowledgeislands-cloudflare-hosting` (Workers + Static Assets serving `dist/`); `wrangler.jsonc` lives in `site/` (`assets.directory: "../dist"`), and the `ki:site:deploy` / `ki:site:preview` / `ki:site:clean` scripts are the entry points.

## Toolchain

[Bun](https://bun.sh) for install/dev.

```bash
bun install         # install deps and wire the husky pre-commit hook
bun run ki:site:dev    # Tailwind watch + Eleventy serve on http://localhost:3000
bun run ki:site:build  # compile the site to dist/
bun run ki:lint:check  # Biome (TypeScript + JSON)
bun run ki:lint:md     # Prettier + markdownlint over Markdown
bun run ki:lint:types  # tsc --noEmit -p site
```

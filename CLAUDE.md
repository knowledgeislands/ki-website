# CLAUDE.md — ki-website

@AGENTS.md

Always-loaded orientation for an agent working in this repo. The full picture is in [README.md](README.md); this file is the short anchor.

Read [AGENTS.md](AGENTS.md) first for the shared runtime-neutral progress and commit convention.

## What this repo is

The public-facing **Knowledge Islands** website — a static site built with the house web stack: **Eleventy 3 + Nunjucks + Markdown, TypeScript run natively on Bun, Tailwind 4 (config-less, semantic design tokens)** — compiled to a portable `dist/` that can be served from any root.

## Working here

- **The neutral website seam** follows `ki-repo-website`: the root exposes the `ki:site:build`, `ki:site:dev`, and `ki:site:clean` lifecycle and the site emits a reproducible `apps/site/dist/`.
- **The content implementation** follows `ki-repo-website-content` — the Eleventy/Nunjucks/Tailwind layout, the `src/_includes/{layouts,partials}/` structure, `tokens.css` design tokens, the portable-`dist/` URL transform, and SEO. Run `ki repo audit --skill ki-repo-website-content --repo .` before shipping a structural change.
- **The toolchain** (package.json scripts, `tsconfig`, `biome`) follows `ki-engineering`; `ki repo audit --skill ki-engineering --repo .` is the gate. The per-tool `ki:lint:*` script family was retired by `ADR-KI-HARNESS-TOOLCHAIN-001`; those checks now resolve through the native rubric, and `ki:deps:update` is the one script-seam exception.
- **Published guidance** restates material other repositories own, so every page declares its upstream `sources` in frontmatter and publishes them through `partials/sources.njk`. `verify:guidance` gates the declaration during `ki:site:build`; see [docs/guides/developer/guidance-provenance.md](docs/guides/developer/guidance-provenance.md).
- **A guide belongs to the project it is about**, at `apps/site/src/projects/<slug>/<page>.md`, bound by the directory data file beside it rather than by its own frontmatter. `apps/site/src/guidance/` holds only what belongs to no project. `verify:guides` gates the shape — an opening claim, and no link text that hands the reader off to a repository; see [docs/guides/developer/project-guides.md](docs/guides/developer/project-guides.md).
- **Markdown / TOML style** follows `ki-authoring`; `ki repo audit --skill ki-authoring --repo .` is the mechanical Markdown gate.
- **The repo shape** is a **monorepo** (`ki-engineering` §0): the root `package.json` declares `"workspaces": ["apps/*"]` and the site lives in the canonical `apps/site` workspace (`apps/site/eleventy.config.ts`, `apps/site/src/`, `apps/site/tsconfig.json`). The generated output is `apps/site/dist/`; root site scripts carry the `ki:site:` prefix and delegate through Turborepo, which owns the task graph (`turbo.json`).
- **Hosting** follows `ki-repo-website-cloudflare` (Workers Static Assets serving `apps/site/dist/`); `wrangler.jsonc` lives in `apps/site/` (`assets.directory: "dist"`), and the `ki:site:deploy` / `ki:site:preview` / `ki:site:clean` scripts are the entry points.

## Toolchain

[Bun](https://bun.sh) for install/dev.

```bash
bun install         # install deps and wire the husky pre-commit hook
bun run ki:site:dev    # Tailwind watch + Eleventy serve on http://localhost:3000
bun run ki:site:build  # compile the site to dist/
ki repo audit --skill ki-engineering --repo .  # toolchain gate: Biome, TypeScript, scripts
ki repo audit --skill ki-authoring --repo .  # rumdl check for authored Markdown
bun run --cwd apps/site verify:guidance -- --network  # report guidance pages whose upstream has moved
```

<!-- headroom:learn:start -->

- When removing or renaming a route, run `bun run ki:site:clean` before `bun run ki:site:build`; an ordinary Eleventy build can retain obsolete output in `apps/site/dist/`.

<!-- headroom:learn:end -->

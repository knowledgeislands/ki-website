# CLAUDE.md — arcadia-website

Always-loaded orientation for an agent working in this repo. The full picture is in [README.md](README.md); this file is the short anchor.

## What this repo is

The public-facing **Knowledge Islands** website — a static site built with the house web stack: **Eleventy 3 + Nunjucks + Markdown,
TypeScript run natively on Bun, Tailwind 4 (config-less, semantic design tokens)** — compiled to a portable `dist/` that can be served from
any root.

## Working here

- **The build standard** is the `knowledgeislands-11ty-websites` skill — the Eleventy/Nunjucks/Tailwind layout, the
  `src/_includes/{layouts,partials}/` structure, `tokens.css` design tokens, the portable-`dist/` URL transform, and SEO. Run its AUDIT
  before shipping a structural change.
- **The toolchain** (package.json scripts, `tsconfig`, `biome`) follows `knowledgeislands-engineering`; the `bun run lint:*` family is the
  gate.
- **Markdown / TOML style** follows `knowledgeislands-authoring`; `bun run lint:md` is the mechanical gate.
- **Hosting**, once the site is deployed, follows `knowledgeislands-cloudflare-hosting` (Workers + Static Assets serving `dist/`); add its
  `[knowledgeislands-cloudflare-hosting]` opt-in table to `.ki-config.toml` at that point.

## Toolchain

[Bun](https://bun.sh) for install/dev.

```bash
bun install        # install deps and wire the husky pre-commit hook
bun run dev        # Tailwind watch + Eleventy serve on http://localhost:3000
bun run build      # compile the site to dist/
bun run lint:check # Biome (TypeScript + JSON)
bun run lint:md    # Prettier + markdownlint over Markdown
bun run lint:types # tsc --noEmit
```

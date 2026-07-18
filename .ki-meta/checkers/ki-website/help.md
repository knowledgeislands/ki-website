# ki-website

Codifies, audits, and enforces the Knowledge Islands static-site standard: Eleventy 3 with Nunjucks and Markdown, TypeScript run natively on Bun, Tailwind 4 in config-less mode with semantic design tokens, and a portable `dist/` output.

**Invoke:** `ki-website audit <repo> | conform <repo> | help | educate <repo> | refresh`

**Modes:**

- `AUDIT` — check a site against the standard
- `CONFORM` — bring a site up to standard
- `EDUCATE` — scaffold a new site
- `HELP` — explain this skill and stop; the default when no mode is given (then routes, if interactive)
- `REFRESH` — re-anchor the standard to its sources

**See also:** Builds on ki-engineering (the aggregate/scoped Bun code-toolchain gate) and ki-authoring (Markdown style); for deploying the built `dist/` to Cloudflare use ki-website-cloudflare.

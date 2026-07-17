# ki-website-cloudflare

Codify, audit, conform, and scaffold the Knowledge Islands house convention for serving a built static site on Cloudflare — Workers + Static Assets (not Pages), one `wrangler.jsonc` pointing `assets.directory` at the site's `dist/`, custom-domain routes, observability, and the `ki:site:deploy` script family.

**Invoke:** `ki-website-cloudflare audit <repo> | conform <repo> | help | educate <repo> | refresh`

**Modes:**

- `AUDIT` — check a site's hosting against the standard
- `CONFORM` — bring a site's hosting up to standard
- `EDUCATE` — scaffold a site's hosting
- `HELP` — explain this skill and stop; the default when no mode is given (then routes, if interactive)
- `REFRESH` — re-anchor the standard to its sources

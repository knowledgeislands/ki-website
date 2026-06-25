# arcadia-website roadmap

The forward view for the public Knowledge Islands website. The [README](README.md) covers what exists today; this file is what's next.

## Done

- **Build out the site beyond the placeholder.** Three content pages (Homepage, Philosophy, Model), the full KI colour palette in
  `tokens.css`, Google Fonts (Playfair Display + Inter), nav/footer partials, component utilities in `main.css`, and a complete `site.ts`
  data file with nav. Built from `arcadia-principal/Pillars/Knowledge Islands/` content and the `Pillars/Aesthetics/Visual Style/` brand
  guide.

## Now

- **Deploy to Cloudflare.** `wrangler.jsonc` is already configured (apex + www custom domains). Declare the
  `[knowledgeislands-cloudflare-hosting]` opt-in in `.ki-config.toml` once the site is ready to publish. Ship `sitemap.xml` and `robots.txt`
  before going public.

## Next

- **Responsive layout pass.** Current layout uses CSS Grid with fixed columns on the philosophy/model pages — the sticky TOC and two-column
  grids need `@media` breakpoints or Tailwind responsive prefixes for mobile. Target: works cleanly at 375px.

- **Replace inline `style=""` with Tailwind utilities.** The pages use inline styles heavily for expedience. A systematic pass to replace
  these with Tailwind utility classes (using the `@theme inline` tokens) will make the markup cleaner and easier to maintain.

- **Replace emoji icons with on-brand SVGs.** The symbol vocabulary defined in `Pillars/Aesthetics/Symbol Library/` (Island, Lighthouse,
  Harbour, Observatory, Route, Current) should replace the placeholder emoji. The isometric tile artwork could back a visual "island
  geography" diagram on the homepage or philosophy page.

- **Illustration / diagram section.** The `Pillars/Aesthetics/Diagrams/` folder has three key visualisations (Knowledge Islands in Cycle,
  Agent model, Geography). A dedicated visual section on the philosophy page would make the model tangible.

- **Getting Started / Arcadia page.** A third content page showing how to adopt the model — the concrete steps from "nothing" to "operating
  island". Draws from the Realisation layer in `Pillars/Knowledge Islands/Realisation/`.

- **Dark mode.** The colour system supports it — ocean/navy for dark surfaces, parchment for light. Add a `prefers-color-scheme: dark` block
  to `tokens.css`.

- **Open Graph image.** Generate a static OG image (island hero + wordmark) for social sharing. The `seo-meta.njk` partial already has the
  `og:image` meta tag slot waiting.

- **`sitemap.xml` and `robots.txt`.** Required before deployment. Eleventy plugin or a static file in `src/`.

## Future

- **Contribution / Community page.** Explain the Contribution Process — how other islands can propose additions to the shared model and
  participate in the archipelago.

- **Interactive island geography diagram.** A visual, interactive version of the Capital/Library/Streams/Harbour geography — SVG or canvas,
  using the isometric tile set from the Aesthetics pillar.

- **Multilingual support.** The model is language-agnostic; the website could support additional languages using Eleventy's i18n plugin.

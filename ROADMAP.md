# arcadia-website roadmap

The forward view for the public Knowledge Islands website. The [README](README.md) covers what exists today; this file is what's next.

## Done

- **Build out the site beyond the placeholder.** Three content pages (Homepage, Philosophy, Model), the full KI colour palette in
  `tokens.css`, Google Fonts (Playfair Display + Inter), nav/footer partials, component utilities in `main.css`, and a complete `site.ts`
  data file with nav.

- **Deploy to Cloudflare.** Live at [knowledgeislands.info](https://knowledgeislands.info) and
  [www.knowledgeislands.info](https://www.knowledgeislands.info) via Cloudflare Workers Static Assets. `sitemap.xml` and `robots.txt` ship
  with the build.

- **Responsive layout pass.** All section grids collapse cleanly at 375px. Sticky TOC hidden on mobile, `grid-5col` orphan fixed (last item
  spans full row), hero padding reduced, footer bottom bar wraps.

- **Replace inline `style=""` with Tailwind utilities.** Systematic pass replaced `font-family`, `color`, `padding`, `margin`, and layout
  inline styles with component classes (`.overline`, `.overline-gold`, `.text-muted`, `.section-pad`, `.card-ki`, `.section-*`, etc.).

- **Replace emoji icons with on-brand SVGs.** `macros/icons.njk` Nunjucks macro ships 13 KI symbol SVGs (island, lighthouse, compass, tree,
  route, anchor, archipelago, harbour, stellar, book, weave, grid, current). All placeholder emoji replaced across homepage, philosophy, and
  model pages.

- **Illustration / diagram sections.** Philosophy page now has: a triangular flow diagram for the Knowledge Cycle (Capture → Connect →
  Reflect) and a vertical geography flow diagram (Outside World → Harbour → Streams → Library / Council Hall).

- **Get Started / Arcadia page.** Fourth page at `/get-started/` covering: what Arcadia is (the canonical living instance), the four-stage
  Contribution Process (Harbour → Streams → Enactment → Library), the three island requirements (Charter, Knowledge Capital, Contribution
  Process), and territory/archipelago federation. Added as the third nav item.

- **Open Graph image.** 1200×630 PNG (navy gradient, KI island logo, Georgia serif heading, gold accent) generated from SVG via
  `rsvg-convert`. `seo-meta.njk` now emits `og:image`, `og:image:width/height`, `twitter:image`, `og:url`, and `rel=canonical` using
  `site.url` — canonical links were silently skipped before because `site.url` was unset.

- **Dark mode.** `prefers-color-scheme: dark` block in `main.css`: light surfaces (`section-parchment`, `html` bg, `section-mist`) switch to
  dark navy tones; headings get a lighter tint (#7ab0d8) visible on dark surfaces; cards, symbol circles, prose, and token overrides
  (`--color-ink`, `--color-border`, `--color-teal`, `--color-gold`) all covered. Dark sections (ocean/navy) unchanged.

## Next

- **Homepage → Get Started CTA.** The homepage currently only links to Philosophy and Model in the footer CTA. Add a "Get Started" card or
  link in the hero / territories section to complete the reading funnel.

- **Inline SVG diagram polish.** The cycle and home geography diagrams use hardcoded hex fills — they remain legible in dark mode but their
  white box fills and light ring strokes are visually inverted. Add `@media (prefers-color-scheme: dark)` rules scoped to the diagram
  containers, or switch fill values to `currentColor`-based tokens.

## Future

- **Interactive island geography diagram.** A visual, interactive version of the Capital/Library/Streams/Harbour geography — SVG or canvas,
  using the isometric tile set from the Aesthetics pillar.

- **Contribution / Community page.** An external-facing page explaining how other islands and teams can propose additions to the shared
  canonical model and participate in the wider archipelago. Distinct from the Get Started page (which covers internal setup); this covers
  the federated contribution mechanics.

- **Multilingual support.** The model is language-agnostic; the website could support additional languages using Eleventy's i18n plugin.

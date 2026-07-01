# arcadia-website roadmap

The forward view for the public Knowledge Islands website. The [README](README.md) covers what exists today; this file is what's next.

## Next

- **Source content from arcadia-principal (KB-first).** The site currently mirrors the harness `docs/` tree — pages are maintained in that repo and copied in. Wire the 11ty build to source from arcadia-principal notes (or a curated export) instead, so the KB is the single source of truth and the site publishes it outward rather than duplicating harness documentation. The first body of content is the KB tool-ecosystem documentation from the `Streams/Active/Agentic Tool Documentation Proposal` stream in arcadia-principal.

- **Homepage → Get Started CTA.** The homepage currently only links to Philosophy and Model in the footer CTA. Add a "Get Started" card or link in the hero / territories section to complete the reading funnel.

- **Inline SVG diagram polish.** The cycle and home geography diagrams use hardcoded hex fills — they remain legible in dark mode but their white box fills and light ring strokes are visually inverted. Add `@media (prefers-color-scheme: dark)` rules scoped to the diagram containers, or switch fill values to `currentColor`-based tokens.

## Future

- **Interactive island geography diagram.** A visual, interactive version of the Capital/Library/Streams/Harbour geography — SVG or canvas, using the isometric tile set from the Aesthetics pillar.

- **Contribution / Community page.** An external-facing page explaining how other islands and teams can propose additions to the shared canonical model and participate in the wider archipelago. Distinct from the Get Started page (which covers internal setup); this covers the federated contribution mechanics.

- **Multilingual support.** The model is language-agnostic; the website could support additional languages using Eleventy's i18n plugin.

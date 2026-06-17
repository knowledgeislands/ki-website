# arcadia-website roadmap

The forward view for the public Knowledge Islands website. The [README](README.md) covers what exists today; this file is what's next.

## Now

- **Build out the site beyond the placeholder.** The structure now conforms to the `knowledgeislands-11ty-websites` standard (a `base.njk`
  layout, the `seo-meta` partial, a `tokens.css` design-token layer), but the content is still a single placeholder landing page. Add the
  real pages, navigation, and content, and resample `tokens.css` from the brand's actual visual identity.

## Later

- **Deploy to Cloudflare.** Add the `knowledgeislands-cloudflare-hosting` setup — a `wrangler.jsonc` pointing Workers + Static Assets at
  `dist/`, a custom-domain route — and declare the `[knowledgeislands-cloudflare-hosting]` opt-in table in `.ki-config.toml` once the site
  is ready to publish. A public site should also ship `sitemap.xml` and `robots.txt`.

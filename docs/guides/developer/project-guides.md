# Project guides

A guide on this site belongs to the project it is about. This guide says where a project guide lives, what it has to contain, and what `verify:guides` refuses.

The arrangement itself — why there is no general guidance section, and why a page's identity comes from its directory rather than from its own frontmatter — is [ADR-KI-WEBSITE-003](../../decisions/ADR-KI-WEBSITE-003-a-page-lives-with-what-it-is-about.md).

## Where a guide lives

```text
apps/site/src/projects/<slug>/<page>.md   →   /projects/<slug>/<page>/
```

`<slug>` is a `slug` in [`src/_data/projects.json5`](../../../apps/site/src/_data/projects.json5). See [the projects directory](projects-directory.md) for the registry itself.

## What binds a guide to its project

The directory, through a data file named after it:

```json5
// apps/site/src/projects/ki/ki.json5
{
  layout: 'layouts/page.njk',
  project: 'ki'
}
```

Every page beside that file inherits both keys, so a guide added later is owned, styled and listed because of where it lives rather than because someone remembered three frontmatter lines. `project` keys the `guides` collection; `layout` gives the page its measure, its prose styling and its [provenance footer](prose-styling.md).

`verify:guides` checks the data file against the registry: the directory name has to be a registered slug, `project` has to match the directory, and the layout has to be the prose layout. A renamed slug therefore fails the build rather than quietly breaking the link.

The page's own frontmatter carries `title`, `description`, `permalink`, its `sources` declaration, and `order` — the position it takes in its project's list. `order` is required and must be a positive whole number no other guide in that project holds. It is not optional, because the alternative is a reading order that decays: an unpositioned page sorts last, so every guide added without one appends itself and the sequence drifts toward the order things were written in, with nothing failing to say so.

## What a guide has to contain

### It opens with a claim

Prose before the first `##`, saying what the reader will be able to do. At least 120 characters of it. A guide that opens by describing itself — "this page summarises the material in X" — has told the reader nothing they can act on.

### It does not defer

Link text may not be a hand-off phrase:

`the full guide`, `full guide`, `the full documentation`, `full documentation`, `see the README`, `see the docs`, `see the documentation`, `read more`, `more here`, `learn more`, `the guide`, and a bare `here`, `docs`, `documentation`, `README` or `this page`.

A link into a repository is fine, and often right, when it cites a fact the page has already stated: _the installer published at `v0.4.0`_, _the VS Code management procedure shipped with `v0.4.0`_. It is wrong when it is the place the answer lives. The test, from GDR-KI-WEBSITE-002, is whether the link survives as a fact rather than as a destination — remove the link and the sentence should still say something true and useful.

This is the rule the whole arrangement exists for. A page that moved out of `/guidance/` and still ends by pointing at a README has changed its URL and nothing else.

### It declares its provenance

`sources` or `sources: original`, exactly as before — see [page provenance](page-provenance.md). `verify:guidance` reads `src/projects/` alongside the trees that belong to no project, so moving a page is not a way to shed its declaration.

## How a guide is found

Three things happen without the page doing anything:

- **The project page lists it.** `projects/project.njk` renders a Guides block from the `guides` collection, filtered to its own slug and sorted by `order`. A project with no guides renders no block.
- **It carries a way back up.** `partials/up-link.njk` renders a link to the project whenever `project` is set, which is the page that lists its siblings.
- **The sitemap includes it**, from the same collection.

`verify:reachable` holds `dist/projects/` to the same standard as the other published trees: a guide that nothing links to fails the build.

## What belongs to no project

Two things, and they live apart because they are not one collection (KI-WEB-SITE-028). `apps/site/src/prompting/` holds the model prompting guides, which cite vendor documentation rather than Knowledge Islands repositories and are the site's own material in a way a project guide is not. `apps/site/src/optional-tools/` holds the one page about a reader's own machine. Neither is a project guide, so neither carries a `project` binding, and neither is listed by a project page.

## Running the check

```bash
bun run --cwd apps/site verify:guides
```

It runs inside `bun run ki:site:build`, and reads source rather than `dist/`, so it can run before a build.

## Feeding the shape back

`tools-ki` and `ki-agentic-harness` own their own `docs/guides/`, and the contract above is worth adopting there — particularly the opening claim and the no-deferral rule, which are not specific to a website. That is a handoff to those repositories, not something this repository changes on their behalf.

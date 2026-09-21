# Guidance provenance

How every published guidance page records what it was written from, and how a refresh sweep finds the pages whose upstream has moved.

[Deciding what this site publishes](guidance-ownership.md) sets out when the site restates material that another repository owns. This guide is the mechanism that makes restating safe: the page declares its sources in frontmatter, and a check reads that declaration rather than relying on anyone's memory.

## The problem this solves

The site's derived accounts drift from their sources by design — the drift is the point, because the site is writing for a different reader. What is not acceptable is drift nobody can see. Before this declaration existed, `/guidance/skills/catalogue/` restated harness skill descriptions with nothing recording that fact, so a skill could be renamed upstream and the site would keep describing the old one until a person happened to notice.

The [tool routes](tool-routes.md) registry already solved the same problem for versions: `tools.json5` pins an exact release, and `verify:routes --network` warns when upstream has published a newer one. Provenance applies that shape to prose.

## The declaration

Every Markdown page under `apps/site/src/guidance/` carries a `sources` key in its frontmatter.

```yaml
---
layout: layouts/base.njk
title: Canonical batch records
description: Prepare, bind, and close an exact-set batch authority envelope.
permalink: /guidance/cli/batch-records/
sources:
  - repository: knowledgeislands/tools-ki
    path: docs/guides/user/batch-records.md
    ref: v0.4.0
    governs: 'The envelope mechanics and the authority ki batch does not grant'
    reviewed: '2026-09-21'
---
```

Quote `governs` and `reviewed`. An unquoted `reviewed` is read as a date by the frontmatter parser and renders as a timestamp; an unquoted `governs` containing a colon is ambiguous.

| Field | Meaning |
| --- | --- |
| `repository` | The `owner/repo` that owns the upstream document. Use this **or** `url`, never both. |
| `path` | The upstream document, relative to that repository's root. Required with `repository`. |
| `ref` | The exact tag or 40-character commit the page was written from. Required with `repository`.† |
| `url` | An external source that is not a Knowledge Islands repository — vendor model documentation, a standards body. |
| `title` | The readable name the published table links by. Required with `url`; optional for a repository source, which falls back to `repository/path`. |
| `governs` | What in _this_ page came from that source. One sentence, so a refresh knows which section to re-read. |
| `reviewed` | The ISO date a person last checked this page against that source. |

† A branch name is rejected. `main` moves, so a page claiming to be written from `main` records nothing a sweep can compare against. Tags are preferred where the source repository releases; a commit SHA is the correct choice for a repository that has no tags yet, and several `mcp-*` repositories are in exactly that position.

A page with no upstream — written here, about this ecosystem, restating nothing — declares that explicitly:

```yaml
sources: original
```

This is a claim, not a default. It says someone decided the page has no source, which is different from nobody having filled the field in.

## Publishing the declaration

The frontmatter is not an internal note. Every guidance page ends with

```njk
{% include "partials/sources.njk" %}
```

which renders the `sources` list as the page's **Sources** table, linking each repository source at its pinned ref. A page declaring `sources: original` renders nothing.

The check requires that include. A citation readers cannot see is not a citation, and a hand-written table beside a frontmatter declaration is two records that will disagree — which is the failure this whole mechanism exists to prevent. The prompting guides previously carried exactly such a hand-written table; it is now generated from the same declaration the sweep reads.

## The sweep

```bash
bun run --cwd apps/site verify:guidance            # declaration shape only
bun run --cwd apps/site verify:guidance -- --network  # additionally compare each ref against upstream
```

Offline, the check confirms that every guidance page declares `sources`, that entries carry a usable shape, that `repository` entries name a `knowledgeislands` repository and pin an immutable ref, and that `reviewed` is a real date that is not in the future.

With `--network`, it resolves each pinned ref against the upstream repository and reports the pages whose source document has changed since. Those are reported as **warnings, not failures**, for the same reason tool-route drift is: an upstream repository editing its own guide must never break this site's build. The warning says a refresh is owed, and refusing to publish until someone performs it would punish the wrong repository.

`verify:guidance` runs as part of `bun run ki:site:build`, so a page cannot reach `dist/` without a declaration.

## Refreshing a page

1. Run the sweep with `--network` and take the reported pages.
2. Read the upstream document at the new ref against the `governs` sentence — that sentence exists to stop this step becoming a full re-read.
3. Revise the site's prose where the change matters **to this site's reader**. Most upstream changes will not. Deciding that a change does not warrant a revision is a real outcome, not a skipped step.
4. Advance `ref` and `reviewed` together. Advancing `reviewed` without `ref` records a review of a source you did not look at; advancing `ref` without `reviewed` claims a review that did not happen.

Step 3 is where restating earns its keep. If every upstream change forced a matching edit here, the page would be a copy, and [the ownership test](guidance-ownership.md#the-test) would have told you to link to it instead.

## What this does not cover

Provenance records where prose came from. It makes no promise that the upstream document is correct, that it still exists at `main`, or that its repository is public — the [projects directory](projects-directory.md) rules on publicity still apply, and a page must not cite a source no reader can open. A private repository can be an honest source for the site's understanding, but it cannot be a published citation.

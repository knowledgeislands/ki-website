# Guidance provenance

How every published guidance page records what it was written from, and how a refresh sweep finds the pages whose upstream has moved.

[Deciding what this site publishes](guidance-ownership.md) sets out how much of another repository's material the site carries. This guide is the mechanism that makes carrying it safe: the page declares its sources in frontmatter, and a check reads that declaration rather than relying on anyone's memory.

The two are easy to confuse and do different jobs. **Ownership decides what the site says; provenance decides what the site cites.** Since [GDR-KI-WEBSITE-002](../../decisions/GDR-KI-WEBSITE-002-carrying-material-for-readers.md) made carrying the default, the site restates more of what it cites than it used to — so this declaration matters more than it did, not less.

## The problem this solves

The site's derived accounts drift from their sources by design — the drift is the point, because the site is writing for a different reader. What is not acceptable is drift nobody can see. Before this declaration existed, `/guidance/skills/catalogue/` restated harness skill descriptions with nothing recording that fact, so a skill could be renamed upstream and the site would keep describing the old one until a person happened to notice.

The [tool routes](tool-routes.md) contract already solved the same problem for versions: a released tool pins an exact release in the registry, and `verify:routes --network` warns when upstream has published a newer one. Provenance applies that shape to prose.

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

### Vendored pages

A third case sits between the two. A **vendored** page declares `sources` in the ordinary way but does not restate them: it reproduces an upstream artefact and renders it. `/guidance/skills/catalogue/` is the one that exists today, rendering the harness's generated capability inventory from `apps/site/src/_data/skillCatalogue.json5` — see [ADR-KI-WEBSITE-001](../../decisions/ADR-KI-WEBSITE-001-vendoring-the-harness-capability-catalogue.md).

Vendoring is the right answer only where the upstream artefact is itself a specified interface and the site adds nothing by rewording it. That is a narrow case: the catalogue qualifies because `ki-repo-harness` names its markers normatively and fixes its fields, and because an inventory reworded is still an inventory. Most guidance is not like that, and [the ownership test](guidance-ownership.md#the-test) still decides.

Refresh a vendored page by re-running its sync at a new ref and advancing the declared `ref` and `reviewed` in the same change:

```bash
bun run --cwd apps/site sync:skills -- --ref <tag-or-commit>
```

The snapshot's ref and the page's declared ref must agree, and the check **fails** when they do not — offline, unlike everything else in this guide. Upstream moving is not the site's fault and warns; the site citing one ref while publishing another is the site contradicting itself, and no amount of upstream good behaviour will fix it.

Nothing is fetched during a build. `apps/site/dist/` has to be reproducible, so a build that reached the network would depend on when it ran.

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

GitHub allows unauthenticated callers sixty requests an hour, and a full `--network` sweep resolves more than that. Set `GITHUB_TOKEN` (`GITHUB_TOKEN="$(gh auth token)"`) to lift the limit. Without one, the first refusal stops the remaining network checks and says so; a refusal is never reported as a missing document, because "GitHub declined to answer" and "the upstream deleted it" are different facts and only one of them is worth acting on.

## Links the prose makes

A page also links upstream documents it never restated — an ADR it points a reader at, a guide it defers to. Those are not `sources`, and until the sweep looked at them nothing did. Two links sat published against documents the harness had deliberately removed: a retirement guide deleted in August, and a skills diagram replaced by a written guide three days later. Both were found by hand, which is not a mechanism.

So `--network` also extracts every `https://github.com/knowledgeislands/<repo>/blob/<ref>/<path>` link from each page's body and resolves it. Links inside inline code count — a page quoting what `ki manage docs manual` prints is making the same promise to the reader as a Markdown link. Identical targets are resolved once however many pages carry them.

An unresolvable link is a **warning**, on the same reasoning as drift: an upstream repository retiring its own document must not break this site's build. The warning names every page carrying the link, because a retired document is usually cited from more than one.

Unlike `sources`, a prose link may point at `main`. A reader following a link wants the current document, and pinning prose links would freeze a reader's view of a living repository at whatever ref the page was last revised — the opposite of what the link is for. The check resolves whatever ref the link names.

## Refreshing a page

1. Run the sweep with `--network` and take the reported pages.
2. Read the upstream document at the new ref against the `governs` sentence — that sentence exists to stop this step becoming a full re-read.
3. Revise the site's prose where the change matters **to this site's reader**. Most upstream changes will not. Deciding that a change does not warrant a revision is a real outcome, not a skipped step.
4. Advance `ref` and `reviewed` together. Advancing `reviewed` without `ref` records a review of a source you did not look at; advancing `ref` without `reviewed` claims a review that did not happen.

Step 3 is where restating earns its keep. If every upstream change forced a matching edit here, the page would be a copy, and [the ownership test](guidance-ownership.md#the-test) would have told you to link to it instead.

## What this does not cover

Provenance records where prose came from. It makes no promise that the upstream document is correct, that a pinned source still exists at `main`, or that its repository is public — the [projects directory](projects-directory.md) rules on publicity still apply, and a page must not cite a source no reader can open. A private repository can be an honest source for the site's understanding, but it cannot be a published citation.

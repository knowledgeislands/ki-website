---
id: KI-WEB-SITE-031
area: SITE
title: Rename the developer guides
theme: site-experience
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:06:42Z
---

## Goal

A maintainer scanning `docs/guides/developer/` can tell from each filename what it governs. No guide is named after a directory it no longer belongs to, and the word "guidance" stops meaning three different things in one collection.

## Context

Three developer guides carry a `guidance-` prefix from when `apps/site/src/guidance/` held every published page:

- `guidance-ownership.md`, titled "Deciding what this site publishes"
- `guidance-provenance.md`, on the `sources` declaration every page carries
- `guidance-reachability.md`, on the build's proof that every page can be reached by navigating

After `KI-WEB-SITE-025`, all three govern `src/projects/` as well as `src/guidance/`, and each says so explicitly in its opening lines. The prefix now points at the smaller half of what each file covers — fifteen residual pages, against the nineteen that moved and everything published since.

`guidance-ownership.md` is the sharpest case: its filename and its own title do not agree, so a reader searching for where the publishing decision is documented has two names to guess between.

The prefix also collides with itself. "Guidance" currently names a directory, a top-level navigation entry, a build gate (`verify:guidance`), and the general category of explanatory writing. Three of those are about to change meaning or disappear under `KI-WEB-SITE-028`.

Against renaming: the gate is still called `verify:guidance`, so `guidance-provenance.md` matches the script it documents; and `ADR-KI-WEBSITE-001` and `ADR-KI-WEBSITE-003` both deep-link `guidance-ownership.md#the-test`, so a rename touches the decision records too. Neither is a reason not to do it, but both are work the item owns.

## Boundary

This item renames files and updates every reference to them. It does not rewrite any guide's content beyond the sentences that name a renamed file, and it does not merge or split guides — each keeps its subject. It does not rename `verify:guidance` or any script, gate, or npm script. It does not rename the `apps/site/src/guidance/` directory or the navigation entry, which are `KI-WEB-SITE-028`. It does not touch `docs/decisions/` bodies beyond repairing link targets.

## Current state

`docs/guides/developer/` holds ten files: `README.md`, `cloudflare.md`, `tool-routes.md`, `projects-directory.md`, `prose-styling.md`, `project-guides.md`, and the three `guidance-*` files. Seven of the ten are named for their subject; three are named for a directory.

Every relative link across `docs/` currently resolves. Inbound references to the three files come from `docs/guides/README.md`, `docs/guides/developer/README.md`, the guides themselves, `AGENTS.md`, and two ADRs — one of which deep-links an anchor.

## Steps

- [ ] Choose names that describe the subject rather than the directory, and check each against the collection so no two guides read as the same topic.
- [ ] Rename with `git mv` so history follows the file.
- [ ] Update `docs/guides/README.md`, `docs/guides/developer/README.md`, cross-links between the guides, and `AGENTS.md`.
- [ ] Repair the `#the-test` deep links in `ADR-KI-WEBSITE-001` and `ADR-KI-WEBSITE-003`, and confirm the anchor still exists under any heading the rename prompts.
- [ ] Reread each renamed guide's opening paragraph so it introduces the subject the new name promises.
- [ ] Sweep `docs/` and `apps/site/` for stale references, including script comments.

## Files touched

- `docs/guides/developer/guidance-{ownership,provenance,reachability}.md`
- `docs/guides/README.md`, `docs/guides/developer/README.md`
- `docs/decisions/ADR-KI-WEBSITE-001-*.md`, `docs/decisions/ADR-KI-WEBSITE-003-*.md`
- `AGENTS.md`

## Verify

- `ki repo audit --skill ki-guides --repo .` and `ki repo audit --skill ki-decision-records --repo .` pass.
- Every relative link in `docs/` and `AGENTS.md` resolves, anchors included.
- `grep -rn 'guidance-ownership\|guidance-provenance\|guidance-reachability' .` returns nothing outside history.
- `bun run ki:site:build` passes — the guides are not published, but the scripts they document are.
- Read the directory listing cold: each filename predicts its contents.

## Dependencies / blocks

Nothing blocks this. It is cheaper after `KI-WEB-SITE-030`, which may merge the two ADRs that deep-link `guidance-ownership.md`, and after `KI-WEB-SITE-028`, which decides what the word "guidance" will mean on the site. Running it first means repairing the same links twice. Sequencing preference, not build order.

## Documentation impact

### Decision Records

None. Renaming a file does not change a decision. Two records need their link targets repaired, which is maintenance of a present-state collection rather than a change to what it decides.

### Specifications

None. No published route or interface involves these filenames.

### Guides

The three renamed files, plus the two READMEs that index them, are the delivery.

### Roadmap

None expected.

## Discussion

### Candidate names

`guidance-ownership.md` should take its own title's subject — something like `what-to-publish.md` — which resolves the filename-versus-title mismatch in the same move.

`guidance-provenance.md` and `guidance-reachability.md` both lose nothing by dropping the prefix outright: `provenance.md` and `reachability.md` are unambiguous within a collection of ten files, and the alternative of a `published-` prefix reintroduces the same problem in a new word.

Worth deciding together rather than one at a time, because the prefix's only real job was grouping, and dropping it from all three keeps the grouping that `README.md`'s "Published guidance" section already provides.

### Why a rename is worth the link repair

The cost is bounded and one-off: six or seven files, all inside this repository, all covered by the link check. The benefit is paid every time someone looks for where a rule lives. A name that describes a directory rather than a subject is a small tax on comprehension that never stops being charged, and this collection is the one maintainers read when they are already unsure.

### The gate name

`verify:guidance` will keep its name, which leaves `provenance.md` documenting a script whose name it no longer echoes. That is acceptable — the guide explains the gate in its first lines — and renaming a gate wired into `package.json` and Turborepo's task graph is a different kind of change for a smaller gain. If the word disappears from the site entirely under `KI-WEB-SITE-028`, the gate name becomes worth revisiting on its own.

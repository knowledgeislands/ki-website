---
id: KI-WEB-SITE-031
area: SITE
title: Rename the developer guides
theme: site-experience
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: bda856fad54384385e338085d1deecfe8aaa0f01
created_at: 2026-09-24T08:06:42Z
updated_at: 2026-09-24T08:40:09Z
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

Delivered. All ten files in `docs/guides/developer/` are now named for their subject: `guidance-ownership.md` became `what-to-publish.md`, `guidance-provenance.md` became `page-provenance.md`, and `guidance-reachability.md` became `page-reachability.md`, each with `git mv` so history follows.

The inbound references turned out to be wider than the survey found. Beyond the two READMEs, the cross-links between the guides, `AGENTS.md` and the two ADRs, three `apps/site/scripts/*.ts` header comments, `partials/sources.njk` and two generated data files under `src/_data/` also named a renamed file. All were repointed. `docs/roadmap/` was deliberately left alone: an accepted record stating which file an item touched is a historical statement, and rewriting it would falsify the record rather than update it.

Every relative link and anchor across `docs/` and the root Markdown resolves, `#the-test` included.

## Steps

- [x] Choose names that describe the subject rather than the directory, and check each against the collection so no two guides read as the same topic.
- [x] Rename with `git mv` so history follows the file.
- [x] Update `docs/guides/README.md`, `docs/guides/developer/README.md`, cross-links between the guides, and `AGENTS.md`.
- [x] Repair the `#the-test` deep links in `ADR-KI-WEBSITE-001` and `ADR-KI-WEBSITE-003`, and confirm the anchor still exists under any heading the rename prompts.
- [x] Reread each renamed guide's opening paragraph so it introduces the subject the new name promises.
- [x] Sweep `docs/` and `apps/site/` for stale references, including script comments.

## Files touched

- `docs/guides/developer/guidance-{ownership,provenance,reachability}.md` → `what-to-publish.md`, `page-provenance.md`, `page-reachability.md`
- `docs/guides/README.md`, `docs/guides/developer/README.md`, `docs/guides/developer/{project-guides,projects-directory}.md`
- `docs/decisions/ADR-KI-WEBSITE-001-vendoring-a-published-inventory.md`, `docs/decisions/ADR-KI-WEBSITE-003-a-page-lives-with-what-it-is-about.md`, `docs/decisions/GDR-KI-WEBSITE-002-carrying-material-for-readers.md`
- `AGENTS.md`
- `apps/site/scripts/{verify-guidance-sources,sync-skill-catalogue,sync-cli-commands}.ts`, `apps/site/src/_includes/partials/sources.njk`
- `apps/site/src/_data/{skillCatalogue,cliCommands}.json5` — generated files carrying a comment that named a renamed guide
- `docs/roadmap/KI-WEB-SITE-031-rename-the-developer-guides.md`

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

## Review

### Delivered

`docs/guides/developer/` reads as a collection of subjects rather than a collection of prefixes. A maintainer looking for where the publishing decision lives finds `what-to-publish.md`, whose filename and title now agree; a maintainer looking for the `sources` contract finds `page-provenance.md`; a maintainer looking for the reachability gate finds `page-reachability.md`. Nothing is named after `apps/site/src/guidance/`, which `KI-WEB-SITE-028` removed.

### Change Summary

Three `git mv` renames, then every inbound reference repointed. `page-provenance.md` and `page-reachability.md` took new H1s to match their filenames; `what-to-publish.md` kept the title it already had, because the rename brought the filename to the title rather than the other way round. Link text followed: "Guidance provenance" became "Page provenance" wherever it appeared.

Two section headings moved off the word: `docs/guides/developer/README.md`'s `## Published guidance` became `## Published pages`, and both READMEs' introductory sentences were reworded to describe a page rather than a category. The three guides' own opening lines were reread and three residual uses of "guidance page" were corrected where the word now names nothing — including one in `page-reachability.md` that described "the residual guidance pages", a collection that no longer exists.

`verify:guidance` keeps its name, as the item's Boundary set out.

### Verification

A link checker walked every relative link in `docs/` and the root Markdown, resolving each target and, where the link carried a fragment, checking the anchor against the target file's headings: all resolve, `what-to-publish.md#the-test` from both ADRs included. `grep -rn 'guidance-ownership\|guidance-provenance\|guidance-reachability'` across the tree returns hits only under `docs/roadmap/`, which is the history the Verify section exempts.

`bun run ki:site:clean && bun run ki:site:build` passes, which matters because two of the repointed references are in generated data files and one is in a Nunjucks partial. `ki repo audit --skill ki-authoring`, `--skill ki-guides`, `--skill ki-decision-records` and `--skill ki-work-roadmap` all pass.

### Outstanding concerns

**A bulk rewrite reached `docs/roadmap/` and had to be undone.** The reference sweep rewrote three accepted roadmap records — 026, 030 and 031 itself — turning statements about which file an item touched at the time into statements about a file that did not then exist. The damage to 031 was self-referential and absurd: its own Context began arguing that `what-to-publish.md` should be renamed to `what-to-publish.md`. All three were restored with `git checkout` before anything was staged. `AGENTS.md` already carries the rule that a bulk rewrite stays inside `apps/site/src/` and that `git diff --stat -- docs/` is checked before staging; the rule is right and was not followed, and the only reason it cost nothing is that the diff was read.

The gate name is now the one place the old vocabulary survives in live code. `page-provenance.md` documents a script called `verify-guidance-sources.ts`, run as `verify:guidance`. That was a deliberate exclusion — renaming a gate wired into `package.json` and Turborepo's task graph is a different kind of change — but it means the guide opens by explaining a name it no longer shares. The question is `KI-WEB-SITE-033`, so the exclusion outlives this record.

`docs/roadmap/` now names files that do not exist. That is correct and is how the standard treats an accepted record, but a reader following a filename out of an old item will not find it.

### Post-change review

The goal is met and the cost was the predicted one: the renames were trivial and the reference repair was the work. The survey in `## Current state` underestimated that repair by about half — it listed six inbound references and there were thirteen, because it looked in `docs/` and the references were also in script headers, a template partial and two generated files. That is the ordinary shape of this mistake: prose references are the ones you think of, and the ones in code are the ones that break a build.

The risk introduced is close to nil. No route, no permalink, no published URL and no gate name changed; the files are not published, so no reader has a stale link. The one durable change is that a maintainer scanning the directory gets ten filenames that each predict their contents.

### Mini recap

`KI-WEB-SITE-031` renamed the three `guidance-*` developer guides to `what-to-publish.md`, `page-provenance.md` and `page-reachability.md`, and repointed thirteen inbound references across the decision records, both READMEs, `AGENTS.md`, three scripts, a Nunjucks partial and two generated data files. Section headings and opening paragraphs were reworded off a word that now names nothing. `docs/roadmap/` was left as history, after a bulk rewrite briefly falsified three records and was reverted. Every relative link and anchor resolves, and the clean build and four skill audits pass.

## Done

Accepted 2026-09-24 by Kris Brown on the review packet above.

## Discussion

### Candidate names

`guidance-ownership.md` should take its own title's subject — something like `what-to-publish.md` — which resolves the filename-versus-title mismatch in the same move.

`guidance-provenance.md` and `guidance-reachability.md` both lose nothing by dropping the prefix outright: `provenance.md` and `reachability.md` are unambiguous within a collection of ten files, and the alternative of a `published-` prefix reintroduces the same problem in a new word.

Worth deciding together rather than one at a time, because the prefix's only real job was grouping, and dropping it from all three keeps the grouping that `README.md`'s "Published guidance" section already provides.

### Why a rename is worth the link repair

The cost is bounded and one-off: six or seven files, all inside this repository, all covered by the link check. The benefit is paid every time someone looks for where a rule lives. A name that describes a directory rather than a subject is a small tax on comprehension that never stops being charged, and this collection is the one maintainers read when they are already unsure.

### The gate name

`verify:guidance` will keep its name, which leaves `provenance.md` documenting a script whose name it no longer echoes. That is acceptable — the guide explains the gate in its first lines — and renaming a gate wired into `package.json` and Turborepo's task graph is a different kind of change for a smaller gain. If the word disappears from the site entirely under `KI-WEB-SITE-028`, the gate name becomes worth revisiting on its own.

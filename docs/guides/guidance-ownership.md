# Deciding what this site publishes

How to decide whether a piece of public explanatory writing belongs on the website or in the repository that currently holds it.

The website is the public home for user, prompting, and cross-skill-composition guidance. That does not make it the home for every document that happens to be public — most Knowledge Islands repositories hold explanation that is correctly placed where it is, and moving it would make it wrong.

## The test

Ask: **does this document age with a version?**

If it does, it stays in its source repository. A guide that describes how a specific release behaves, or that cites a specification corpus it ships alongside, cannot be copied here and stay true — the copy is frozen at the moment it was taken while the original moves on. Link to it instead, pinned at an explicit tag.

If it does not, the website is a candidate. Explanation that routes a reader, orients a newcomer, or compares options is durable in a way that release notes and operator procedures are not, and it belongs where a reader will actually look.

The test people reach for first — "is this public?" — does not discriminate. Nearly all of it is public. The question is whether the document has a version it is true of.

## What the test decided

The `KI-WEB-SITE-002` inventory applied it across the six primary public repositories and found the migration surface much smaller than expected:

| Material | Outcome |
| --- | --- |
| `ki-specifications` informative documents | Stay. Versioned with the KIS corpus they describe. |
| `tools-ki` operator guides | Stay. Each describes a specific CLI release; several cite `docs/specs/`. |
| `ki-agentic-harness` developer guides, generated catalogues, diagrams | Stay. Source-coupled. |
| `ki-agentic-harness` outcome-to-skill routing | Moved. Routes a reader to a capability; no version to age against. |
| `ki-plugins`, `ki-arcadia-principal` | Nothing applicable. |

Four of six repositories held nothing that should move. What was missing was not material but **routes into it** — the site had no way to reach the specifications adoption path or the CLI operator guides. Adding a link solved more than a migration would have.

## Two different problems

Keep these apart:

- **"This is hard to find."** Fix with a link or an index page. Cheap, reversible, no other repository involved.
- **"This is in the wrong repository."** Fix with a migration. Needs the owning repository's agreement, and is not done until the old source is removed or reduced to a pointer.

Treating the first as the second is the common error. It produces cross-repository work for something a one-line link would have fixed.

## Migration discipline

When a document does move:

1. Copy it verbatim. Rewrite only the frontmatter and any relative links. A migration that also edits prose cannot be checked against its source; one that does not can be verified with a single equality assertion.
2. File a record in the owning repository to reduce its copy to a pointer, and say which file.
3. Do not consider the migration complete while two copies exist. Recorded divergence is better than silent divergence, but it is still divergence.

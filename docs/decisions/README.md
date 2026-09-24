# Decision Records - KI Website

This directory holds the significant, durable decisions for the KI Website. Records use the Knowledge Islands Decision Records format and are living present-state records: update the record when the decision changes, rather than adding a supersession chain.

## Reading order

1. [GDR-KI-WEBSITE-001](GDR-KI-WEBSITE-001-adopting-decision-records.md) - adopts Decision Records for this repository.
2. [GDR-KI-FUNDAMENTALS-001](GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md) - routing responsibility, repository structures and boundaries, and ecosystem coordination.
3. [GDR-KI-WEBSITE-002](GDR-KI-WEBSITE-002-carrying-material-for-readers.md) - reverses the publishing default so the site carries what a reader needs rather than routing them to a repository, and names vendoring as the outcome for material that changes per release.
4. [ADR-KI-WEBSITE-001](ADR-KI-WEBSITE-001-vendoring-a-published-inventory.md) - vendors the skill catalogue and the `ki` command inventory from their upstreams at pinned refs, and states what the parse owes when the upstream is published but not specified.
5. [ADR-KI-WEBSITE-002](ADR-KI-WEBSITE-002-one-section-for-every-project.md) - merges the tooling section into projects, leaving one registry and one section for every public repository.
6. [ADR-KI-WEBSITE-003](ADR-KI-WEBSITE-003-a-page-lives-with-what-it-is-about.md) - dissolves the guidance section, putting each guide under the project it is about and each remaining collection under a name that says what it holds.

`ADR-KI-WEBSITE-003` previously recorded the `ki` command inventory as a second vendoring decision. It reached the same conclusion as `ADR-KI-WEBSITE-001` over a weaker upstream, so the two were merged into the one record that owns the concern, and the distinction it drew between a specified and a merely published interface is carried there in full. The freed serial was reused rather than left as a hole. One peer citation moved with it: `KI-TOOL-CLI-080` in `tools-ki` names the vendoring record by identifier and now names `ADR-KI-WEBSITE-001`.

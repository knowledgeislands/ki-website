# Site experience roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Homepage -> Get Started CTA

The homepage currently only links to Philosophy and Model in the footer CTA. Add a "Get Started" card or link in the hero / territories section to complete the reading funnel.

### Inline SVG diagram polish

The cycle and home geography diagrams use hardcoded hex fills - they remain legible in dark mode but their white box fills and light ring strokes are visually inverted. Add `@media (prefers-color-scheme: dark)` rules scoped to the diagram containers, or switch fill values to `currentColor`-based tokens.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Publish stable harness installation entry points

Origin: `ki-agentic-harness` FND-001. This is an independently executable, non-blocking cross-repository hand-off.

Publish these stable user-facing routes for shell installation:

- `https://knowledgeislands.info/harness/install` serves or redirects to `https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/user-install.sh`.
- `https://knowledgeislands.info/harness/bootstrap` serves or redirects to `https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/repo-bootstrap.sh`.

The routes are the documented contract. The raw GitHub script paths are implementation locations and may change only with a corresponding route-binding update. Both shell entry points must retain their own caller-supplied arguments, including a pinned ref.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Interactive island geography diagram _(candidate)_

A visual, interactive version of the Capital/Library/Streams/Harbour geography - SVG or canvas, using the isometric tile set from the Aesthetics pillar.

### Contribution / Community page _(candidate)_

An external-facing page explaining how other islands and teams can propose additions to the shared canonical model and participate in the wider archipelago. Distinct from the Get Started page (which covers internal setup); this covers the federated contribution mechanics.

### Multilingual support _(candidate)_

The model is language-agnostic; the website could support additional languages using Eleventy's i18n plugin.

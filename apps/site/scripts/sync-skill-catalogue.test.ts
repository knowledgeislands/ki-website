import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { CATALOGUE_END, CATALOGUE_START, parseCatalogue } from './sync-skill-catalogue.ts'

/** Mirrors the upstream block's shape: a preamble stating counts, domain headings, uniform entries. */
const block = (body: string, counts = '2 skills: 1 governance skills and 1 process skills'): string =>
  [
    '# skills',
    '',
    'Prose above the block, which the parser must ignore.',
    '',
    CATALOGUE_START,
    '## Generated capability catalogue',
    '',
    `This source harness publishes ${counts}. The entries below are generated from canonical \`SKILL.md\` frontmatter.`,
    '',
    body,
    CATALOGUE_END,
    '',
    'Prose below the block, which the parser must also ignore.'
  ].join('\n')

const governance = [
  '### Governance',
  '',
  '#### `ki-authoring`',
  '',
  'Governs Markdown and TOML style across the estate.',
  '',
  '- **Kind:** Governance',
  '- **Applicability:** Detected',
  '- **Arguments:** `audit <repo> | conform <repo>`',
  '- **Dependencies:** `ki-git`, `ki-repo`',
  '- **Runtime:** Portable',
  ''
].join('\n')

const processSkill = [
  '### Change Management',
  '',
  '#### `ki-plan`',
  '',
  'Shapes a selected item through the explicit Ready gate, then stops.',
  '',
  '- **Kind:** Process',
  '- **Applicability:** Invocation Only',
  '- **Arguments:** `<item>`',
  '- **Dependencies:** None',
  '- **Runtime:** Runtime-bound: `claude-code`',
  ''
].join('\n')

describe('parseCatalogue', () => {
  test('reads entries grouped by domain, ignoring prose outside the markers', () => {
    const catalogue = parseCatalogue(block(`${governance}\n${processSkill}`))

    assert.equal(catalogue.domains.length, 2)
    assert.deepEqual(
      catalogue.domains.map((domain) => domain.name),
      ['Governance', 'Change Management']
    )
    assert.deepEqual(catalogue.counts, { total: 2, governance: 1, process: 1 })
  })

  test('carries every published field verbatim, in the order upstream lists them', () => {
    const [skill] = parseCatalogue(block(`${governance}\n${processSkill}`)).domains[0].skills

    assert.equal(skill.name, 'ki-authoring')
    assert.equal(skill.description, 'Governs Markdown and TOML style across the estate.')
    assert.equal(skill.kind, 'Governance')
    assert.deepEqual(skill.fields, [
      { label: 'Kind', value: 'Governance' },
      { label: 'Applicability', value: 'Detected' },
      { label: 'Arguments', value: '`audit <repo> | conform <repo>`' },
      { label: 'Dependencies', value: '`ki-git`, `ki-repo`' },
      { label: 'Runtime', value: 'Portable' }
    ])
  })

  test('carries an optional field in its published position', () => {
    const detected = governance.replace('- **Runtime:** Portable', '- **Detects:** `*.md`\n- **Runtime:** Portable')
    const [skill] = parseCatalogue(block(`${detected}\n${processSkill}`)).domains[0].skills

    assert.deepEqual(
      skill.fields.map((field) => field.label),
      ['Kind', 'Applicability', 'Arguments', 'Dependencies', 'Detects', 'Runtime']
    )
    assert.equal(skill.description, 'Governs Markdown and TOML style across the estate.')
  })

  test('refuses a block whose declared counts disagree with its entries', () => {
    const wrong = block(`${governance}\n${processSkill}`, '3 skills: 2 governance skills and 1 process skills')

    assert.throws(() => parseCatalogue(wrong), /parsed 2 skills .* but the block declares 3/)
  })

  test('refuses an entry missing a published field', () => {
    const incomplete = governance.replace('- **Runtime:** Portable\n', '')
    const counts = '1 skills: 1 governance skills and 0 process skills'

    assert.throws(() => parseCatalogue(block(incomplete, counts)), /ki-authoring: entry is missing Runtime/)
  })

  test('refuses an unrecognised Kind rather than dropping the entry from both counts', () => {
    const odd = governance.replace('- **Kind:** Governance', '- **Kind:** Something else')
    const counts = '1 skills: 1 governance skills and 0 process skills'

    assert.throws(() => parseCatalogue(block(odd, counts)), /ki-authoring: Kind is "Something else"/)
  })

  test('refuses a document with no markers', () => {
    assert.throws(() => parseCatalogue('# skills\n\nNo catalogue here.\n'), /markers not found/)
  })

  test('refuses reversed markers', () => {
    const reversed = `${CATALOGUE_END}\n## Generated capability catalogue\n\n${CATALOGUE_START}\n`

    assert.throws(() => parseCatalogue(reversed), /reversed/)
  })

  test('refuses a preamble that states no counts, since the parse would be unchecked', () => {
    const silent = [CATALOGUE_START, '## Generated capability catalogue', '', governance, CATALOGUE_END].join('\n')

    assert.throws(() => parseCatalogue(silent), /does not state its skill counts/)
  })
})

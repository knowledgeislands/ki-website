/**
 * Vendors the harness's generated capability catalogue into site data.
 *
 * `/projects/ki-agentic-harness/skill-catalogue/` used to restate all sixty-one skills in hand-written prose, which is
 * the one guidance page where the derived account added nothing: it was the upstream inventory,
 * reworded, and it rotted accordingly. The harness already publishes that inventory as a specified
 * interface — `ki-repo-harness` names the two markers normatively and fixes the fields between them
 * — so the site consumes it rather than paraphrasing it.
 *
 * The snapshot is vendored at an immutable ref rather than fetched during the build. `apps/site/dist/`
 * must be reproducible, and a build that reached the network would depend on when it ran. Drift is
 * caught by the ordinary provenance sweep, because the page still declares the same `sources` entry.
 *
 * Usage: bun scripts/sync-skill-catalogue.ts --ref <tag-or-commit>
 * See docs/guides/developer/guidance-provenance.md.
 */

import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const CATALOGUE_START = '<!-- ki-repo-harness:capability-catalogue:start -->'
export const CATALOGUE_END = '<!-- ki-repo-harness:capability-catalogue:end -->'

const SOURCE_REPOSITORY = 'knowledgeislands/ki-agentic-harness'
const SOURCE_PATH = 'skills/README.md'

const tagPattern = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/
const commitPattern = /^[0-9a-f]{40}$/

export interface CatalogueField {
  label: string
  value: string
}

export interface CatalogueSkill {
  name: string
  description: string
  kind: string
  /** The published fields in the order upstream lists them, carried verbatim so the page renders a copy. */
  fields: CatalogueField[]
}

export interface CatalogueDomain {
  name: string
  skills: CatalogueSkill[]
}

export interface Catalogue {
  counts: { total: number; governance: number; process: number }
  domains: CatalogueDomain[]
}

/** Field values arrive as Markdown bullets; the label is fixed by the upstream standard. */
const fieldPattern = /^- \*\*([A-Za-z]+):\*\* (.+)$/

const REQUIRED_FIELDS = ['Kind', 'Applicability', 'Arguments', 'Dependencies', 'Runtime']

const parseSkill = (name: string, body: string): CatalogueSkill => {
  const lines = body.split('\n')
  const description = lines
    .filter((line) => !fieldPattern.test(line))
    .join('\n')
    .trim()

  if (description === '') throw new Error(`${name}: entry carries no description`)

  const fields: CatalogueField[] = []
  for (const line of lines) {
    const match = line.match(fieldPattern)
    if (match) fields.push({ label: match[1], value: match[2].trim() })
  }

  const labels = fields.map((field) => field.label)
  const missing = REQUIRED_FIELDS.filter((field) => !labels.includes(field))
  if (missing.length > 0) {
    throw new Error(`${name}: entry is missing ${missing.join(', ')}`)
  }

  const kind = fields.find((field) => field.label === 'Kind')?.value as string
  if (kind !== 'Governance' && kind !== 'Process') {
    throw new Error(`${name}: Kind is "${kind}", expected Governance or Process`)
  }

  return { name, description, kind, fields }
}

/**
 * Parses the marker-delimited block out of the harness's `skills/README.md`.
 *
 * Every failure here is thrown rather than worked around. The block is a published contract, so a
 * shape this parser does not recognise means the contract changed — and a catalogue that silently
 * degrades to fewer skills is worse than one that refuses to build, because nobody would notice.
 */
export function parseCatalogue(markdown: string): Catalogue {
  const start = markdown.indexOf(CATALOGUE_START)
  const end = markdown.indexOf(CATALOGUE_END)
  if (start === -1 || end === -1) throw new Error('capability-catalogue markers not found')
  if (markdown.indexOf(CATALOGUE_START, start + 1) !== -1) throw new Error('duplicate start marker')
  if (start > end) throw new Error('capability-catalogue markers are reversed')

  const block = markdown.slice(start + CATALOGUE_START.length, end)

  // The generator states its own totals in the block's preamble; they are checked against the parse.
  const declared = block.match(/publishes (\d+) skills: (\d+) governance skills and (\d+) process skills/)
  if (!declared) throw new Error('capability-catalogue preamble does not state its skill counts')

  const domains: CatalogueDomain[] = []
  let domain: CatalogueDomain | null = null
  let skillName: string | null = null
  let skillLines: string[] = []

  const flushSkill = (): void => {
    if (!skillName) return
    if (!domain) throw new Error(`${skillName}: entry appears before any domain heading`)
    domain.skills.push(parseSkill(skillName, skillLines.join('\n')))
    skillName = null
    skillLines = []
  }

  for (const line of block.split('\n')) {
    const skillHeading = line.match(/^#### `([a-z0-9-]+)`$/)
    if (skillHeading) {
      flushSkill()
      skillName = skillHeading[1]
      continue
    }

    const domainHeading = line.match(/^### (.+)$/)
    if (domainHeading) {
      flushSkill()
      domain = { name: domainHeading[1].trim(), skills: [] }
      domains.push(domain)
      continue
    }

    if (skillName) skillLines.push(line)
  }
  flushSkill()

  const skills = domains.flatMap((entry) => entry.skills)
  const counts = {
    total: skills.length,
    governance: skills.filter((skill) => skill.kind === 'Governance').length,
    process: skills.filter((skill) => skill.kind === 'Process').length
  }

  const [, total, governance, processed] = declared.map(Number)
  if (counts.total !== total || counts.governance !== governance || counts.process !== processed) {
    throw new Error(
      `parsed ${counts.total} skills (${counts.governance} governance, ${counts.process} process) but the block declares ${total} (${governance} governance, ${processed} process)`
    )
  }

  const names = skills.map((skill) => skill.name)
  const duplicate = names.find((name, position) => names.indexOf(name) !== position)
  if (duplicate) throw new Error(`${duplicate}: appears more than once`)

  return { counts, domains }
}

/** Kept verbatim so the emitted file explains itself to whoever opens it next. */
const header = (ref: string): string => `// Vendored snapshot of the harness's generated capability catalogue.
//
// GENERATED FILE — do not edit. Regenerate with:
//   bun run --cwd apps/site sync:skills -- --ref <tag-or-commit>
//
// Parsed from ${SOURCE_REPOSITORY} ${SOURCE_PATH} between the
// ki-repo-harness:capability-catalogue markers, which that standard names normatively.
//
// The ref below must match the ref declared in the sources frontmatter of
// src/projects/ki-agentic-harness/skill-catalogue.md; verify:guidance fails the build when they disagree.
// See docs/guides/developer/guidance-provenance.md.
//
// Snapshot taken at ${ref}.
`

async function main(): Promise<void> {
  const refFlag = process.argv.indexOf('--ref')
  const ref = refFlag === -1 ? undefined : process.argv[refFlag + 1]
  if (!ref) throw new Error('usage: sync-skill-catalogue.ts --ref <tag-or-commit>')
  if (!tagPattern.test(ref) && !commitPattern.test(ref)) {
    throw new Error(`${ref} is not an immutable ref; pass an exact tag or a 40-character commit`)
  }

  const url = `https://raw.githubusercontent.com/${SOURCE_REPOSITORY}/${ref}/${SOURCE_PATH}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)

  const catalogue = parseCatalogue(await response.text())
  const payload = {
    source: { repository: SOURCE_REPOSITORY, path: SOURCE_PATH, ref },
    ...catalogue
  }

  const target = resolve(import.meta.dirname, '../src/_data/skillCatalogue.json5')
  await writeFile(target, `${header(ref)}${JSON.stringify(payload, null, 2)}\n`)

  console.log(
    `sync-skill-catalogue: ${catalogue.counts.total} skills (${catalogue.counts.governance} governance, ${catalogue.counts.process} process) across ${catalogue.domains.length} domains at ${ref}`
  )
}

if (import.meta.main) {
  await main().catch((error: Error) => {
    console.error(`sync-skill-catalogue: ${error.message}`)
    process.exit(1)
  })
}

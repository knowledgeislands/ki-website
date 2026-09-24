/**
 * Verifies that a project guide is owned, opens with a claim, and does not defer.
 *
 * Guidance used to be a section of its own, and it read as a routing layer over
 * other repositories' work: seventy links into GitHub across thirty-five pages,
 * six of them literally `[The full guide](…/tools-ki/blob/…)`. Moving those
 * pages under the projects that own them fixes where they live; this fixes what
 * they say, because a page that moved and still points at a README has changed
 * its URL and nothing else (KI-WEB-SITE-025).
 *
 * Three things are checked, all against source rather than `dist/` so the gate
 * can run before a build:
 *
 *   - the directory a guide lives in binds it to a project the registry lists;
 *   - it opens with prose before its first `##`, saying what the reader can do;
 *   - no link text is a hand-off phrase.
 *
 * The binding is checked on the directory rather than on the page because that
 * is where it is declared: `src/projects/ki/ki.json5` sets `project` for every
 * page beside it, so a guide added later is owned because of where it lives
 * rather than because someone remembered a frontmatter line.
 *
 * A repository link is not banned and should not be. The test from
 * GDR-KI-WEBSITE-002 is whether it survives as a fact rather than as a
 * destination, and link text is the part of that a machine can judge: "the full
 * guide" names a destination, while "the installer published at v0.4.0" names a
 * fact. Provenance is `verify-guidance-sources.ts`; this file owns voice.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import JSON5 from 'json5'

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const projectsDir = resolve(siteRoot, 'src/projects')
const registryPath = resolve(siteRoot, 'src/_data/projects.json5')

/** The layout that carries the prose measure, the styling and the provenance footer. */
const proseLayout = 'layouts/page.njk'

/** A lead shorter than this is a label, not a claim about what the reader gains. */
const minimumLeadLength = 120

/**
 * Link text that names a destination instead of a fact.
 *
 * Matched against the whole anchor text, lowercased and trimmed of trailing
 * punctuation, so a sentence *containing* "the full guide" as part of a real
 * claim is untouched while a link whose entire text is that phrase is not.
 */
const deferralPhrases = [
  'the full guide',
  'the full documentation',
  'full documentation',
  'full guide',
  'see the readme',
  'see the docs',
  'see the documentation',
  'read more',
  'more here',
  'learn more',
  'the guide',
  'here',
  'docs',
  'documentation',
  'readme',
  'this page'
]

interface Project {
  slug: string
}

const failures: string[] = []

const fail = (message: string): void => {
  failures.push(message)
}

/** Every Markdown page below a project's directory. */
const guidePages = (dir: string): string[] => {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return []
  }
  return entries.flatMap((name) => {
    const path = resolve(dir, name)
    if (statSync(path).isDirectory()) return guidePages(path)
    return name.endsWith('.md') ? [path] : []
  })
}

/** The frontmatter block and the body that follows it. */
const split = (contents: string): { frontmatter: string; body: string } => {
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { frontmatter: '', body: contents }
  return { frontmatter: match[1] as string, body: match[2] as string }
}

/**
 * The prose a reader meets before the first heading below the title.
 *
 * Nunjucks includes, HTML blocks and the `# Title` line itself are not prose a
 * reader can act on, so none of them count towards the lead.
 */
const lead = (body: string): string => {
  const collected: string[] = []
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('##')) break
    if (trimmed === '' || trimmed.startsWith('#') || trimmed.startsWith('{%') || trimmed.startsWith('<')) continue
    collected.push(trimmed)
  }
  return collected.join(' ')
}

/** Anchor texts in one body, with Markdown emphasis and code markers stripped. */
const linkTexts = (body: string): string[] =>
  [...body.matchAll(/\[([^\]]+)\]\([^)]*\)/g)].map((match) =>
    (match[1] as string)
      .replace(/[*_`]/g, '')
      .trim()
      .replace(/[.,;:!?]+$/, '')
      .toLowerCase()
  )

const registry = JSON5.parse(readFileSync(registryPath, 'utf-8')) as Project[]
const slugs = new Set(registry.map((project) => project.slug))

const directories = readdirSync(projectsDir).filter((name) => statSync(resolve(projectsDir, name)).isDirectory())

let pageCount = 0

for (const directory of directories) {
  const dataFile = resolve(projectsDir, directory, `${directory}.json5`)
  const declared = `${relative(siteRoot, dataFile)}`

  if (!slugs.has(directory)) {
    fail(`src/projects/${directory}/: no project with slug "${directory}" is registered in src/_data/projects.json5.`)
  }

  let data: { project?: string; layout?: string }
  try {
    data = JSON5.parse(readFileSync(dataFile, 'utf-8')) as { project?: string; layout?: string }
  } catch {
    fail(`${declared}: missing. A project's guides are bound to it by the directory data file, not by each page.`)
    continue
  }

  if (data.project !== directory) {
    fail(`${declared}: declares project "${data.project}", but sits at src/projects/${directory}/.`)
  }
  if (data.layout !== proseLayout) {
    fail(
      `${declared}: declares layout "${data.layout}"; a guide needs "${proseLayout}" for its prose chrome and provenance footer.`
    )
  }

  const positions = new Map<number, string>()

  for (const file of guidePages(resolve(projectsDir, directory))) {
    pageCount += 1
    const page = relative(siteRoot, file)
    const { frontmatter, body } = split(readFileSync(file, 'utf-8'))

    // The first guide a reader meets under a project decides whether they read a second, so the
    // list's order is an editorial decision rather than an accident of what was written when.
    // Eleventy sorts unpositioned pages last, which is a reasonable default and a poor rule: every
    // page added without one appends, and the reading order decays toward chronology with nothing
    // failing. Requiring the key makes the decision explicit; requiring it to be unique stops two
    // pages tying and falling through to a title sort nobody chose. (KI-WEB-SITE-029)
    const orderLine = frontmatter.match(/^order:[ \t]*(.*)$/m)
    if (!orderLine) {
      fail(
        `${page}: declares no "order"; a project's guides are read in a chosen sequence, not the order they were written.`
      )
    } else {
      const position = Number(orderLine[1]?.trim())
      if (!Number.isInteger(position) || position < 1) {
        fail(`${page}: "order: ${orderLine[1]?.trim()}" is not a positive whole number.`)
      } else {
        const taken = positions.get(position)
        if (taken) {
          fail(
            `${page}: takes order ${position}, which ${taken} already holds; the tie is broken by title rather than by a decision.`
          )
        } else {
          positions.set(position, page)
        }
      }
    }

    const opening = lead(body)
    if (opening.length < minimumLeadLength) {
      fail(
        `${page}: opens with ${opening.length} characters before its first "##"; a reader needs at least ${minimumLeadLength} saying what they will be able to do.`
      )
    }

    for (const text of linkTexts(body)) {
      if (deferralPhrases.includes(text)) {
        fail(`${page}: a link reads "${text}", which names a destination rather than a fact the page states.`)
      }
    }
  }
}

if (failures.length > 0) {
  for (const message of failures) console.error(`error: ${message}`)
  console.error(`\nverify-guides: ${failures.length} problem(s) found`)
  process.exit(1)
}

console.log(
  `verify-guides: ${pageCount} guide(s) across ${directories.length} project director${directories.length === 1 ? 'y' : 'ies'} verified`
)

/**
 * Verifies that every published guidance page can be reached by navigating.
 *
 * On the run that first exercised this gate, twenty-one of the thirty-three
 * guidance pages were reachable only by typing their URL — an entire
 * fourteen-page collection had no inbound link from outside its own subtree.
 * Nothing detected it, because nothing looked (KI-WEB-SITE-019).
 *
 * So this walks the built site from `dist/index.html` the way a reader does,
 * following only `href` attributes, and fails when a guidance page is not on
 * the far end of any of them. It fails rather than warns because an orphaned
 * page is entirely within this site's control, unlike the upstream drift that
 * `verify-guidance-sources.ts` reports as a warning.
 *
 * `dist/guidance/` no longer exists. The guides each project owns moved to
 * `dist/projects/` (KI-WEB-SITE-025), and what was left — the prompting guides
 * and the optional-tools page — moved to `dist/prompting/` and
 * `dist/optional-tools/` (KI-WEB-SITE-028). All three are held to the same
 * standard: a page that moved must not become unreachable in the move, and the
 * index that lists a collection must itself be on the far end of a link.
 *
 * Pages outside those trees are reported as warnings. They are reachable today
 * and should stay so, but this gate was built for published prose and should
 * say plainly what it holds to.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(siteRoot, 'dist')
const entryPoint = resolve(distDir, 'index.html')

const failures: string[] = []
const warnings: string[] = []

/** Every HTML document the build wrote, as absolute paths. */
const pages = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name)
    if (entry.isDirectory()) return pages(path)
    return entry.name.endsWith('.html') ? [path] : []
  })

/**
 * The href targets of one document, resolved to absolute paths in `dist/`.
 *
 * External schemes and bare fragments address nothing in the tree. A link that
 * leaves the tree — `../../elsewhere` — resolves outside `dist/` and is
 * dropped by the caller rather than silently treated as a hit.
 */
const linksFrom = (page: string): string[] => {
  const source = readFileSync(page, 'utf-8')
  const from = dirname(page)
  return [...source.matchAll(/\shref=(["'])([^"']+)\1/gi)]
    .map((match) => match[2] as string)
    .filter((href) => !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href))
    .map((href) => {
      const hash = href.indexOf('#')
      return resolve(from, hash < 0 ? href : href.slice(0, hash))
    })
}

const reachable = (): Set<string> => {
  const seen = new Set<string>([entryPoint])
  const queue = [entryPoint]

  while (queue.length > 0) {
    const page = queue.pop() as string
    for (const target of linksFrom(page)) {
      if (seen.has(target)) continue
      if (!target.startsWith(`${distDir}/`)) continue
      let isFile = false
      try {
        isFile = statSync(target).isFile()
      } catch {
        // A link to something the build did not write. `verify-tool-routes.ts`
        // and `verify-projects.ts` own route existence; this gate owns arrival.
        continue
      }
      if (!isFile || !target.endsWith('.html')) continue
      seen.add(target)
      queue.push(target)
    }
  }

  return seen
}

const seen = reachable()
const all = pages(distDir)
const where = (page: string): string => relative(distDir, page)

/** The trees whose pages a reader has to be able to arrive at by navigating. */
const publishedTrees = ['projects/', 'prompting/', 'optional-tools/']

const published = (path: string): boolean => publishedTrees.some((tree) => path.startsWith(tree))

for (const page of all) {
  if (seen.has(page)) continue
  const path = where(page)
  if (published(path)) {
    failures.push(`dist/${path} cannot be reached by following links from dist/index.html`)
  } else {
    warnings.push(`dist/${path} cannot be reached by following links from dist/index.html`)
  }
}

const guidance = all.filter((page) => published(where(page)))

for (const message of warnings) console.warn(`warning: ${message}`)

if (failures.length > 0) {
  for (const message of failures) console.error(`error: ${message}`)
  console.error(`\nverify-guidance-reachable: ${failures.length} unreachable guidance page(s)`)
  process.exit(1)
}

console.log(`verify-guidance-reachable: ${guidance.length} published page(s) reachable from the home page`)

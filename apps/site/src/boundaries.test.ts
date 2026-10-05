/**
 * The dependency boundaries in `.dependency-cruiser.ts`, cruised over the site workspace and proven able to fail.
 *
 * A boundary checker fails open. Every rule matches on resolved paths, so a cruise that resolves nothing satisfies all
 * of them and prints a clean run. Here that is the default rather than a risk: dependency-cruiser reads TypeScript
 * through the compiler API and supports `typescript@>=2 <7`, and this repository is on TypeScript 7, so against the
 * repository's own install it cruises zero modules and reports zero violations. The cruise therefore runs through the
 * install root at `tooling/boundaries`, which holds a TypeScript it can drive, and this suite checks that there was a
 * graph — a module floor, a type-only edge, a resolved crossing between layers — before it believes the violation
 * count, then writes deliberate crossings and expects each named rule to trip.
 *
 * It sits in `apps/site` because the site is the only workspace and the root is not a Turborepo workspace, so a
 * root-level suite would never run under `bun run test`. It sits in `src/` beside the data modules rather than in
 * `_data/`, so Eleventy neither renders nor loads it.
 */

import { beforeAll, describe, expect, test } from 'bun:test'
import { readdirSync } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = join(import.meta.dir, '..', '..', '..')

/** The checker's own install root, outside the repository's dependency tree; nothing else resolves it. */
const TOOLING = join(ROOT, 'tooling', 'boundaries')

/** Every source root of the site workspace; a root left out is a boundary nothing checks. */
const SITE_ROOTS = ['apps/site/eleventy.config.ts', 'apps/site/src', 'apps/site/scripts', 'apps/site/types']

/**
 * The floor below which the cruise is not measuring this repository.
 *
 * Near the real count rather than merely non-zero: a parser that resolves nothing reports 0, but one that reads only
 * what it recognises reports a plausible fraction. The workspace holds about 24 modules today.
 */
const MODULE_FLOOR = 20

interface Dependency {
  readonly module: string
  readonly resolved: string
  readonly couldNotResolve: boolean
  readonly dependencyTypes: readonly string[]
}

interface Module {
  readonly source: string
  readonly dependencies: readonly Dependency[]
}

interface Violation {
  readonly from: string
  readonly to: string
  readonly rule: { readonly name: string }
}

interface Cruise {
  readonly modules: readonly Module[]
  readonly summary: { readonly violations: readonly Violation[] }
}

interface Transpiler {
  readonly name: string
  readonly version: string
  readonly available: boolean
}

/** Run a command to completion and return what it printed, or throw with whatever it said instead. */
const output = async (command: readonly string[], cwd: string): Promise<string> => {
  const child = Bun.spawn([...command], { cwd, stdout: 'pipe', stderr: 'pipe' })
  const [text, error, status] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited
  ])
  // depcruise exits non-zero when it finds a violation, which the deliberate crossings below rely on, so the exit
  // status alone is not a failure: printing nothing is.
  if (text.trim() === '') throw new Error(`${command.join(' ')} printed nothing (exit ${status}): ${error.trim()}`)
  return text
}

/**
 * Install the tooling root from its lockfile, so an absent install is restored and a stale one is reconciled.
 *
 * `--frozen-lockfile` refuses a manifest the lockfile does not match, so a mismatched tooling root fails the suite
 * rather than skipping it or cruising with whatever happens to be installed.
 */
const installTooling = async (): Promise<void> => {
  const child = Bun.spawn(['bun', 'install', '--frozen-lockfile'], { cwd: TOOLING, stdout: 'ignore', stderr: 'pipe' })
  const [error, status] = await Promise.all([new Response(child.stderr).text(), child.exited])
  if (status !== 0) throw new Error(`tooling/boundaries does not install from its lockfile (exit ${status}): ${error}`)
}

/** Cruise the given paths through the tooling root's `depcruise` and return the graph it reports. */
const cruise = async (paths: readonly string[]): Promise<Cruise> =>
  JSON.parse(
    await output(
      [
        join(TOOLING, 'node_modules', '.bin', 'depcruise'),
        '--config',
        '.dependency-cruiser.ts',
        '--output-type',
        'json',
        ...paths
      ],
      ROOT
    )
  ) as Cruise

/** The parsers dependency-cruiser can drive, asked of the same install the cruise runs through. */
const transpilers = async (): Promise<readonly Transpiler[]> =>
  JSON.parse(
    await output(
      [
        'node',
        '--input-type=module',
        '--eval',
        "import { getAvailableTranspilers } from 'dependency-cruiser'; console.log(JSON.stringify(getAvailableTranspilers()))"
      ],
      TOOLING
    )
  ) as readonly Transpiler[]

/** The modules of the site workspace, as opposed to root files and the dependency leaves also recorded. */
const siteModules = (graph: Cruise): readonly Module[] =>
  graph.modules.filter((module) => module.source.startsWith('apps/site/'))

/** The type-only imports the site's own modules make, wherever they land. */
const typeOnly = (graph: Cruise): readonly string[] =>
  siteModules(graph).flatMap((module) =>
    module.dependencies
      .filter((dependency) => dependency.dependencyTypes.includes('type-only') && !dependency.couldNotResolve)
      .map((dependency) => `${module.source} -> ${dependency.module}`)
  )

const manifest = async (path: string) =>
  JSON.parse(await readFile(join(ROOT, path), 'utf8')) as {
    readonly dependencies?: Readonly<Record<string, string>>
    readonly devDependencies?: Readonly<Record<string, string>>
  }

/** The major a version specification asks for, ignoring the range operator in front of it. */
const major = (specification: string | undefined): number =>
  Number((specification ?? '').replace(/^\D*/u, '').split('.')[0])

let graph: Cruise
let typescript: Transpiler | undefined

beforeAll(async () => {
  await installTooling()
  const rootFiles = readdirSync(ROOT)
    .filter((name) => name.endsWith('.ts'))
    .sort()
  const [found, cruised] = await Promise.all([transpilers(), cruise([...SITE_ROOTS, ...rootFiles])])
  typescript = found.find((transpiler) => transpiler.name === 'typescript')
  graph = cruised
}, 60_000)

describe('the boundary tooling', () => {
  test('drives a TypeScript dependency-cruiser can read', () => {
    // When this fails the cruise below read no TypeScript, and every other assertion in this file is about nothing.
    expect(typescript?.available).toBe(true)
  })

  test('names the same dependency-cruiser as the repository', async () => {
    const [repository, tooling] = await Promise.all([
      manifest('package.json'),
      manifest('tooling/boundaries/package.json')
    ])

    expect(tooling.dependencies?.['dependency-cruiser']).toBe(repository.devDependencies?.['dependency-cruiser'])
  })

  test('is still needed', async () => {
    // When this fails, dependency-cruiser drives the repository's own TypeScript and `tooling/boundaries` can go.
    const refused = Number(/<\s*(\d+)/u.exec(typescript?.version ?? '')?.[1])
    const repository = await manifest('package.json')

    expect(major(repository.devDependencies?.typescript)).toBeGreaterThanOrEqual(refused)
  })
})

describe('the cruise of the site workspace', () => {
  test('reads the repository it is checking', () => {
    expect(siteModules(graph).length).toBeGreaterThanOrEqual(MODULE_FLOOR)
    console.info(`boundaries: cruised ${siteModules(graph).length} site modules`)
  })

  test('sees the type-only imports the compiler would erase', () => {
    // `tsPreCompilationDeps` is on, so a parser reading each module's own imports finds the config's type-only import
    // of Eleventy, and one that reads only the compiler's emit sees nothing. No site layer yet imports another only
    // for its types, so the deliberate crossing below proves a type-only edge between layers is seen and refused.
    expect(typeOnly(graph)).toContain('apps/site/eleventy.config.ts -> @11ty/eleventy')
  })

  test('resolves a command reaching its shared helper to the real module', () => {
    const command = graph.modules.find((module) => module.source === 'apps/site/scripts/verify-provenance.ts')
    const helper = command?.dependencies.find((dependency) => dependency.module === './lib/github.ts')

    expect(helper?.couldNotResolve).toBe(false)
    expect(helper?.resolved).toBe('apps/site/scripts/lib/github.ts')
  })

  test('finds no violation of a stated boundary', () => {
    expect(
      graph.summary.violations.map((violation) => `${violation.rule.name}: ${violation.from} -> ${violation.to}`)
    ).toEqual([])
  })
})

/**
 * One temporary module per rule family, each a crossing the rule exists to refuse.
 *
 * They are written, cruised together, and removed before any assertion runs, so a failing expectation never leaves a
 * violation behind in the tree. Each is cruised as an entry point, and its rule is read off the edges it starts. None
 * lands where Eleventy would render or load it.
 */
const CROSSINGS: Readonly<Record<string, string>> = {
  // The build reaching a helper, for its types only: erased at run time, refused all the same.
  'apps/site/src/boundary-probe.tmp.ts':
    "import type { walk } from '../scripts/lib/walk.ts'\nexport type Walk = typeof walk\n",
  // A helper reaching up into a command, and across into the build's data.
  'apps/site/scripts/lib/boundary-probe.tmp.ts': "import '../verify-reachable.ts'\nimport '../../src/_data/site.ts'\n",
  // A command importing another command, and a suite.
  'apps/site/scripts/boundary-probe.tmp.ts': "import './verify-projects.ts'\nimport './lib/walk.test.ts'\n",
  // A cycle with a value edge each way, which survives to run time.
  'apps/site/scripts/lib/boundary-probe-a.tmp.ts': "import './boundary-probe-b.tmp.ts'\n",
  'apps/site/scripts/lib/boundary-probe-b.tmp.ts': "import './boundary-probe-a.tmp.ts'\n"
}

describe('a deliberate crossing', () => {
  let crossed: Cruise
  let violations: readonly string[]

  beforeAll(async () => {
    try {
      for (const [path, text] of Object.entries(CROSSINGS)) await writeFile(join(ROOT, path), text)
      crossed = await cruise(Object.keys(CROSSINGS))
      violations = crossed.summary.violations.map(
        (violation) => `${violation.rule.name}: ${violation.from} -> ${violation.to}`
      )
    } finally {
      await Promise.all(Object.keys(CROSSINGS).map((path) => rm(join(ROOT, path), { force: true })))
    }
  }, 60_000)

  test('trips the build rule for a type-only import of a helper', () => {
    expect(typeOnly(crossed)).toContain('apps/site/src/boundary-probe.tmp.ts -> ../scripts/lib/walk.ts')
    expect(violations).toContain(
      'the-build-does-not-run-the-commands: apps/site/src/boundary-probe.tmp.ts -> apps/site/scripts/lib/walk.ts'
    )
  })

  test('trips the independence rule for a helper importing the build', () => {
    expect(violations).toContain(
      'commands-verify-the-build-independently: apps/site/scripts/lib/boundary-probe.tmp.ts -> apps/site/src/_data/site.ts'
    )
  })

  test('trips the floor rule for a helper importing a command', () => {
    expect(violations).toContain(
      'helpers-are-the-floor: apps/site/scripts/lib/boundary-probe.tmp.ts -> apps/site/scripts/verify-reachable.ts'
    )
  })

  test('trips the command rule for one command importing another', () => {
    expect(violations).toContain(
      'commands-share-only-through-helpers: apps/site/scripts/boundary-probe.tmp.ts -> apps/site/scripts/verify-projects.ts'
    )
  })

  test('trips the test seam for a command importing a suite', () => {
    expect(violations).toContain(
      'product-does-not-import-suites: apps/site/scripts/boundary-probe.tmp.ts -> apps/site/scripts/lib/walk.test.ts'
    )
  })

  test('trips no-circular for a cycle that survives to run time', () => {
    expect(
      violations.some((violation) => violation.startsWith('no-circular: apps/site/scripts/lib/boundary-probe-'))
    ).toBe(true)
  })

  test('leaves nothing behind', async () => {
    const paths = Object.keys(CROSSINGS)
    const present = await Promise.all(paths.map((path) => Bun.file(join(ROOT, path)).exists()))

    expect(paths.filter((_path, index) => present[index])).toEqual([])
  })
})

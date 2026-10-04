import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Every file below `dir` whose name `matches` accepts, as absolute paths in directory order.
 *
 * Directories are recognised with `statSync`, so a symlinked directory is followed. A missing
 * `dir` throws; a caller that tolerates absence checks for it first.
 */
export const walk = (dir: string, matches: (name: string) => boolean): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = resolve(dir, name)
    if (statSync(path).isDirectory()) return walk(path, matches)
    return matches(name) ? [path] : []
  })

/** A `matches` predicate accepting any of the given file extensions, each including its dot. */
export const byExtension =
  (...extensions: string[]) =>
  (name: string): boolean =>
    extensions.some((extension) => name.endsWith(extension))

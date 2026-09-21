/**
 * The subset of the project directory that needs a generated page.
 *
 * Some projects already have a richer home on this site — Specifications has
 * its own section, the website is the site itself — and a second page for them
 * would be a duplicate that drifts. Those entries declare a `route`, and this
 * list drops them so `/projects/<slug>/` is generated only for projects whose
 * card would otherwise lead nowhere but GitHub.
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import JSON5 from 'json5'

interface Project {
  slug: string
  route?: string
}

const registryPath = resolve(dirname(fileURLToPath(import.meta.url)), 'projects.json5')
const projects = JSON5.parse(readFileSync(registryPath, 'utf-8')) as Project[]

export default projects.filter((project) => typeof project.route !== 'string')

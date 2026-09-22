import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import JSON5 from 'json5'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const versionPattern = /^v\d+\.\d+\.\d+$/
const repositoryPattern = /^knowledgeislands\/[a-z0-9]+(?:-[a-z0-9]+)*$/
const commitPattern = /^[0-9a-f]{40}$/

export interface ToolReleaseRequest {
  tool: string
  version: string
  sourceRepository: string
  tapCommit: string
  formulaPath: string
}

interface RegistryTool {
  slug: string
  kind?: string
  repository: string
  version: string
  installer: string
  manual: string
  changelog: string
}

interface GitHubRelease {
  tag_name?: string
  draft?: boolean
  prerelease?: boolean
  immutable?: boolean
}

export function validateRequest(request: ToolReleaseRequest): void {
  if (!slugPattern.test(request.tool)) throw new Error(`invalid tool slug: ${request.tool}`)
  if (!versionPattern.test(request.version)) throw new Error(`invalid release version: ${request.version}`)
  if (!repositoryPattern.test(request.sourceRepository)) {
    throw new Error(`invalid source repository: ${request.sourceRepository}`)
  }
  if (!commitPattern.test(request.tapCommit)) throw new Error(`invalid tap commit: ${request.tapCommit}`)
  if (request.formulaPath !== `Formula/${request.tool}.rb`) {
    throw new Error(`formula path must be Formula/${request.tool}.rb`)
  }
}

export function parseFormulaRelease(source: string, formulaPath: string): { repository: string; version: string } {
  const urls = [...source.matchAll(/^\s*url\s+"([^"]+)"/gm)].map((match) => match[1])
  if (urls.length === 0) throw new Error(`${formulaPath}: formula must declare at least one url`)

  const releases = urls.map((url) => {
    const match =
      /^https:\/\/github\.com\/(knowledgeislands\/[a-z0-9-]+)\/(?:releases\/download|archive\/refs\/tags)\/(v\d+\.\d+\.\d+)(?:\/|\.tar\.gz$)/.exec(
        url
      )
    if (!match) throw new Error(`${formulaPath}: unsupported release url ${url}`)
    return `${match[1]}@${match[2]}`
  })

  const unique = [...new Set(releases)]
  if (unique.length !== 1) throw new Error(`${formulaPath}: release urls disagree on repository or version`)
  const separator = unique[0].lastIndexOf('@')
  return { repository: unique[0].slice(0, separator), version: unique[0].slice(separator + 1) }
}

function compareVersions(left: string, right: string): number {
  const parts = (value: string) => value.slice(1).split('.').map(Number)
  const leftParts = parts(left)
  const rightParts = parts(right)
  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index]
  }
  return 0
}

function registryTools(source: string): RegistryTool[] {
  const parsed = JSON5.parse(source) as unknown
  if (!Array.isArray(parsed)) throw new Error('project registry must be an array')
  return parsed as RegistryTool[]
}

export function updateRegistrySource(
  source: string,
  request: ToolReleaseRequest
): { source: string; changed: boolean } {
  validateRequest(request)
  const tools = registryTools(source)
  const tool = tools.find((candidate) => candidate.slug === request.tool)
  if (!tool) throw new Error(`project registry has no entry for ${request.tool}`)
  if (tool.kind !== 'tool') throw new Error(`${request.tool}: registry entry is not a released tool`)
  if (tool.repository !== `https://github.com/${request.sourceRepository}`) {
    throw new Error(`${request.tool}: registry repository does not match ${request.sourceRepository}`)
  }
  if (compareVersions(request.version, tool.version) < 0) {
    throw new Error(`${request.tool}: refusing downgrade from ${tool.version} to ${request.version}`)
  }
  if (request.version === tool.version) return { source, changed: false }

  const marker = `slug: '${request.tool}'`
  const markerIndex = source.indexOf(marker)
  if (markerIndex < 0) throw new Error(`${request.tool}: could not locate registry source block`)
  const blockStart = source.lastIndexOf('{', markerIndex)
  const blockEndMarker = source.indexOf('\n  }', markerIndex)
  if (blockStart < 0 || blockEndMarker < 0) throw new Error(`${request.tool}: malformed registry source block`)
  const blockEnd = blockEndMarker + '\n  }'.length
  const block = source.slice(blockStart, blockEnd)
  const occurrences = block.split(tool.version).length - 1
  if (occurrences < 4) throw new Error(`${request.tool}: registry block does not carry four coherent version pins`)

  const updated = `${source.slice(0, blockStart)}${block.replaceAll(tool.version, request.version)}${source.slice(blockEnd)}`
  const updatedTool = registryTools(updated).find((candidate) => candidate.slug === request.tool)
  if (!updatedTool) throw new Error(`${request.tool}: updated registry entry disappeared`)
  for (const field of ['installer', 'manual', 'changelog'] as const) {
    if (!updatedTool[field].includes(`/${request.version}/`)) {
      throw new Error(`${request.tool}: updated ${field} is not pinned to ${request.version}`)
    }
  }
  return { source: updated, changed: true }
}

async function checkedFetch(fetcher: typeof fetch, url: string, token?: string): Promise<Response> {
  const response = await fetcher(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ki-website-release-sync',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response
}

export async function verifyRemoteRelease(
  request: ToolReleaseRequest,
  fetcher: typeof fetch = fetch,
  token = process.env.GITHUB_TOKEN
): Promise<void> {
  validateRequest(request)
  const releaseBase = `https://api.github.com/repos/${request.sourceRepository}/releases`
  const release = (await (
    await checkedFetch(fetcher, `${releaseBase}/tags/${request.version}`, token)
  ).json()) as GitHubRelease
  if (
    release.tag_name !== request.version ||
    release.draft !== false ||
    release.prerelease !== false ||
    release.immutable !== true
  ) {
    throw new Error(`${request.sourceRepository}@${request.version}: release is not published and immutable`)
  }

  const latest = (await (await checkedFetch(fetcher, `${releaseBase}/latest`, token)).json()) as GitHubRelease
  if (latest.tag_name !== request.version) {
    throw new Error(
      `${request.sourceRepository}: latest release is ${latest.tag_name ?? 'unknown'}, not ${request.version}`
    )
  }

  const formulaUrl = `https://raw.githubusercontent.com/knowledgeislands/homebrew-tap/${request.tapCommit}/${request.formulaPath}`
  const formula = await (await checkedFetch(fetcher, formulaUrl, token)).text()
  const formulaRelease = parseFormulaRelease(formula, request.formulaPath)
  if (formulaRelease.repository !== request.sourceRepository || formulaRelease.version !== request.version) {
    throw new Error(`${request.formulaPath}: formula release does not match dispatched release`)
  }

  const installerUrl = `https://raw.githubusercontent.com/${request.sourceRepository}/${request.version}/install.sh`
  const installer = await (await checkedFetch(fetcher, installerUrl, token)).text()
  if (installer.trim() === '') throw new Error(`${request.sourceRepository}@${request.version}: installer is empty`)
}

interface CliOptions {
  request: ToolReleaseRequest
  registryPath: string
  checkOnly: boolean
}

function parseArguments(args: string[]): CliOptions {
  const values = new Map<string, string>()
  let checkOnly = false
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--check') {
      checkOnly = true
      continue
    }
    if (!argument.startsWith('--') || !args[index + 1]) throw new Error(`invalid argument: ${argument}`)
    values.set(argument.slice(2), args[index + 1])
    index += 1
  }
  const required = (name: string): string => {
    const value = values.get(name)
    if (!value) throw new Error(`missing --${name}`)
    return value
  }
  const tool = required('tool')
  return {
    request: {
      tool,
      version: required('version'),
      sourceRepository: required('source-repository'),
      tapCommit: required('tap-commit'),
      formulaPath: values.get('formula-path') ?? `Formula/${tool}.rb`
    },
    registryPath: resolve(values.get('registry') ?? 'apps/site/src/_data/projects.json5'),
    checkOnly
  }
}

if (import.meta.main) {
  try {
    const options = parseArguments(process.argv.slice(2))
    await verifyRemoteRelease(options.request)
    const current = await readFile(options.registryPath, 'utf-8')
    const update = updateRegistrySource(current, options.request)
    if (update.changed && !options.checkOnly) await writeFile(options.registryPath, update.source)
    console.log(
      `${options.request.tool} ${options.request.version}: ${update.changed ? 'registry update prepared' : 'registry already current'}`
    )
  } catch (error) {
    console.error((error as Error).message)
    process.exitCode = 1
  }
}

import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
  parseFormulaRelease,
  type ToolReleaseRequest,
  updateRegistrySource,
  validateRequest,
  verifyRemoteRelease
} from './sync-tool-release.ts'

const request: ToolReleaseRequest = {
  tool: 'ki',
  version: 'v0.4.0',
  sourceRepository: 'knowledgeislands/tools-ki',
  tapCommit: 'a'.repeat(40),
  formulaPath: 'Formula/ki.rb'
}

/** Mirrors the merged registry: released tools sit among projects of other kinds. */
const registry = `[
  {
    slug: 'mcp-git-audit',
    kind: 'mcp',
    repository: 'https://github.com/knowledgeislands/mcp-git-audit',
  },
  {
    slug: 'ki',
    kind: 'tool',
    repository: 'https://github.com/knowledgeislands/tools-ki',
    version: 'v0.3.6',
    installer: 'https://raw.githubusercontent.com/knowledgeislands/tools-ki/v0.3.6/install.sh',
    manual: 'https://github.com/knowledgeislands/tools-ki/blob/v0.3.6/README.md',
    changelog: 'https://github.com/knowledgeislands/tools-ki/blob/v0.3.6/CHANGELOG.md',
  },
  {
    slug: 'mgit',
    kind: 'tool',
    repository: 'https://github.com/knowledgeislands/tools-mgit',
    version: 'v0.13.0',
    installer: 'https://raw.githubusercontent.com/knowledgeislands/tools-mgit/v0.13.0/install.sh',
    manual: 'https://github.com/knowledgeislands/tools-mgit/blob/v0.13.0/README.md',
    changelog: 'https://github.com/knowledgeislands/tools-mgit/blob/v0.13.0/CHANGELOG.md',
  },
]`

describe('release request validation', () => {
  test('accepts one exact formula path', () => {
    assert.doesNotThrow(() => validateRequest(request))
  })

  test('rejects traversal and malformed identities', () => {
    assert.throws(() => validateRequest({ ...request, formulaPath: '../ki.rb' }), /formula path/)
    assert.throws(() => validateRequest({ ...request, tapCommit: 'main' }), /tap commit/)
    assert.throws(() => validateRequest({ ...request, sourceRepository: 'someone/tools-ki' }), /source repository/)
  })
})

describe('formula evidence', () => {
  test('accepts coherent multi-platform URLs', () => {
    const parsed = parseFormulaRelease(
      `url "https://github.com/knowledgeislands/tools-ki/releases/download/v0.4.0/ki-v0.4.0-darwin-arm64.tar.gz"\n` +
        `url "https://github.com/knowledgeislands/tools-ki/releases/download/v0.4.0/ki-v0.4.0-linux-x64.tar.gz"\n`,
      'Formula/ki.rb'
    )
    assert.deepEqual(parsed, { repository: 'knowledgeislands/tools-ki', version: 'v0.4.0' })
  })

  test('rejects conflicting formula URLs', () => {
    assert.throws(
      () =>
        parseFormulaRelease(
          `url "https://github.com/knowledgeislands/tools-ki/releases/download/v0.4.0/a.tar.gz"\n` +
            `url "https://github.com/knowledgeislands/tools-ki/releases/download/v0.4.1/b.tar.gz"\n`,
          'Formula/ki.rb'
        ),
      /disagree/
    )
  })
})

describe('registry update', () => {
  test('updates only the selected entry and every immutable pin', () => {
    const update = updateRegistrySource(registry, request)
    assert.equal(update.changed, true)
    assert.match(update.source, /version: 'v0\.4\.0'/)
    assert.match(update.source, /\/tools-ki\/v0\.4\.0\/install\.sh/)
    assert.match(update.source, /\/tools-ki\/blob\/v0\.4\.0\/README\.md/)
    assert.match(update.source, /version: 'v0\.13\.0'/)
  })

  test('refuses an entry that is not a released tool', () => {
    assert.throws(
      () =>
        updateRegistrySource(registry, { ...request, tool: 'mcp-git-audit', formulaPath: 'Formula/mcp-git-audit.rb' }),
      /not a released tool/
    )
  })

  test('is idempotent and rejects downgrades', () => {
    const updated = updateRegistrySource(registry, request).source
    assert.equal(updateRegistrySource(updated, request).changed, false)
    assert.throws(() => updateRegistrySource(updated, { ...request, version: 'v0.3.6' }), /refusing downgrade/)
  })
})

test('remote verification binds immutable latest release, formula and installer', async () => {
  const responses = new Map<string, Response>([
    [
      'https://api.github.com/repos/knowledgeislands/tools-ki/releases/tags/v0.4.0',
      Response.json({ tag_name: 'v0.4.0', draft: false, prerelease: false, immutable: true })
    ],
    [
      'https://api.github.com/repos/knowledgeislands/tools-ki/releases/latest',
      Response.json({ tag_name: 'v0.4.0', draft: false, prerelease: false, immutable: true })
    ],
    [
      `https://raw.githubusercontent.com/knowledgeislands/homebrew-tap/${request.tapCommit}/Formula/ki.rb`,
      new Response('url "https://github.com/knowledgeislands/tools-ki/releases/download/v0.4.0/ki.tar.gz"')
    ],
    ['https://raw.githubusercontent.com/knowledgeislands/tools-ki/v0.4.0/install.sh', new Response('#!/bin/sh\n')]
  ])
  const fetcher = (async (url: string | URL | Request) => {
    const response = responses.get(String(url))
    if (!response) return new Response('', { status: 404 })
    return response.clone()
  }) as typeof fetch

  await assert.doesNotReject(verifyRemoteRelease(request, fetcher, 'token'))
})

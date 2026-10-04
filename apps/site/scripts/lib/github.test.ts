import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { githubFetchOk, githubHeaders, githubToken, isGitHubHost, USER_AGENT } from './github.ts'

describe('githubToken', () => {
  test('prefers GITHUB_TOKEN, falls back to GH_TOKEN, and ignores empty values', () => {
    assert.equal(githubToken({ GITHUB_TOKEN: 'a', GH_TOKEN: 'b' }), 'a')
    assert.equal(githubToken({ GH_TOKEN: 'b' }), 'b')
    assert.equal(githubToken({ GITHUB_TOKEN: '' }), undefined)
  })
})

describe('githubHeaders', () => {
  test('always sends a User-Agent and sends the token only to GitHub hosts', () => {
    const api = githubHeaders('https://api.github.com/repos/a/b', 't')
    assert.equal(api['User-Agent'], USER_AGENT)
    assert.equal(api.Authorization, 'Bearer t')
    assert.equal(githubHeaders('https://raw.githubusercontent.com/a/b/v1/x', 't').Authorization, 'Bearer t')
    const elsewhere = githubHeaders('https://example.com/install.sh', 't')
    assert.equal(elsewhere['User-Agent'], USER_AGENT)
    assert.equal(elsewhere.Authorization, undefined)
    assert.equal(isGitHubHost('not a url'), false)
  })
})

describe('githubFetchOk', () => {
  const respond = (status: number, seen: RequestInit[] = []) =>
    (async (_url: string | URL | Request, init?: RequestInit) => {
      seen.push(init ?? {})
      return new Response('ok', { status })
    }) as typeof fetch

  test('passes the shared headers and returns an OK response', async () => {
    const seen: RequestInit[] = []
    const response = await githubFetchOk('https://api.github.com/x', { token: 't', fetcher: respond(200, seen) })
    assert.equal(await response.text(), 'ok')
    const headers = seen[0]?.headers as Record<string, string> | undefined
    assert.equal(headers?.Authorization, 'Bearer t')
  })

  test('names the token remedy when GitHub declines', async () => {
    await assert.rejects(
      githubFetchOk('https://api.github.com/x', { token: undefined, fetcher: respond(403) }),
      /Set GITHUB_TOKEN/
    )
    await assert.rejects(
      githubFetchOk('https://api.github.com/x', { token: undefined, fetcher: respond(429) }),
      /Set GITHUB_TOKEN/
    )
  })

  test('reports any other failure with its status', async () => {
    await assert.rejects(
      githubFetchOk('https://api.github.com/x', { token: undefined, fetcher: respond(404) }),
      /HTTP 404 for/
    )
  })
})

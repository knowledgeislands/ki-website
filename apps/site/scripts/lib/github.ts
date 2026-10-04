/**
 * The one GitHub HTTP client every site script uses.
 *
 * Unauthenticated callers get sixty requests an hour per IP address. Every script that reaches
 * GitHub resolves the same token, sends the same `User-Agent`, and names the same remedy when
 * GitHub declines, so a refusal arrives as a sentence rather than as a bare HTTP status.
 *
 * The token is attached only to GitHub-owned hosts. A tool's installer or any other URL may live
 * elsewhere, and a credential must never travel to a host that did not issue it.
 */

export const USER_AGENT = 'ki-website-scripts'

const GITHUB_HOSTS = new Set([
  'api.github.com',
  'github.com',
  'raw.githubusercontent.com',
  'codeload.github.com',
  'objects.githubusercontent.com'
])

/** The token from `GITHUB_TOKEN`, falling back to `GH_TOKEN`. */
export const githubToken = (env: Record<string, string | undefined> = process.env): string | undefined =>
  env.GITHUB_TOKEN || env.GH_TOKEN || undefined

/** Whether a URL addresses a host that accepts a GitHub token. */
export const isGitHubHost = (url: string): boolean => {
  try {
    return GITHUB_HOSTS.has(new URL(url).hostname)
  } catch {
    return false
  }
}

const isApiHost = (url: string): boolean => {
  try {
    return new URL(url).hostname === 'api.github.com'
  } catch {
    return false
  }
}

/** The headers a request to `url` should carry: always `User-Agent`, the API media type for the API host, a token only for GitHub hosts. */
export const githubHeaders = (url: string, token: string | undefined = githubToken()): Record<string, string> => ({
  ...(isApiHost(url) ? { Accept: 'application/vnd.github+json' } : {}),
  'User-Agent': USER_AGENT,
  ...(token && isGitHubHost(url) ? { Authorization: `Bearer ${token}` } : {})
})

/** 403 and 429 mean GitHub declined to answer, not that the resource is missing. */
export const isRateLimited = (status: number): boolean => status === 403 || status === 429

/** The one sentence a script prints when GitHub declines further requests. */
export const rateLimitMessage = (status: number): string =>
  `GitHub declined further requests (HTTP ${status}). Set GITHUB_TOKEN to lift the unauthenticated limit of sixty requests an hour.`

export interface GitHubFetchOptions {
  token?: string | undefined
  fetcher?: typeof fetch
  init?: RequestInit
}

/** Fetches `url` with the shared headers; caller headers in `init` win over the defaults. */
export const githubFetch = (url: string, options: GitHubFetchOptions = {}): Promise<Response> => {
  const { fetcher = fetch, init = {} } = options
  const token = 'token' in options ? options.token : githubToken()
  return fetcher(url, {
    ...init,
    headers: { ...githubHeaders(url, token), ...(init.headers as Record<string, string> | undefined) }
  })
}

/**
 * Fetches `url` and throws unless the response is OK, naming the token remedy on a refusal.
 */
export const githubFetchOk = async (url: string, options: GitHubFetchOptions = {}): Promise<Response> => {
  const response = await githubFetch(url, options)
  if (response.ok) return response
  if (isRateLimited(response.status)) throw new Error(`${url}: ${rateLimitMessage(response.status)}`)
  throw new Error(`HTTP ${response.status} for ${url}`)
}

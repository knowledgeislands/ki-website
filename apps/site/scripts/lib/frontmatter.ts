/**
 * The one frontmatter reader every site script uses.
 *
 * It splits a file into its frontmatter block and body without parsing YAML: the site has no YAML
 * dependency, and each caller reads the narrow keys it owns out of `block`. The opening fence must
 * be the file's first line; the block ends at the next line beginning `---`, and the body starts on
 * the line after that fence.
 */
export type Frontmatter =
  | { kind: 'none'; body: string }
  | { kind: 'unterminated'; body: string }
  | { kind: 'block'; block: string; body: string }

export const readFrontmatter = (contents: string): Frontmatter => {
  const open = contents.match(/^---\r?\n/)
  if (!open) return { kind: 'none', body: contents }
  const start = open[0].length
  const fence = contents.indexOf('\n---', start - 1)
  if (fence === -1) return { kind: 'unterminated', body: contents }
  const block = start > fence ? '' : contents.slice(start, fence).replace(/\r$/, '')
  const lineEnd = contents.indexOf('\n', fence + 1)
  const body = lineEnd === -1 ? '' : contents.slice(lineEnd + 1)
  return { kind: 'block', block, body }
}

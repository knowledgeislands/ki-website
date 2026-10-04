import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { after, describe, test } from 'node:test'
import { byExtension, walk } from './walk.ts'

const root = mkdtempSync(join(tmpdir(), 'ki-website-walk-'))
mkdirSync(join(root, 'a', 'b'), { recursive: true })
for (const file of ['top.md', 'top.html', 'a/one.md', 'a/b/two.njk', 'a/b/skip.txt'])
  writeFileSync(join(root, file), '')
after(() => rmSync(root, { recursive: true, force: true }))

describe('walk', () => {
  test('recurses and filters by extension', () => {
    const found = walk(root, byExtension('.md', '.njk'))
      .map((path) => relative(root, path))
      .sort()
    assert.deepEqual(found, ['a/b/two.njk', 'a/one.md', 'top.md'])
  })

  test('throws for a missing directory', () => {
    assert.throws(() => walk(join(root, 'missing'), () => true))
  })
})

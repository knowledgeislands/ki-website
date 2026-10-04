import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { readFrontmatter } from './frontmatter.ts'

describe('readFrontmatter', () => {
  test('splits a block from its body', () => {
    assert.deepEqual(readFrontmatter('---\ntitle: A\norder: 2\n---\n\n# Body\n'), {
      kind: 'block',
      block: 'title: A\norder: 2',
      body: '\n# Body\n'
    })
  })

  test('accepts CRLF line endings', () => {
    assert.deepEqual(readFrontmatter('---\r\ntitle: A\r\n---\r\nBody'), {
      kind: 'block',
      block: 'title: A',
      body: 'Body'
    })
  })

  test('reads an empty block and a fence at end of file', () => {
    assert.deepEqual(readFrontmatter('---\n---\nBody'), { kind: 'block', block: '', body: 'Body' })
    assert.deepEqual(readFrontmatter('---\ntitle: A\n---'), { kind: 'block', block: 'title: A', body: '' })
  })

  test('distinguishes a missing block from an unterminated one', () => {
    assert.deepEqual(readFrontmatter('# No frontmatter\n'), { kind: 'none', body: '# No frontmatter\n' })
    assert.equal(readFrontmatter('---\ntitle: A\n').kind, 'unterminated')
  })
})

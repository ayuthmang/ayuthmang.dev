import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { getAllPosts, getPostBySlug, getPostSlugs } from '../posts'

const FIXTURES_DIR = path.join(__dirname, 'fixtures')

const opts = (includeDrafts: boolean) => ({
  directory: FIXTURES_DIR,
  includeDrafts,
})

describe('getAllPosts', () => {
  test('parses frontmatter and derives slug from filename', () => {
    const posts = getAllPosts(opts(true))
    const alpha = posts.find((post) => post.slug === 'alpha-post')

    expect(alpha).toMatchObject({
      slug: 'alpha-post',
      title: 'Alpha Post',
      description: 'The first post, published earlier.',
      date: '2026-01-01',
      tags: ['react'],
      draft: false,
      coverImage: '/images/alpha.png',
    })
  })

  test('sorts posts by date descending', () => {
    const slugs = getAllPosts(opts(true)).map((post) => post.slug)
    // draft-post (Mar) > beta-post (Feb) > alpha-post (Jan)
    expect(slugs).toEqual(['draft-post', 'beta-post', 'alpha-post'])
  })

  test('defaults tags to an empty array when omitted', () => {
    const draft = getAllPosts(opts(true)).find((p) => p.slug === 'draft-post')
    expect(draft?.tags).toEqual(['wip'])
    const alpha = getAllPosts(opts(true)).find((p) => p.slug === 'alpha-post')
    expect(Array.isArray(alpha?.tags)).toBe(true)
  })

  test('excludes drafts when includeDrafts is false', () => {
    const slugs = getAllPosts(opts(false)).map((post) => post.slug)
    expect(slugs).toEqual(['beta-post', 'alpha-post'])
    expect(slugs).not.toContain('draft-post')
  })

  test('includes drafts when includeDrafts is true', () => {
    const slugs = getAllPosts(opts(true)).map((post) => post.slug)
    expect(slugs).toContain('draft-post')
  })

  test('returns an empty list for a non-existent directory', () => {
    expect(getAllPosts({ directory: path.join(FIXTURES_DIR, 'nope') })).toEqual([])
  })
})

describe('getPostSlugs', () => {
  test('returns slugs of publishable posts', () => {
    expect(getPostSlugs(opts(false)).sort()).toEqual(['alpha-post', 'beta-post'])
  })
})

describe('getPostBySlug', () => {
  test('returns the matching post', () => {
    expect(getPostBySlug('beta-post', opts(true))?.title).toBe('Beta Post')
  })

  test('returns null for an unknown slug', () => {
    expect(getPostBySlug('does-not-exist', opts(true))).toBeNull()
  })

  test('returns null for an excluded draft', () => {
    expect(getPostBySlug('draft-post', opts(false))).toBeNull()
  })
})

import { describe, test, expect } from 'vitest'
import { extractHeadings, slugify } from '../headings'

describe('extractHeadings', () => {
  test('Empty string', () => {
    expect(extractHeadings('')).toEqual([])
  })

  test('Content with no headings', () => {
    expect(extractHeadings('Just some text\nMore text')).toEqual([])
  })

  test('Single ## Heading', () => {
    expect(extractHeadings('## Heading')).toEqual([{ depth: 2, text: 'Heading', id: 'heading' }])
  })

  test('Multiple h2 and h3', () => {
    const content = `
## First Heading
Some content
### Subheading
More content
## Second Heading
    `
    expect(extractHeadings(content)).toEqual([
      { depth: 2, text: 'First Heading', id: 'first-heading' },
      { depth: 3, text: 'Subheading', id: 'subheading' },
      { depth: 2, text: 'Second Heading', id: 'second-heading' },
    ])
  })

  test('Ignores # H1 headings', () => {
    expect(extractHeadings('# H1\n## H2')).toEqual([{ depth: 2, text: 'H2', id: 'h2' }])
  })

  test('Ignores #### H4 and deeper', () => {
    expect(extractHeadings('## H2\n#### H4\n##### H5')).toEqual([{ depth: 2, text: 'H2', id: 'h2' }])
  })

  test('Strips inline code backticks from heading text', () => {
    expect(extractHeadings('## Use `useState`')).toEqual([{ depth: 2, text: 'Use useState', id: 'use-usestate' }])
  })

  test('Strips markdown links from heading text', () => {
    expect(extractHeadings('## Check [this](url) out')).toEqual([{ depth: 2, text: 'Check this out', id: 'check-this-out' }])
  })

  test('Skips headings inside fenced code blocks', () => {
    const content = `
## Actual Heading
\`\`\`ts
## Not a heading
\`\`\`
### Another Actual Heading
    `
    expect(extractHeadings(content)).toEqual([
      { depth: 2, text: 'Actual Heading', id: 'actual-heading' },
      { depth: 3, text: 'Another Actual Heading', id: 'another-actual-heading' },
    ])
  })

  test('Strips frontmatter before processing', () => {
    const content = `---
title: "## Fake heading"
---
## Real heading
    `
    expect(extractHeadings(content)).toEqual([
      { depth: 2, text: 'Real heading', id: 'real-heading' },
    ])
  })
})

describe('extractHeadings ids match rehype-slug', () => {
  test('Duplicate headings get numbered suffixes', () => {
    expect(extractHeadings('## Setup\n## Setup\n### Setup').map((h) => h.id)).toEqual([
      'setup',
      'setup-1',
      'setup-2',
    ])
  })
})

describe('slugify', () => {
  test('Lowercases', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  test('Replaces spaces with hyphens', () => {
    expect(slugify('a b c')).toBe('a-b-c')
  })

  test('Strips non-alphanumeric characters (except hyphens)', () => {
    expect(slugify("What's New?")).toBe('whats-new')
  })

  // The cases below pin parity with rehype-slug (github-slugger). The old
  // hand-rolled slugify collapsed/trimmed hyphens and dropped non-ASCII
  // letters, so TOC links to headings like "FIRE Lights Me 🔥" were dead.
  test('Keeps the trailing hyphen left by a stripped emoji', () => {
    expect(slugify('FIRE Lights Me 🔥')).toBe('fire-lights-me-')
  })

  test('Keeps repeated hyphens', () => {
    expect(slugify('a---b')).toBe('a---b')
  })

  test('Keeps non-Latin letters', () => {
    expect(slugify('สวัสดี World')).toBe('สวัสดี-world')
  })
})

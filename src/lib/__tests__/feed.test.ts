import { describe, test, expect } from 'vitest'
import { buildRssFeed, escapeXml, stripHtml, type FeedItem } from '../feed'

const RFC_822 = /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/

const baseOptions = {
  title: 'Ayuth Mangmesap',
  description:
    'Writing about web development, TypeScript, and building things.',
  siteUrl: 'https://ayuthmang-dev.vercel.app',
  feedUrl: 'https://ayuthmang-dev.vercel.app/feed.xml',
}

function feedWith(
  items: FeedItem[],
  overrides: Partial<typeof baseOptions> = {},
) {
  return buildRssFeed({ ...baseOptions, ...overrides, items })
}

describe('escapeXml', () => {
  test('Escapes the five XML-unsafe characters', () => {
    expect(escapeXml(`& < > " '`)).toBe('&amp; &lt; &gt; &quot; &apos;')
  })

  test('Escapes ampersands before the entities it introduces', () => {
    expect(escapeXml('Tom & <Jerry>')).toBe('Tom &amp; &lt;Jerry&gt;')
  })

  test('Leaves plain text untouched', () => {
    expect(escapeXml('plain text')).toBe('plain text')
  })
})

describe('stripHtml', () => {
  test('Removes tags and trims', () => {
    expect(stripHtml('  <p>Hello <strong>world</strong></p>  ')).toBe(
      'Hello world',
    )
  })

  test('Removes tags with attributes', () => {
    expect(stripHtml('<a href="https://example.com">link</a>')).toBe('link')
  })

  test('Empty string stays empty', () => {
    expect(stripHtml('')).toBe('')
  })
})

describe('buildRssFeed', () => {
  const items: FeedItem[] = [
    {
      title: 'Older post',
      url: 'https://ayuthmang-dev.vercel.app/blog/older',
      description: 'The older one',
      date: '2026-01-01',
      tags: ['typescript'],
    },
    {
      title: 'Newer post',
      url: 'https://ayuthmang-dev.vercel.app/blog/newer',
      description: 'The newer one',
      date: '2026-06-01',
      tags: ['react', 'nextjs'],
    },
  ]

  test('Starts with the XML declaration and the rss root element', () => {
    const xml = feedWith(items)
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain(
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    )
    expect(xml).toContain('</rss>')
  })

  test('Emits the channel metadata', () => {
    const xml = feedWith(items)
    expect(xml).toContain('<title>Ayuth Mangmesap</title>')
    expect(xml).toContain('<link>https://ayuthmang-dev.vercel.app</link>')
    expect(xml).toContain(
      '<description>Writing about web development, TypeScript, and building things.</description>',
    )
  })

  test('Defaults the language to en-us and honours an override', () => {
    expect(feedWith(items)).toContain('<language>en-us</language>')
    expect(feedWith(items, { ...baseOptions })).toContain(
      '<language>en-us</language>',
    )
    expect(
      buildRssFeed({ ...baseOptions, language: 'th-th', items }),
    ).toContain('<language>th-th</language>')
  })

  test('Emits the self-referencing atom:link', () => {
    expect(feedWith(items)).toContain(
      '<atom:link href="https://ayuthmang-dev.vercel.app/feed.xml" rel="self" type="application/rss+xml"/>',
    )
  })

  test('Emits one category per tag', () => {
    const xml = feedWith(items)
    expect(xml).toContain('<category>react</category>')
    expect(xml).toContain('<category>nextjs</category>')
    expect(xml).toContain('<category>typescript</category>')
    expect(xml.match(/<category>/g)).toHaveLength(3)
  })

  test('Emits a permalink guid matching the item link', () => {
    const xml = feedWith(items)
    expect(xml).toContain(
      '<guid isPermaLink="true">https://ayuthmang-dev.vercel.app/blog/newer</guid>',
    )
    expect(xml).toContain(
      '<link>https://ayuthmang-dev.vercel.app/blog/newer</link>',
    )
  })

  test('Formats pubDate as RFC 822', () => {
    const xml = feedWith(items)
    const pubDates = [...xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map(
      (match) => match[1],
    )
    expect(pubDates).toHaveLength(2)
    for (const pubDate of pubDates) {
      expect(pubDate).toMatch(RFC_822)
    }
    expect(pubDates[0]).toBe('Mon, 01 Jun 2026 00:00:00 GMT')
  })

  test('Sorts items newest first regardless of input order', () => {
    const xml = feedWith(items)
    expect(xml.indexOf('Newer post')).toBeLessThan(xml.indexOf('Older post'))

    const reversed = feedWith([...items].reverse())
    expect(reversed.indexOf('Newer post')).toBeLessThan(
      reversed.indexOf('Older post'),
    )
  })

  test('lastBuildDate equals the newest item pubDate', () => {
    const xml = feedWith(items)
    const lastBuildDate = xml.match(
      /<lastBuildDate>([^<]+)<\/lastBuildDate>/,
    )?.[1]
    const firstPubDate = xml.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1]
    expect(lastBuildDate).toMatch(RFC_822)
    expect(lastBuildDate).toBe(firstPubDate)
  })

  test('Omits the description when it is empty or absent', () => {
    const xml = feedWith([
      {
        title: 'No description',
        url: 'https://ayuthmang-dev.vercel.app/blog/bare',
        date: '2026-02-02',
      },
      {
        title: 'Blank description',
        url: 'https://ayuthmang-dev.vercel.app/blog/blank',
        description: '',
        date: '2026-02-01',
      },
    ])
    expect(xml).not.toContain('<description></description>')
    // Only the channel-level description remains.
    expect(xml.match(/<description>/g)).toHaveLength(1)
  })

  test('Omits categories when an item has no tags', () => {
    const xml = feedWith([
      {
        title: 'Untagged',
        url: 'https://ayuthmang-dev.vercel.app/blog/untagged',
        date: '2026-02-02',
      },
    ])
    expect(xml).not.toContain('<category>')
  })

  test('An empty item list still yields a valid channel', () => {
    const xml = feedWith([])
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<channel>')
    expect(xml).toContain('</channel>')
    expect(xml).toContain('<title>Ayuth Mangmesap</title>')
    expect(xml).not.toContain('<item>')
    expect(xml).not.toContain('<lastBuildDate>')
  })

  test('Escapes ampersands and angle brackets in titles and descriptions', () => {
    const xml = feedWith([
      {
        title: 'Tips & tricks for <script> tags',
        url: 'https://ayuthmang-dev.vercel.app/blog/tips?a=1&b=2',
        description: 'Rock & roll',
        date: '2026-03-03',
        tags: ['a & b'],
      },
    ])
    expect(xml).toContain(
      '<title>Tips &amp; tricks for &lt;script&gt; tags</title>',
    )
    expect(xml).toContain('<description>Rock &amp; roll</description>')
    expect(xml).toContain('<category>a &amp; b</category>')
    expect(xml).toContain(
      '<link>https://ayuthmang-dev.vercel.app/blog/tips?a=1&amp;b=2</link>',
    )
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/)
  })
})

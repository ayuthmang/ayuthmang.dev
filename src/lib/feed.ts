/**
 * Pure helpers for building an RSS 2.0 document.
 *
 * Deliberately free of `fs` and network access so the builder can be unit
 * tested; callers gather the items and hand them over.
 */

export type FeedItem = {
  title: string
  url: string
  description?: string
  /** Anything `new Date()` understands, e.g. "2026-07-25" or an RFC 822 string. */
  date: string
  tags?: string[]
}

export type FeedOptions = {
  title: string
  description: string
  siteUrl: string
  feedUrl: string
  /** Defaults to `en-us`. */
  language?: string
  items: FeedItem[]
}

/** Escapes the five characters that are unsafe inside XML text and attributes. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Removes HTML tags and surrounding whitespace, e.g. from a Medium summary. */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim()
}

/** Formats a date as RFC 822, the format RSS `pubDate` expects. */
function toRfc822(value: string): string {
  return new Date(value).toUTCString()
}

function renderItem(item: FeedItem): string {
  const lines = [
    '    <item>',
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${escapeXml(item.url)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
    `      <pubDate>${toRfc822(item.date)}</pubDate>`,
  ]

  if (item.description) {
    lines.push(
      `      <description>${escapeXml(item.description)}</description>`,
    )
  }

  for (const tag of item.tags ?? []) {
    lines.push(`      <category>${escapeXml(tag)}</category>`)
  }

  lines.push('    </item>')
  return lines.join('\n')
}

/**
 * Builds a complete RSS 2.0 document. Items are sorted newest first and
 * `lastBuildDate` tracks the newest item, so callers need not pre-sort.
 */
export function buildRssFeed(options: FeedOptions): string {
  const { title, description, siteUrl, feedUrl, language = 'en-us' } = options

  const items = [...options.items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(siteUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${escapeXml(language)}</language>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>`,
  ]

  if (items.length > 0) {
    lines.push(`    <lastBuildDate>${toRfc822(items[0].date)}</lastBuildDate>`)
  }

  for (const item of items) {
    lines.push(renderItem(item))
  }

  lines.push('  </channel>', '</rss>', '')

  return lines.join('\n')
}

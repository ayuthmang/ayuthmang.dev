import { getMediumItemsSafe, slugFromLink } from '@/hooks/use-medium'
import { buildRssFeed, stripHtml, type FeedItem } from '@/lib/feed'
import { getAllPosts } from '@/lib/posts'

const siteUrl = 'https://ayuthmang-dev.vercel.app'
const MEDIUM_USERNAME = '@ayuthmang'

/** Prerender the feed at build time, the same way `sitemap.ts` is generated. */
export const dynamic = 'force-static'

export async function GET() {
  const localPosts = getAllPosts()
  const localSlugs = new Set(localPosts.map((post) => post.slug))

  const localItems: FeedItem[] = localPosts.map((post) => ({
    title: post.title,
    url: `${siteUrl}/blog/${post.slug}`,
    description: post.description,
    date: post.date,
    tags: post.tags,
  }))

  const mediumItems: FeedItem[] = (await getMediumItemsSafe(MEDIUM_USERNAME))
    .filter((item) => !localSlugs.has(slugFromLink(item.link)))
    .map((item) => ({
      title: item.title,
      url: `${siteUrl}/blog/${slugFromLink(item.link)}`,
      description: stripHtml(item.description).slice(0, 160),
      date: item.pubDate,
      tags: item.categories,
    }))

  const xml = buildRssFeed({
    title: 'Ayuth Mangmesap',
    description:
      'Writing about web development, TypeScript, and building things.',
    siteUrl,
    feedUrl: `${siteUrl}/feed.xml`,
    items: [...localItems, ...mediumItems],
  })

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}

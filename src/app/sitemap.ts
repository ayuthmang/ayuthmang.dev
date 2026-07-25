import type { MetadataRoute } from 'next'
import { getMediumItemsSafe, slugFromLink } from '@/hooks/use-medium'
import { getAllPosts } from '@/lib/posts'

const siteUrl = 'https://ayuthmang-dev.vercel.app'
const MEDIUM_USERNAME = '@ayuthmang'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localPosts = getAllPosts()
  const localSlugs = new Set(localPosts.map((post) => post.slug))

  const localEntries: MetadataRoute.Sitemap = localPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const items = await getMediumItemsSafe(MEDIUM_USERNAME)
  const mediumEntries: MetadataRoute.Sitemap = items
    .filter((post) => !localSlugs.has(slugFromLink(post.link)))
    .map((post) => ({
      url: `${siteUrl}/blog/${slugFromLink(post.link)}`,
      lastModified: new Date(post.pubDate),
      changeFrequency: 'yearly',
      priority: 0.6,
    }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...localEntries,
    ...mediumEntries,
  ]
}

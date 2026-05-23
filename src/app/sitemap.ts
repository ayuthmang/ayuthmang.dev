import type { MetadataRoute } from 'next'
import { getLatestMediumPosts, slugFromLink } from '@/hooks/use-medium'

const siteUrl = 'https://ayuthmang-dev.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { items } = await getLatestMediumPosts('@ayuthmang')

  const blogEntries: MetadataRoute.Sitemap = items.map((post) => ({
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
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...blogEntries,
  ]
}

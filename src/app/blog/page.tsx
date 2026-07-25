import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { getMediumItemsSafe, slugFromLink } from '@/hooks/use-medium'
import { getAllPosts } from '@/lib/posts'

const MEDIUM_USERNAME = '@ayuthmang'
const siteUrl = 'https://ayuthmang-dev.vercel.app'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing about web development, TypeScript, and building things — locally authored posts and articles from Medium.',
  alternates: { canonical: `${siteUrl}/blog` },
}

type BlogListItem = {
  slug: string
  title: string
  description?: string
  date: string
  tags: string[]
  source: 'Local' | 'Medium'
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim()
}

async function getBlogList(): Promise<BlogListItem[]> {
  const localPosts: BlogListItem[] = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    source: 'Local',
  }))

  const mediumItems = await getMediumItemsSafe(MEDIUM_USERNAME)
  const localSlugs = new Set(localPosts.map((post) => post.slug))
  const mediumPosts: BlogListItem[] = mediumItems
    .map((item) => ({
      slug: slugFromLink(item.link),
      title: item.title,
      description: stripHtml(item.description).slice(0, 160),
      date: item.pubDate,
      tags: item.categories,
      source: 'Medium' as const,
    }))
    .filter((post) => !localSlugs.has(post.slug))

  return [...localPosts, ...mediumPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogIndexPage() {
  const posts = await getBlogList()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold leading-tight">Blog</h1>
        <p className="text-muted-foreground">
          Notes on web development and the things I build. Local posts and
          articles cross-posted from Medium.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {posts.map((post) => (
            <li key={`${post.source}-${post.slug}`} className="py-6 first:pt-0">
              <article className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <Badge variant="outline">{post.source}</Badge>
                </div>
                <h2 className="text-xl font-semibold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.description ? (
                  <p className="text-muted-foreground">{post.description}</p>
                ) : null}
                {post.tags.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={`${post.slug}-${tag}`} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

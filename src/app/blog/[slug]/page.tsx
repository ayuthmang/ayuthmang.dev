import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import {
  getMediumItemsSafe,
  getMediumPostBySlugSafe,
  slugFromLink,
} from '@/hooks/use-medium'
import { getAllPosts, getPostBySlug, type Post } from '@/lib/posts'

const MEDIUM_USERNAME = '@ayuthmang'
const siteUrl = 'https://ayuthmang-dev.vercel.app'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function generateStaticParams() {
  const localSlugs = getAllPosts().map((post) => ({ slug: post.slug }))
  const mediumItems = await getMediumItemsSafe(MEDIUM_USERNAME)
  const mediumSlugs = mediumItems.map((post) => ({ slug: slugFromLink(post.link) }))

  // Local slugs win over Medium slugs if they ever collide.
  const seen = new Set(localSlugs.map((entry) => entry.slug))
  return [...localSlugs, ...mediumSlugs.filter((entry) => !seen.has(entry.slug))]
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params

  const localPost = getPostBySlug(slug)
  if (localPost) {
    return {
      title: localPost.title,
      description: localPost.description,
      openGraph: {
        title: `${localPost.title} | Ayuth Mangmesap`,
        description: localPost.description,
        url: `${siteUrl}/blog/${slug}`,
        type: 'article',
        publishedTime: localPost.date,
        tags: localPost.tags,
        ...(localPost.coverImage ? { images: [{ url: localPost.coverImage }] } : {}),
      },
      alternates: { canonical: `${siteUrl}/blog/${slug}` },
    }
  }

  const post = await getMediumPostBySlugSafe(MEDIUM_USERNAME, slug)
  if (!post) return {}

  const description = post.description.replace(/<[^>]*>/g, '').slice(0, 160)
  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | Ayuth Mangmesap`,
      description,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: post.pubDate,
      authors: [post.author],
      tags: post.categories,
      ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
    },
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
  }
}

function BackLink() {
  return (
    <Link
      href="/blog"
      className="group mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      Back to blog
    </Link>
  )
}

const proseClassName =
  'prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl dark:prose-a:text-blue-400'

async function LocalPost({ post }: { post: Post }) {
  // Dynamic import with a static prefix + `.mdx` suffix lets Turbopack build a
  // module map of `content/blog/*.mdx` and resolve the right one at runtime.
  const { default: MDXContent } = await import(
    `../../../../content/blog/${post.slug}.mdx`
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <BackLink />
      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.tags.length > 0 ? (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </header>

      <article className={proseClassName}>
        <MDXContent />
      </article>
    </div>
  )
}

async function MediumPost({ slug }: { slug: string }) {
  const post = await getMediumPostBySlugSafe(MEDIUM_USERNAME, slug)
  if (!post) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <BackLink />
      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold leading-tight">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span>·</span>
          <time dateTime={post.pubDate}>{formatDate(post.pubDate)}</time>
          <span>·</span>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Read on Medium
          </a>
        </div>
      </header>

      <article
        className={proseClassName}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const localPost = getPostBySlug(slug)
  if (localPost) return <LocalPost post={localPost} />

  return <MediumPost slug={slug} />
}

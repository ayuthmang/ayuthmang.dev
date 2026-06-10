import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { getLatestMediumPosts, getMediumPostBySlug, slugFromLink } from '@/hooks/use-medium'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { items } = await getLatestMediumPosts('@ayuthmang')
  return items.map((post) => ({ slug: slugFromLink(post.link) }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getMediumPostBySlug('@ayuthmang', slug)

  if (!post) return {}

  const siteUrl = 'https://ayuthmang-dev.vercel.app'

  return {
    title: post.title,
    description: post.description.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: `${post.title} | Ayuth Mangmesap`,
      description: post.description.replace(/<[^>]*>/g, '').slice(0, 160),
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: post.pubDate,
      authors: [post.author],
      tags: post.categories,
      ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getMediumPostBySlug('@ayuthmang', slug)

  if (!post) notFound()

  const publishedDate = new Date(post.pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="py-10 max-w-3xl mx-auto px-4">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight mb-3">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span>·</span>
          <time dateTime={post.pubDate}>{publishedDate}</time>
          <span>·</span>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline underline-offset-2 transition-colors"
          >
            Read on Medium
          </a>
        </div>
      </header>

      {/* Article content */}
      <article
        className="prose prose-neutral dark:prose-invert max-w-none prose-img:rounded-xl prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-headings:font-bold"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  )
}

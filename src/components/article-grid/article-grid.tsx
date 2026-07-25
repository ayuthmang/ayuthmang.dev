import Article, { type ArticleProps } from '@/components/article'
import React from 'react'
import { getMediumItemsSafe, slugFromLink } from '@/hooks/use-medium'
import { getAllPosts } from '@/lib/posts'

const MEDIUM_USERNAME = '@ayuthmang'
const FALLBACK_COVER = '/images/post-placeholder.svg'

export async function ArticleGrid() {
  // Local MDX posts, adapted to the Medium-shaped `Article` props.
  const localArticles: ArticleProps[] = getAllPosts().map((post) => ({
    guid: `local-${post.slug}`,
    title: post.title,
    description: post.description ?? '',
    categories: post.tags,
    thumbnail: post.coverImage ?? FALLBACK_COVER,
    slug: post.slug,
  }))

  const mediumItems = await getMediumItemsSafe(MEDIUM_USERNAME)
  const mediumArticles: ArticleProps[] = mediumItems.map((post) => ({
    guid: post.guid,
    title: post.title,
    description: post.description,
    categories: post.categories,
    thumbnail: post.thumbnail,
    slug: slugFromLink(post.link),
  }))

  const articles = [...localArticles, ...mediumArticles]

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-4 lg:gap-6">
      {articles.map((article) => (
        <Article key={article.guid} {...article} />
      ))}
    </div>
  )
}

export default ArticleGrid

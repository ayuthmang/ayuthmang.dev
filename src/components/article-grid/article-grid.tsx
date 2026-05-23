import Article from '@/components/article'
import React from 'react'
import { getLatestMediumPosts, slugFromLink } from '@/hooks/use-medium'

export async function ArticleGrid() {
  const { items } = await getLatestMediumPosts('@ayuthmang')

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-4 lg:gap-6">
      {items?.map((post, index) => {
        return (
          <Article
            key={post.guid}
            guid={post.guid}
            title={post.title}
            thumbnail={post.thumbnail}
            categories={post.categories}
            description={post.description}
            slug={slugFromLink(post.link)}
          />
        )
      })}
    </div>
  )
}

export default ArticleGrid

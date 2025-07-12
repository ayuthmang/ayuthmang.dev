import Article from '@/components/article'
import React from 'react'
import { useLatestMediumPosts } from '@/hooks/use-medium'

export function ArticleGrid() {
  const { data } = useLatestMediumPosts('@ayuthmang')

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] lg:gap-6 gap-4">
      {data?.items?.map((post) => {
        return (
          <Article
            key={post.guid}
            guid={post.guid}
            title={post.title}
            thumbnail={post.thumbnail}
            categories={post.categories}
            description={post.description}
            link={post.link}
          />
        )
      })}
    </div>
  )
}

export default ArticleGrid

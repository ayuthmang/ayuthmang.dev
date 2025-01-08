import Article from '~/components/Article'
import React from 'react'
import { useLatestMediumPosts } from '~/hooks/use-medium-posts'

export function ArticleGrid() {
  const { data } = useLatestMediumPosts('@ayuthmang')

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(275px,_1fr))] gap-8">
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

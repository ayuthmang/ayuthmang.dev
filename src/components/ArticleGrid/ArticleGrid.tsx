import Article from '~/components/Article'
import React from 'react'
import styled from 'styled-components'
import { useLatestMediumPosts } from '~/app/api/medium/use-medium-posts.hooks'

export async function ArticleGrid() {
  const { data } = useLatestMediumPosts('@ayuthmang')

  return (
    <Wrapper>
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: 32px;
`

export default ArticleGrid

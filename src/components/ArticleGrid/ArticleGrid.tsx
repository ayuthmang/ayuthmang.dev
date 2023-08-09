import Article from '~/components/Article'
import { getLatestMediumPosts } from '~/app/api/medium'
import React from 'react'
import styled from 'styled-components'

export async function ArticleGrid() {
  const posts = await getLatestMediumPosts('@ayuthmang')

  return (
    <Wrapper>
      {posts?.map((post) => {
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

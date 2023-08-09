import Article from '~/components/Article'
import useMediumPosts from '~/hooks/use-medium-posts'
import React from 'react'
import styled from 'styled-components'

function ArticleGrid(): JSX.Element {
  const { posts } = useMediumPosts()

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

import Article from 'components/Article/Article'
import useMediumPosts from 'hooks/use-medium-posts'
import React from 'react'
import styled from 'styled-components'

function ArticleGrid(): JSX.Element {
  const { posts } = useMediumPosts()

  return (
    <Wrapper>
      {posts?.map((post) => {
        return (
          <ArticleWrapper key={post.guid}>
            <Article
              guid={post.guid}
              title={post.title}
              thumbnail={post.thumbnail}
              categories={post.categories}
              description={post.description}
              link={post.link}
            />
          </ArticleWrapper>
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
`

const ArticleWrapper = styled.div`
  min-width: 275px;
  flex: 1;
`

export default ArticleGrid

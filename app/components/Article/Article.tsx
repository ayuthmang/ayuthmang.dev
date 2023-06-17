import React from 'react'
import Tag from '~/app/components/Tag'
import styled from 'styled-components'

export type ArticleProps = {
  guid: string
  title: string
  description: string
  categories: string[]
  thumbnail: string
  link: string
}

function Article({
  guid,
  title,
  description,
  categories,
  thumbnail,
  link,
}: ArticleProps): JSX.Element {
  return (
    <Link href={link}>
      <Wrapper>
        <ImageWrapper>
          <Image src={thumbnail} alt="Article's cover image" />
        </ImageWrapper>
        <Title>{title}</Title>
        {/* <Description dangerouslySetInnerHTML={{ __html: description }} /> */}
        <Tags>
          {categories.map((category) => (
            <Tag key={`${guid}-${category}`}>{category}</Tag>
          ))}
        </Tags>
      </Wrapper>
    </Link>
  )
}

const Link = styled.a`
  text-decoration: none;
  color: inherit;
`

const Image = styled.img`
  display: inline;
  height: 12rem;
  width: 100%;
  object-fit: cover;
  will-change: transform;
  transition: transform 600ms, filter 1000ms;
  filter: brightness(90%);

  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    ${Link}:hover &,
    ${Link}:focus & {
      transform: scale(1.1);
      transition: transform 250ms, filter 400ms;
      filter: brightness(100%);
    }
  }
`

const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 8px;
`

const Title = styled.h3`
  font-weight: var(--font-weight-bold);
`

const Description = styled.p``

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
`

const Tags = styled.div`
  display: flex;
  overflow: hidden;
  overflow-x: scroll;
  /* text-overflow: ellipsis; */
  white-space: nowrap;
  padding: 4px 0;
`

export default Article

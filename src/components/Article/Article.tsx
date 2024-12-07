import React from 'react'
import Tag from '~/components/Tag'
import styled, { keyframes } from 'styled-components'

export type ArticleProps = {
  guid: string
  title: string
  description: string
  categories: string[]
  thumbnail: string
  link: string
}

function Article({ guid, title, categories, thumbnail, link }: ArticleProps) {
  return (
    <Link href={link}>
      <Wrapper>
        <ImageWrapper>
          <Image src={thumbnail} alt="Article's cover image" />
        </ImageWrapper>
        <Title>{title}</Title>
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transition:
    transform 600ms,
    filter 1000ms;
  filter: brightness(90%);

  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    ${Link}:hover &,
    ${Link}:focus & {
      transform: scale(1.1);
      transition:
        transform 250ms,
        filter 400ms;
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
  height: 15rem;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
`

const Tags = styled.div`
  display: flex;
  overflow: hidden;
  overflow-x: auto;
  /* text-overflow: ellipsis; */
  white-space: nowrap;
  padding: 4px 0;
`

export default Article

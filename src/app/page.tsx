'use client'
import styled from 'styled-components'
import ArticleGrid from '~/components/ArticleGrid'
import MainContent from '~/components/MainContent'
import MaxWidthWrapper from '~/components/MaxWidthWrapper'
import { QUERIES } from '~/constants'

const Page = () => {
  return (
    <>
      <HeroHeadingWrapper>
        <Heading>Hello World</Heading>
        <HandWrapper>
          <Hand role="img" aria-label="Waving hand">
            👋
          </Hand>
        </HandWrapper>
      </HeroHeadingWrapper>
      <MainContent>
        <ArticleGrid />
      </MainContent>
    </>
  )
}

const HeroHeadingWrapper = styled(MaxWidthWrapper)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media ${QUERIES.phoneAndSmaller} {
    flex-direction: column;
  }
`

const Heading = styled.h1`
  font-size: 3rem;
  color: transparent;
  background-color: rgb(255, 178, 62);
  background-image: linear-gradient(
    268.67deg,
    rgb(255, 255, 255) 3.43%,
    rgb(255, 240, 102) 15.69%,
    rgb(255, 163, 26) 55.54%,
    rgb(255, 0, 115) 99%
  );

  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`

const Hand = styled.span``

const HandWrapper = styled.p`
  @keyframes wave {
    from {
      transform: rotate(-10deg);
    }
    to {
      transform: rotate(30deg);
    }
  }
  font-size: 3rem;

  ${Hand} {
    display: inline-block;
    animation: wave 1000ms infinite alternate ease-in-out;
    transform-origin: 75% 80%;
  }
`

const PaperStyleWrapper = styled(MaxWidthWrapper)`
  background-color: #171717;
  color: var(--text-white);
  box-shadow: 0px 6px 12px 3px rgba(0, 0, 0, 0.24);
  padding: 52px 72px;
`

export default Page
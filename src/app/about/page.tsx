'use client'
import React from 'react'
import styled from 'styled-components'
import Paragraph from '~/components/Paragraph'
import ParagraphWithImage from '~/components/ParagraphWithImage'

const AboutPage: React.FC = () => {
  return (
    <>
      <HeroContainer>
        <Heading>
          Hi there{' '}
          <HandWrapper>
            <Hand role="img" aria-label="Waving hand">
              👋
            </Hand>
          </HandWrapper>
        </Heading>
        <ParagraphWithImage
          imageAlt={'coding cat'}
          imageSrc="https://media.tenor.com/G5YA-Jm1pG4AAAAi/peeposhy-pepe-the-frog.gif"
          imageWidth={250}
          imageHeight={250}
        >
          I&apos;m a Full-stack Web Developer who loves memes.
        </ParagraphWithImage>
        <ParagraphWithImage
          imageAlt={'cinderella drinking coffee'}
          imageSrc="https://64.media.tumblr.com/c10da7d3592bddfca6a8d2586b15c153/tumblr_of7di4D6mW1tr7vtjo1_500.gif"
          imageWidth={250}
          imageHeight={250}
        >
          I drink coffee to keep me alive, not for the taste.
        </ParagraphWithImage>
      </HeroContainer>
    </>
  )
}

const Hand = styled.span``

const HandWrapper = styled.div`
  font-size: 2rem;
  display: inline-block;

  @keyframes wave {
    from {
      transform: rotate(-10deg);
    }
    to {
      transform: rotate(30deg);
    }
  }

  ${Hand} {
    display: inline-block;
    animation: wave 1000ms infinite alternate ease-in-out;
    transform-origin: 75% 80%;
  }
`

const HeroContainer = styled.div`
  min-height: 650px;
  max-height: 750px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const Heading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
`

export default AboutPage

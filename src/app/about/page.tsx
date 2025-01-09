import React from 'react'
import ParagraphWithImage from '@/components/ParagraphWithImage'
import styles from './page.module.css'

function AboutPage() {
  return (
    <HeroContainer>
      <Heading>
        Hi there <WavingHand />
      </Heading>
      <ParagraphWithImage
        imageAlt="pepe is so shy"
        imageSrc="https://media.tenor.com/G5YA-Jm1pG4AAAAi/peeposhy-pepe-the-frog.gif"
        imageWidth={250}
        imageHeight={250}
      >
        I&apos;m a Full-stack Web Developer who loves memes.
      </ParagraphWithImage>
    </HeroContainer>
  )
}

function WavingHand() {
  return (
    <div className="inline-block text-4xl">
      <p role="img" aria-label="Waving hand" className={styles.animateWave}>
        👋
      </p>
    </div>
  )
}

function HeroContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full max-h-[46rem] min-h-[54rem] flex-col items-center justify-center">
      {children}
    </div>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-center text-4xl font-bold">{children}</h2>
}

export default AboutPage

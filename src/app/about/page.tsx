import React from 'react'
import styles from './page.module.css'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'

function AboutPage() {
  return (
    <HeroContainer>
      <Heading>
        Hi there <WavingHand />
      </Heading>
      <div>
        I&apos;m a Full-stack Web Developer who loves{' '}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="relative cursor-pointer">
              memes
              <span className="absolute bottom-0 left-0 w-full h-[6px] bg-yellow-300/60 -z-10 translate-y-[2px]"></span>
            </span>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-center p-4">
            <Image
              src="https://media.tenor.com/G5YA-Jm1pG4AAAAi/peeposhy-pepe-the-frog.gif"
              alt="cute pepe"
              width="120"
              height="120"
              className="rounded-md"
            />
          </TooltipContent>
        </Tooltip>.
      </div>
    </HeroContainer>
  )
}

function WavingHand() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-block text-4xl">
          <p role="img" aria-label="Waving hand" className={styles.animateWave}>
            👋
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Friendly greeting!</p>
      </TooltipContent>
    </Tooltip>
  )
}

function HeroContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full max-h-184 min-h-216 flex-col items-center justify-center">
      {children}
    </div>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-center text-4xl font-bold">{children}</h2>
}

export default AboutPage

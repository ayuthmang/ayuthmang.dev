import type { Metadata } from 'next'
import React from 'react'
import styles from './page.module.css'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { BentoGrid, BentoCard } from '@/components/bento-grid'
import { PlaygroundCard } from '@/components/playground-card'
import { TechStack } from '@/components/tech-stack'
import { PROFILE_LINKS } from '@/constants'
import { cn } from '@/utils'
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
  description:
    "Ayuth Mangmesap is a Full-Stack Developer at OOZOU with experience in fintech, banking, and Web 3.0. Currently pursuing a Master's in Computer Science at Chulalongkorn University.",
  openGraph: {
    title: 'About | Ayuth Mangmesap',
    description:
      'Full-Stack Developer at OOZOU with experience across fintech, banking, and Web 3.0. Security researcher and open-source contributor.',
    url: 'https://ayuthmang-dev.vercel.app/about',
  },
  alternates: {
    canonical: 'https://ayuthmang-dev.vercel.app/about',
  },
}

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className={cn('relative mb-12', styles.heroEnter)}>
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-xl max-w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/25 via-blue-500/15 to-indigo-500/25 blur-3xl"
        />
        <Heading>
          <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
            Hi there
          </span>{' '}
          <WavingHand />
        </Heading>
        <p className="mx-auto max-w-xl text-center text-lg text-balance text-gray-600 dark:text-gray-400">
          I&apos;m a full-stack developer building the future of web experiences
        </p>
      </div>

      <BentoGrid className={styles.gridEnter}>
        {/* Main intro — large card */}
        <BentoCard title="👨‍💻 About Me" className="md:col-span-2 md:row-span-2">
          <p className="text-base leading-relaxed">
            I&apos;m a Full-Stack Developer with a passion for building
            scalable, user-centric applications. Currently at{' '}
            <strong>OOZOU</strong>, I work on high-impact projects ranging from
            cryptocurrency trading platforms to B2B e-commerce solutions. With
            experience spanning fintech, banking, and innovation labs, I thrive
            in fast-paced environments where I can collaborate with talented
            international teams and push the boundaries of what&apos;s possible.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            Beyond code, I love{' '}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="relative cursor-pointer font-semibold">
                  exploring vulnerabilities
                  <span className="absolute bottom-0 left-0 -z-10 h-[6px] w-full translate-y-[2px] bg-yellow-300/60"></span>
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col items-center p-4">
                <Image
                  src="https://media.tenor.com/G5YA-Jm1pG4AAAAi/peeposhy-pepe-the-frog.gif"
                  alt="security researcher"
                  width="120"
                  height="120"
                  unoptimized
                  className="rounded-md"
                />
              </TooltipContent>
            </Tooltip>
            , contributing to open-source, and sharing knowledge through
            technical writing on{' '}
            <a
              href="https://medium.com/@ayuthmang"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Medium
            </a>{' '}
            and{' '}
            <a
              href="https://dev.to/ayuthmang"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              DEV
            </a>
            .
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            <FactChip>💼 Full-Stack Dev @ OOZOU</FactChip>
            <FactChip>🎓 MSc CS @ Chulalongkorn</FactChip>
            <FactChip>🚀 GitKraken Ambassador</FactChip>
          </div>
        </BentoCard>

        {/* Highlights — tall card */}
        <BentoCard title="✨ Highlights" className="md:row-span-2">
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-3 text-lg">🏆</span>
              <span>
                1st Runner-Up, SCB Innovation Bootcamp 2022 for a reusable
                components library that accelerated development by 40%
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-lg">🔐</span>
              <span>
                Security researcher discovering and responsibly disclosing
                vulnerabilities in high-profile platforms
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-lg">📚</span>
              <span>
                Active technical writer and speaker, sharing knowledge on Web
                3.0, cloud architecture, and development best practices
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-lg">🚀</span>
              <span>
                GitKraken Ambassador, passionate about developer tools and
                community engagement
              </span>
            </li>
          </ul>
        </BentoCard>

        {/* Professional Experience — wide card */}
        <BentoCard title="💼 Professional Journey" className="md:col-span-2">
          <div className="relative ml-1.5 space-y-8 border-l-2 border-gray-200 pl-6 dark:border-gray-800">
            <ExperienceItem
              company="OOZOU"
              position="Full-Stack Developer"
              period="Aug 2023 – Present"
              description="Building high-performance cryptocurrency and e-commerce platforms using modern JavaScript technologies. Leading initiatives to improve collaboration workflows and reduce iteration cycles by 50%."
            />
            <ExperienceItem
              company="SCB TechX"
              position="Technology Evangelist & Software Engineer"
              period="Jul 2021 – Jul 2023"
              description="Developed reusable component libraries, implemented internal engagement platforms with NFT integration, and mentored teams on Web 3.0 and smart contract development."
            />
            <ExperienceItem
              company="Siam Commercial Bank"
              position="Software Engineer - SCB Digital Academy"
              period="Sep 2019 – Jun 2021"
              description="Built internal applications, taught web development bootcamps, and established testing standards achieving 80%+ code coverage from the ground up."
            />
          </div>
        </BentoCard>

        {/* Education & Certifications */}
        <BentoCard title="🎓 Education & Certifications">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Chulalongkorn University</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Master&apos;s in Computer Science (2024 – Present)
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Thammasat University</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bachelor of Science in Computer Science (2015 – 2019)
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Microsoft Certified</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Azure AI Fundamentals',
                  'Azure Data Fundamentals',
                  'Azure Fundamentals',
                ].map((cert) => (
                  <span
                    key={cert}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Technical Skills — wide card */}
        <BentoCard title="🛠️ Technical Stack" className="md:col-span-2">
          <TechStack />
        </BentoCard>

        {/* Connect */}
        <BentoCard title="🤝 Let's Connect">
          <p className="mb-4 text-base leading-relaxed">
            I&apos;m always interested in discussing new projects, innovative
            technologies, and challenging problems. Feel free to reach out!
          </p>
          <div className="mt-auto flex flex-wrap gap-3">
            <ConnectLink
              href="mailto:ayuth.mang@gmail.com"
              className="bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              <EnvelopeClosedIcon aria-hidden />
              Email
            </ConnectLink>
            <ConnectLink
              href={PROFILE_LINKS.LINKEDIN}
              external
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <LinkedInLogoIcon aria-hidden />
              LinkedIn
            </ConnectLink>
            <ConnectLink
              href={PROFILE_LINKS.GITHUB}
              external
              className="bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
            >
              <GitHubLogoIcon aria-hidden />
              GitHub
            </ConnectLink>
          </div>
        </BentoCard>

        {/* Playground — interactive frontend toys */}
        <BentoCard title="🎮 Playground" className="md:col-span-3">
          <PlaygroundCard />
        </BentoCard>
      </BentoGrid>
    </div>
  )
}

function WavingHand() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="img"
          aria-label="Waving hand"
          className={`${styles.animateWave} text-4xl`}
        >
          👋
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Friendly greeting!</p>
      </TooltipContent>
    </Tooltip>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-header mb-3 text-center text-4xl font-bold tracking-tight md:text-5xl">
      {children}
    </h2>
  )
}

interface ExperienceItemProps {
  company: string
  position: string
  period: string
  description: string
}

function ExperienceItem({
  company,
  position,
  period,
  description,
}: ExperienceItemProps) {
  const isCurrent = period.includes('Present')

  return (
    <div className="relative">
      <span
        aria-hidden
        className={cn(
          'absolute top-1.5 -left-[31px] size-3 rounded-full ring-4 ring-white dark:ring-gray-900',
          isCurrent
            ? 'bg-blue-500 shadow-md shadow-blue-500/50'
            : 'bg-gray-300 dark:bg-gray-700',
        )}
      />
      <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-lg leading-snug font-semibold">{position}</h4>
          <p className="font-medium text-blue-600 dark:text-blue-400">
            {company}
          </p>
        </div>
        <span className="mt-1 w-fit shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-gray-600 sm:mt-0.5 dark:bg-gray-800 dark:text-gray-400">
          {period}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  )
}

function FactChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300">
      {children}
    </span>
  )
}

interface ConnectLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  external?: boolean
}

function ConnectLink({
  external,
  className,
  children,
  ...rest
}: ConnectLinkProps) {
  return (
    <a
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )
}

export default AboutPage

import type { Metadata } from 'next'
import React from 'react'
import styles from './page.module.css'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
  description:
    "Ayuth Mangmesap is a Full-Stack Developer at OOZOU with experience in fintech, banking, and Web 3.0. Currently pursuing a Master's in Computer Science at Chulalongkorn University.",
  openGraph: {
    title: 'About | Ayuth Mangmesap',
    description:
      'Full-Stack Developer at OOZOU with experience across fintech, banking, and Web 3.0. Security researcher and open-source contributor.',
    url: 'https://ayuthmang.dev/about',
  },
  alternates: {
    canonical: 'https://ayuthmang.dev/about',
  },
}

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12">
        <Heading>
          Hi there <WavingHand />
        </Heading>
        <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400">
          I&apos;m a full-stack developer building the future of web experiences
        </p>
      </div>

      <div className="space-y-8">
        {/* Main intro */}
        <Section>
          <SectionTitle>About Me</SectionTitle>
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
        </Section>

        {/* Professional Experience */}
        <Section>
          <SectionTitle>Professional Journey</SectionTitle>
          <div className="space-y-6">
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
        </Section>

        {/* Technical Skills */}
        <Section>
          <SectionTitle>Technical Stack</SectionTitle>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SkillCategory
              category="Frontend"
              skills={[
                'React',
                'Next.js',
                'Vue.js',
                'TypeScript',
                'HTML5/CSS3',
              ]}
            />
            <SkillCategory
              category="Backend"
              skills={[
                'Node.js',
                'Nest.js',
                'Express',
                'Spring Boot',
                'Python',
              ]}
            />
            <SkillCategory
              category="Databases & Cloud"
              skills={[
                'PostgreSQL',
                'MongoDB',
                'AWS',
                'GCP',
                'Docker',
                'Kubernetes',
              ]}
            />
            <SkillCategory
              category="Mobile"
              skills={['React Native', 'Flutter', 'Kotlin']}
            />
          </div>
        </Section>

        {/* Achievements */}
        <Section>
          <SectionTitle>Highlights</SectionTitle>
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
        </Section>

        {/* Education & Certifications */}
        <Section>
          <SectionTitle>Education & Certifications</SectionTitle>
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
              <p className="text-sm">
                Microsoft Certified: Azure (AI Fundamentals, Data Fundamentals,
                Fundamentals)
              </p>
            </div>
          </div>
        </Section>

        {/* Connect */}
        <Section>
          <SectionTitle>Let&apos;s Connect</SectionTitle>
          <p className="mb-4 text-base leading-relaxed">
            I&apos;m always interested in discussing new projects, innovative
            technologies, and challenging problems. Feel free to reach out!
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:ayuth.mang@gmail.com"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Email
            </a>
            <a
              href="https://linkedin.com"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              className="rounded-lg bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-900 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
            >
              GitHub
            </a>
          </div>
        </Section>
      </div>
    </div>
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

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-center text-4xl font-bold">{children}</h2>
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-b border-gray-200 pb-8 dark:border-gray-800">
      {children}
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-2xl font-bold">{children}</h3>
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
  return (
    <div>
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold">{position}</h4>
          <p className="font-medium text-blue-600 dark:text-blue-400">
            {company}
          </p>
        </div>
        <span className="mt-1 text-sm text-gray-600 sm:mt-0 dark:text-gray-400">
          {period}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  )
}

interface SkillCategoryProps {
  category: string
  skills: string[]
}

function SkillCategory({ category, skills }: SkillCategoryProps) {
  return (
    <div>
      <h4 className="mb-2 font-semibold">{category}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default AboutPage

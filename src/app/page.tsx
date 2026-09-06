import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import ArticleGrid from '@/components/article-grid'
import ArticleGridSkeleton from '@/components/article-grid-skeleton'
import { ROUTES } from '@/constants'

const siteDescription =
  'Full-stack developer at OOZOU writing about web development, TypeScript, and the things I build.'

export const metadata: Metadata = {
  title: 'Ayuth Mangmesap',
  description: siteDescription,
  openGraph: {
    title: 'Ayuth Mangmesap',
    description: siteDescription,
    url: 'https://ayuthmang-dev.vercel.app',
  },
  alternates: {
    canonical: 'https://ayuthmang-dev.vercel.app',
  },
}

function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
    >
      {children}
      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </Link>
  )
}

function HomePage() {
  return (
    <div className="my-8">
      <section aria-labelledby="intro-heading" className="mb-10 md:mb-12">
        <h1
          id="intro-heading"
          className="font-header text-3xl font-bold tracking-tight md:text-4xl"
        >
          Hi, I&apos;m Ayuth.
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg text-balance">
          Full-stack developer at OOZOU, building things with React, Next.js,
          and TypeScript. I write about web development and whatever I&apos;m
          learning along the way.
        </p>
        <div className="mt-5">
          <ArrowLink href={ROUTES.ABOUT}>More about me</ArrowLink>
        </div>
      </section>

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Latest writing</h2>
        <ArrowLink href={ROUTES.BLOG}>All posts</ArrowLink>
      </div>

      <Suspense fallback={<ArticleGridSkeleton rows={3} columns={3} />}>
        <ArticleGrid />
      </Suspense>
    </div>
  )
}

export default HomePage

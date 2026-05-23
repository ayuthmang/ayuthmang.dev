import type { Metadata } from 'next'
import { Suspense } from 'react'
import ArticleGrid from '@/components/article-grid'
import ArticleGridSkeleton from '@/components/article-grid-skeleton'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Personal website of Ayuth Mangmesap.',
  openGraph: {
    title: 'Ayuth Mangmesap',
    description: 'Personal website of Ayuth Mangmesap.',
    url: 'https://ayuthmang.dev',
  },
  alternates: {
    canonical: 'https://ayuthmang.dev',
  },
}

function HomePage() {
  return (
    <div className="my-8">
      <Suspense fallback={<ArticleGridSkeleton rows={3} columns={3} />}>
        <ArticleGrid />
      </Suspense>
    </div>
  )
}

export default HomePage

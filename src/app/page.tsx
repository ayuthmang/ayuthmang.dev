import { Suspense } from 'react'
import ArticleGrid from '@/components/article-grid'
import ArticleGridSkeleton from '@/components/article-grid-skeleton'

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

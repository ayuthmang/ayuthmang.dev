'use client'

import React from 'react'
import ArticleGrid from '@/components/article-grid'
import ArticleGridSkeleton from '@/components/article-grid-skeleton'

function HomePage() {
  return (
    <div className="py-8">
      <React.Suspense fallback={<ArticleGridSkeleton rows={3} columns={3} />}>
        <ArticleGrid />
      </React.Suspense>
    </div>
  )
}

export default HomePage

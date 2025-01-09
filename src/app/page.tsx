'use client'
import React from 'react'
import ArticleGrid from '@/components/ArticleGrid'
import ArticleGridSkeleton from '@/components/ArticleGridSkeleton/ArticleGridSkeleton'

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

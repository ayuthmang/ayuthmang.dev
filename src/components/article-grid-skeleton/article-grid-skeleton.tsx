import * as React from 'react'
import { range } from '@/utils'
import ArticleSkeleton from '@/components/article-skeleton'

export type ArticleGridSkeletonProps = {
  rows: number
  columns: number
}

function ArticleGridSkeleton({
  rows = 3,
  columns = 3,
}: ArticleGridSkeletonProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-4 lg:gap-6">
      {range(0, rows).map((row) => {
        return range(0, columns).map((column) => (
          <ArticleSkeleton key={`${row}-${column}`} />
        ))
      })}
    </div>
  )
}

export default ArticleGridSkeleton

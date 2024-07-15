'use client'

import clsx from 'clsx'
import React from 'react'
import ArticleGrid from '~/components/ArticleGrid'
import ArticleGridSkeleton from '~/components/ArticleGridSkeleton/ArticleGridSkeleton'

function Page() {
  return (
    <>
      <MainContent>
        <React.Suspense fallback={<ArticleGridSkeleton rows={3} columns={3} />}>
          <ArticleGrid />
        </React.Suspense>
      </MainContent>
    </>
  )
}

function MainContent({
  children,
  className,
  ...delegated
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('py-8', className)} {...delegated}>
      {children}
    </div>
  )
}

export default Page

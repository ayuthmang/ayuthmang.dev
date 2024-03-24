'use client'
import React from 'react'
import styled from 'styled-components'
import ArticleGrid from '~/components/ArticleGrid'
import ArticleGridSkeleton from '~/components/ArticleGridSkeleton/ArticleGridSkeleton'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import MaxWidthWrapper from '~/components/MaxWidthWrapper'

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

const MainContent = styled(MaxWidthWrapper)`
  padding-top: 32px;
  padding-bottom: 32px;
`

export default Page

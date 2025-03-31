'use client'
import * as React from 'react'
import { styled } from 'styled-components'
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
    <Wrapper>
      {range(0, rows).map((row) => {
        return range(0, columns).map((column) => (
          <ArticleSkeleton key={`${row}-${column}`} />
        ))
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: 32px;
`

export default ArticleGridSkeleton

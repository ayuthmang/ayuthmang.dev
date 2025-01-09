import React from 'react'
import styled, { keyframes } from 'styled-components'

function ArticleSkeleton() {
  return (
    <Wrapper>
      <SkeletonImageWrapper>
        <PreviewImageSkeleton />
      </SkeletonImageWrapper>
      <LineSkeleton />
      <LineSkeleton width="50%" />
      <LineSkeleton width="75%" />
      <TagsWrapper>
        <LineSkeleton width={5 + 'em'} height="1.75rem" />
        <LineSkeleton width={5 + 'em'} height="1.75rem" />
        <LineSkeleton width={7 + 'em'} height="1.75rem" />
      </TagsWrapper>
    </Wrapper>
  )
}

const pulse = keyframes`
  from {
    opacity: .5;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 8px;
`
const SkeletonImageWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
`

const PreviewImageSkeleton = styled.div`
  width: 100%;
  background-color: gray;
  height: 100%;
  min-height: 15rem;
  animation: ${pulse} 1000ms ease-in-out infinite alternate;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: -100%;
    bottom: 0;
    background: hsl(0deg 0% 100% / 0.2);
    transform: translateY(-35%) rotate(10deg);
    transition: transform 200ms;
    will-change: transform;
    mix-blend-mode: plus-lighter;
  }
`

const LineSkeleton = styled.span<{
  width?: string
  height?: string
}>`
  background-color: gray;
  border-radius: 8px;
  width: ${(props) => props.width ?? '100%'};
  height: ${(props) => props.height ?? '1rem'};
  min-height: 1rem;
`

function TagsWrapper({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="flex flex-row gap-3 overflow-hidden overflow-y-auto whitespace-nowrap">
      {children}
    </div>
  )
}

export default ArticleSkeleton

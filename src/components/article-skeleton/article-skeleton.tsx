import React from 'react'

function ArticleSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-lg">
      <SkeletonImageWrapper>
        <PreviewImageSkeleton />
      </SkeletonImageWrapper>
      <LineSkeleton />
      <LineSkeleton width="50%" />
      <LineSkeleton width="75%" />
      <TagsWrapper>
        <LineSkeleton width="5em" height="1.75rem" />
        <LineSkeleton width="5em" height="1.75rem" />
        <LineSkeleton width="7em" height="1.75rem" />
      </TagsWrapper>
    </div>
  )
}
function SkeletonImageWrapper({
  children,
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="relative overflow-hidden rounded-2xl">{children}</div>
}

function PreviewImageSkeleton({
  children,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={`
        h-full min-h-60 w-full bg-gray-500
        after:absolute after:bottom-0 after:left-0 after:right-[-100%] after:top-0 after:translate-y-[-35%] after:rotate-[10deg] after:bg-[color:hsl(0deg_0%_100%/0.2)] after:mix-blend-plus-lighter
        after:will-change-transform after:content-['']
      `}
      style={{}}
    >
      {children}
    </div>
  )
}

function LineSkeleton({
  width = '100%',
  height = '1rem',
}: {
  width?: string
  height?: string
}) {
  return (
    <span
      className="rounded-lg bg-gray-500"
      style={{ width, height, minHeight: '1rem' }}
    />
  )
}

function TagsWrapper({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="flex flex-row gap-3 overflow-hidden overflow-y-auto whitespace-nowrap">
      {children}
    </div>
  )
}

export default ArticleSkeleton

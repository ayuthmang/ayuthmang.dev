'use client'

import React from 'react'
import { cn } from '@/utils'
import type { Heading } from '@/lib/headings'
import {
  computeReadingProgress,
  findActiveHeadingId,
  minutesLeft,
} from './table-of-contents.utils'

type TableOfContentsProps = {
  headings: Heading[]
  /** id of the element wrapping the article body; progress is measured against it */
  contentId: string
  /** Estimated reading time in minutes */
  readingTime: number
}

/**
 * Distance from the viewport top at which a heading counts as "current".
 * Clears the fixed header (3.5rem) plus some breathing room.
 */
const ACTIVE_OFFSET_PX = 120

type ScrollState = { progress: number; activeId: string | null }

function useReadingState(headings: Heading[], contentId: string): ScrollState {
  const [state, setState] = React.useState<ScrollState>({
    progress: 0,
    activeId: null,
  })

  React.useEffect(() => {
    const content = document.getElementById(contentId)
    if (!content) return

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    let frame = 0

    const update = () => {
      frame = 0
      const rect = content.getBoundingClientRect()
      const progress = computeReadingProgress({
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight,
        contentTop: rect.top + window.scrollY,
        contentHeight: rect.height,
      })
      const activeId = findActiveHeadingId(
        headingElements.map((el) => ({
          id: el.id,
          top: el.getBoundingClientRect().top,
        })),
        ACTIVE_OFFSET_PX,
        progress >= 1,
      )

      setState((prev) =>
        prev.progress === progress && prev.activeId === activeId
          ? prev
          : { progress, activeId },
      )
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Images and code blocks can change the article height after load.
    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(content)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      resizeObserver.disconnect()
    }
  }, [headings, contentId])

  return state
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function TableOfContents({
  headings,
  contentId,
  readingTime,
}: TableOfContentsProps) {
  const { progress, activeId } = useReadingState(headings, contentId)
  const listRef = React.useRef<HTMLUListElement>(null)
  const percent = Math.round(progress * 100)
  const remaining = minutesLeft(readingTime, progress)

  // Keep the active item visible when the outline is taller than the screen.
  React.useEffect(() => {
    const list = listRef.current
    if (!list || !activeId) return
    const item = list.querySelector<HTMLElement>(`[data-id="${CSS.escape(activeId)}"]`)
    if (!item) return
    const { offsetTop, offsetHeight } = item
    if (offsetTop < list.scrollTop) {
      list.scrollTop = offsetTop
    } else if (offsetTop + offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = offsetTop + offsetHeight - list.clientHeight
    }
  }, [activeId])

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <>
      {/* Small screens: the outline is hidden, so show a hairline progress bar instead. */}
      <div
        aria-hidden
        className="fixed top-0 right-0 left-0 z-20 h-0.5 origin-left bg-foreground lg:hidden"
        style={{ transform: `scaleX(${progress})` }}
      />

      <aside aria-label="Reading progress" className="hidden lg:block">
        <div className="sticky top-24 text-xs tracking-wide [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">
          {headings.length > 0 ? (
            <nav aria-label="Table of contents">
              <p className="mb-3 uppercase text-muted-foreground">Contents</p>
              <ul
                ref={listRef}
                className="relative max-h-[calc(100vh-16rem)] space-y-2 overflow-y-auto overscroll-contain"
              >
                {headings.map((heading) => {
                  const isActive = activeId === heading.id
                  return (
                    <li key={heading.id} data-id={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        onClick={(event) => handleClick(event, heading.id)}
                        aria-current={isActive ? 'location' : undefined}
                        className={cn(
                          'flex gap-2 leading-snug text-muted-foreground transition-colors duration-200 hover:text-foreground',
                          heading.depth === 3 && 'pl-4',
                          isActive && 'text-foreground',
                        )}
                      >
                        <span aria-hidden className="shrink-0 opacity-50">
                          └
                        </span>
                        <span>{heading.text}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          ) : null}

          <div className="mt-8 flex items-center gap-3">
            <div
              role="progressbar"
              aria-label="Reading progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="relative h-3 flex-1 text-foreground"
            >
              {/* Dotted track */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(currentColor 0.75px, transparent 1px)',
                  backgroundSize: '3px 3px',
                }}
              />
              {/* Dithered fill, revealed with clip-path so it doesn't trigger layout */}
              <div
                className="absolute inset-0 transition-[clip-path] duration-150 ease-out motion-reduce:transition-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 3px)',
                  clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
                }}
              />
            </div>
            <span className="w-9 text-right tabular-nums text-muted-foreground">
              {percent}%
            </span>
          </div>

          <p className="mt-3 uppercase text-muted-foreground">
            {progress === 0
              ? `${readingTime} min read`
              : remaining === 0
                ? 'Done reading'
                : `${remaining} min left`}
          </p>
        </div>
      </aside>
    </>
  )
}

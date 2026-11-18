'use client'

import React from 'react'
import { ArrowUpIcon } from '@radix-ui/react-icons'
import { cn } from '@/utils'
import type { Heading } from '@/lib/headings'
import styles from './table-of-contents.module.css'
import {
  computeReadingLine,
  computeReadingProgress,
  locateSection,
  minutesLeft,
  railOffset,
  type SectionPosition,
} from './table-of-contents.utils'

type TableOfContentsProps = {
  headings: Heading[]
  /** id of the element wrapping the article body; progress is measured against it */
  contentId: string
  /** Estimated reading time in minutes */
  readingTime: number
}

/**
 * Where the reading line sits below the viewport top. Must be larger than the
 * headings' scroll-margin (scroll-mt-24 = 96px) so a heading jumped to from
 * the outline is immediately the current one.
 */
const READING_LINE_OFFSET = 120

/** Vertical centre of an item's first line (leading-5 = 20px). */
const FIRST_LINE_CENTER = 10

/** How far the rail runs past the last item, so "finished" has its own spot. */
const RAIL_TAIL = 14

/** x-centre of the rail inside the outline. */
const RAIL_X = 5

/** Same overshoot curve as the social-links pill in the header. */
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

type ReadingState = { progress: number; section: SectionPosition }

const INITIAL_STATE: ReadingState = {
  progress: 0,
  section: { index: -1, fraction: 0 },
}

function useReadingState(headings: Heading[], contentId: string): ReadingState {
  const [state, setState] = React.useState<ReadingState>(INITIAL_STATE)

  React.useEffect(() => {
    const content = document.getElementById(contentId)
    if (!content) return

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    let frame = 0

    const update = () => {
      frame = 0
      const { scrollY, innerHeight } = window
      const rect = content.getBoundingClientRect()
      const contentTop = rect.top + scrollY
      const input = {
        scrollY,
        viewportHeight: innerHeight,
        contentTop,
        contentHeight: rect.height,
      }

      const progress = computeReadingProgress(input)
      const line = computeReadingLine({ ...input, offset: READING_LINE_OFFSET })
      const section = locateSection(
        headingElements.map((el) => el.getBoundingClientRect().top + scrollY),
        contentTop,
        contentTop + rect.height,
        line,
      )

      setState((prev) =>
        prev.progress === progress &&
        prev.section.index === section.index &&
        prev.section.fraction === section.fraction
          ? prev
          : { progress, section },
      )
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Images and embeds can change the article height after first paint.
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

type RailNode = { y: number; depth: Heading['depth'] }
type RailLayout = { nodes: RailNode[]; end: number }

/** Measures where each outline item sits so the rail can line up with it. */
function useRailLayout(
  containerRef: React.RefObject<HTMLDivElement | null>,
  headings: Heading[],
): RailLayout | null {
  const [layout, setLayout] = React.useState<RailLayout | null>(null)

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const items = Array.from(
        container.querySelectorAll<HTMLElement>('[data-toc-item]'),
      )
      if (items.length === 0) {
        setLayout(null)
        return
      }
      const last = items[items.length - 1]
      setLayout({
        nodes: items.map((item, i) => ({
          y: item.offsetTop + FIRST_LINE_CENTER,
          depth: headings[i]?.depth ?? 2,
        })),
        end: last.offsetTop + last.offsetHeight + RAIL_TAIL,
      })
    }

    measure()
    // Re-measure when web fonts load or the outline re-wraps.
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [containerRef, headings])

  return layout
}

/**
 * Index the reader explicitly jumped to, held until they scroll by hand.
 *
 * Near the bottom of a page the browser can't scroll a heading all the way
 * to the top, so position alone would highlight a later section than the one
 * that was clicked.
 */
function usePinnedIndex(): [number | null, (index: number) => void] {
  // `jump` changes on every click, so re-clicking the same item restarts the hold.
  const [pinned, setPinned] = React.useState<{ index: number; jump: number } | null>(null)

  React.useEffect(() => {
    if (pinned === null) return
    const release = () => setPinned(null)

    // The jump's own smooth scroll has finished once scrolling goes quiet;
    // any scroll after that (wheel, scrollbar drag, keys, back-to-top) is new.
    let settled = false
    let settleTimer = window.setTimeout(() => (settled = true), 300)
    const onScroll = () => {
      if (settled) return release()
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => (settled = true), 150)
    }

    // A human grabbing the page mid-jump also takes over immediately.
    const inputs = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const
    window.addEventListener('scroll', onScroll, { passive: true })
    for (const type of inputs) window.addEventListener(type, release, { passive: true })
    return () => {
      window.clearTimeout(settleTimer)
      window.removeEventListener('scroll', onScroll)
      for (const type of inputs) window.removeEventListener(type, release)
    }
  }, [pinned])

  const pin = React.useCallback(
    (index: number) => setPinned((prev) => ({ index, jump: (prev?.jump ?? 0) + 1 })),
    [],
  )

  return [pinned?.index ?? null, pin]
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'
}

export function TableOfContents({
  headings,
  contentId,
  readingTime,
}: TableOfContentsProps) {
  const reading = useReadingState(headings, contentId)
  const [pinnedIndex, pin] = usePinnedIndex()
  const { progress } = reading
  const section: SectionPosition =
    pinnedIndex === null
      ? reading.section
      : {
          index: pinnedIndex,
          fraction: reading.section.index === pinnedIndex ? reading.section.fraction : 0,
        }
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const railRef = React.useRef<HTMLDivElement>(null)
  const layout = useRailLayout(railRef, headings)

  const activeIndex = section.index
  const percent = Math.round(progress * 100)
  const remaining = minutesLeft(readingTime, progress)
  const isDone = progress >= 1
  const showBackToTop = progress > 0.05

  const status = isDone
    ? 'All done 🎉'
    : progress > 0
      ? `${remaining} min left`
      : `${readingTime} min read`

  // Keep the current item in view when the outline is taller than the screen.
  React.useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller || activeIndex < 0) return
    const item = scroller.querySelectorAll<HTMLElement>('[data-toc-item]')[activeIndex]
    if (!item) return
    const { offsetTop, offsetHeight } = item
    if (offsetTop < scroller.scrollTop) {
      scroller.scrollTop = offsetTop
    } else if (offsetTop + offsetHeight > scroller.scrollTop + scroller.clientHeight) {
      scroller.scrollTop = offsetTop + offsetHeight - scroller.clientHeight
    }
  }, [activeIndex])

  const jumpTo = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    index: number,
  ) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    pin(index)
    target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() })
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  return (
    <div className={cn(styles.root, 'contents')}>
      {/* Small screens hide the outline, so show a gradient bar under the header instead. */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-(--navbar-height) z-10 h-0.5 lg:hidden"
        style={{
          backgroundImage: 'var(--toc-gradient-x)',
          clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
        }}
      />

      <aside aria-label="Article outline" className="hidden lg:block">
        <div className="sticky top-24">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-header text-sm font-semibold tracking-tight">
              On this page
            </p>
            <div
              role="progressbar"
              aria-label="Reading progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums"
            >
              <ProgressRing value={progress} />
              <span className="w-8 text-right">{percent}%</span>
            </div>
          </div>

          {headings.length > 0 ? (
            <nav aria-label="Table of contents">
              {/* Side padding leaves room for the marker's glow and the active nudge. */}
              <div
                ref={scrollRef}
                className="-mx-2 max-h-[calc(100vh-15rem)] overflow-x-hidden overflow-y-auto overscroll-contain px-2 pt-1 pb-3"
              >
                <div ref={railRef} className="relative" style={{ paddingBottom: RAIL_TAIL }}>
                  {layout ? (
                    <Rail
                      layout={layout}
                      progressY={railOffset(
                        layout.nodes.map((node) => node.y),
                        layout.end,
                        section,
                      )}
                    />
                  ) : null}
                  <ul className="space-y-2.5">
                    {headings.map((heading, i) => {
                      const isActive = i === activeIndex
                      return (
                        <li key={heading.id} data-toc-item>
                          <a
                            href={`#${heading.id}`}
                            onClick={(event) => jumpTo(event, heading.id, i)}
                            aria-current={isActive ? 'location' : undefined}
                            style={{ transitionTimingFunction: SPRING }}
                            className={cn(
                              'block rounded-sm leading-5 transition-[color,transform] duration-500 motion-reduce:transition-none',
                              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                              heading.depth === 3 ? 'pl-8 text-[13px]' : 'pl-6 text-sm',
                              isActive
                                ? 'translate-x-1 text-foreground'
                                : 'text-muted-foreground hover:translate-x-0.5 hover:text-foreground',
                            )}
                          >
                            {heading.text}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </nav>
          ) : null}

          <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
            <span aria-live="polite">{status}</span>
            <button
              type="button"
              onClick={backToTop}
              tabIndex={showBackToTop ? 0 : -1}
              aria-hidden={!showBackToTop}
              className={cn(
                'group inline-flex items-center gap-1 rounded-sm transition-[opacity,color] duration-300 hover:text-foreground',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                showBackToTop ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              Back to top
              <ArrowUpIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

/**
 * The outline's spine. A muted track with hollow nodes sits underneath; a
 * gradient copy sits on top, clipped at the reader's position, so the rail
 * and every node it passes "fill in" with the brand colours.
 */
function Rail({ layout, progressY }: { layout: RailLayout; progressY: number }) {
  const { nodes, end } = layout
  const start = nodes[0].y

  // Every coloured piece samples the same rail-length gradient at its own
  // offset, so colours line up across the line, nodes and marker.
  const sample = (top: number): React.CSSProperties => ({
    backgroundImage: 'var(--toc-gradient-y)',
    backgroundSize: `100% ${end}px`,
    backgroundPosition: `0 ${-top}px`,
    backgroundRepeat: 'no-repeat',
  })

  const nodeBox = (node: RailNode) => {
    const size = node.depth === 2 ? 9 : 7
    return { top: node.y - size / 2, left: RAIL_X - size / 2, size }
  }

  const MARKER = 11
  const markerTop = progressY - MARKER / 2

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 animate-in fade-in duration-500">
      {/* Track */}
      <span
        className="absolute w-0.5 rounded-full bg-border"
        style={{ left: RAIL_X - 1, top: start, height: end - start }}
      />
      {nodes.map((node, i) => {
        const { top, left, size } = nodeBox(node)
        return (
          <span
            key={i}
            className="absolute rounded-full border-[1.5px] border-muted-foreground/40 bg-background"
            style={{ top, left, width: size, height: size }}
          />
        )
      })}

      {/* Fill, revealed down to the reader's position */}
      <div
        className="absolute inset-0 transition-[clip-path] duration-100 ease-linear motion-reduce:transition-none"
        style={{ clipPath: `inset(0 0 calc(100% - ${progressY}px) 0)` }}
      >
        <span
          className="absolute w-0.5 rounded-full"
          style={{ left: RAIL_X - 1, top: start, height: end - start, ...sample(start) }}
        />
        {nodes.map((node, i) => {
          const { top, left, size } = nodeBox(node)
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{ top, left, width: size, height: size, ...sample(top) }}
            />
          )
        })}
      </div>

      {/* Marker */}
      <span
        className="absolute top-0 left-0 rounded-full shadow-[0_0_0_3px_var(--background),0_0_14px_2px_color-mix(in_oklab,var(--toc-via)_45%,transparent)] transition-[transform,background-position] duration-100 ease-linear motion-reduce:transition-none"
        style={{
          width: MARKER,
          height: MARKER,
          transform: `translate(${RAIL_X - MARKER / 2}px, ${markerTop}px)`,
          // Clamp so the marker never samples past either end of the gradient.
          ...sample(Math.min(Math.max(markerTop, 0), end - MARKER)),
        }}
      />
    </div>
  )
}

function ProgressRing({ value }: { value: number }) {
  const gradientId = `toc-ring-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const radius = 7
  const circumference = 2 * Math.PI * radius

  return (
    <svg viewBox="0 0 18 18" className="size-[18px] -rotate-90" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--toc-from)' }} />
          <stop offset="50%" style={{ stopColor: 'var(--toc-via)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--toc-to)' }} />
        </linearGradient>
      </defs>
      <circle cx="9" cy="9" r={radius} fill="none" strokeWidth="2.5" className="stroke-border" />
      {value > 0 ? (
        <circle
          cx="9"
          cy="9"
          r={radius}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value)}
          className="transition-[stroke-dashoffset] duration-150 ease-out motion-reduce:transition-none"
        />
      ) : null}
    </svg>
  )
}

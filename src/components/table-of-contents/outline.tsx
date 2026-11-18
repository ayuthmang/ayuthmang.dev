'use client'

import React from 'react'
import { ArrowUpIcon } from '@radix-ui/react-icons'
import { cn } from '@/utils'
import type { Heading } from '@/lib/headings'
import { minutesLeft, railOffset, type SectionPosition } from './table-of-contents.utils'

/** How far the rail runs past the last item, so "finished" has its own spot. */
const RAIL_TAIL = 14

/** x-centre of the rail inside the outline. */
const RAIL_X = 5

/** Same overshoot curve as the social-links pill in the header. */
export const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

/**
 * Item typography per context. `firstLineCenter` is where the rail node sits:
 * the vertical centre of the item's first line, including any top padding.
 */
const SIZES = {
  /** Desktop sidebar */
  sm: {
    list: 'space-y-2.5',
    item: 'leading-5',
    depth: { 2: 'pl-6 text-sm', 3: 'pl-8 text-[13px]' },
    firstLineCenter: 10,
  },
  /** Mobile sheet: 40px rows so every item is an easy tap target */
  lg: {
    list: '',
    item: 'py-2 leading-6',
    depth: { 2: 'pl-7 text-base', 3: 'pl-10 text-[15px]' },
    firstLineCenter: 20,
  },
} as const

type OutlineSize = keyof typeof SIZES

type RailNode = { y: number; depth: Heading['depth'] }
type RailLayout = { nodes: RailNode[]; end: number }

/** Measures where each outline item sits so the rail can line up with it. */
function useRailLayout(
  containerRef: React.RefObject<HTMLDivElement | null>,
  headings: Heading[],
  firstLineCenter: number,
): RailLayout | null {
  const [layout, setLayout] = React.useState<RailLayout | null>(null)

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const items = Array.from(container.querySelectorAll<HTMLElement>('[data-toc-item]'))
      if (items.length === 0) {
        setLayout(null)
        return
      }
      const last = items[items.length - 1]
      setLayout({
        nodes: items.map((item, i) => ({
          y: item.offsetTop + firstLineCenter,
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
  }, [containerRef, headings, firstLineCenter])

  return layout
}

type OutlineProps = {
  headings: Heading[]
  section: SectionPosition
  onJump: (id: string, index: number) => void
  size?: OutlineSize
  /** Extra classes for the scroll container, typically its max height */
  className?: string
}

/** The heading list with its progress rail. Shared by the sidebar and the mobile sheet. */
export function Outline({ headings, section, onJump, size = 'sm', className }: OutlineProps) {
  const sizing = SIZES[size]
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const railRef = React.useRef<HTMLDivElement>(null)
  const layout = useRailLayout(railRef, headings, sizing.firstLineCenter)
  const activeIndex = section.index

  // Keep the current item in view when the outline is taller than its box.
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

  return (
    <nav aria-label="Table of contents">
      {/* Side padding leaves room for the marker's glow and the active nudge. */}
      <div
        ref={scrollRef}
        className={cn(
          '-mx-2 overflow-x-hidden overflow-y-auto overscroll-contain px-2 pt-1 pb-3',
          className,
        )}
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
          <ul className={sizing.list}>
            {headings.map((heading, i) => {
              const isActive = i === activeIndex
              return (
                <li key={heading.id} data-toc-item>
                  <a
                    href={`#${heading.id}`}
                    onClick={(event) => {
                      if (!document.getElementById(heading.id)) return
                      event.preventDefault()
                      onJump(heading.id, i)
                    }}
                    aria-current={isActive ? 'location' : undefined}
                    style={{ transitionTimingFunction: SPRING }}
                    className={cn(
                      'block rounded-sm transition-[color,translate] duration-500 motion-reduce:transition-none',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                      sizing.item,
                      sizing.depth[heading.depth],
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
  )
}

/** Title on the left, progress ring + percentage on the right. */
export function OutlineHeader({
  title,
  progress,
  className,
}: {
  title: React.ReactNode
  progress: number
  className?: string
}) {
  const percent = Math.round(progress * 100)
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      {title}
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
  )
}

/** "N min left" on the left, back-to-top on the right. */
export function OutlineFooter({
  progress,
  readingTime,
  onBackToTop,
  className,
}: {
  progress: number
  readingTime: number
  onBackToTop: () => void
  className?: string
}) {
  const showBackToTop = progress > 0.05
  const status =
    progress >= 1
      ? 'All done 🎉'
      : progress > 0
        ? `${minutesLeft(readingTime, progress)} min left`
        : `${readingTime} min read`

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground',
        className,
      )}
    >
      <span aria-live="polite">{status}</span>
      <button
        type="button"
        onClick={onBackToTop}
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

export function ProgressRing({ value, className }: { value: number; className?: string }) {
  const gradientId = `toc-ring-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const radius = 7
  const circumference = 2 * Math.PI * radius

  return (
    <svg viewBox="0 0 18 18" className={cn('size-[18px] -rotate-90', className)} aria-hidden>
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

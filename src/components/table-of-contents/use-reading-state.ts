'use client'

import React from 'react'
import type { Heading } from '@/lib/headings'
import {
  computeReadingLine,
  computeReadingProgress,
  locateSection,
  type SectionPosition,
} from './table-of-contents.utils'

/**
 * Where the reading line sits below the viewport top. Must be larger than the
 * headings' scroll-margin (scroll-mt-24 = 96px) so a heading jumped to from
 * the outline is immediately the current one.
 */
const READING_LINE_OFFSET = 120

export type ReadingState = { progress: number; section: SectionPosition }

const INITIAL_STATE: ReadingState = {
  progress: 0,
  section: { index: -1, fraction: 0 },
}

/** Tracks overall reading progress and the section the reader is in. */
export function useReadingState(headings: Heading[], contentId: string): ReadingState {
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

/**
 * Index the reader explicitly jumped to, held until they scroll by hand.
 *
 * Near the bottom of a page the browser can't scroll a heading all the way
 * to the top, so position alone would highlight a later section than the one
 * that was clicked.
 */
export function usePinnedIndex(): [number | null, (index: number) => void] {
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

/** Ignore scroll jitter smaller than this before deciding on a direction. */
const DIRECTION_THRESHOLD = 8

/** True while the reader is scrolling back up the page. */
export function useScrollingUp(): boolean {
  const [scrollingUp, setScrollingUp] = React.useState(false)

  React.useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      // Small deltas accumulate until they cross the threshold.
      if (Math.abs(delta) < DIRECTION_THRESHOLD) return
      setScrollingUp(delta < 0)
      lastY = y
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return scrollingUp
}

export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'
}

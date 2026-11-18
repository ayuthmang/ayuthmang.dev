'use client'

import React from 'react'
import { cn } from '@/utils'
import type { Heading } from '@/lib/headings'
import styles from './table-of-contents.module.css'
import type { SectionPosition } from './table-of-contents.utils'
import { MobileOutline } from './mobile-outline'
import { Outline, OutlineFooter, OutlineHeader } from './outline'
import { scrollBehavior, usePinnedIndex, useReadingState } from './use-reading-state'

type TableOfContentsProps = {
  headings: Heading[]
  /** id of the element wrapping the article body; progress is measured against it */
  contentId: string
  /** Estimated reading time in minutes */
  readingTime: number
}

export function TableOfContents({ headings, contentId, readingTime }: TableOfContentsProps) {
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

  const jumpTo = (id: string, index: number) => {
    const target = document.getElementById(id)
    if (!target) return
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
      {/* Small screens: a gradient bar under the header plus a floating outline button. */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-(--navbar-height) z-10 h-0.5 lg:hidden"
        style={{
          backgroundImage: 'var(--toc-gradient-x)',
          clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
        }}
      />
      <MobileOutline
        headings={headings}
        section={section}
        progress={progress}
        readingTime={readingTime}
        onJump={jumpTo}
        onBackToTop={backToTop}
      />

      <aside aria-label="Article outline" className="hidden lg:block">
        <div className="sticky top-24">
          <OutlineHeader
            className="mb-4"
            progress={progress}
            title={<p className="font-header text-sm font-semibold tracking-tight">On this page</p>}
          />
          {headings.length > 0 ? (
            <Outline
              headings={headings}
              section={section}
              onJump={jumpTo}
              className="max-h-[calc(100vh-15rem)]"
            />
          ) : null}
          <OutlineFooter
            className="mt-5"
            progress={progress}
            readingTime={readingTime}
            onBackToTop={backToTop}
          />
        </div>
      </aside>
    </div>
  )
}

'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronUpIcon, Cross1Icon } from '@radix-ui/react-icons'
import { cn } from '@/utils'
import type { Heading } from '@/lib/headings'
import styles from './table-of-contents.module.css'
import { Outline, OutlineFooter, OutlineHeader, ProgressRing, SPRING } from './outline'
import { useScrollingUp } from './use-reading-state'
import type { SectionPosition } from './table-of-contents.utils'

type MobileOutlineProps = {
  headings: Heading[]
  section: SectionPosition
  progress: number
  readingTime: number
  onJump: (id: string, index: number) => void
  onBackToTop: () => void
}

/**
 * Small screens: a floating pill showing the current section and progress.
 * Tapping it opens the full outline in a bottom sheet.
 */
export function MobileOutline({
  headings,
  section,
  progress,
  readingTime,
  onJump,
  onBackToTop,
}: MobileOutlineProps) {
  const [open, setOpen] = React.useState(false)
  const scrollingUp = useScrollingUp()
  // Scrolling while the sheet's scroll lock is active fights the browser, so
  // navigation is queued and run once the sheet has fully closed.
  const afterClose = React.useRef<(() => void) | null>(null)

  if (headings.length === 0) return null

  const percent = Math.round(progress * 100)
  const current = headings[section.index]?.text

  // Out of the way while reading downwards; back when the reader scrolls up,
  // reaches the end, or has only just started (so they know it exists).
  const visible = open || (progress > 0 && (scrollingUp || progress >= 1 || progress < 0.03))

  const closeThen = (action: () => void) => {
    afterClose.current = action
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          aria-label={`Table of contents, ${percent}% read${current ? `. Current section: ${current}` : ''}`}
          style={{
            bottom: 'max(1rem, env(safe-area-inset-bottom))',
            transitionTimingFunction: SPRING,
          }}
          className={cn(
            'fixed left-1/2 z-20 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 lg:hidden',
            'rounded-full border bg-background/85 py-2 pr-3 pl-2.5 text-sm shadow-lg shadow-black/5 backdrop-blur-md',
            'transition-[translate,opacity,scale] duration-500 active:scale-95 motion-reduce:transition-none',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[calc(100%+2rem)] opacity-0',
          )}
        >
          <ProgressRing value={progress} className="shrink-0" />
          <span className="max-w-[60vw] truncate font-medium">{current ?? 'On this page'}</span>
          <ChevronUpIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-(--color-backdrop) backdrop-blur-[2px] duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
        <Dialog.Content
          // The portal renders outside the component tree, so the gradient
          // variables have to be re-declared on the sheet itself.
          className={cn(
            styles.root,
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl border-t bg-background px-5 pt-3 shadow-2xl lg:hidden',
            'duration-300 ease-out data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom',
            'focus:outline-none',
          )}
          style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
          onCloseAutoFocus={(event) => {
            const action = afterClose.current
            if (!action) return
            // Don't bounce focus back to the pill; the page is about to move.
            event.preventDefault()
            afterClose.current = null
            action()
          }}
        >
          <div aria-hidden className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-border" />

          <OutlineHeader
            className="mb-4"
            progress={progress}
            title={
              <div className="flex items-center gap-2">
                <Dialog.Close
                  aria-label="Close table of contents"
                  className="-ml-1.5 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Cross1Icon className="size-4" />
                </Dialog.Close>
                <Dialog.Title className="font-header text-base font-semibold tracking-tight">
                  On this page
                </Dialog.Title>
              </div>
            }
          />
          <Dialog.Description className="sr-only">
            Jump to a section of this article.
          </Dialog.Description>

          <Outline
            size="lg"
            headings={headings}
            section={section}
            className="max-h-[55dvh]"
            onJump={(id, index) => closeThen(() => onJump(id, index))}
          />

          <OutlineFooter
            className="mt-3"
            progress={progress}
            readingTime={readingTime}
            onBackToTop={() => closeThen(onBackToTop)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

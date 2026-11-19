'use client'

import React from 'react'
import { cn } from '@/utils'
import { Mascot } from './mascot'
import { MascotGaze } from './mascot-gaze'
import { MASCOT_GREETINGS } from './mascot.utils'
import styles from './mascot-buddy.module.css'

const GREETING_DURATION_MS = 1800

type Greeting = { id: number; text: string }

export type MascotBuddyProps = {
  /** Rendered width in CSS pixels. Use a multiple of 16. */
  size?: number
  className?: string
}

/**
 * Kala as a little companion: his eyes follow the pointer, and when you click
 * or tap him he hops and says hi.
 */
export function MascotBuddy({ size = 96, className }: MascotBuddyProps) {
  const [greeting, setGreeting] = React.useState<Greeting | null>(null)
  const greetingCount = React.useRef(0)
  const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  React.useEffect(() => () => clearTimeout(timeout.current), [])

  const greet = () => {
    const id = greetingCount.current++
    setGreeting({ id, text: MASCOT_GREETINGS[id % MASCOT_GREETINGS.length] })
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setGreeting(null), GREETING_DURATION_MS)
  }

  return (
    <span className={cn('inline-flex flex-col items-center gap-2', className)}>
      {/* The slot keeps its height so the speech bubble never shifts the layout. */}
      <span aria-live="polite" className="flex h-8 items-end">
        {greeting ? (
          <span
            key={greeting.id}
            className={cn(
              styles.bubble,
              'rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm font-semibold whitespace-nowrap text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
            )}
          >
            {greeting.text}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        onClick={greet}
        aria-label="Say hi to Kala"
        className="cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
      >
        {/* The key restarts the hop on every click. */}
        <span
          key={greeting?.id ?? 'resting'}
          className={cn('block', greeting && styles.hop)}
        >
          {greeting ? (
            <Mascot pose="happy" size={size} />
          ) : (
            <MascotGaze size={size} />
          )}
        </span>
      </button>
    </span>
  )
}

export default MascotBuddy

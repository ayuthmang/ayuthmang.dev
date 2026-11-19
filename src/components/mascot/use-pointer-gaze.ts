'use client'

import React from 'react'
import { GAZE_REST, gazeOffset, type GazeOffset } from './mascot.utils'

/** The eyes sit about a fifth of the way down the sprite. */
const EYE_LINE = 0.19

/**
 * Tracks the pointer and returns how far the mascot's pupils should shift to
 * look at it. `ref` is the element the mascot is drawn in.
 */
export function usePointerGaze(
  ref: React.RefObject<Element | null>,
): GazeOffset {
  const [gaze, setGaze] = React.useState<GazeOffset>(GAZE_REST)

  React.useEffect(() => {
    let frame = 0
    let pointer: { x: number; y: number } | null = null

    const update = () => {
      frame = 0
      const element = ref.current
      if (!element || !pointer) return

      const rect = element.getBoundingClientRect()
      // Hidden mascots (display: none) have no box to look out from.
      if (rect.width === 0) return

      const next = gazeOffset(
        pointer.x - (rect.left + rect.width / 2),
        pointer.y - (rect.top + rect.height * EYE_LINE),
        rect.width / 2,
      )
      setGaze((prev) => (prev.x === next.x && prev.y === next.y ? prev : next))
    }

    // pointerdown as well, so a tap on a touch screen moves the eyes too.
    const handlePointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('pointerdown', handlePointer, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('pointerdown', handlePointer)
      cancelAnimationFrame(frame)
    }
  }, [ref])

  return gaze
}

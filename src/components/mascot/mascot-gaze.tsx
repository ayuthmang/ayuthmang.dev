'use client'

import React from 'react'
import { Mascot, type MascotProps } from './mascot'
import {
  MASCOT_PALETTE,
  MASCOT_PUPILS,
  MASCOT_PUPIL_SIZE,
} from './mascot.utils'
import { usePointerGaze } from './use-pointer-gaze'

export type MascotGazeProps = Omit<MascotProps, 'pose' | 'children' | 'ref'>

/** Kala in his idle pose, with eyes that follow the pointer. */
export function MascotGaze(props: MascotGazeProps) {
  const ref = React.useRef<SVGSVGElement>(null)
  const gaze = usePointerGaze(ref)

  return (
    <Mascot ref={ref} pose="gaze" {...props}>
      {MASCOT_PUPILS.map((pupil) => (
        <rect
          key={pupil.x}
          x={pupil.x + gaze.x}
          y={pupil.y + gaze.y}
          width={MASCOT_PUPIL_SIZE}
          height={MASCOT_PUPIL_SIZE}
          fill={MASCOT_PALETTE.K}
        />
      ))}
    </Mascot>
  )
}

export default MascotGaze

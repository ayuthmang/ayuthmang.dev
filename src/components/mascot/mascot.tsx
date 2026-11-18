import React from 'react'
import {
  MASCOT_PALETTE,
  MASCOT_POSES,
  spriteSize,
  spriteToPaths,
  type MascotColorKey,
  type MascotPose,
} from './mascot.utils'

export type MascotProps = Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'width' | 'height' | 'viewBox'
> & {
  pose?: MascotPose
  /**
   * Rendered width in CSS pixels; the height follows the sprite. Use a multiple
   * of 16 so every sprite pixel lands on whole screen pixels.
   */
  size?: number
  /** Accessible name. Leave it out when the mascot is purely decorative. */
  label?: string
}

export function Mascot({
  pose = 'idle',
  size = 32,
  label,
  ...props
}: MascotProps) {
  const rows = MASCOT_POSES[pose]
  const { width, height } = spriteSize(rows)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={(size * height) / width}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true })}
      {...props}
    >
      {spriteToPaths(rows).map(({ key, d }) => (
        <path key={key} fill={MASCOT_PALETTE[key as MascotColorKey]} d={d} />
      ))}
    </svg>
  )
}

export default Mascot

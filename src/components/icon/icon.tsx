import React from 'react'
import { Menu, X } from 'react-feather'

const icons = {
  menu: Menu,
  x: X,
}

type IconProps = {
  id: keyof typeof icons
  color?: string
  size?: number
  strokeWidth?: number
} & React.HTMLAttributes<HTMLDivElement>

const Icon: React.FC<IconProps> = ({
  id,
  color,
  size,
  strokeWidth,
  className,
  ...delegated
}) => {
  const Component = icons[id]

  return (
    <div
      className={className}
      style={
        strokeWidth !== undefined
          ? ({ ['--stroke-width']: `${strokeWidth}px` } as React.CSSProperties)
          : undefined
      }
      {...delegated}
    >
      <Component
        color={color}
        size={size}
        className="block [stroke-width:var(--stroke-width)]"
      />
    </div>
  )
}

export default Icon

import React, { HTMLAttributes, ReactElement } from 'react'
import { Menu, X } from 'react-feather'
import styled from 'styled-components'

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
// } & React.HTMLAttributes<HTMLDivElement>
// } & typeof Wrapper
// } & StyledComponent<"div", any, WrapperProps, never>
const Icon: React.FC<IconProps> = ({
  id,
  color,
  size,
  strokeWidth,
  ...delegated
}) => {
  const Component = icons[id]
  return (
    <Wrapper strokeWidth={strokeWidth} {...delegated}>
      <Component color={color} size={size} />
    </Wrapper>
  )
}

type WrapperProps = {
  strokeWidth?: number
}
const Wrapper = styled.div<WrapperProps>`
  & > svg {
    display: block;
    stroke-width: ${(p) =>
      p.strokeWidth !== undefined ? p.strokeWidth + 'px' : undefined};
  }
`

export default Icon

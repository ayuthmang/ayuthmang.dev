import styled from 'styled-components'
import ParagraphBase from '~/components/Paragraph'
import React from 'react'

type ParagraphWithImageProps = {
  imageSrc: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  children: React.ReactNode
}

export function ParagraphWithImage(props: ParagraphWithImageProps) {
  const { imageSrc, imageAlt, imageWidth, imageHeight, children } = props
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  const handleOnMouseMove = (event: React.MouseEvent<HTMLParagraphElement>) => {
    setMousePosition({
      x: event.clientX - (event.target as HTMLElement).offsetLeft,
      y: event.clientY - (event.target as HTMLElement).offsetTop,
    })
  }

  return (
    <Paragraph
      onMouseMove={handleOnMouseMove}
      style={
        {
          '--x': mousePosition.x + 'px',
          '--y': mousePosition.y + 'px',
        } as React.CSSProperties
      }
    >
      {children}
      <Image
        role="decorative"
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
      />
    </Paragraph>
  )
}

const Paragraph = styled(ParagraphBase)`
  position: relative;
  font-size: 1.125rem;
`

const Image = styled.img`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(var(--x), -100%);

  ${Paragraph}:hover & {
    display: inline-block;
  }
`

export default ParagraphWithImage

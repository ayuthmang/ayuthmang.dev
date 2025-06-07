'use client'

import React, { useState } from 'react'

type ParagraphWithImageProps = {
  imageSrc: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  children: React.ReactNode
}

export function ParagraphWithImage({
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  children,
}: ParagraphWithImageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleOnMouseMove = (event: React.MouseEvent<HTMLParagraphElement>) => {
    setMousePosition({
      x: event.clientX - (event.target as HTMLElement).offsetLeft,
      y: event.clientY - (event.target as HTMLElement).offsetTop,
    })
  }

  return (
    <p
      className="group relative text-lg leading-9"
      onMouseMove={handleOnMouseMove}
      style={
        {
          '--x': mousePosition.x + 'px',
          '--y': mousePosition.y + 'px',
        } as React.CSSProperties
      }
    >
      {children}
      {/* eslint-disable-next-line @next/next/no-img-element, @next/next/no-img-element */}
      <img
        className={`
          absolute left-0 top-0 hidden translate-x-(--x) translate-y-(--y)
          group-hover:inline-block`}
        role="decorative"
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
      />
    </p>
  )
}

export default ParagraphWithImage

import React from 'react'
import Image from 'next/image'

export type FigureProps = {
  src: string
  alt: string
  /** Intrinsic width of the image. Defaults to a 16:9 frame. */
  width?: number
  /** Intrinsic height of the image. Defaults to a 16:9 frame. */
  height?: number
  /**
   * Forwarded to `next/image`. Defaults to `lazy`. Set `eager` on an image
   * that sits above the fold (usually the first figure in a post) so it is not
   * lazy-loaded as the page's Largest Contentful Paint element.
   */
  loading?: 'eager' | 'lazy'
  /** Caption shown directly under the image, e.g. a photo credit. */
  children?: React.ReactNode
}

/**
 * An image with an optional caption that sits right under it, for use inside
 * `.mdx` posts:
 *
 * `<Figure src="..." alt="...">Photo by [Name](https://...) on Unsplash</Figure>`
 */
export function Figure({
  src,
  alt,
  width = 1600,
  height = 900,
  loading,
  children,
}: FigureProps) {
  return (
    <figure className="not-prose my-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes="(max-width: 768px) 100vw, 768px"
        className="h-auto w-full rounded-xl"
      />
      {children ? (
        <figcaption className="text-muted-foreground [&_a]:hover:text-foreground mt-2 text-center text-xs [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </figcaption>
      ) : null}
    </figure>
  )
}

export default Figure

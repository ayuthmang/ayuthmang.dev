import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import Callout from '@/components/callout'

/**
 * Global MDX component overrides. Next.js (App Router) picks this file up
 * automatically for every compiled `.mdx` module. Components declared here are
 * available inside posts without importing them (e.g. `<Callout />`).
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    a: ({ href = '', ...props }) => {
      const isInternal = href.startsWith('/') || href.startsWith('#')
      if (isInternal) {
        return <Link href={href} {...props} />
      }
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    },
    img: ({ alt = '', ...props }) => (
      <Image
        sizes="(max-width: 768px) 100vw, 768px"
        width={768}
        height={432}
        className="rounded-xl"
        alt={alt}
        {...(props as Omit<ImageProps, 'alt'>)}
      />
    ),
    ...components,
  }
}

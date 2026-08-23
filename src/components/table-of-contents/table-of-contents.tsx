'use client'

import React from 'react'
import { cn } from '@/utils'

type Heading = {
  depth: 2 | 3
  text: string
  id: string
}

type TableOfContentsProps = {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 },
    )

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    for (const el of headingElements) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="hidden lg:block">
      <div className="sticky top-24">
        <p className="mb-3 text-sm font-semibold text-foreground">
          On this page
        </p>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(heading.depth === 3 && 'ml-4')}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  'block text-muted-foreground transition-colors hover:text-foreground',
                  activeId === heading.id && 'font-medium text-foreground',
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn, stringToHue } from '@/utils'
import { Badge } from '@/components/ui/badge'

export type ArticleProps = {
  guid: string
  title: string
  description: string
  categories: string[]
  thumbnail: string
  slug: string
}

function Article({ guid, title, categories, thumbnail, slug }: ArticleProps) {
  const hue = stringToHue(guid)

  return (
    <Link
      href={`/blog/${slug}`}
      style={
        {
          '--card-glow': `hsl(${hue} 70% 55% / 0.35)`,
          '--card-accent': `hsl(${hue} 70% 55%)`,
          '--card-overlay': `hsl(${hue} 70% 35% / 0.55)`,
        } as React.CSSProperties
      }
      className={cn(
        'group -m-3 overflow-hidden rounded-lg p-3',
        'border border-transparent transition-all duration-300 ease-out',
        'hover:rounded-xl hover:border-[var(--card-accent)] hover:shadow-[0_4px_24px_var(--card-glow)]',
        'hover:-translate-y-1',
      )}
    >
      <article className="flex flex-col gap-3">
        {/* Thumbnail with colored gradient overlay on hover */}
        <div className="relative h-60 w-full overflow-hidden rounded-2xl">
          <Image
            className={cn(
              'h-full w-full object-cover transition-all duration-500 ease-in-out',
              'brightness-90 group-hover:scale-105 group-hover:brightness-100',
            )}
            src={thumbnail}
            fill
            alt="Article's cover image"
          />
          {/* Colored overlay that fades in on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `linear-gradient(to top, var(--card-overlay) 0%, transparent 55%)`,
            }}
          />
        </div>

        <h3 className="font-bold transition-colors duration-300 group-hover:text-[var(--card-accent)]">
          {title}
        </h3>

        <div className="flex gap-2 overflow-hidden overflow-x-auto text-ellipsis">
          {categories.map((category) => (
            <Badge key={`${guid}-${category}`}>{category}</Badge>
          ))}
        </div>
      </article>
    </Link>
  )
}

export default Article

import React from 'react'
import { cn } from '@/utils'
import { Badge } from '@/components/ui/badge'

export type ArticleProps = {
  guid: string
  title: string
  description: string
  categories: string[]
  thumbnail: string
  link: string
}

function Article({ guid, title, categories, thumbnail, link }: ArticleProps) {
  return (
    <a
      href={link}
      className={cn(
        'group rounded-lg text-inherit no-underline',
        'border-transparent transition-colors duration-300 ease-in-out hover:rounded-xl hover:bg-gray-700',
      )}
    >
      <article className="m-3 flex flex-col gap-3">
        <div className="relative h-60 w-full overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element, @next/next/no-img-element */}
          <img
            className={cn(
              'inline h-full w-full object-cover brightness-90 transition-[transform,filter] duration-[600ms,1000ms] will-change-transform',
              'group-hover:delay-50 group-hover:scale-110 group-hover:brightness-100 group-hover:transition-[transform,filter] group-hover:duration-[250ms,400ms]',
            )}
            src={thumbnail}
            alt="Article's cover image"
          />
        </div>
        <h3 className="font-bold">{title}</h3>
        <div className="flex gap-2 overflow-hidden overflow-x-auto text-ellipsis">
          {categories.map((category) => (
            <Badge key={`${guid}-${category}`}>{category}</Badge>
          ))}
        </div>
      </article>
    </a>
  )
}

export default Article

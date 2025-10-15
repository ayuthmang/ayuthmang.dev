import React from 'react'
import { cn } from '@/utils'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

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
        'group -m-3 overflow-hidden rounded-lg p-3',
        'border border-transparent transition-all duration-300 ease-out',
        'hover:rounded-xl hover:bg-gray-300/50 hover:shadow-md hover:dark:bg-gray-200/20',
        'hover:translate-y-[-2px]',
      )}
    >
      <article className="flex flex-col gap-3">
        <div className="relative h-60 w-full overflow-hidden rounded-2xl">
          <Image
            className={cn(
              'inline h-full w-full object-cover transition-all duration-500 ease-in-out',
              'brightness-90 group-hover:scale-105 group-hover:brightness-100',
            )}
            src={thumbnail}
            fill
            alt="Article's cover image"
          />
        </div>
        <h3 className="group-hover:text-primary font-bold transition-colors duration-300">
          {title}
        </h3>
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

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
        'group rounded-lg text-inherit no-underline',
        'border-transparent transition-colors duration-300 ease-in-out hover:rounded-xl hover:bg-gray-200'
      )}
    >
      <article className="m-3 flex flex-col gap-3">
        <div className="relative h-60 w-full overflow-hidden rounded-2xl">
          <Image
            className={cn(
              'inline h-full w-full object-cover brightness-90 transition-transform transition-filter ease-in-out duration-500',
              'group-hover:scale-105 group-hover:brightness-100'
            )}
            src={thumbnail}
            fill
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

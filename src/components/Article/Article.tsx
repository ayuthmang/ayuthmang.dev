import React from 'react'
import Tag from '~/components/Tag'
import { cn } from '~/utils'

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
    <a href={link} className="group text-inherit no-underline">
      <article className="flex flex-col gap-3 rounded-lg">
        <div className="relative h-60 w-full overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element, @next/next/no-img-element */}
          <img
            className={cn(
              'inline h-full w-full object-cover brightness-90 transition-[transform,filter] duration-[600ms,1000ms] will-change-transform',
              'group-hover:scale-110 group-hover:brightness-100',
              'group-hover:brightness-100 group-hover:transition-[transform,filter] group-hover:duration-[250ms,400ms]',
            )}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU3HFVnkYFJ_OIogo__Qv58bmhwRqZJcQhOA&s"
            alt="Article's cover image"
          />
        </div>
        <h3 className="font-bold">{title}</h3>
        <div className="flex overflow-hidden overflow-x-auto overflow-ellipsis px-1 py-0">
          {categories.map((category) => (
            <Tag key={`${guid}-${category}`}>{category}</Tag>
          ))}
        </div>
      </article>
    </a>
  )
}

export default Article

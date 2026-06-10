import { cn } from '@/utils'
import React from 'react'

export function BentoGrid({
  children,
  className,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface BentoCardProps
  extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> {
  title?: React.ReactNode
}

export function BentoCard({
  title,
  children,
  className,
  ...rest
}: BentoCardProps) {
  return (
    <section
      className={cn(
        'group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-shadow duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:shadow-gray-950/50',
        className,
      )}
      {...rest}
    >
      {title ? (
        <h3 className="font-header mb-4 text-xl font-bold">{title}</h3>
      ) : null}
      {children}
    </section>
  )
}

export default BentoGrid

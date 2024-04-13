'use client'

import { cn } from '~/utils'

export function MaxWidthWrapper({
  children,
  className,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('px-4 w-full max-w-[1100px] mx-auto md:px-8', className)}
    >
      {children}
    </div>
  )
}

export default MaxWidthWrapper

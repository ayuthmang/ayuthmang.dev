import React from 'react'
import { cn } from '@/utils'

export const UnstyledButton = React.forwardRef(function UnstyledButton(
  {
    children,
    className,
    ...delegated
  }: React.ComponentPropsWithoutRef<'button'>,

  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      className={cn(
        'font-inherit color-inherit m-0 cursor-pointer border-none bg-transparent p-0 text-left',
        'focus:not(:focus-visible)]:outline-none focus:outline-offset-2',
        className,
      )}
      {...delegated}
      ref={ref}
    >
      {children}
    </button>
  )
})

export default UnstyledButton

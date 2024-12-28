import { cn } from '~/utils'

export function MaxWidthWrapper({
  children,
  className,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1100px] px-4 md:px-8', className)}
    >
      {children}
    </div>
  )
}

export default MaxWidthWrapper

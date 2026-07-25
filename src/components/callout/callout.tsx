import React from 'react'
import { cn } from '@/utils'
import { InfoCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'

export type CalloutProps = {
  type?: 'info' | 'warning'
  title?: string
  children: React.ReactNode
}

const STYLES = {
  info: {
    container: 'border-blue-500/30 bg-blue-500/10 text-foreground',
    icon: 'text-blue-500',
    Icon: InfoCircledIcon,
  },
  warning: {
    container: 'border-amber-500/30 bg-amber-500/10 text-foreground',
    icon: 'text-amber-500',
    Icon: ExclamationTriangleIcon,
  },
} as const

/**
 * A small demo component that can be embedded directly inside `.mdx` posts,
 * e.g. `<Callout type="warning" title="Heads up">...</Callout>`.
 */
export function Callout({ type = 'info', title, children }: CalloutProps) {
  const { container, icon, Icon } = STYLES[type]

  return (
    <div
      className={cn(
        'not-prose my-6 flex gap-3 rounded-lg border p-4 text-sm',
        container,
      )}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', icon)} aria-hidden />
      <div className="flex flex-col gap-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="[&>p]:m-0 [&>p:not(:last-child)]:mb-2">{children}</div>
      </div>
    </div>
  )
}

export default Callout

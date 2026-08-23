'use client'

import React, { useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'

export function Pre({ children, className, ...props }: React.ComponentProps<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [isCopied, setIsCopied] = useState(false)

  const copy = async () => {
    if (!preRef.current) return
    const text = preRef.current.textContent || ''
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="group relative">
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
      <button
        disabled={isCopied}
        onClick={copy}
        className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-gray-100/20 backdrop-blur-md opacity-0 transition-all hover:bg-gray-200/40 focus-visible:opacity-100 group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
        aria-label="Copy code"
      >
        {isCopied ? (
          <CheckIcon className="h-4 w-4 text-green-500" />
        ) : (
          <CopyIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
    </div>
  )
}

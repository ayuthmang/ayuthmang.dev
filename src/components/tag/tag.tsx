import React from 'react'

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block whitespace-nowrap rounded-lg bg-gray-200 px-1 py-2 text-sm font-semibold text-gray-900">
      {children}
    </span>
  )
}

export default Tag

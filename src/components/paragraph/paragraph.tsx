import React from 'react'

function Paragraph({ children }: React.ComponentPropsWithoutRef<'p'>) {
  return <p className="mb-6">{children}</p>
}

export default Paragraph

import React from 'react'

function VisuallyHidden({ children }: { children: React.ReactNode }) {
  const [forceShow, setForceShow] = React.useState(false)

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'Alt') {
          setForceShow(true)
        }
      }

      const handleKeyUp = () => {
        setForceShow(false)
      }

      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keydown', handleKeyUp)
      }
    }
  }, [])

  if (forceShow) {
    return <>{children}</>
  }

  return (
    <div
      className="absolute m-0 hidden h-px w-px border-0 p-0"
      style={{ clip: 'rect(0 0 0 0)' }}
    >
      {children}
    </div>
  )
}

export default VisuallyHidden

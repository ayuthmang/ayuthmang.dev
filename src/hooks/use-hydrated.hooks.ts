import React from 'react'

/**
 * Mae sure the component is hydrated.
 *
 * @returns {boolean} hydrated
 */
export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}

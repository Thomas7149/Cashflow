import { useEffect, useState } from 'react'
import { parseHash } from '../lib/urls'

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const clear = () => { window.location.hash = ''; setRoute(parseHash('')) }

  return { route, clear }
}

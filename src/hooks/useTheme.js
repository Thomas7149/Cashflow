import { useEffect, useState } from 'react'

const KEY = 'cashflow-theme-mode' // 'light' | 'dark' | 'auto'

function applyTheme(mode) {
  const isDark = mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
}

// The theme (light/dark) is a personal, per-device display preference, unlike
// the centre's brand color and logo which are shared and live in Firestore.
export function useTheme() {
  const [mode, setModeState] = useState(() => localStorage.getItem(KEY) || 'auto')

  useEffect(() => {
    applyTheme(mode)
    if (mode !== 'auto') return undefined
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('auto')
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [mode])

  const setMode = (nextMode) => {
    localStorage.setItem(KEY, nextMode)
    setModeState(nextMode)
  }

  return { mode, setMode }
}
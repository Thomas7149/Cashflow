import { useCallback, useEffect, useRef, useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState('')
  const timerRef = useRef(null)

  const notify = useCallback((text) => {
    setToast(text)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(''), 2800)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { toast, notify }
}

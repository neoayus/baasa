import { useEffect } from 'react'
import { getLenis } from '../animations/lenis'

export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined
    getLenis()?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      getLenis()?.start()
    }
  }, [active])
}

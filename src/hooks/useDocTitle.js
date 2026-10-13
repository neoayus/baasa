import { useEffect } from 'react'

const DEFAULT = 'Alcove — Find somewhere worth calling home'

export default function useDocTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — Alcove` : DEFAULT
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}

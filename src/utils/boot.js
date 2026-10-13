const KEY = 'alcove:booted'

export const isBooted = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return true
  }
}

export const markBooted = () => {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* storage unavailable */
  }
}

// Delay (seconds) before page-entrance animations should start, so they play after the loader.
export const bootDelay = () => (isBooted() ? 0.1 : 1.15)

import { useEffect, useState } from 'react'
import styles from './BgToggle.module.css'

// Determine initial theme: localStorage -> system preference -> default 'dark'
function getInitialTheme() {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore unavailable storage */
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  return 'dark'
}

const BgToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme)
  const isDark = theme === 'dark'

  // Apply to <html data-theme="..."> and persist
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore unavailable storage */
    }
  }, [theme])

  // Update when OS preference changes and no explicit choice is stored
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const stored = (() => {
      try {
        return localStorage.getItem('theme')
      } catch {
        return null
      }
    })()
    if (stored === 'light' || stored === 'dark') return
    const listener = (e) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener?.('change', listener)
    return () => mq.removeEventListener?.('change', listener)
  }, [])

  

  return (
    
    <button
    type="button"
    className={styles.toggle}
    aria-pressed={isDark}
    onClick={() => setTheme(isDark ? 'light' : 'dark')}
  />
  )
}

export default BgToggle
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

  // Apply to <html data-theme="...">, persist, and broadcast change
  const applyTheme = (newTheme) => {
    setTheme(newTheme)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
    try {
      localStorage.setItem('theme', newTheme)
    } catch {
      /* ignore unavailable storage */
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }))
    }
  }

  // Ensure DOM attribute is set on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Synchronize state across multiple instances (e.g. desktop header & mobile drawer)
  useEffect(() => {
    const handleSync = (e) => {
      const nextTheme = e.detail?.theme
      if (nextTheme && (nextTheme === 'light' || nextTheme === 'dark')) {
        setTheme(nextTheme)
      }
    }
    window.addEventListener('themechange', handleSync)
    return () => window.removeEventListener('themechange', handleSync)
  }, [])

  // Update when OS preference changes and no explicit choice is stored
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e) => {
      try {
        const stored = localStorage.getItem('theme')
        if (stored === 'light' || stored === 'dark') return
      } catch {
        /* ignore unavailable storage */
      }
      applyTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener?.('change', listener)
    return () => mq.removeEventListener?.('change', listener)
  }, [])

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      onClick={() => applyTheme(isDark ? 'light' : 'dark')}
    >
      <span className={styles.iconSlot} aria-hidden="true">
        {/* Sun Icon for Light */}
        <svg
          className={`${styles.icon} ${styles.sun}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </span>

      <span className={styles.thumb} aria-hidden="true">
        {isDark ? (
          <svg className={styles.thumbIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg className={styles.thumbIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </span>

      <span className={styles.iconSlot} aria-hidden="true">
        {/* Moon Icon for Dark */}
        <svg
          className={`${styles.icon} ${styles.moon}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  )
}

export default BgToggle
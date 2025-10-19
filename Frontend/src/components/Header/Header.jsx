import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Header.module.css'
import Logo from '../Logo/Logo'
import NavBar from '../NavBar/NavBar'
import BgToggle from '../BgToggle/BgToggle'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)
  const closeButtonRef = useRef(null)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Focus management: focus trap inside mobile menu when open
  useEffect(() => {
    if (!menuOpen) {
      // restore focus to toggle button when closing
      menuButtonRef.current?.focus?.()
      return
    }

    // Move focus to close button initially
    const to = setTimeout(() => closeButtonRef.current?.focus?.(), 0)

    const handleKeyDown = (e) => {
      if (!menuRef.current) return
      if (e.key !== 'Tab') return
      const focusables = menuRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      const list = Array.from(focusables)
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(to)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <div className={styles.Header}>
        <div className={styles.left}>
          <Logo />
        </div>

        <nav className={styles.desktopNav} aria-label="Primary">
          <NavBar />
        </nav>

        <div className={styles.right}>
          <div className={styles.toggleWrap}>
            <BgToggle />
          </div>
          <button
            type="button"
            className={`${styles.menuButton} ${menuOpen ? styles.open : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            ref={menuButtonRef}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <button
        type="button"
        className={`${styles.backdrop} ${menuOpen ? styles.show : ''}`}
        aria-hidden={!menuOpen}
        tabIndex={-1}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile slide-in menu (from right) */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Primary navigation"
        ref={menuRef}
      >
        <div className={styles.mobileTop}>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            ref={closeButtonRef}
          >
            <span className={styles.xbar} />
            <span className={styles.xbar} />
          </button>
        </div>

        <nav>
          <NavBar />
          <div className={styles.mobileExtras}>
            <BgToggle />
          </div>
        </nav>
      </div>
    </>
  )
}

export default Header
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import Logo from '../Logo/Logo'
import NavBar from '../NavBar/NavBar'
import BgToggle from '../BgToggle/BgToggle'
import Button from '../Button/Button'
import { smoothScrollTo } from '../../utils/scrollHelper'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)
  const closeButtonRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Track scroll position for header visual density and floating pill state
  useEffect(() => {
    let rafId = 0
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      setIsScrolled(scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })
    rafId = requestAnimationFrame(handleScroll)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [menuOpen])

  // Close on Escape & focus management
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuButtonRef.current?.focus?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Focus trap inside mobile drawer
  useEffect(() => {
    if (!menuOpen) return

    // Move initial focus to close button
    const timer = setTimeout(() => closeButtonRef.current?.focus?.(), 50)

    const handleKeyDown = (e) => {
      if (!menuRef.current || e.key !== 'Tab') return

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
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const handleContactClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }
    e.preventDefault()
    setMenuOpen(false)

    if (location.pathname === '/') {
      smoothScrollTo('contact')
    } else {
      navigate('/contact')
    }
  }

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={styles.innerContainer}>
          <div className={styles.left}>
            <Logo />
          </div>

          <nav className={styles.desktopNav} aria-label="Primary Navigation">
            <NavBar />
          </nav>

          <div className={styles.right}>
            <div className={styles.toggleWrap}>
              <BgToggle />
            </div>

            <Button
              to="/contact"
              variant="secondary"
              size="sm"
              onClick={handleContactClick}
              className={styles.headerContactBtn}
              aria-label="Contact Pardeep Shyoran"
            >
              Contact
            </Button>

            <button
              type="button"
              className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ''}`}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={() => setMenuOpen((v) => !v)}
              ref={menuButtonRef}
            >
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Backdrop */}
      <div
        className={`${styles.backdrop} ${menuOpen ? styles.backdropActive : ''}`}
        aria-hidden="true"
        onClick={() => {
          setMenuOpen(false)
          menuButtonRef.current?.focus?.()
        }}
      />

      {/* Mobile Slide-in Drawer */}
      <div
        id="mobile-navigation-drawer"
        className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        aria-hidden={!menuOpen || undefined}
        inert={!menuOpen}
        ref={menuRef}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitleGroup}>
            <span className={styles.drawerKicker}>MENU</span>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close navigation menu"
            onClick={() => {
              setMenuOpen(false)
              menuButtonRef.current?.focus?.()
            }}
            ref={closeButtonRef}
          >
            <span className={styles.xbar} />
            <span className={styles.xbar} />
          </button>
        </div>

        <div className={styles.drawerContent}>
          <nav aria-label="Mobile Primary Navigation" className={styles.mobileNavSection}>
            <NavBar onNavigate={() => setMenuOpen(false)} isMobile={true} />
          </nav>

          <div className={styles.drawerActions}>
            <div className={styles.drawerPreferenceRow}>
              <span className={styles.prefLabel}>Appearance</span>
              <BgToggle />
            </div>

            <Button
              to="/contact"
              variant="primary"
              size="md"
              onClick={handleContactClick}
              className={styles.drawerContactBtn}
            >
              Get in Touch
            </Button>
          </div>

          <div className={styles.drawerFooter}>
            <div className={styles.socialRow}>
              <a
                href="https://github.com/Pardeep-Shyoran"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drawerSocialLink}
                aria-label="GitHub profile"
              >
                GitHub
              </a>
              <span className={styles.socialDot} aria-hidden="true">•</span>
              <a
                href="https://www.linkedin.com/in/pardeepshyoran/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drawerSocialLink}
                aria-label="LinkedIn profile"
              >
                LinkedIn
              </a>
              <span className={styles.socialDot} aria-hidden="true">•</span>
              <a
                href="https://codolio.com/profile/Pardeep_Shyoran"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.drawerSocialLink}
                aria-label="Codolio profile"
              >
                Codolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
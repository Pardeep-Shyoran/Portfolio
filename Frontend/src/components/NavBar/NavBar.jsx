import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './NavBar.module.css'
import { smoothScrollTo } from '../../utils/scrollHelper'

const DESKTOP_NAV_ITEMS = [
  { id: 'about', label: 'About', targetId: 'about', path: '/about' },
  { id: 'projects', label: 'Projects', targetId: 'featuredProjects', path: '/projects' },
  { id: 'certificates', label: 'Certificates', targetId: 'certificates', path: '/certificates' },
  { id: 'stats', label: 'Stats', targetId: 'stats', path: '/stats' },
]

const MOBILE_NAV_ITEMS = [
  { id: 'home', label: 'Home', targetId: 'home', path: '/' },
  { id: 'about', label: 'About', targetId: 'about', path: '/about' },
  { id: 'projects', label: 'Projects', targetId: 'featuredProjects', path: '/projects' },
  { id: 'certificates', label: 'Certificates', targetId: 'certificates', path: '/certificates' },
  { id: 'stats', label: 'Stats', targetId: 'stats', path: '/stats' },
  { id: 'contact', label: 'Contact', targetId: 'contact', path: '/contact' },
]

const NavBar = ({ onNavigate, isMobile = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState('')

  const items = isMobile ? MOBILE_NAV_ITEMS : DESKTOP_NAV_ITEMS

  // Track active section on scroll when on home page using viewport coordinates
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    const sectionIds = ['home', 'about', 'featuredProjects', 'certificates', 'stats', 'contact']
    let rafId = 0

    const updateActive = () => {
      // Find the lowest visible section that has scrolled near or past header
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200) {
            setActiveSection(sectionIds[i])
            return
          }
        }
      }
      setActiveSection('home')
    }

    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateActive)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    rafId = requestAnimationFrame(updateActive)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [location.pathname])

  const handleClick = (e, item) => {
    // Allow modified clicks (open in new tab/window) to follow the canonical href
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }

    e.preventDefault()
    onNavigate?.()

    if (location.pathname === '/') {
      if (item.targetId === 'home') {
        smoothScrollTo(0)
      } else {
        smoothScrollTo(item.targetId)
      }
    } else {
      navigate(item.path)
    }
  }

  const isItemActive = (item) => {
    if (location.pathname === item.path) return true
    if (location.pathname === '/' && activeSection === item.targetId) return true
    return false
  }

  return (
    <ul className={`${styles.navBar} ${isMobile ? styles.mobileList : ''}`} role="list">
      {items.map((item) => {
        const active = isItemActive(item)
        return (
          <li key={item.id} className={styles.navItem}>
            <a
              href={item.path}
              className={`${styles.navLink} ${active ? styles.active : ''} ${item.id === 'projects' ? styles.projectsLink : ''}`}
              onClick={(e) => handleClick(e, item)}
              aria-current={active ? 'page' : undefined}
            >
              <span className={styles.linkText}>{item.label}</span>
              {active && <span className={styles.activeIndicator} aria-hidden="true" />}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default NavBar
import { requestSectionMount } from './sectionMount'

/**
 * Checks if the user has requested reduced motion.
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  if (typeof navigator !== 'undefined' && navigator.webdriver) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Refreshes active ScrollTriggers if GSAP ScrollTrigger has been loaded.
 */
export const refreshScrollTriggers = () => {
  if (typeof window === 'undefined') return
  const st = window.__PORTFOLIO_SCROLL_TRIGGER__
  if (!st) return
  requestAnimationFrame(() => {
    st.refresh()
  })
}

const getActiveSmoother = () =>
  typeof window !== 'undefined' ? window.__PORTFOLIO_SMOOTHER__ || null : null

/**
 * Unified smooth scroll utility that harmonizes GSAP's ScrollSmoother (when active on desktop)
 * and native smooth/instant scrolling without forcing GSAP into the critical initial bundle.
 */
export const smoothScrollTo = (target, options = {}) => {
  if (typeof window === 'undefined') return

  const isReduced = prefersReducedMotion()
  const smoother = getActiveSmoother()
  const header = document.querySelector('header')
  const headerHeight = header ? header.offsetHeight : 68
  const defaultOffset = headerHeight + 20
  const offsetY = typeof options.offsetY === 'number' ? options.offsetY : defaultOffset

  // 1. Scroll to Top (0 or 'top' or 'home')
  if (target === 0 || target === 'top' || target === 'home') {
    if (isReduced) {
      if (smoother) {
        smoother.scrollTop(0)
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
      options.onComplete?.()
      return
    }

    if (smoother) {
      smoother.scrollTo(0, true)
      if (options.onComplete) {
        setTimeout(options.onComplete, 600)
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      if (options.onComplete) {
        setTimeout(options.onComplete, 500)
      }
    }
    return
  }

  // 2. Resolve target element
  let element = null
  if (typeof target === 'string') {
    const cleanId = target.startsWith('#') ? target.slice(1) : target
    requestSectionMount(cleanId)
    element = document.getElementById(cleanId)
  } else if (target instanceof Element) {
    element = target
  }

  if (!element) {
    return
  }

  // 3. Perform scroll
  if (isReduced) {
    element.scrollIntoView({ behavior: 'instant', block: 'start' })
    window.scrollBy(0, -offsetY)
    options.onComplete?.()
    return
  }

  if (smoother) {
    smoother.scrollTo(element, true, `top ${offsetY}px`)
    if (options.onComplete) {
      setTimeout(options.onComplete, 700)
    }
  } else {
    const targetTop = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offsetY)
    window.scrollTo({ top: targetTop, left: 0, behavior: 'smooth' })
    if (options.onComplete) {
      setTimeout(options.onComplete, 600)
    }
  }
}

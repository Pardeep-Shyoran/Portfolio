import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin)

/**
 * Checks if the user has requested reduced motion.
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  if (typeof navigator !== 'undefined' && navigator.webdriver) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Refreshes all active ScrollTriggers to recalculate layout positions.
 */
export const refreshScrollTriggers = () => {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
}

/**
 * Unified smooth scroll utility that harmonizes GSAP's ScrollSmoother,
 * GSAP ScrollToPlugin, and native scrolling.
 *
 * Automatically respects `prefers-reduced-motion` and avoids scroll locking.
 *
 * @param {string|Element|number} target - Element ID (string), DOM element, or scroll position number (e.g. 0 for top)
 * @param {Object} [options]
 * @param {number} [options.offsetY] - Pixel offset for sticky headers (defaults to header height + 20)
 * @param {number} [options.duration] - GSAP tween duration (default: 0.7)
 * @param {Function} [options.onComplete] - Callback on arrival
 */
export const smoothScrollTo = (target, options = {}) => {
  if (typeof window === 'undefined') return

  const isReduced = prefersReducedMotion()
  const smoother = ScrollSmoother.get()
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
      gsap.to(window, {
        duration: options.duration ?? 0.6,
        scrollTo: { y: 0 },
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: options.onComplete,
      })
    }
    return
  }

  // 2. Resolve target element
  let element = null
  if (typeof target === 'string') {
    const cleanId = target.startsWith('#') ? target.slice(1) : target
    element = document.getElementById(cleanId)
  } else if (target instanceof Element) {
    element = target
  }

  if (!element) {
    // If element doesn't exist yet (e.g. lazy loaded), do nothing or warn gently
    return
  }

  // 3. Perform scroll
  if (isReduced) {
    element.scrollIntoView({ behavior: 'instant', block: 'start' })
    // Adjust for sticky header
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
    gsap.to(window, {
      duration: options.duration ?? 0.7,
      scrollTo: {
        y: element,
        offsetY,
      },
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: options.onComplete,
    })
  }
}

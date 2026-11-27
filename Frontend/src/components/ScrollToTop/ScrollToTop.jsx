import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const getActiveSmoother = () =>
  typeof window !== 'undefined' ? window.__PORTFOLIO_SMOOTHER__ || null : null;

/**
 * ScrollToTop component ensures page scroll position always resets cleanly
 * to the very top (0, 0) on page refresh and on route changes.
 * Integrates directly with GSAP's ScrollSmoother and disables browser scroll restoration.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Enforce scroll-to-top and disable browser scroll memory on initial mount & refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // If page reloads with a hash on root (e.g. #about), remove it to prevent auto-jumping
    if (pathname === '/' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    const resetTop = () => {
      const smoother = getActiveSmoother();
      if (smoother) {
        smoother.scrollTop(0);
      } else if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };

    resetTop();

    const handleBeforeUnload = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Reset scroll position on route changes
  useEffect(() => {
    const smoother = getActiveSmoother();
    if (smoother) {
      smoother.scrollTop(0);
    } else if (window.scrollY !== 0 || window.scrollX !== 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Refresh ScrollTrigger measurements if loaded
    const timer = setTimeout(() => {
      window.__PORTFOLIO_SCROLL_TRIGGER__?.refresh?.();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

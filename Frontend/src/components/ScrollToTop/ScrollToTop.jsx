import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTop(0);
      }
    };

    resetTop();

    // Guard against delayed browser layout restoration
    const timer = setTimeout(resetTop, 50);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Reset scroll position on route changes
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTop(0);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Refresh ScrollTrigger measurements after DOM updates to prevent stale triggers
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

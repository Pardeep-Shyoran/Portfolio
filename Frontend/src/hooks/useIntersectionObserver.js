import { useEffect, useState, useRef } from 'react';

/**
   * Custom hook to observe when a DOM element enters the viewport.
   * Disconnects automatically after the first intersection to prevent re-triggering.
   * @param {IntersectionObserverInit} options 
   * @returns {[React.RefObject<any>, boolean]}
   */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Trigger load 200px before entering viewport
        threshold: 0,
        ...optionsRef.current,
      }
    );

    observer.observe(element);

    return () => {
      try {
        observer.disconnect();
      } catch {
        // ignore
      }
    };
  }, []);

  return [elementRef, isIntersecting];
};

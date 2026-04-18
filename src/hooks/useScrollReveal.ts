import { useEffect } from 'react';

/**
 * Global scroll-reveal: observes all [data-animate] elements and
 * adds 'in-view' class when they enter the viewport.
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    // observe all data-animate elements already in DOM
    const observe = () => {
      document.querySelectorAll('[data-animate]').forEach((el) => {
        if (!el.classList.contains('in-view')) observer.observe(el);
      });
    };

    observe();

    // re-observe on route changes (MutationObserver on body)
    const mutObs = new MutationObserver(observe);
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObs.disconnect();
    };
  }, []);
}

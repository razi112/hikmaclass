import { useEffect } from 'react';

/**
 * Global scroll-reveal: observes [data-animate] and .animate-on-scroll elements,
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
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    );

    const observe = () => {
      document.querySelectorAll('[data-animate], .animate-on-scroll, .section-animate').forEach((el) => {
        if (!el.classList.contains('in-view')) observer.observe(el);
      });
    };

    observe();

    // re-observe when new elements are added (route changes)
    const mutObs = new MutationObserver(observe);
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObs.disconnect();
    };
  }, []);
}

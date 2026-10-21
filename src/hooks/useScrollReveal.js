'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * useScrollReveal Hook
 * Automatically attaches an IntersectionObserver to elements with `.reveal-up`
 * so that text, cards, and sections smoothly transition from bottom to top
 * when they enter the viewport for the first time.
 */
export function useScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-up').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-up').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      }
    );

    const elements = document.querySelectorAll('.reveal-up');
    elements.forEach((el) => observer.observe(el));

    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll('.reveal-up:not(.is-revealed)');
      newElements.forEach((el) => observer.observe(el));
    });

    if (document.body) {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);
}

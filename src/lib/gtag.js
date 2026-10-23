// Google Analytics 4 (GA4) Helper Utilities

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-KY995SYKY6';

// Record pageview on client route transition
export const pageview = (url) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Record custom conversion event (e.g. pre-book submit, whatsapp click, phone call)
export const trackEvent = (action, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
};

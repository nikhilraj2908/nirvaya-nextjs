'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/services/api';
import { pageview as gaPageview } from '@/lib/gtag';

/**
 * Hook to automatically track page views for CRP analytics & Google Analytics (GA4) in Next.js
 * Safely accesses window.location.search only on client inside useEffect
 * to allow static prerendering across all public pages and not-found routes.
 */
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Internal CRP Analytics
    trackEvent('page_view', {
      pathname,
      search: typeof window !== 'undefined' ? window.location.search : ''
    });

    // 2. Google Analytics 4 (GA4) Page View
    gaPageview(pathname);
  }, [pathname]);
}

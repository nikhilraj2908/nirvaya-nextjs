'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/services/api';

/**
 * Hook to automatically track page views for CRP analytics in Next.js
 * Safely accesses window.location.search only on client inside useEffect
 * to allow static prerendering across all public pages and not-found routes.
 */
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent('page_view', {
      pathname,
      search: typeof window !== 'undefined' ? window.location.search : ''
    });
  }, [pathname]);
}

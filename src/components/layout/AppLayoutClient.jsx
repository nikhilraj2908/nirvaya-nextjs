'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp';
import { usePageTracking } from '@/hooks/usePageTracking';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { IS_PREVIEW } from '@/lib/preview';

export default function AppLayoutClient({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Secret Staff/Admin shortcut: Ctrl + , (or Cmd + ,) navigates directly to Admin login
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === ',' || e.code === 'Comma')) {
        if (IS_PREVIEW) return; // Prevent admin navigation in preview mode
        e.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const [currentLang, setCurrentLang] = useState('en');
  const [currentFontScale, setCurrentFontScale] = useState('md');

  const [navKey, setNavKey] = useState(pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  // Instantly reset scroll to top on route change (avoiding confusing slow scroll-up)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    setIsNavigating(true);
    setNavKey(pathname);
    const timer = setTimeout(() => setIsNavigating(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Trigger bottom-to-top reveal transitions on text and elements as they enter viewport
  useScrollReveal();

  // Track page transitions for CRP Funnel Analytics
  usePageTracking();

  // Handle accessible font scaling
  const handleFontScaleChange = (scale) => {
    setCurrentFontScale(scale);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
      root.classList.add(`font-scale-${scale}`);
    }
  };

  const handleLangChange = (lang) => {
    if (lang === 'hi') return; // Hindi deferred until content finalised
    setCurrentLang(lang);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#DFBF64] selection:text-[#0A1E3F] w-full">
      {/* Top Route Progress Bar for clear redirection feedback */}
      {isNavigating && (
        <div
          key={`progress-${navKey}`}
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#DFBF64] via-sky-400 to-[#DFBF64] z-50 animate-route-progress shadow-xs pointer-events-none"
        />
      )}

      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0A1E3F] focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
      >
        Skip to main content
      </a>

      {/* Show Public Header only on client-facing routes */}
      {!isAdminRoute && (
        <Header
          currentLang={currentLang}
          onLangChange={handleLangChange}
          currentFontScale={currentFontScale}
          onFontScaleChange={handleFontScaleChange}
        />
      )}

      {/* Main Content with clean page enter animation */}
      <main
        id="main-content"
        key={pathname}
        className="flex-1 w-full animate-page-enter"
      >
        {children}
      </main>

      {/* Show Public Footer and Floating WhatsApp only on client-facing routes */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsApp />}

      {/* Tiny non-blocking UI Preview ribbon shown only in preview mode */}
      {IS_PREVIEW && (
        <div
          role="status"
          aria-label="UI Preview Mode"
          className="fixed bottom-3 left-3 z-50 pointer-events-none select-none px-2.5 py-1 rounded-full bg-[#0A1E3F]/80 backdrop-blur-md text-[#DFBF64] text-[11px] font-bold tracking-wider uppercase border border-[#DFBF64]/30 shadow-lg flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#DFBF64] animate-pulse" />
          <span>UI Preview</span>
        </div>
      )}
    </div>
  );
}

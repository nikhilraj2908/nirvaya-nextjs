'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyMobileActionBar from '@/components/home/StickyMobileActionBar';
import { usePageTracking } from '@/hooks/usePageTracking';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function AppLayoutClient({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  const [currentLang, setCurrentLang] = useState('en');
  const [currentFontScale, setCurrentFontScale] = useState('md');

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
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#DFBF64] selection:text-[#0A1E3F] overflow-x-clip w-full">
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

      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>

      {/* Show Public Footer and Sticky Bar only on client-facing routes */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <StickyMobileActionBar />}
    </div>
  );
}

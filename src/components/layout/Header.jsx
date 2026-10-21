'use client';

import React, { useState, useEffect } from 'react';
import TopHeader from './TopHeader';
import MainNavigation from './MainNavigation';
import MobileNavigation from './MobileNavigation';

export default function Header({
  currentLang = 'en',
  onLangChange,
  currentFontScale = 'md',
  onFontScaleChange
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white transition-all">
      <TopHeader
        currentLang={currentLang}
        onLangChange={onLangChange}
        currentFontScale={currentFontScale}
        onFontScaleChange={onFontScaleChange}
      />

      <MainNavigation
        isScrolled={isScrolled}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}

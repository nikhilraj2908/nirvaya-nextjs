'use client';

import React, { useState, useEffect, useRef } from 'react';
import TopHeader from './TopHeader';
import MainNavigation from './MainNavigation';
import MobileNavigation from './MobileNavigation';

export default function Header({
  currentLang = 'en',
  onLangChange,
  currentFontScale = 'md',
  onFontScaleChange
}) {
  const [showTopHeader, setShowTopHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Track if page has scrolled away from top
      setIsScrolled(currentScrollY > 15);

      // Always show upper header when near the very top of the page
      if (currentScrollY <= 25) {
        setShowTopHeader(true);
      } else {
        const delta = currentScrollY - lastScrollYRef.current;

        // Scrolling DOWN -> smoothly hide ONLY the upper utility header
        if (delta > 5 && currentScrollY > 50) {
          setShowTopHeader(false);
        }
        // Scrolling UP -> reveal the upper utility header
        else if (delta < -5) {
          setShowTopHeader(true);
        }
      }

      lastScrollYRef.current = currentScrollY;
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
    <header className="sticky top-0 z-40 w-full bg-white">
      {/* Upper Utility Header (Location, Lang, Font Scale, Admin Portal): Collapses on scroll down, reappears on scroll up */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
          showTopHeader ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <TopHeader
          currentLang={currentLang}
          onLangChange={onLangChange}
          currentFontScale={currentFontScale}
          onFontScaleChange={onFontScaleChange}
        />
      </div>

      {/* Lower Navigation Header (Logo, Nav items, Eye Animation Pre-book, Hamburger): ALWAYS visible and sticky */}
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

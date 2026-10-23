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

  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let upScrollAccumulator = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY);

          setIsScrolled(currentScrollY > 20);

          // 1. Initial fold dead zone (within 80px): always show top header to eliminate boundary flickering
          if (currentScrollY <= 80) {
            setShowTopHeader(true);
            upScrollAccumulator = 0;
          } else {
            const diff = currentScrollY - lastScrollY;

            // 2. Scrolling DOWN: Hide top utility header only after sustained downward scroll (> 12px)
            if (diff > 12) {
              upScrollAccumulator = 0;
              setShowTopHeader(false);
            }
            // 3. Scrolling UP: Require intentional upward scroll (>= 30px accumulator)
            else if (diff < -12) {
              upScrollAccumulator += Math.abs(diff);
              if (upScrollAccumulator >= 30) {
                setShowTopHeader(true);
              }
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
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
    <header className="sticky top-0 z-40 w-full bg-white">
      {/* Upper Utility Header (Location, Lang, Font Scale, Admin Portal): Collapses on scroll down, reappears on scroll up */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-250 ease-in-out ${
          showTopHeader ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <TopHeader
            currentLang={currentLang}
            onLangChange={onLangChange}
            currentFontScale={currentFontScale}
            onFontScaleChange={onFontScaleChange}
          />
        </div>
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

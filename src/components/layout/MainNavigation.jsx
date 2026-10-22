'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu } from 'lucide-react';
import { NAVIGATION_ITEMS } from '@/data/siteData';
import Logo from '@/components/common/Logo';
import EyeTrackingButton from '@/components/common/EyeTrackingButton';

export default function MainNavigation({
  isScrolled = false,
  onOpenMobileMenu
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const handleMouseEnter = (label) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`w-full bg-white transition-all duration-300 ${
        isScrolled
          ? 'shadow-sm border-b border-slate-200/90 py-2 sm:py-2.5'
          : 'border-b border-slate-100 py-2.5 sm:py-3.5'
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 lg:gap-4 xl:gap-6">
        <Logo className="shrink-0 mr-1 xl:mr-3" />

        <nav
          className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 2xl:gap-3 text-[12.5px] xl:text-[13.5px] 2xl:text-[14px] font-semibold text-[#0A1E3F] whitespace-nowrap min-w-0"
          aria-label="Main Navigation"
        >
          {NAVIGATION_ITEMS.map((item) => {
            const hasChildren = item.isDropdown && item.children;
            const isOpen = activeDropdown === item.label;

            if (hasChildren) {
              return (
                <div
                  key={item.label}
                  className="relative group shrink-0"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                    className={`inline-flex items-center whitespace-nowrap gap-1 px-2 xl:px-2.5 py-1.5 rounded-md hover:text-[#C59B27] hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#C59B27] cursor-pointer ${
                      isOpen ? 'text-[#C59B27] bg-slate-50' : 'text-[#0A1E3F]'
                    }`}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C59B27]' : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Dropdown Panel */}
                  {isOpen && (
                    <div
                      role="menu"
                      className={`absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200/80 p-3 animate-in fade-in slide-in-from-top-2 duration-150 ${
                        item.label === 'Services' ? 'w-[520px] grid grid-cols-2 gap-1.5' : 'w-72 flex flex-col space-y-1'
                      }`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          role="menuitem"
                          onClick={() => setActiveDropdown(null)}
                          className="flex flex-col p-2.5 rounded-lg hover:bg-[#F8FAFC] group/item border border-transparent hover:border-slate-100 transition-colors"
                        >
                          <span className="text-xs font-bold text-[#0A1E3F] group-hover/item:text-[#C59B27] transition-colors flex items-center justify-between">
                            {child.label}
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover/item:bg-[#C59B27] transition-colors" />
                          </span>
                          {child.desc && (
                            <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {child.desc}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center whitespace-nowrap px-2 xl:px-2.5 py-1.5 rounded-md hover:text-[#C59B27] hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#C59B27] shrink-0"
              >
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto lg:ml-0">
          {/* Pre-book Page Redirect Button with Interactive Eye Tracking (Always visible on mobile & desktop) */}
          <EyeTrackingButton
            href="/pre-book"
            to="/pre-book"
            label="Pre-book a Slot"
            variant="navy"
            size="md"
            showMobileShortText={true}
            ariaLabel="Pre-book an appointment slot"
          />

          {/* Minimalist Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 text-[#0A1E3F] hover:text-[#C59B27] transition-colors cursor-pointer shrink-0"
          >
            <Menu className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

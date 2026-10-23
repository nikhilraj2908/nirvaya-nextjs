'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SafeLink from '@/components/common/SafeLink';
import { X, ChevronDown, ChevronRight, Phone, MessageSquare } from 'lucide-react';
import { NAVIGATION_ITEMS, CLINIC_INFO } from '@/data/siteData';
import Logo from '@/components/common/Logo';
import EyeTrackingButton from '@/components/common/EyeTrackingButton';

export default function MobileNavigation({
  isOpen,
  onClose
}) {
  const [openAccordions, setOpenAccordions] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleAccordion = (label) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-[9999] lg:hidden flex justify-end"
    >
      {/* Dimmed Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Menu */}
      <div className="relative w-full max-w-[320px] xs:max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden transform transition-transform duration-300 ease-out">
        {/* Top bar with Logo & Close icon */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <Logo onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const hasChildren = item.isDropdown && item.children;
            const isAccordionOpen = openAccordions[item.label];

            if (hasChildren) {
              return (
                <div key={item.label} className="border-b border-slate-100 py-0.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.label)}
                    aria-expanded={isAccordionOpen}
                    className="w-full flex items-center justify-between py-3 text-base font-semibold text-[#0A1E3F] hover:text-[#C59B27] transition-colors min-h-[44px] text-left cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                        isAccordionOpen ? 'rotate-180 text-[#C59B27]' : ''
                      }`}
                    />
                  </button>

                  {isAccordionOpen && (
                    <div className="pl-2 pb-2 space-y-1 bg-slate-50/80 rounded-lg p-2 mt-1">
                      {item.children.map((child) => (
                        <SafeLink
                          key={child.label}
                          href={child.href}
                          onClick={onClose}
                          className="flex flex-col py-2 px-2.5 rounded text-sm font-medium text-slate-700 hover:text-[#0A1E3F] hover:bg-white transition-colors min-h-[44px] justify-center"
                        >
                          <span className="font-semibold text-xs text-[#0A1E3F]">
                            {child.label}
                          </span>
                          {child.desc && (
                            <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {child.desc}
                            </span>
                          )}
                        </SafeLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <SafeLink
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 px-1 text-base font-semibold text-[#0A1E3F] hover:text-[#C59B27] border-b border-slate-100 transition-colors min-h-[44px]"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </SafeLink>
            );
          })}
        </nav>

        {/* Bottom Drawer Actions (Pre-book CTA, WhatsApp, Call) */}
        <div className="p-4 border-t border-slate-200 bg-[#F8FAFC] space-y-2.5">
          <EyeTrackingButton
            href="/pre-book"
            to="/pre-book"
            label="Pre-book a Slot"
            variant="navy"
            size="md"
            className="w-full justify-center shadow-md font-bold text-sm min-h-[46px]"
            onClick={onClose}
            showMobileShortText={false}
          />

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <SafeLink
              href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
                CLINIC_INFO.whatsappDefaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs min-h-[44px] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </SafeLink>

            <SafeLink
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#0A1E3F] hover:bg-[#16325C] text-white text-xs font-semibold shadow-xs min-h-[44px] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Clinic</span>
            </SafeLink>
          </div>

          <div className="text-[10.5px] text-slate-500 text-center pt-0.5">
            Ayodhya Bypass Road, Bhopal • Mon-Sat 9:30 AM - 7:30 PM
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronRight, Phone, MessageSquare, Shield } from 'lucide-react';
import { NAVIGATION_ITEMS, CLINIC_INFO } from '@/data/siteData';
import Logo from '@/components/common/Logo';
import EyeTrackingButton from '@/components/common/EyeTrackingButton';

export default function MobileNavigation({
  isOpen,
  onClose
}) {
  const [openAccordions, setOpenAccordions] = useState({});

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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 lg:hidden flex flex-col"
    >
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[320px] xs:max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden ml-auto animate-in slide-in-from-right duration-250">
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
                        <Link
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
                onClick={onClose}
                className="flex items-center justify-between py-3 px-1 text-base font-semibold text-[#0A1E3F] hover:text-[#C59B27] border-b border-slate-100 transition-colors min-h-[44px]"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
            );
          })}
        </nav>

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
            <a
              href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
                CLINIC_INFO.whatsappDefaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs min-h-[44px] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#0A1E3F] hover:bg-[#16325C] text-white text-xs font-semibold shadow-xs min-h-[44px] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Clinic</span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-200/80 text-center">
            <Link
              href="/admin"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#0A1E3F] hover:bg-slate-100 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Staff & Admin Portal</span>
            </Link>
          </div>

          <div className="text-[10.5px] text-slate-500 text-center pt-0.5">
            Ayodhya Bypass Road, Bhopal • Mon-Sat 9:30 AM - 7:30 PM
          </div>
        </div>
      </div>
    </div>
  );
}

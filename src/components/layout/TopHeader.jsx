'use client';

import React from 'react';
import { MapPin, Phone, Clock, Languages } from 'lucide-react';
import { CLINIC_INFO } from '@/data/siteData';
import SafeLink from '@/components/common/SafeLink';

export default function TopHeader({
  currentLang = 'en',
  onLangChange,
  currentFontScale = 'md',
  onFontScaleChange
}) {
  return (
    <div
      role="region"
      aria-label="Clinic utility and accessibility bar"
      className="w-full bg-[#061226] text-slate-300 text-xs border-b border-slate-800/80 transition-colors overflow-hidden"
    >
      <div className="w-full max-w-[1400px] mx-auto px-2.5 xs:px-3.5 sm:px-6 lg:px-8 h-8 sm:h-9 lg:h-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 text-slate-300 font-medium text-[11px] sm:text-xs truncate">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFBF64] shrink-0" aria-hidden="true" />
            <span className="sm:hidden truncate">Bhopal</span>
            <span className="hidden sm:inline truncate">Ayodhya Bypass Road, Bhopal</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span>OPD: 9:30 AM – 7:30 PM (Mon–Sat)</span>
          </div>

          <SafeLink
            href={`tel:${CLINIC_INFO.phoneRaw}`}
            className="hidden lg:inline-flex items-center gap-1.5 text-slate-300 hover:text-[#DFBF64] transition-colors text-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#DFBF64]" aria-hidden="true" />
            <span>{CLINIC_INFO.phone}</span>
          </SafeLink>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
          <div
            className="flex items-center rounded bg-slate-800/80 p-0.5 border border-slate-700/60"
            role="group"
            aria-label="Font size accessibility scaling"
          >
            <button
              type="button"
              onClick={() => onFontScaleChange && onFontScaleChange('sm')}
              aria-label="Small font size"
              title="Small text"
              aria-pressed={currentFontScale === 'sm'}
              className={`px-1.5 sm:px-2 py-0.5 text-[10.5px] sm:text-xs rounded transition-all cursor-pointer ${
                currentFontScale === 'sm'
                  ? 'bg-[#C59B27] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => onFontScaleChange && onFontScaleChange('md')}
              aria-label="Default font size"
              title="Default text"
              aria-pressed={currentFontScale === 'md'}
              className={`px-1.5 sm:px-2 py-0.5 text-[10.5px] sm:text-xs rounded transition-all cursor-pointer ${
                currentFontScale === 'md'
                  ? 'bg-[#C59B27] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onFontScaleChange && onFontScaleChange('lg')}
              aria-label="Large font size"
              title="Large text"
              aria-pressed={currentFontScale === 'lg'}
              className={`px-1.5 sm:px-2 py-0.5 text-[10.5px] sm:text-xs rounded transition-all cursor-pointer ${
                currentFontScale === 'lg'
                  ? 'bg-[#C59B27] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              A+
            </button>
          </div>

          {/* Language Switcher Icons */}
          <div
            className="flex items-center rounded bg-slate-800/80 p-0.5 border border-slate-700/60 ml-1"
            role="group"
            aria-label="Language selection"
          >
            <div className="pl-1.5 pr-1 text-slate-400 flex items-center" title="Select Language">
              <Languages className="w-3.5 h-3.5 text-[#DFBF64]" aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={() => onLangChange && onLangChange('en')}
              aria-label="English"
              title="English"
              aria-pressed={currentLang === 'en'}
              className={`px-1.5 sm:px-2 py-0.5 text-[10.5px] sm:text-xs rounded font-bold transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-[#C59B27] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLangChange && onLangChange('hi')}
              aria-label="Hindi"
              title="हिन्दी (Hindi)"
              aria-pressed={currentLang === 'hi'}
              className={`px-1.5 sm:px-2 py-0.5 text-[10.5px] sm:text-xs rounded font-bold font-hindi transition-all cursor-pointer ${
                currentLang === 'hi'
                  ? 'bg-[#C59B27] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              हि
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

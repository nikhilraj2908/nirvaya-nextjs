'use client';

import React from 'react';
import SafeLink from '@/components/common/SafeLink';
import { CLINIC_INFO } from '@/data/siteData';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import en from '@/locales/en.json';

export default function StickyMobileActionBar() {
  return (
    <nav
      aria-label="Mobile Quick Clinical and Booking Actions"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#0A1E3F]/88 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0A1E3F]/80 border-t border-white/15 shadow-[0_-8px_32px_rgba(6,18,38,0.45)] py-2.5 px-3.5 lg:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.6rem)' }}
    >
      <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto items-center">
        {/* Direct Call Button */}
        <SafeLink
          href={`tel:${CLINIC_INFO.phoneRaw}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white active:scale-95 transition-all min-h-[44px]"
          aria-label="Call clinic directly"
        >
          <Phone className="w-3.5 h-3.5 text-[#DFBF64] shrink-0" />
          <span className="text-xs font-semibold tracking-tight">{en.common.call}</span>
        </SafeLink>

        {/* WhatsApp Consultation Button */}
        <SafeLink
          href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
            CLINIC_INFO.whatsappDefaultMessage
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/35 text-white active:scale-95 transition-all min-h-[44px]"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
          <span className="text-xs font-semibold tracking-tight">{en.common.whatsApp}</span>
        </SafeLink>

        {/* Pre-book OPD Slot Hero Button */}
        <SafeLink
          href="/pre-book"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-[#DFBF64] via-[#C59B27] to-[#B3871B] text-[#0A1E3F] font-extrabold text-xs shadow-md shadow-[#C59B27]/25 hover:brightness-105 active:scale-95 transition-all min-h-[44px] cursor-pointer"
          aria-label="Open Pre-book Consultation Page"
        >
          <Calendar className="w-3.5 h-3.5 text-[#0A1E3F] shrink-0" />
          <span className="tracking-tight">{en.common.preBook}</span>
        </SafeLink>
      </div>
    </nav>
  );
}

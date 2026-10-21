'use client';

import React from 'react';
import Link from 'next/link';
import { CLINIC_INFO } from '@/data/siteData';
import { Phone, MessageSquare, Calendar } from 'lucide-react';

export default function StickyMobileActionBar() {
  return (
    <div
      aria-label="Mobile Emergency and Booking Actions"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] py-2 px-3 lg:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)' }}
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Direct Call Button */}
        <a
          href={`tel:${CLINIC_INFO.phoneRaw}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all min-h-[44px]"
          aria-label="Call clinic directly"
        >
          <Phone className="w-4 h-4 text-sky-700 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
            CLINIC_INFO.whatsappDefaultMessage
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/70 active:scale-95 transition-all min-h-[44px]"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* Pre-book Slot Page Trigger */}
        <Link
          href="/pre-book"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-[#DFBF64] to-[#C59B27] text-[#0A1E3F] font-bold shadow-md active:scale-95 transition-all min-h-[44px] cursor-pointer"
          aria-label="Open Pre-book Consultation Page"
        >
          <Calendar className="w-4 h-4 text-[#0A1E3F] mb-0.5" />
          <span className="text-[11px] font-extrabold tracking-tight">Pre-book</span>
        </Link>
      </div>
    </div>
  );
}

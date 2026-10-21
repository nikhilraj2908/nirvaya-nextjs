'use client';

import React, { useState, useEffect } from 'react';
import { CLINIC_INFO } from '@/data/siteData';

export default function FloatingWhatsApp() {
  const [isGlowing, setIsGlowing] = useState(false);

  const whatsappUrl = `https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
    CLINIC_INFO.whatsappDefaultMessage
  )}`;

  useEffect(() => {
    let isMounted = true;
    let glowTimer;
    let intervalId;

    // Trigger a gentle, polite 2-second glow every 10 seconds
    const triggerPulse = () => {
      if (!isMounted) return;
      setIsGlowing(true);

      glowTimer = setTimeout(() => {
        if (isMounted) setIsGlowing(false);
      }, 2000); // Glows for 2 seconds
    };

    // Initial polite pulse after 4 seconds
    const initialTimer = setTimeout(triggerPulse, 4000);

    // Repeat with 10 seconds of quiet rest between glows (10s quiet + 2s glow = 12s cycle)
    intervalId = setInterval(triggerPulse, 12000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearTimeout(glowTimer);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="fixed bottom-6 sm:bottom-7 lg:bottom-8 right-5 sm:right-6 lg:right-8 z-40 flex items-center group">
      {/* Floating Tooltip (Desktop) */}
      <span className="hidden lg:flex items-center gap-1.5 absolute right-full mr-3.5 px-3.5 py-1.5 rounded-full bg-[#0A1E3F]/95 backdrop-blur-md text-white text-xs font-semibold shadow-xl border border-[#C59B27]/40 whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        Chat with us on WhatsApp
      </span>

      {/* Floating Pulse Rings: Only activates during the 10-second interval */}
      {isGlowing && (
        <>
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
          <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/25 blur-sm pointer-events-none" />
        </>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Nirvaya Eyecare Centre on WhatsApp"
        className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.65)] hover:scale-108 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 cursor-pointer ${
          isGlowing ? 'scale-105 shadow-[0_0_24px_rgba(37,211,102,0.65)]' : ''
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-white drop-shadow-xs"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.34C16.31 14.21 15.09 13.61 14.86 13.53C14.64 13.45 14.47 13.41 14.31 13.66C14.14 13.91 13.66 14.47 13.51 14.64C13.37 14.81 13.22 14.83 12.97 14.71C12.72 14.58 11.92 14.32 10.97 13.47C10.23 12.81 9.73 12 9.58 11.75C9.44 11.5 9.57 11.37 9.69 11.24C9.8 11.13 9.94 10.95 10.06 10.81C10.19 10.66 10.23 10.56 10.31 10.39C10.39 10.23 10.35 10.08 10.29 9.96C10.23 9.83 9.73 8.61 9.53 8.1C9.32 7.61 9.11 7.68 8.95 7.67C8.8 7.66 8.63 7.66 8.46 7.66C8.29 7.66 8.02 7.72 7.79 7.97C7.56 8.22 6.92 8.82 6.92 10.04C6.92 11.26 7.81 12.44 7.93 12.6C8.06 12.77 9.68 15.27 12.16 16.34C12.75 16.6 13.21 16.75 13.57 16.86C14.16 17.05 14.7 17.02 15.13 16.96C15.61 16.89 16.6 16.36 16.81 15.77C17.02 15.18 17.02 14.68 16.96 14.58C16.9 14.47 16.81 14.47 16.56 14.34Z" />
        </svg>
      </a>
    </div>
  );
}

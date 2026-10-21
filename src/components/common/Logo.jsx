'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Logo({
  light = false,
  variant = 'default',
  className = '',
  onClick
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLight = light || variant === 'light';

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }

    if (pathname === '/') {
      e.preventDefault();
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      router.push('/');
      setTimeout(() => {
        const heroEl = document.getElementById('hero');
        if (heroEl) {
          heroEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label="Nirvaya Eyecare Centre Home"
      className={`inline-flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C59B27] rounded-sm transition-transform active:scale-[0.99] shrink-0 cursor-pointer ${className}`}
    >
      <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-gradient-to-br from-[#0A1E3F] to-[#16325C] p-1.5 sm:p-2 flex items-center justify-center shadow-xs border border-white/10">
        <svg
          viewBox="0 0 36 36"
          className="w-full h-full text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 18 C10 8, 26 8, 32 18 C26 28, 10 28, 4 18 Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="18"
            cy="18"
            r="6"
            stroke="#DFBF64"
            strokeWidth="1.8"
            strokeDasharray="2 1"
          />
          <circle cx="18" cy="18" r="3.2" fill="#C59B27" />
          <circle cx="16.8" cy="16.8" r="1.1" fill="#FFFFFF" />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C59B27] ring-2 ring-white"></span>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span
            className={`font-heading text-base sm:text-lg xl:text-xl font-extrabold tracking-wider uppercase leading-none ${
              isLight ? 'text-white' : 'text-[#0A1E3F]'
            }`}
          >
            NIRVAYA
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-[#FDF9EE] text-[#C59B27] border border-[#C59B27]/30">
            Eye Care
          </span>
        </div>
        <span
          className={`hidden xs:inline text-[9.5px] sm:text-[10.5px] tracking-wider uppercase font-medium mt-0.5 sm:mt-1 leading-tight ${
            isLight ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          Specialist Centre • Bhopal
        </span>
      </div>
    </Link>
  );
}

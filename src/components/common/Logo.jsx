'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Logo({
  light = false,
  variant = 'default',
  type = 'default', // 'default' | 'round'
  size = 'md',
  className = '',
  onClick
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLight = light || variant === 'light';
  const isRound = type === 'round';

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }

    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const heightClasses = isRound
    ? {
        sm: 'h-16 w-auto max-w-[120px]',
        md: 'h-20 sm:h-24 w-auto max-w-[160px]',
        lg: 'h-24 sm:h-28 md:h-32 w-auto max-w-[200px]'
      }[size] || 'h-20 sm:h-24 w-auto max-w-[160px]'
    : {
        sm: 'h-7 sm:h-8 max-w-[140px] sm:max-w-[160px]',
        md: 'h-8 sm:h-10 md:h-11 max-w-[165px] sm:max-w-[210px] md:max-w-[230px]',
        lg: 'h-10 sm:h-12 max-w-[200px] sm:max-w-[240px]'
      }[size] || 'h-8 sm:h-10 md:h-11 max-w-[165px] sm:max-w-[210px] md:max-w-[230px]';

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label="Nirvaya Eyecare Centre Home"
      className={`inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-[#C59B27] rounded-2xl transition-transform active:scale-[0.99] shrink-0 cursor-pointer ${className}`}
    >
      <div
        className={`relative flex items-center transition-all ${
          isLight
            ? isRound
              ? 'bg-white p-3 sm:p-3.5 rounded-2xl shadow-md border border-white/30'
              : 'bg-white/95 px-2.5 py-1 rounded-lg shadow-xs border border-white/20'
            : ''
        }`}
      >
        <img
          src={isRound ? '/images/logo-round.png' : '/images/nirvaya-logo.png'}
          alt="Nirvaya Eyecare Centre Logo"
          width={isRound ? 3468 : 6271}
          height={isRound ? 3200 : 1271}
          className={`w-auto ${heightClasses} object-contain transition-transform group-hover:scale-[1.02]`}
          loading="eager"
        />
      </div>
    </Link>
  );
}

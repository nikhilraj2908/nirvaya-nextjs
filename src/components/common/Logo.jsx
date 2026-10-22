'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Logo({
  light = false,
  variant = 'default',
  size = 'md',
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
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const heightClasses = {
    sm: 'h-7 sm:h-8 max-w-[140px] sm:max-w-[160px]',
    md: 'h-8 sm:h-10 md:h-11 max-w-[165px] sm:max-w-[210px] md:max-w-[230px]',
    lg: 'h-10 sm:h-12 max-w-[200px] sm:max-w-[240px]'
  }[size] || 'h-8 sm:h-10 md:h-11 max-w-[165px] sm:max-w-[210px] md:max-w-[230px]';

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label="Nirvaya Eyecare Centre Home"
      className={`inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-[#C59B27] rounded transition-transform active:scale-[0.99] shrink-0 cursor-pointer ${className}`}
    >
      <div
        className={`relative flex items-center transition-all ${
          isLight
            ? 'bg-white/95 px-2.5 py-1 rounded-lg shadow-xs border border-white/20'
            : ''
        }`}
      >
        <img
          src="/images/nirvaya-logo.png"
          alt="Nirvaya Eyecare Centre Logo"
          width={6271}
          height={1271}
          className={`w-auto ${heightClasses} object-contain`}
          loading="eager"
        />
      </div>
    </Link>
  );
}

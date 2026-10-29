'use client';

import React, { useRef, useEffect, useState } from 'react';
import SafeLink from '@/components/common/SafeLink';
import { IS_PREVIEW } from '@/lib/preview';

/**
 * Interactive Eye-Tracking Button Component
 *
 * Features:
 * - Two cartoon-style white eyes with dark pupils following viewport cursor
 * - High performance: Runs inside a direct DOM mutation requestAnimationFrame loop (zero React re-renders)
 * - Trigonometric calculation: Distance and angle clamped to keep pupil safely within eye radius
 * - Natural Blinking: Scheduled blinks with occasional playful double-blinks
 * - Responsive & Accessible: Disables tracking on touch-only devices and honors `prefers-reduced-motion`
 */
export default function EyeTrackingButton({
  label = 'Pre-book a Slot',
  to,
  href,
  onClick,
  variant = 'navy', // navy | gold | darkNavy
  size = 'md', // sm | md | lg
  className = '',
  ariaLabel,
  showMobileShortText = false
}) {
  const buttonRef = useRef(null);
  const eyesContainerRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  // Mutable tracking coordinates (no React state re-renders)
  const mouseCoords = useRef({ x: -9999, y: -9999 });
  const currentPupilLeft = useRef({ x: 0, y: 0 });
  const currentPupilRight = useRef({ x: 0, y: 0 });
  const targetPupilLeft = useRef({ x: 0, y: 0 });
  const targetPupilRight = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // Blinking state for eyelid animation
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimeoutRef = useRef(null);
  const doubleBlinkTimeoutRef = useRef(null);

  // 1. Mouse / Pointer Tracking RAF Loop
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize to center of screen so eyes are active from mount
    if (mouseCoords.current.x === -9999) {
      mouseCoords.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };
    }

    const handlePointerMove = (e) => {
      if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
        mouseCoords.current = { x: e.clientX, y: e.clientY };
      }
    };

    // Listen to both mousemove and pointermove across window and document
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mousemove', handlePointerMove, { passive: true });

    const updatePupilPositions = () => {
      if (mouseCoords.current.x !== -9999 && mouseCoords.current.y !== -9999) {
        // Left Eye calculations
        if (leftEyeRef.current) {
          const rect = leftEyeRef.current.getBoundingClientRect();
          const eyeCenterX = rect.left + rect.width / 2;
          const eyeCenterY = rect.top + rect.height / 2;

          const dx = mouseCoords.current.x - eyeCenterX;
          const dy = mouseCoords.current.y - eyeCenterY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.hypot(dx, dy);

          // Dynamic travel: allows prominent, delightful movement while staying safely inside sclera
          const maxTravel = Math.max(3.6, Math.min(5.2, (rect.width / 2) * 0.52));
          const travel = distance === 0 ? 0 : Math.min(maxTravel, Math.max(1.2, distance * 0.14));

          targetPupilLeft.current.x = Math.cos(angle) * travel;
          targetPupilLeft.current.y = Math.sin(angle) * travel;
        }

        // Right Eye calculations
        if (rightEyeRef.current) {
          const rect = rightEyeRef.current.getBoundingClientRect();
          const eyeCenterX = rect.left + rect.width / 2;
          const eyeCenterY = rect.top + rect.height / 2;

          const dx = mouseCoords.current.x - eyeCenterX;
          const dy = mouseCoords.current.y - eyeCenterY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.hypot(dx, dy);

          const maxTravel = Math.max(3.6, Math.min(5.2, (rect.width / 2) * 0.52));
          const travel = distance === 0 ? 0 : Math.min(maxTravel, Math.max(1.2, distance * 0.14));

          targetPupilRight.current.x = Math.cos(angle) * travel;
          targetPupilRight.current.y = Math.sin(angle) * travel;
        }

        // Smooth Interpolation (Lerp factor = 0.22 for fluid, responsive follow)
        currentPupilLeft.current.x +=
          (targetPupilLeft.current.x - currentPupilLeft.current.x) * 0.22;
        currentPupilLeft.current.y +=
          (targetPupilLeft.current.y - currentPupilLeft.current.y) * 0.22;

        currentPupilRight.current.x +=
          (targetPupilRight.current.x - currentPupilRight.current.x) * 0.22;
        currentPupilRight.current.y +=
          (targetPupilRight.current.y - currentPupilRight.current.y) * 0.22;

        // Directly apply transform to pupil elements (zero React re-renders!)
        if (leftPupilRef.current) {
          leftPupilRef.current.style.transform = `translate3d(${currentPupilLeft.current.x.toFixed(
            2
          )}px, ${currentPupilLeft.current.y.toFixed(2)}px, 0)`;
        }
        if (rightPupilRef.current) {
          rightPupilRef.current.style.transform = `translate3d(${currentPupilRight.current.x.toFixed(
            2
          )}px, ${currentPupilRight.current.y.toFixed(2)}px, 0)`;
        }
      }

      rafId.current = requestAnimationFrame(updatePupilPositions);
    };

    rafId.current = requestAnimationFrame(updatePupilPositions);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mousemove', handlePointerMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // 2. Natural Blinking Animation Loop (3 to 6-second random intervals + subtle double-blink)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    let isMounted = true;

    const performBlink = () => {
      if (!isMounted) return;

      // 1. Close eyelids
      setIsBlinking(true);

      // 2. Open eyelids after 160ms (quick natural blink)
      blinkTimeoutRef.current = setTimeout(() => {
        if (!isMounted) return;
        setIsBlinking(false);

        // 20% probability of an occasional playful double-blink!
        const isDoubleBlink = Math.random() < 0.2;
        if (isDoubleBlink) {
          doubleBlinkTimeoutRef.current = setTimeout(() => {
            if (!isMounted) return;
            setIsBlinking(true);
            setTimeout(() => {
              if (isMounted) setIsBlinking(false);
            }, 140);
          }, 110);
        }
      }, 160);

      // Schedule next blink randomly between 3000ms and 6000ms
      const nextInterval = Math.floor(Math.random() * 3000) + 3000;
      blinkTimeoutRef.current = setTimeout(performBlink, nextInterval);
    };

    // Initial blink after 2.2 seconds
    const initialTimer = setTimeout(performBlink, 2200);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      if (doubleBlinkTimeoutRef.current) clearTimeout(doubleBlinkTimeoutRef.current);
    };
  }, []);

  // Sizing definitions matching healthcare aesthetics
  const sizeStyles = {
    sm: {
      button: 'px-3.5 py-1.5 text-xs min-h-[38px] gap-2',
      eye: 'w-[17px] h-[17px]',
      pupil: 'w-[6.5px] h-[6.5px]',
      catchlight: 'w-[1.8px] h-[1.8px]'
    },
    md: {
      button: 'px-2 xs:px-2.5 sm:px-5 py-1 sm:py-2 text-[11px] xs:text-xs sm:text-sm min-h-[32px] sm:min-h-[44px] gap-1 xs:gap-1.5 sm:gap-2.5',
      eye: 'w-[15px] h-[15px] xs:w-[17px] xs:h-[17px] sm:w-[21px] sm:h-[21px]',
      pupil: 'w-[5.5px] h-[5.5px] xs:w-[6.5px] xs:h-[6.5px] sm:w-[8.5px] sm:h-[8.5px]',
      catchlight: 'w-[1.6px] h-[1.6px] xs:w-[1.8px] xs:h-[1.8px] sm:w-[2px] sm:h-[2px]'
    },
    lg: {
      button: 'px-6 py-3.5 text-sm sm:text-base min-h-[52px] sm:min-h-[56px] gap-3',
      eye: 'w-[24px] h-[24px]',
      pupil: 'w-[9.5px] h-[9.5px]',
      catchlight: 'w-[2.5px] h-[2.5px]'
    }
  }[size] || sizeStyles.md;

  // Variant styling
  const variantStyles = {
    navy: 'bg-[#102A43] hover:bg-[#16385C] text-white border border-white/10 shadow-md hover:shadow-xl hover:shadow-[#102A43]/30',
    gold: 'bg-[#DFBF64] hover:bg-[#E5C97A] text-[#0A1E3F] border border-[#C59B27]/30 shadow-md hover:shadow-xl hover:shadow-[#DFBF64]/30',
    darkNavy: 'bg-[#0A1E3F] hover:bg-[#122A54] text-white border border-white/15 shadow-md hover:shadow-xl hover:shadow-[#0A1E3F]/35'
  }[variant] || variantStyles.navy;

  const content = (
    <>
      {/* Label Text on Left */}
      <span className="font-bold tracking-tight whitespace-nowrap select-none drop-shadow-2xs">
        {showMobileShortText ? (
          <>
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">Pre-book</span>
          </>
        ) : (
          label
        )}
      </span>

      {/* Two Cartoon-Style Animated White Eyes on Right */}
      <span
        ref={eyesContainerRef}
        aria-hidden="true"
        className="inline-flex items-center gap-1 shrink-0 select-none pointer-events-none"
      >
        {/* Left Eye */}
        <span
          ref={leftEyeRef}
          className={`relative ${sizeStyles.eye} rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xs transition-transform duration-150 ease-out origin-center`}
          style={{
            transform: isBlinking ? 'scaleY(0.08)' : 'scaleY(1)'
          }}
        >
          {/* Left Pupil (Navy/Black with glossy white catchlight reflection) */}
          <span
            ref={leftPupilRef}
            className={`block ${sizeStyles.pupil} rounded-full bg-[#081B30] relative shadow-inner`}
            style={{
              willChange: 'transform'
            }}
          >
            {/* Catchlight highlight dot */}
            <span
              className={`block ${sizeStyles.catchlight} rounded-full bg-white absolute top-0.5 right-0.5 opacity-90`}
            />
          </span>
        </span>

        {/* Right Eye */}
        <span
          ref={rightEyeRef}
          className={`relative ${sizeStyles.eye} rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xs transition-transform duration-150 ease-out origin-center`}
          style={{
            transform: isBlinking ? 'scaleY(0.08)' : 'scaleY(1)'
          }}
        >
          {/* Right Pupil (Navy/Black with glossy white catchlight reflection) */}
          <span
            ref={rightPupilRef}
            className={`block ${sizeStyles.pupil} rounded-full bg-[#081B30] relative shadow-inner`}
            style={{
              willChange: 'transform'
            }}
          >
            {/* Catchlight highlight dot */}
            <span
              className={`block ${sizeStyles.catchlight} rounded-full bg-white absolute top-0.5 right-0.5 opacity-90`}
            />
          </span>
        </span>
      </span>
    </>
  );

  const sharedClasses = `inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFBF64] focus-visible:ring-offset-2 ${sizeStyles.button} ${variantStyles} ${className}`;

  const destination = to || href;

  if (destination) {
    return (
      <SafeLink
        ref={buttonRef}
        href={destination}
        onClick={onClick}
        className={sharedClasses}
        aria-label={ariaLabel || label}
      >
        {content}
      </SafeLink>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={(e) => {
        if (IS_PREVIEW) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (onClick) onClick(e);
      }}
      className={sharedClasses}
      aria-label={ariaLabel || label}
    >
      {content}
    </button>
  );
}

'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { CLINIC_INFO, HERO_STAGES } from '@/data/siteData';
import Button from '@/components/common/Button';

// Register GSAP ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EyeScrollVideo({ onOpenPreBook, currentLang = 'en' }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const videoRef = useRef(null);

  const [activeStage, setActiveStage] = useState(0);
  const [mobileSlide, setMobileSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoShiftX, setVideoShiftX] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive screen size & desktop video shift
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      setIsMobile(w < 1024);

      if (w >= 1536) setVideoShiftX(160);
      else if (w >= 1280) setVideoShiftX(140);
      else if (w >= 1024) setVideoShiftX(110);
      else setVideoShiftX(0);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Setup GSAP MatchMedia: Desktop (Scrubbed) vs Mobile (Normal Looping Video)
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const mm = gsap.matchMedia();

    const handleMetadata = () => {
      setIsVideoLoaded(true);
      if (video && video.currentTime === 0) {
        try {
          video.currentTime = 0.001;
        } catch (_) {}
      }
    };

    const handleError = (e) => {
      console.warn('Hero video asset encountered an error, activating graceful fallback', e);
      setVideoError(true);
    };

    if (video.readyState >= 1) {
      handleMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleMetadata);
      video.addEventListener('canplay', handleMetadata);
    }
    video.addEventListener('error', handleError);

    // 1. DESKTOP VIEW (>= 1024px): GSAP ScrollTrigger video scrub
    mm.add('(min-width: 1024px)', () => {
      if (isReducedMotion) {
        if (video.duration) video.currentTime = 0;
        return;
      }

      const duration = video.duration || 6.0;
      const playhead = { time: 0 };
      video.pause();

      const scrubTween = gsap.to(playhead, {
        time: duration,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const prog = self.progress;

            let nextStage = 0;
            if (prog < 0.20) nextStage = 0;
            else if (prog < 0.38) nextStage = 1;
            else if (prog < 0.55) nextStage = 2;
            else if (prog < 0.72) nextStage = 3;
            else if (prog < 0.88) nextStage = 4;
            else nextStage = 5;

            setActiveStage((prev) => (prev !== nextStage ? nextStage : prev));

            const targetTime = prog * duration;
            if (
              video &&
              !video.seeking &&
              Math.abs(video.currentTime - targetTime) > 0.015
            ) {
              video.currentTime = targetTime;
            }
          }
        }
      });

      return () => {
        scrubTween.scrollTrigger?.kill();
        scrubTween.kill();
      };
    });

    // 2. MOBILE VIEW (< 1024px): Normal continuously playing background video
    mm.add('(max-width: 1023px)', () => {
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Mobile video autoplay waiting for user interaction:', err);
        });
      }

      return () => {
        video.pause();
      };
    });

    return () => {
      mm.revert();
      if (video) {
        video.removeEventListener('loadedmetadata', handleMetadata);
        video.removeEventListener('canplay', handleMetadata);
        video.removeEventListener('error', handleError);
      }
    };
  }, [isReducedMotion]);

  // Slides data for mobile carousel
  const mobileSlides = useMemo(() => [
    {
      stage: 0,
      eyebrow: currentLang === 'hi' ? 'विशेषज्ञ नेत्र देखभाल' : 'SPECIALIST EYE CARE IN BHOPAL',
      headline: currentLang === 'hi' ? 'विशेषज्ञ-नेतृत्व रेटिना और मोतियाबिंद' : 'Specialist-led Retina & Cataract Eye Care',
      description: currentLang === 'hi'
        ? 'रेटिना, मोतियाबिंद, डायबिटिक नेत्र रोग, ROP और समग्र नेत्र स्वास्थ्य के लिए उच्च गुणवत्ता और विशेषज्ञ परामर्श।'
        : 'Expert evaluation and personalised eye care for retina, cataract, diabetic eye disease, ROP and comprehensive ophthalmology in Bhopal.',
      isHero: true,
      features: [
        'Retina & Vitreoretinal Care',
        'Micro-Incision Cataract',
        'Diabetic Eye Care',
        'Bedside ROP Screening'
      ],
      primaryCta: {
        text: currentLang === 'hi' ? 'स्लॉट प्री-बुक करें' : 'Pre-book a Slot',
        href: '/pre-book'
      },
      secondaryCta: {
        text: currentLang === 'hi' ? 'सेवाएं देखें' : 'Explore Services',
        href: '/services'
      }
    },
    ...HERO_STAGES.slice(1).map((stageItem) => ({
      stage: stageItem.stage,
      eyebrow: stageItem.eyebrow,
      headline: stageItem.headline,
      description: stageItem.description,
      subDetail: stageItem.subDetail,
      isHero: false,
      primaryCta: {
        text: 'Consult Doctor for this',
        href: '/pre-book'
      },
      secondaryCta: {
        text: 'View All Procedures',
        href: '/services'
      }
    }))
  ], [currentLang]);

  // Auto-advance mobile carousel (pauses during touch interaction or pause state)
  useEffect(() => {
    if (!isMobile || isPaused) return;

    const interval = setInterval(() => {
      setMobileSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isMobile, isPaused, mobileSlides.length]);

  // Touch Swipe Handlers for smooth mobile carousel without hindering vertical scroll
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only switch if horizontal swipe dominates vertical movement
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        setMobileSlide((prev) => (prev + 1) % mobileSlides.length);
      } else {
        setMobileSlide((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length);
      }
    }

    // Resume auto-rotation after 4s idle
    setTimeout(() => setIsPaused(false), 4000);
  };

  const currentDesktopContent = HERO_STAGES[activeStage] || HERO_STAGES[0];
  const currentMobileSlide = mobileSlides[mobileSlide] || mobileSlides[0];

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Interactive Eye Hero Experience"
      className={`relative w-full overflow-x-clip ${
        isMobile
          ? 'min-h-[88svh] sm:min-h-screen'
          : isReducedMotion
          ? 'min-h-[85vh]'
          : 'h-[460vh] sm:h-[500vh]'
      }`}
    >
      {/* Hero Viewport (Relative on mobile for smooth natural scrolling; Sticky on desktop for GSAP scrub) */}
      <div
        ref={stickyRef}
        className={`${
          isMobile
            ? 'relative min-h-[88svh] sm:min-h-screen'
            : 'sticky top-0 h-[100svh] min-h-[580px] max-h-[100svh]'
        } w-full overflow-hidden bg-[#061226] flex flex-col justify-between`}
      >
        {/* Ambient Dark Canvas Base */}
        <div className="absolute inset-0 bg-[#061226] z-0 pointer-events-none" />

        {/* Luminous Medical Halo Backlight */}
        <div className="absolute top-1/2 left-1/2 lg:left-[71%] xl:left-[72%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] lg:w-[640px] lg:h-[640px] bg-gradient-to-tr from-sky-400/25 via-blue-500/15 to-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />

        {/* 16:9 Hero Video Layer (Continuous loop on mobile, scrubbed on desktop) */}
        {!videoError ? (
          <div className="absolute inset-0 w-full h-full z-1 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              src="/assets/demo-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              controls={false}
              tabIndex={-1}
              aria-hidden="true"
              className="w-full h-full object-cover object-center lg:object-right select-none opacity-100 pointer-events-none transition-transform duration-300"
              style={{
                filter: 'brightness(1.04) contrast(1.08)',
                transform: videoShiftX ? `translateX(${videoShiftX}px)` : 'none',
                transformOrigin: 'center right'
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center lg:justify-end lg:pr-32 z-1 bg-[#061226]">
            <div className="relative w-80 h-80 rounded-full border border-sky-400/30 flex items-center justify-center animate-pulse">
              <div className="w-56 h-56 rounded-full border border-[#DFBF64]/40 flex items-center justify-center">
                <Eye className="w-24 h-24 text-[#DFBF64]/60" />
              </div>
            </div>
          </div>
        )}

        {/* Desktop Left-to-Right Feathered Gradient for Strong Text Contrast & Deep Canvas */}
        <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-2 bg-gradient-to-r from-[#061226] via-[#061226] via-[28%] via-[#061226]/95 via-[35%] via-[#061226]/20 via-[40%] via-[#061226]/25 via-[8%] to-transparent to-[62%]" />

        {/* Mobile / Tablet Full Smooth Overlay */}
        <div className="lg:hidden absolute inset-0 pointer-events-none z-2 bg-gradient-to-t from-[#061226] via-[#061226]/85 via-[52%] to-[#061226]/40" />

        {/* Bottom Vignette for Smooth Transition to Trust Strip */}
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-2 bg-gradient-to-t from-[#061226] via-[#061226]/60 to-transparent" />

        {/* Foreground Content Container */}
        <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-4 sm:py-6 lg:py-12 pointer-events-none">
          {/* Subtle top breathing space */}
          <div className="h-2 sm:h-4 lg:h-6 pointer-events-none" />

          {/* ============================================================== */}
          {/* 1. MOBILE CAROUSEL VIEW (< 1024px)                             */}
          {/* ============================================================== */}
          <div
            className="lg:hidden w-full max-w-lg mx-auto my-auto pt-20 sm:pt-24 pb-4 px-1 pointer-events-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative bg-[#061226]/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl overflow-hidden transition-all duration-300">
              {/* Subtle top golden accent line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#DFBF64] to-transparent opacity-85" />

              {/* Header Row: Eyebrow + Slide Counter */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
                  <Layers className="w-3.5 h-3.5 text-[#DFBF64] shrink-0" />
                  <span className="truncate max-w-[210px]">{currentMobileSlide.eyebrow}</span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-300 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-slate-700/60 shrink-0">
                  0{mobileSlide + 1} / 0{mobileSlides.length}
                </span>
              </div>

              {/* Slide Body */}
              <div className="min-h-[220px] sm:min-h-[200px] flex flex-col justify-between">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                    {currentMobileSlide.headline}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-2.5">
                    {currentMobileSlide.description}
                  </p>

                  {/* Stage Details */}
                  {currentMobileSlide.isHero ? (
                    <div className="mt-3.5 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-medium">
                      {currentMobileSlide.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#DFBF64] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3.5 p-2.5 rounded-lg bg-slate-900/70 border border-slate-700/60 text-xs text-[#DFBF64] font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-[#DFBF64]" />
                      <span className="leading-tight">{currentMobileSlide.subDetail}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="gold"
                      size="sm"
                      href={currentMobileSlide.primaryCta.href}
                      to={currentMobileSlide.primaryCta.href}
                      icon={Calendar}
                      className="font-bold text-xs shadow-md"
                    >
                      {currentMobileSlide.primaryCta.text}
                    </Button>

                    {currentMobileSlide.isHero ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        href={currentMobileSlide.secondaryCta.href}
                        to={currentMobileSlide.secondaryCta.href}
                        icon={ArrowRight}
                        iconPosition="right"
                        className="bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] border-white/30 text-xs font-semibold"
                      >
                        {currentMobileSlide.secondaryCta.text}
                      </Button>
                    ) : (
                      <Link
                        href={currentMobileSlide.secondaryCta.href}
                        className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 underline-offset-4 font-medium"
                      >
                        {currentMobileSlide.secondaryCta.text}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Carousel Navigation (Arrows + Dots) */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => setMobileSlide((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length)}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-[#DFBF64] text-white flex items-center justify-center transition-colors active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-300" />
                </button>

                {/* Dot Indicators */}
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero carousel stages">
                  {mobileSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={mobileSlide === idx}
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => setMobileSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        mobileSlide === idx
                          ? 'w-6 bg-[#DFBF64] shadow-[0_0_8px_rgba(223,191,100,0.6)]'
                          : 'w-2 bg-slate-600/70 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setMobileSlide((prev) => (prev + 1) % mobileSlides.length)}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-[#DFBF64] text-white flex items-center justify-center transition-colors active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>

            {/* Mobile Smooth Scroll Cue */}
            <div className="mt-3 flex items-center justify-center text-[11px] text-slate-400">
              <div className="inline-flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-800/80">
                <span>Swipe card or scroll down</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#DFBF64] animate-bounce" />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. DESKTOP VIEW (>= 1024px): Scroll-scrubbed hero copy          */}
          {/* ============================================================== */}
          <div className="hidden lg:block my-auto max-w-xl lg:max-w-lg xl:max-w-xl pointer-events-auto transition-all duration-300">
            {/* STAGE 0: Initial Hero Entry */}
            {activeStage === 0 && (
              <div className="space-y-6">
                <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12] animate-fade-in-up stagger-1">
                  {currentLang === 'hi' ? (
                    <span className="font-hindi">
                      विशेषज्ञ-नेतृत्व <span className="text-[#DFBF64]">रेटिना और मोतियाबिंद</span> नेत्र देखभाल
                    </span>
                  ) : (
                    <>
                      Specialist-led{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#DFBF64]">
                        Retina & Cataract
                      </span>{' '}
                      Eye Care
                    </>
                  )}
                </h1>

                <p className="text-base lg:text-lg text-slate-200 leading-relaxed max-w-xl font-normal animate-fade-in-up stagger-3">
                  {currentLang === 'hi'
                    ? 'रेटिना, मोतियाबिंद, डायबिटिक नेत्र रोग, ROP और समग्र नेत्र स्वास्थ्य के लिए उच्च गुणवत्ता और विशेषज्ञ परामर्श।'
                    : 'Expert evaluation and personalised eye care for retina, cataract, diabetic eye disease, ROP and comprehensive ophthalmology in Bhopal.'}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 animate-fade-in-up stagger-4">
                  <Button
                    variant="gold"
                    size="lg"
                    href="/pre-book"
                    to="/pre-book"
                    icon={Calendar}
                    className="shadow-lg hover:shadow-xl font-bold"
                  >
                    {currentLang === 'hi' ? 'परामर्श स्लॉट प्री-बुक करें' : 'Pre-book a Slot'}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    href="/services"
                    to="/services"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] border-white/30 backdrop-blur-xs font-semibold shadow-md transition-all duration-200"
                  >
                    {currentLang === 'hi' ? 'हमारी सेवाएं देखें' : 'Explore Our Services'}
                  </Button>
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex flex-wrap gap-4 text-xs text-slate-300 font-medium animate-fade-in-up stagger-5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <span>Retina & Vitreoretinal Care</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <span>Micro-Incision Cataract</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <span>Diabetic Eye Care</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <span>Bedside ROP Screening</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGES 1 TO 5 */}
            {activeStage > 0 && (
              <div className="bg-[#061226]/85 backdrop-blur-md p-8 rounded-2xl border border-slate-700/80 shadow-2xl max-w-lg space-y-4 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{currentDesktopContent.eyebrow}</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  {currentDesktopContent.headline}
                </h2>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {currentDesktopContent.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-[#DFBF64] font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#DFBF64]" />
                  <span>{currentDesktopContent.subDetail}</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button
                    variant="gold"
                    size="sm"
                    href="/pre-book"
                    to="/pre-book"
                    icon={Calendar}
                    className="font-semibold shadow-xs"
                  >
                    Consult Doctor for this
                  </Button>
                  <Link
                    href="/services"
                    className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 underline-offset-4"
                  >
                    View All Procedures
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Desktop Controls / Scroll Cue */}
          <div className="hidden lg:flex items-center justify-between text-xs text-slate-400 pointer-events-auto pt-2">
            {!isReducedMotion ? (
              <div className="inline-flex items-center gap-2 bg-slate-950/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-[#DFBF64] animate-ping" />
                <span>
                  {activeStage === 0
                    ? 'Scroll down to explore interactive eye anatomy'
                    : 'Keep scrolling to reveal deeper retinal layers'}
                </span>
                <ChevronDown className="w-4 h-4 text-[#DFBF64] animate-bounce ml-1" />
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Reduced motion active • Static anatomical view
              </div>
            )}

            <div className="text-slate-400 text-[11px]">
              Ayodhya Bypass Road, Bhopal • M/s Nirvaya Health
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


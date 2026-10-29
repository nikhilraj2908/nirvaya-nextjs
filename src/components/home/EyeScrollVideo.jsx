'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import SafeLink from '@/components/common/SafeLink';
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
import MobileHero from './MobileHero';
import EyeTestModal from '@/components/eye-test/EyeTestModal';
import en from '@/locales/en.json';

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
  const [isEyeTestOpen, setIsEyeTestOpen] = useState(false);

  // Global event listener to open eye test from any component/navigation or button click
  useEffect(() => {
    const handleOpen = () => setIsEyeTestOpen(true);
    window.addEventListener('open-eye-test', handleOpen);

    // Capture phase document click listener ensures no child or overlay blocks the button
    const handleDocumentClick = (e) => {
      const target = e.target.closest('#hero-online-eye-test-btn, #mobile-hero-online-eye-test-btn, [data-open-eye-test], a[href="#online-eye-test"]');
      if (target) {
        e.preventDefault();
        setIsEyeTestOpen(true);
      }
    };
    document.addEventListener('click', handleDocumentClick, true);

    const handleHash = () => {
      if (window.location.hash === '#online-eye-test') {
        setIsEyeTestOpen(true);
      }
    };
    if (window.location.hash === '#online-eye-test') {
      setIsEyeTestOpen(true);
    }
    window.addEventListener('hashchange', handleHash);

    return () => {
      window.removeEventListener('open-eye-test', handleOpen);
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Scroll to specific stage on indicator click
  const scrollToStage = (stage) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetProgress = HERO_STAGES[stage]?.progressRange?.[0] ?? (stage / (HERO_STAGES.length - 1));
    window.scrollTo({
      top: containerTop + totalHeight * Math.min(Math.max(targetProgress + 0.02, 0), 1),
      behavior: 'smooth'
    });
  };

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
        } catch (_) { }
      }
      ScrollTrigger.refresh();
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

    // 1. DESKTOP VIEW (>= 1024px): GSAP ScrollTrigger video scrub with silky smooth momentum
    mm.add('(min-width: 1024px)', () => {
      if (isReducedMotion) {
        if (video.duration) video.currentTime = 0;
        return;
      }

      const getDuration = () =>
        video.duration && !isNaN(video.duration) && video.duration > 0
          ? video.duration
          : 6.0;

      const duration = getDuration();
      const playhead = { time: 0 };
      video.pause();

      let targetVideoTime = 0;
      let rafId = null;

      // Safely apply target time on animation frames
      const syncVideo = () => {
        rafId = null;
        if (!video) return;
        if (!video.seeking && Math.abs(video.currentTime - targetVideoTime) > 0.015) {
          video.currentTime = targetVideoTime;
        }
      };

      // When browser finishes decoding/seeking frame, catch up if target changed
      const handleSeeked = () => {
        if (!video) return;
        if (Math.abs(video.currentTime - targetVideoTime) > 0.015) {
          video.currentTime = targetVideoTime;
        }
      };

      video.addEventListener('seeked', handleSeeked);

      const scrubTween = gsap.to(playhead, {
        time: duration,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Luxurious momentum smoothing for desktop wheel and trackpad scroll
          fastScrollEnd: true,
          preventOverlaps: true,
        },
        onUpdate: () => {
          // Runs on every animation frame as playhead.time smoothly glides!
          const smoothedTime = playhead.time;
          const currDuration = getDuration();
          const smoothedProg =
            currDuration > 0
              ? Math.min(Math.max(smoothedTime / currDuration, 0), 1)
              : 0;

          // Compute active stage smoothly based on smoothed progress
          let nextStage = 0;
          for (let i = HERO_STAGES.length - 1; i >= 0; i--) {
            const rangeStart = HERO_STAGES[i].progressRange?.[0] ?? (i / HERO_STAGES.length);
            if (smoothedProg >= rangeStart) {
              nextStage = HERO_STAGES[i].stage ?? i;
              break;
            }
          }

          setActiveStage((prev) => (prev !== nextStage ? nextStage : prev));

          targetVideoTime = Math.min(
            Math.max(smoothedTime, 0),
            Math.max(currDuration - 0.02, 0)
          );

          if (!rafId) {
            rafId = requestAnimationFrame(syncVideo);
          }
        }
      });

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        video.removeEventListener('seeked', handleSeeked);
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
      headline: currentLang === 'hi' ? 'विशेषज्ञ-नेतृत्व रेटिना और मोतियाबिंद आईकेयर सेंटर' : 'Specialist-led Retina & Cataract Eye Care Center',
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
    <>
      {/* 1. Mobile & Tablet Hero (< 1024px) - Clean Luxury Editorial Landing with Live Countdown & Lead Capture */}
      <div className="block lg:hidden w-full">
        <MobileHero
          onOpenPreBook={onOpenPreBook}
          onOpenEyeTest={() => setIsEyeTestOpen(true)}
          currentLang={currentLang}
        />
      </div>

      {/* 2. Desktop Hero (>= 1024px) - Interactive Eye Disassembly Scroll Video */}
      <section
        ref={containerRef}
        id="hero"
        aria-label="Interactive Eye Hero Experience"
        className={`hidden lg:block relative w-full overflow-x-clip ${isReducedMotion
            ? 'min-h-[85vh]'
            : 'h-[460vh] sm:h-[500vh]'
          }`}
      >
        {/* Desktop Sticky Viewport */}
        <div
          ref={stickyRef}
          className="sticky top-0 h-[100svh] max-h-[100svh] w-full overflow-hidden bg-[#061226] flex flex-col justify-between"
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

          {/* Mobile / Tablet Full Smooth Overlay - reduced opacity for vibrant video visibility */}
          <div className="lg:hidden absolute inset-0 pointer-events-none z-2 bg-gradient-to-t from-[#061226]/85 via-[#061226]/30 via-[50%] to-transparent" />

          {/* Bottom Vignette for Smooth Transition to Trust Strip */}
          <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-2 bg-gradient-to-t from-[#061226] via-[#061226]/60 to-transparent" />

          {/* Foreground Content Container - Balanced top/bottom clearance for optical centering */}
          <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-16 sm:pt-18 lg:pt-20 xl:pt-24 pb-3 sm:pb-4 lg:pb-5 pointer-events-auto">
            {/* Top breathing space below sticky header */}
            <div className="h-2 sm:h-3 lg:h-3 pointer-events-none shrink-0" />

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
              {/* Glassmorphic Carousel Card with Elegant Transparency */}
              <div className="relative bg-[#061226]/40 sm:bg-[#061226]/45 backdrop-blur-xl rounded-2xl border border-white/20 p-5 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-300">
                {/* Subtle top golden accent line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#DFBF64] to-transparent opacity-90" />

                {/* Header Row: Eyebrow + Slide Counter */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#C59B27]/25 backdrop-blur-md text-[#DFBF64] border border-[#DFBF64]/40 shadow-xs">
                    <Layers className="w-3.5 h-3.5 text-[#DFBF64] shrink-0" />
                    <span className="truncate max-w-[210px]">{currentMobileSlide.eyebrow}</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-200 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 shrink-0">
                    0{mobileSlide + 1} / 0{mobileSlides.length}
                  </span>
                </div>

                {/* Slide Body */}
                <div className="min-h-[220px] sm:min-h-[200px] flex flex-col justify-between">
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                      {currentMobileSlide.headline}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed mt-2.5 drop-shadow-xs">
                      {currentMobileSlide.description}
                    </p>

                    {/* Stage Details */}
                    {!currentMobileSlide.isHero && (
                      <div className="mt-3.5 p-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#DFBF64] font-medium flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 shrink-0 text-[#DFBF64]" />
                        <span className="leading-tight">{currentMobileSlide.subDetail}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-3">
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
                          className="bg-white/15 hover:bg-white text-white hover:text-[#0A1E3F] border-white/30 backdrop-blur-md text-xs font-semibold shadow-xs"
                        >
                          {currentMobileSlide.secondaryCta.text}
                        </Button>
                      ) : (
                        <SafeLink
                          href={currentMobileSlide.secondaryCta.href}
                          className="text-xs text-slate-200 hover:text-white underline decoration-slate-400 underline-offset-4 font-medium drop-shadow-xs"
                        >
                          {currentMobileSlide.secondaryCta.text}
                        </SafeLink>
                      )}
                    </div>
                  </div>
                </div>

                {/* Carousel Navigation (Arrows + Dots) */}
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => setMobileSlide((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length)}
                    aria-label="Previous slide"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-[#DFBF64] text-white flex items-center justify-center transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
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
                        className={`h-2 rounded-full transition-all duration-300 ${mobileSlide === idx
                            ? 'w-6 bg-[#DFBF64] shadow-[0_0_10px_rgba(223,191,100,0.8)]'
                            : 'w-2 bg-white/30 hover:bg-white/50'
                          }`}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => setMobileSlide((prev) => (prev + 1) % mobileSlides.length)}
                    aria-label="Next slide"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-[#DFBF64] text-white flex items-center justify-center transition-all active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Mobile Smooth Scroll Cue */}
              <div className="mt-3 flex items-center justify-center text-[11px] text-slate-300">
                <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15 shadow-xs">
                  <span>Swipe card or scroll down</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#DFBF64] animate-bounce" />
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 2. DESKTOP VIEW (>= 1024px): Smooth crossfaded stage copy      */}
            {/* ============================================================== */}
            <div className="hidden lg:block my-auto w-full pointer-events-auto">
              {/* STAGE 0: Full-Width Initial Hero Entry with "Test Your Eyes Online" near the glass */}
              <div
                className={`w-full transition-all duration-500 ease-out ${
                  activeStage === 0
                    ? 'opacity-100 translate-y-0 pointer-events-auto relative z-20'
                    : 'opacity-0 -translate-y-4 pointer-events-none invisible absolute inset-0 z-0'
                }`}
              >
                <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 xl:gap-8">
                  {/* Left Column: Heading, description & Primary booking CTAs */}
                  <div className="max-w-xl xl:max-w-2xl space-y-6">
                    <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                      {currentLang === 'hi' ? (
                        <span className="font-hindi">
                          विशेषज्ञ-नेतृत्व <span className="text-[#DFBF64]">रेटिना और मोतियाबिंद</span> नेत्र देखभाल केंद्र
                        </span>
                      ) : (
                        <>
                          Specialist-led{' '}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#DFBF64]">
                            Retina & Cataract
                          </span>{' '}
                          Eye Care Center
                        </>
                      )}
                    </h1>

                    <p className="text-base lg:text-lg text-slate-200 leading-relaxed max-w-xl font-normal">
                      {currentLang === 'hi'
                        ? 'रेटिना, मोतियाबिंद, डायबिटिक नेत्र रोग, ROP और समग्र नेत्र स्वास्थ्य के लिए उच्च गुणवत्ता और विशेषज्ञ परामर्श।'
                        : en.mobileHero.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button
                        variant="gold"
                        size="lg"
                        href="/pre-book"
                        to="/pre-book"
                        icon={Calendar}
                        className="shadow-lg hover:shadow-xl font-bold cursor-pointer"
                      >
                        {currentLang === 'hi' ? 'परामर्श स्लॉट प्री-बुक करें' : en.common.preBookSlot}
                      </Button>

                      <Button
                        variant="secondary"
                        size="lg"
                        href="/services"
                        to="/services"
                        icon={ArrowRight}
                        iconPosition="right"
                        className="bg-white/80 hover:bg-white text-[#0A1E3F] hover:text-[#0A1E3F] border border-slate-300/80 hover:border-[#DFBF64] backdrop-blur-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        {currentLang === 'hi' ? 'हमारी सेवाएं देखें' : en.common.exploreServices}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column / Placed to the side of main headings, near the phoropter glass! */}
                  <div className="shrink-0 pointer-events-auto z-30 lg:mr-4 xl:mr-10 flex flex-col items-start">
                    <button
                      type="button"
                      id="hero-online-eye-test-btn"
                      data-open-eye-test="true"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsEyeTestOpen(true);
                      }}
                      className="group relative flex items-center gap-3.5 px-5 py-4 sm:px-6 sm:py-4.5 rounded-2xl bg-[#061226]/90 hover:bg-[#0A1E3F] border-2 border-[#DFBF64] hover:border-amber-300 text-white shadow-[0_16px_45px_rgba(0,0,0,0.65),0_0_28px_rgba(223,191,100,0.4)] hover:shadow-[0_20px_55px_rgba(0,0,0,0.75),0_0_40px_rgba(223,191,100,0.6)] active:scale-95 transition-all duration-300 cursor-pointer pointer-events-auto backdrop-blur-xl text-left select-none"
                      aria-haspopup="dialog"
                      aria-label="Test Your Eyes Online vision screening"
                    >
                      {/* Tumbling E / Glowing Icon Badge */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DFBF64] via-[#C59B27] to-[#8C6D1F] flex items-center justify-center text-[#061226] shadow-md group-hover:scale-105 transition-transform">
                          <Eye className="w-6 h-6 text-[#061226]" aria-hidden="true" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                        </span>
                      </div>

                      {/* Text info */}
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#DFBF64]">
                            Online Screening
                          </span>
                          <span className="text-white/40 text-[10px]">•</span>
                          <span className="text-slate-300 text-[10px]">Free 2-Min</span>
                        </div>
                        <div className="text-base lg:text-lg font-extrabold text-white group-hover:text-[#DFBF64] transition-colors tracking-tight flex items-center gap-2">
                          <span>Test Your Eyes Online</span>
                          <ArrowRight className="w-4 h-4 text-[#DFBF64] group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-[11px] text-slate-300 font-normal">
                          Check clarity at one hand distance
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* STAGES 1 TO 6: Clean, Perfectly Centered Stage Cards (only when scrolled past stage 0) */}
              <div
                className={`grid grid-cols-1 grid-rows-1 max-w-xl lg:max-w-lg xl:max-w-xl items-center transition-all duration-500 ${
                  activeStage > 0
                    ? 'opacity-100 translate-y-0 pointer-events-auto relative z-10'
                    : 'opacity-0 pointer-events-none invisible absolute inset-0 z-0'
                }`}
              >
                {HERO_STAGES.slice(1).map((stageItem) => {
                  const isActive = activeStage === stageItem.stage;
                  return (
                    <article
                      key={stageItem.stage}
                      className={`col-start-1 row-start-1 hero-stage-card bg-[#061226]/85 backdrop-blur-2xl p-6 sm:p-7 lg:p-7 xl:p-8 rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(197,155,39,0.15)] flex flex-col gap-4 ${
                        isActive ? 'is-active pointer-events-auto' : 'pointer-events-none'
                      }`}
                    >
                      {/* Top Header: Eyebrow + Stage Index Badge */}
                      <div className="hero-stagger-item hero-stagger-1 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/25 text-[#DFBF64] border border-[#DFBF64]/40">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{stageItem.eyebrow}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-200/80 bg-white/5 border border-amber-300/20 px-2.5 py-0.5 rounded-full">
                          Stage 0{stageItem.stage} / 0{HERO_STAGES.length - 1}
                        </span>
                      </div>

                      {/* Main Title & Clinical Headline */}
                      <div className="space-y-2 py-0.5">
                        <h2 className="hero-stagger-item hero-stagger-2 font-heading text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                          {stageItem.headline}
                        </h2>

                        <p className="hero-stagger-item hero-stagger-3 text-sm xl:text-base text-slate-200 leading-relaxed drop-shadow-xs">
                          {stageItem.description}
                        </p>
                      </div>

                      {/* Sub-Detail Highlight Box with Key Clinical Stat */}
                      <div className="hero-stagger-item hero-stagger-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-white/5 to-transparent border border-amber-400/30 text-xs text-amber-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 shrink-0 text-[#DFBF64]" />
                          <span className="font-medium text-slate-200">{stageItem.subDetail}</span>
                        </div>
                        {stageItem.stat && (
                          <div className="text-right shrink-0 pl-2 border-l border-white/15">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{stageItem.stat.label}</div>
                            <div className="text-xs font-bold text-[#DFBF64]">{stageItem.stat.value}</div>
                          </div>
                        )}
                      </div>

                      {/* Action CTAs & Attribution */}
                      <div className="hero-stagger-item hero-stagger-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="gold"
                            size="sm"
                            href="/pre-book"
                            to="/pre-book"
                            icon={Calendar}
                            className="font-semibold shadow-md"
                          >
                            {en.common.consultDoctor}
                          </Button>
                          <SafeLink
                            href="/services"
                            className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 underline-offset-4"
                          >
                            {en.common.viewAllProcedures}
                          </SafeLink>
                        </div>

                        <span className="text-sm sm:text-base font-bold text-[#DFBF64] tracking-wide hidden sm:inline">
                          Dr. Sandhya Gaur
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom Desktop Controls / Progress Indicator */}
            <div className="relative hidden lg:flex items-center justify-center text-xs text-slate-400 pointer-events-auto pt-2">
              {/* Desktop Stage Progress Indicator Pills (Centered) */}
              <div className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-800/80">
                {HERO_STAGES.slice(1).map((s) => (
                  <button
                    key={s.stage}
                    type="button"
                    onClick={() => scrollToStage(s.stage)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeStage === s.stage
                        ? 'w-6 bg-[#DFBF64] shadow-[0_0_8px_rgba(223,191,100,0.8)]'
                        : activeStage > s.stage
                          ? 'w-2 bg-[#DFBF64]/60 hover:bg-[#DFBF64]'
                          : 'w-2 bg-white/20 hover:bg-white/50'
                    }`}
                    title={`Jump to Stage 0${s.stage}: ${s.headline || ''}`}
                    aria-label={`Jump to Stage 0${s.stage}`}
                  />
                ))}
              </div>

              {/* Right Address Marker */}
              <div className="absolute right-0 text-slate-400 text-[11px]">
                Ayodhya Bypass Road, Bhopal • M/s Nirvaya Health
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Online Vision Screening Modal (Directly in Homepage via Portal) */}
      <EyeTestModal
        isOpen={isEyeTestOpen}
        onClose={() => {
          setIsEyeTestOpen(false);
          if (typeof window !== 'undefined' && window.location.hash === '#online-eye-test') {
            try {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            } catch (_) {}
          }
        }}
        onOpenPreBook={onOpenPreBook}
      />
    </>
  );
}


'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  ShieldCheck,
  ChevronDown,
  Layers,
  Sparkles,
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
  const triggerRef = useRef(null);

  const [activeStage, setActiveStage] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoShiftX, setVideoShiftX] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Shift video 100-200px to the right on desktop so main animation is unobstructed
  useEffect(() => {
    const updateShift = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w >= 1536) setVideoShiftX(160);
      else if (w >= 1280) setVideoShiftX(140);
      else if (w >= 1024) setVideoShiftX(110);
      else setVideoShiftX(0);
    };
    updateShift();
    window.addEventListener('resize', updateShift);
    return () => window.removeEventListener('resize', updateShift);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Video Scrubbing Setup with GSAP ScrollTrigger
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    let scrubTween = null;
    let st = null;

    const setupScrub = () => {
      if (isReducedMotion) {
        if (video.duration) video.currentTime = 0;
        return;
      }

      const duration = video.duration || 6.0;
      const playhead = { time: 0 };

      video.pause();

      scrubTween = gsap.to(playhead, {
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

      st = scrubTween.scrollTrigger;
      triggerRef.current = st;
    };

    const handleMetadata = () => {
      setIsVideoLoaded(true);
      if (video && video.currentTime === 0) {
        try {
          video.currentTime = 0.001;
        } catch (_) {}
      }
      setupScrub();
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

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', handleMetadata);
        video.removeEventListener('canplay', handleMetadata);
        video.removeEventListener('error', handleError);
      }
      window.removeEventListener('resize', handleResize);
      if (st) st.kill();
      if (scrubTween) scrubTween.kill();
    };
  }, [isReducedMotion]);

  const currentContent = HERO_STAGES[activeStage] || HERO_STAGES[0];

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Interactive Eye Hero Experience"
      className={`relative w-full overflow-x-clip ${
        isReducedMotion ? 'min-h-[85vh]' : 'h-[460vh] sm:h-[500vh]'
      }`}
    >
      {/* Sticky Hero Viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-[100svh] min-h-[580px] max-h-[100svh] overflow-hidden bg-[#061226]"
      >
        {/* Ambient Dark Canvas Base */}
        <div className="absolute inset-0 bg-[#061226] z-0 pointer-events-none" />

        {/* Luminous Medical Halo Backlight */}
        <div className="absolute top-1/2 left-1/2 lg:left-[71%] xl:left-[72%] -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] sm:w-[580px] sm:h-[580px] lg:w-[640px] lg:h-[640px] bg-gradient-to-tr from-sky-400/25 via-blue-500/15 to-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />

        {/* 16:9 Hero Video Layer */}
        {!videoError ? (
          <div className="absolute inset-0 w-full h-full z-1 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              src="/assets/demo-video.mp4"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              controls={false}
              tabIndex={-1}
              aria-hidden="true"
              className="w-full h-full object-cover object-right select-none opacity-100 pointer-events-none transition-transform duration-300"
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
        <div className="lg:hidden absolute inset-0 pointer-events-none z-2 bg-gradient-to-t from-[#061226] via-[#061226]/75 via-[48%] to-[#061226]/35" />

        {/* Bottom Vignette for Smooth Transition to Trust Strip */}
        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-2 bg-gradient-to-t from-[#061226] via-[#061226]/60 to-transparent" />

        {/* Foreground Content Container */}
        <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-6 sm:py-8 lg:py-12 pointer-events-none">
          {/* Subtle top breathing space */}
          <div className="h-2 sm:h-6 pointer-events-none" />

          {/* Main Hero Copy & Overlay Choreography */}
          <div className="my-auto max-w-xl lg:max-w-lg xl:max-w-xl pointer-events-auto transition-all duration-300">
            {/* STAGE 0: Initial Hero Entry */}
            {activeStage === 0 && (
              <div className="space-y-4 sm:space-y-6">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12] animate-fade-in-up stagger-1">
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

                <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-xl font-normal animate-fade-in-up stagger-3">
                  {currentLang === 'hi'
                    ? 'रेटिना, मोतियाबिंद, डायबिटिक नेत्र रोग, ROP और समग्र नेत्र स्वास्थ्य के लिए उच्च गुणवत्ता और विशेषज्ञ परामर्श।'
                    : 'Expert evaluation and personalised eye care for retina, cataract, diabetic eye disease, ROP and comprehensive ophthalmology in Bhopal.'}
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 animate-fade-in-up stagger-4">
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

                <div className="pt-2 sm:pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-4 text-xs text-slate-300 font-medium animate-fade-in-up stagger-5">
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
              <div className="bg-[#061226]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl max-w-lg space-y-4 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{currentContent.eyebrow}</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  {currentContent.headline}
                </h2>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {currentContent.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-[#DFBF64] font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#DFBF64]" />
                  <span>{currentContent.subDetail}</span>
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

          {/* Bottom Controls / Scroll Cue */}
          <div className="flex items-center justify-between text-xs text-slate-400 pointer-events-auto pt-2">
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

            <div className="hidden sm:block text-slate-400 text-[11px]">
              Ayodhya Bypass Road, Bhopal • M/s Nirvaya Health
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

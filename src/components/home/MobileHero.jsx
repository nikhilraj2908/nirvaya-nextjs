'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import Button from '@/components/common/Button';
import { HERO_STAGES } from '@/data/siteData';

export default function MobileHero({ onOpenPreBook, currentLang = 'en' }) {
  const scrollContainerRef = useRef(null);
  const cardMeasureRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardHeight, setCardHeight] = useState(450);

  // Measure card height to reserve exact matching space in normal document flow
  useEffect(() => {
    if (!cardMeasureRef.current) return;
    const updateHeight = () => {
      if (cardMeasureRef.current) {
        setCardHeight(cardMeasureRef.current.offsetHeight);
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(cardMeasureRef.current);
    return () => ro.disconnect();
  }, []);

  // 6 Clinical Stages adapted from PC View (HERO_STAGES)
  const slides = useMemo(() => [
    {
      stage: 0,
      eyebrow: currentLang === 'hi' ? 'विशेषज्ञ नेत्र देखभाल' : 'SPECIALIST EYE CARE IN BHOPAL',
      headline: currentLang === 'hi' ? (
        <span className="font-hindi">
          विशेषज्ञ-नेतृत्व <span className="text-[#C59B27]">रेटिना और मोतियाबिंद</span> नेत्र देखभाल
        </span>
      ) : (
        <>
          Specialist-led{' '}
          <span className="text-[#C59B27]">Retina & Cataract</span>{' '}
          Eye Care
        </>
      ),
      description: currentLang === 'hi'
        ? 'रेटिना, मोतियाबिंद, डायबिटिक नेत्र रोग, ROP और समग्र नेत्र स्वास्थ्य के लिए उच्च गुणवत्ता और विशेषज्ञ परामर्श।'
        : 'Expert evaluation and personalised eye care for retina, cataract, diabetic eye disease, ROP and comprehensive ophthalmology in Bhopal.',
      isHero: true,
      features: [
        'Retina & Vitreo Care',
        'Micro-Incision Cataract',
        'Diabetic Eye Care',
        'Bedside ROP Screening'
      ],
      primaryCta: {
        text: currentLang === 'hi' ? 'परामर्श स्लॉट प्री-बुक करें' : 'Pre-book a Slot',
        href: '/pre-book'
      },
      secondaryCta: {
        text: currentLang === 'hi' ? 'हमारी सेवाएं देखें' : 'Explore Our Services',
        href: '/services'
      }
    },
    ...HERO_STAGES.slice(1).map((s) => ({
      stage: s.stage,
      eyebrow: `STAGE 0${s.stage} • ${s.eyebrow}`,
      headline: (
        <>
          {s.headline.split('&').map((part, i, arr) => (
            <React.Fragment key={i}>
              {i === 0 ? part : <span className="text-[#C59B27]">& {part.trim()}</span>}
            </React.Fragment>
          ))}
        </>
      ),
      description: s.description,
      subDetail: s.subDetail,
      isHero: false,
      primaryCta: {
        text: currentLang === 'hi' ? 'परामर्श स्लॉट प्री-बुक करें' : 'Consult Doctor for this',
        href: '/pre-book'
      },
      secondaryCta: {
        text: currentLang === 'hi' ? 'हमारी सेवाएं देखें' : 'View All Procedures',
        href: '/services'
      }
    }))
  ], [currentLang]);

  // Handle horizontal scroll update to synchronize active index indicator
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.offsetWidth;
    if (itemWidth > 0) {
      const idx = Math.round(scrollLeft / itemWidth);
      if (idx >= 0 && idx < slides.length && idx !== activeIndex) {
        setActiveIndex(idx);
      }
    }
  }, [activeIndex, slides.length]);

  const scrollToSlide = (idx) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const itemWidth = el.offsetWidth;
    el.scrollTo({
      left: idx * itemWidth,
      behavior: 'smooth'
    });
    setActiveIndex(idx);
  };

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + slides.length) % slides.length;
    scrollToSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % slides.length;
    scrollToSlide(nextIdx);
  };

  return (
    <section
      aria-label="Nirvaya Eyecare Mobile Hero"
      className="relative w-full overflow-hidden bg-[#FAFBFD] pt-3 sm:pt-6 pb-6 select-none"
      style={{
        // Ensure parent container reserves exact vertical space for the absolute card overlap
        minHeight: `${245 + cardHeight + 20}px`
      }}
    >
      {/* ============================================================== */}
      {/* 1. UPPER AREA: Eye Artwork on Right + Editorial Typography on Left */}
      {/* ============================================================== */}
      <div className="relative min-h-[320px] sm:min-h-[360px] w-full max-w-lg mx-auto overflow-visible px-4 sm:px-6">
        {/* Layer 1: Macro Human Eye Image - Scaled to fill half of the mobile screen */}
        <div
          aria-hidden="true"
          className="absolute -top-4 -right-6 sm:-right-4 h-[320px] sm:h-[370px] w-auto max-w-none pointer-events-none z-0"
        >
          <img
            src="/images/mobileheroimg.png"
            alt="Advanced Clinical Eye Care"
            className="h-full w-auto max-w-none object-contain"
            loading="eager"
          />
        </div>

        {/* Layer 2: Golden Ribbons & Emerald/Teal Leaves Overlay */}
        <div
          aria-hidden="true"
          className="absolute -top-4 -right-6 sm:-right-4 h-[320px] sm:h-[370px] w-auto max-w-none pointer-events-none z-[1]"
        >
          <img
            src="/images/element-design.png"
            alt="Nirvaya Brand Artwork"
            className="h-full w-auto max-w-none object-contain"
            loading="eager"
          />
        </div>

        {/* Layer 3: Left-Aligned Editorial Typography */}
        <div className="relative z-10 pt-2 sm:pt-4 max-w-[58%] sm:max-w-[52%]">
          <h1 className="font-[family-name:var(--font-serif-luxury),Georgia,serif] text-[31px] sm:text-[38px] font-bold text-[#0A1E3F] leading-[1.08] tracking-tight">
            Vision
            <br />
            Without
            <br />
            <span className="text-[#C59B27]">Symptoms.</span>
          </h1>

          {/* Golden Horizontal Accent Line */}
          <div className="w-12 h-[2px] bg-[#C59B27] mt-2 mb-3 rounded-full" />

          {/* Subtitle */}
          <h2 className="font-[family-name:var(--font-serif-luxury),Georgia,serif] text-[15.5px] sm:text-[18px] font-semibold text-[#0A1E3F] leading-snug">
            Your Future Needs
            <br />
            Attention Now.
          </h2>

          {/* Tagline */}
          <p className="text-[12px] sm:text-[13px] text-slate-600 mt-2 leading-relaxed font-normal">
            Advanced Eye Care for
            <br />
            a Clearer Tomorrow.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ABSOLUTE SCROLLABLE CARDS: Positioned 20% Over the Eye Background */}
      {/* ============================================================== */}
      <div
        className="absolute top-[245px] sm:top-[270px] left-0 right-0 z-20 w-full"
        style={{ position: 'absolute' }}
      >
        {/* Horizontal Scrollable Snap Carousel */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full overflow-x-auto flex snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.stage}
              ref={idx === 0 ? cardMeasureRef : null}
              className="w-full shrink-0 snap-center px-4 sm:px-6 flex justify-center"
            >
              <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_16px_40px_-8px_rgba(10,30,63,0.14),0_2px_12px_rgba(197,155,39,0.08)] p-5 sm:p-6 space-y-3.5 flex flex-col justify-between min-h-[380px] sm:min-h-[400px]">
                {/* Upper Card Content */}
                <div className="space-y-3">
                  {/* Eyebrow Badge + Slide Counter */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#C59B27]/15 text-[#8C6D1F] border border-[#C59B27]/30">
                      {slide.isHero ? (
                        <Sparkles className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                      ) : (
                        <Layers className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                      )}
                      <span className="truncate max-w-[200px] sm:max-w-none">{slide.eyebrow}</span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 shrink-0">
                      0{slide.stage + 1} / 0{slides.length}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0A1E3F] tracking-tight leading-snug">
                    {slide.headline}
                  </h3>

                  {/* Clinical Description */}
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                    {slide.description}
                  </p>

                  {/* Feature Grid (Stage 0) OR SubDetail Badge (Stages 1-5) */}
                  {slide.isHero ? (
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-slate-700 font-medium">
                      {slide.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 text-[11px] sm:text-xs text-slate-700 font-medium flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#C59B27] shrink-0" />
                        <span className="leading-tight">{slide.subDetail}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lower Card Area: CTAs + Navigation Controls */}
                <div className="pt-2 space-y-3">
                  {/* Action CTAs */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Button
                      variant="gold"
                      size="md"
                      href={slide.primaryCta.href}
                      to={slide.primaryCta.href}
                      icon={Calendar}
                      className="w-full sm:w-auto font-bold text-xs sm:text-sm shadow-md justify-center"
                    >
                      {slide.primaryCta.text}
                    </Button>

                    <Button
                      variant="secondary"
                      size="md"
                      href={slide.secondaryCta.href}
                      to={slide.secondaryCta.href}
                      icon={ArrowRight}
                      iconPosition="right"
                      className="w-full sm:w-auto text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-[#0A1E3F] border border-slate-200 justify-center"
                    >
                      {slide.secondaryCta.text}
                    </Button>
                  </div>

                  {/* Carousel Navigation Bar (Prev / 6 Dots / Next) */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous clinical stage"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-700" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero carousel stages">
                      {slides.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          role="tab"
                          aria-selected={activeIndex === dotIdx}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                          onClick={() => scrollToSlide(dotIdx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            activeIndex === dotIdx
                              ? 'w-6 bg-[#C59B27] shadow-[0_0_8px_rgba(197,155,39,0.5)]'
                              : 'w-2 bg-slate-300 hover:bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next clinical stage"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Swipe Hint Cue */}
        <div className="mt-2 flex items-center justify-center text-[10px] sm:text-[11px] text-slate-400">
          <span className="bg-white/80 backdrop-blur-xs px-3 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
            ← Swipe cards to explore all 6 clinical stages →
          </span>
        </div>
      </div>

      {/* Normal Document Flow Spacer */}
      <div
        aria-hidden="true"
        className="pointer-events-none transition-all duration-200"
        style={{ height: cardHeight ? `${cardHeight - 75 + 32}px` : '380px' }}
      />
    </section>
  );
}

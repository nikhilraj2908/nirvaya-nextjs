'use client';

import React, { useState } from 'react';
import SafeLink from '@/components/common/SafeLink';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import {
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { HOMEPAGE_FAQS, ALL_FAQS } from '@/data/faqData';
import en from '@/locales/en.json';

// Backwards compatibility alias for exports
export const CLINICAL_FAQS = ALL_FAQS.slice(0, 5);
export const DOCTOR_LICENSE_FAQS = CLINICAL_FAQS;

export default function FAQSection({ currentLang = 'en' }) {
  // First item open by default
  const [openIndex, setOpenIndex] = useState(0);

  const lang = currentLang === 'hi' ? 'hi' : 'en';

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative py-16 lg:py-24 bg-gradient-to-b from-[#EEF4FA] via-[#E4ECF5] to-[#EDF3F9] border-t border-slate-200/80 scroll-mt-24 overflow-hidden"
    >
      {/* ============================================================== */}
      {/* MINIMALIST BRAND BACKGROUND: Optical Vector Waves & Dot Matrix  */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        {/* Soft Ambient Corner Lighting Blobs */}
        <div className="absolute -top-28 -right-28 w-[500px] h-[500px] bg-sky-400/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-[450px] h-[450px] bg-[#C59B27]/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-sky-100/[0.3] rounded-full blur-3xl pointer-events-none" />

        {/* Crisp Vector Wave Ribbons & Dot Grid */}
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Linear Gradient: Nirvaya Cyan / Azure Wave */}
            <linearGradient id="faq-wave-cyan" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00aeef" stopOpacity="0.04" />
              <stop offset="30%" stopColor="#00aeef" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0A1E3F" stopOpacity="0.02" />
            </linearGradient>

            {/* Linear Gradient: Nirvaya Gold Accent Wave */}
            <linearGradient id="faq-wave-gold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C59B27" stopOpacity="0.03" />
              <stop offset="40%" stopColor="#DFBF64" stopOpacity="0.28" />
              <stop offset="80%" stopColor="#C59B27" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#DFBF64" stopOpacity="0.02" />
            </linearGradient>

            {/* Radial Mask for Bottom-Left Dot Matrix Grid */}
            <radialGradient id="faq-dot-fade" cx="12%" cy="88%" r="48%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <mask id="faq-dot-mask">
              <rect width="100%" height="100%" fill="url(#faq-dot-fade)" />
            </mask>

            {/* High-Precision Modern Dot Matrix Pattern */}
            <pattern id="faq-dot-grid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" fill="#0A1E3F" fillOpacity="0.1" />
            </pattern>
          </defs>

          {/* 1. Subtle Dot Matrix (fades softly in the bottom-left corner) */}
          <rect width="100%" height="100%" fill="url(#faq-dot-grid)" mask="url(#faq-dot-mask)" />

          {/* 2. Right-Hand Flowing Contour Wave Ribbon (Concentric Fine Curves) */}
          <g stroke="url(#faq-wave-cyan)" strokeWidth="1" fill="none">
            <path d="M1440,60 C1280,140 1140,240 1060,390 C980,540 1020,700 950,880 L940,900" opacity="0.35" />
            <path d="M1440,85 C1290,165 1160,260 1085,405 C1010,550 1045,710 980,890 L972,900" opacity="0.45" />
            <path d="M1440,110 C1300,190 1180,280 1110,420 C1040,560 1070,720 1010,900" opacity="0.55" />
            <path d="M1440,135 C1310,215 1200,300 1135,435 C1070,570 1095,730 1040,900" opacity="0.65" />
            <path d="M1440,160 C1320,240 1220,320 1160,450 C1100,580 1120,740 1070,900" opacity="0.75" />
            <path d="M1440,185 C1330,265 1240,340 1185,465 C1130,590 1145,750 1100,900" opacity="0.85" />
            <path d="M1440,210 C1340,290 1260,360 1210,480 C1160,600 1170,760 1130,900" opacity="0.75" />
            <path d="M1440,235 C1350,315 1280,380 1235,495 C1190,610 1195,770 1160,900" opacity="0.6" />
            <path d="M1440,260 C1360,340 1300,400 1260,510 C1220,620 1220,780 1190,900" opacity="0.45" />
            <path d="M1440,285 C1370,365 1320,420 1285,525 C1250,630 1245,790 1220,900" opacity="0.3" />
          </g>

          {/* 3. Left-Hand Sweeping Contour Waves with Warm Gold Accent Lines */}
          <g stroke="url(#faq-wave-gold)" strokeWidth="1" fill="none">
            <path d="M0,580 C200,520 380,620 540,550 C700,480 840,540 1020,460 C1180,390 1320,440 1440,380" opacity="0.3" />
            <path d="M0,610 C210,550 395,645 560,575 C725,505 865,565 1045,485 C1205,415 1340,460 1440,405" opacity="0.42" />
            <path d="M0,640 C220,580 410,670 580,600 C750,530 890,590 1070,510 C1230,440 1360,480 1440,430" opacity="0.55" />
            <path d="M0,670 C230,610 425,695 600,625 C775,555 915,615 1095,535 C1255,465 1380,500 1440,455" opacity="0.65" />
            <path d="M0,700 C240,640 440,720 620,650 C800,580 940,640 1120,560 C1280,490 1400,520 1440,480" opacity="0.5" />
            <path d="M0,730 C250,670 455,745 640,675 C825,605 965,665 1145,585 C1305,515 1420,540 1440,505" opacity="0.35" />
          </g>

          {/* 4. Fine Ambient Horizon Arc */}
          <path
            d="M-50,750 Q720,450 1490,750"
            stroke="url(#faq-wave-cyan)"
            strokeWidth="1.25"
            strokeDasharray="4 6"
            opacity="0.35"
            fill="none"
          />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="reveal-up text-center mb-10 sm:mb-14">
            <SectionHeading
              align="center"
              eyebrow={lang === 'hi' ? 'मरीजों के सामान्य प्रश्न' : en.faq.eyebrow}
              title={lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : en.faq.title}
              description={
                lang === 'hi'
                  ? 'अपॉइंटमेंट प्रक्रिया, पुतली फैलाने का समय, मोतियाबिंद डे-केयर सर्जरी और निर्वाया आईकेयर सेंटर में आपकी यात्रा से संबंधित स्पष्ट जानकारी।'
                  : en.faq.description
              }
            />
          </div>

          {/* Compact 4-5 Question Accordion */}
          <div className="space-y-3.5">
            {HOMEPAGE_FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
                    isOpen
                      ? 'border-[#DFBF64]/70 shadow-md ring-1 ring-[#DFBF64]/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-[#0A1E3F] text-[#DFBF64]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27] bg-[#C59B27]/10 px-2 py-0.5 rounded border border-[#C59B27]/20">
                            {faq.categoryLabel}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-sm sm:text-base text-[#0A1E3F] leading-snug">
                          {faq.question[lang]}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-[#0A1E3F] text-[#DFBF64] rotate-180 shadow-xs'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-700 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-2 mb-3">
                        {faq.answer[lang]}
                      </p>

                      {faq.keyTakeaway && (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{faq.keyTakeaway}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Link to Dedicated FAQ Page */}
          <div className="mt-8 text-center">
            <SafeLink
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-[#DFBF64] text-[#0A1E3F] font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all group"
            >
              <span>{en.faq.dedicatedPageCTA}</span>
              <ArrowRight className="w-4 h-4 text-[#DFBF64] group-hover:translate-x-1 transition-transform" />
            </SafeLink>
          </div>

          {/* Unanswered Questions Callout Banner */}
          <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-sky-50/80 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-700">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-600/10 text-sky-800 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-sky-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-[#0A1E3F]">
                  {lang === 'hi'
                    ? 'क्या आपका कोई ऐसा प्रश्न है जिसका उत्तर यहां नहीं है?'
                    : en.faq.unansweredTitle}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {lang === 'hi'
                    ? 'हमारे क्लिनिक समन्वयक से +91 755 492 8200 पर बात करें या व्हाट्सएप पर पूछें।'
                    : en.faq.unansweredDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <SafeLink
                href={`tel:${en.faq.phone.replace(/[^0-9+]/g, '')}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0A1E3F] font-bold text-xs shadow-2xs hover:bg-slate-50 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#00aeef]" />
                <span>{en.faq.phone}</span>
              </SafeLink>
              <SafeLink
                href="https://wa.me/917554928200"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{en.faq.whatsapp}</span>
              </SafeLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

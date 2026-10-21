'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import {
  HelpCircle,
  CalendarCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  MessageCircle
} from 'lucide-react';

/**
 * 5 Iconic Medical Pill FAQs inspired by doctor-license.com
 * Features:
 * - 5 authentic pill shapes (Cyan capsule, Gold circle, Green narrow, Magenta capsule, Purple diamond)
 * - Realistic contact shadow
 * - Top & bottom split animation on hover/active
 * - Floating handwritten questions in 'Journal' script font
 * - Curved dotted SVG arrows with directional arrowheads
 * - Interactive answer showcase with matching accent color, rich explanations, and clinical takeaways
 * - Mobile responsive pill selector + full accordion toggle
 */
export const DOCTOR_LICENSE_FAQS = [
  {
    id: 'appointment',
    pillIndex: 0,
    width: 55,
    height: 100,
    left: 0,
    bgOffset: -123,
    color: '#00aeef', // Cyan
    colorName: 'Cyan',
    themeBg: 'bg-sky-50/70',
    themeBorder: 'border-sky-300',
    themeText: 'text-[#00aeef]',
    themeBadge: 'bg-sky-100 text-sky-800 border-sky-300',
    themeRing: 'ring-sky-400',
    category: 'Appointment Policy',
    scriptQuestion: {
      en: 'Do I need prior appointment?',
      hi: 'क्या पहले से अपॉइंटमेंट चाहिए?'
    },
    fullQuestion: {
      en: 'Do I need an appointment before visiting Nirvaya Eyecare Centre?',
      hi: 'क्या निर्वाया आईकेयर सेंटर में आने से पहले अपॉइंटमेंट लेना जरूरी है?'
    },
    boldKeyword: {
      en: 'prior appointment',
      hi: 'पहले से अपॉइंटमेंट'
    },
    subtitle: {
      en: 'Great clinical care requires planned, unhurried consultation time',
      hi: 'उत्तम नैदानिक एवं परामर्श मूल्यांकन के लिए पर्याप्त समय आवश्यक है'
    },
    answer: {
      en: 'Prior slot pre-booking is strongly recommended to minimize waiting times and ensure Dr. Sandhya Gaur can give you dedicated, unhurried clinical time. However, sudden ocular emergencies (such as sudden loss of vision, acute eye trauma, severe sudden pain, or fresh retinal detachment symptoms) are attended to promptly with priority emergency triage.',
      hi: 'अनावश्यक प्रतीक्षा समय से बचने तथा विस्तृत जांच एवं परामर्श हेतु पहले से स्लॉट बुक करना अत्यधिक उचित है। तथापि, दृष्टि में अचानक गिरावट या किसी भी नेत्र आघात (इमरजेंसी) पर तुरंत प्राथमिकता के साथ देखा जाता है।'
    },
    takeaways: [
      'Dedicated 20-30 min unhurried consultation with senior retina & cataract specialist',
      'Pre-booked time slots eliminate tedious waiting room delays',
      'Immediate walk-in priority triage for acute eye trauma and sudden vision loss'
    ],
    ctaText: 'Pre-Book Appointment Slot',
    ctaLink: '/pre-book',
    labelPos: { left: '32px', top: '135px' },
    arrowPath: 'M 295 178 C 265 170, 240 160, 218 152',
    arrowHead: '218,152 228,147 226,155'
  },
  {
    id: 'retina-checkup',
    pillIndex: 1,
    width: 100,
    height: 100,
    left: 67,
    bgOffset: 0,
    color: '#f8a800', // Amber Gold
    colorName: 'Amber',
    themeBg: 'bg-amber-50/70',
    themeBorder: 'border-amber-300',
    themeText: 'text-[#f8a800]',
    themeBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    themeRing: 'ring-amber-400',
    category: 'Retina Diagnostics',
    scriptQuestion: {
      en: 'How long does retina check take?',
      hi: 'रेटिना जांच में कितना समय लगता है?'
    },
    fullQuestion: {
      en: 'How long does a comprehensive dilated retina evaluation take?',
      hi: 'विस्तृत डायलेटेड रेटिना जांच में कुल कितना समय लगता है?'
    },
    boldKeyword: {
      en: 'retina checkup',
      hi: 'रेटिना जांच'
    },
    subtitle: {
      en: 'Dilated fundus examinations require medical precision & patience',
      hi: 'पुतली फैलाने व माइक्रोन-स्तरीय स्कैनिंग में थोड़ा समय लगता है'
    },
    answer: {
      en: 'A comprehensive retinal evaluation requires pupil dilation using specialized eye drops, taking approximately 30 to 45 minutes to achieve maximum dilation. Subsequent High-Definition Spectral OCT micrometer scanning, indirect ophthalmoscopy, and doctor counselling take an additional 20 to 30 minutes. Vision remains temporarily blurred for 2 to 4 hours post-dilation, so we strongly advise bringing a companion to drive you home.',
      hi: 'रेटिना की सूक्ष्म जांच के लिए पुतली फैलाना जरूरी होता है, जिसमें दवा डालने के बाद 30 से 45 मिनट का समय लगता है। इसके उपरांत ओसीटी व विशेषज्ञ परामर्श में 20 से 30 मिनट लगते हैं। जांच के बाद कुछ समय दृष्टि धुंधली रह सकती है, अतः किसी सहयोगी के साथ आना उचित है।'
    },
    takeaways: [
      'Total clinic visit takes approximately 60 to 75 minutes',
      'Includes sub-micron High-Definition Spectral OCT imaging',
      'Bring sunglasses and an accompanying family member to assist with travel'
    ],
    ctaText: 'Explore Retina Diagnostic Tech',
    ctaLink: '/technology',
    labelPos: { left: '150px', top: '55px' },
    arrowPath: 'M 390 162 C 372 135, 350 110, 328 88',
    arrowHead: '328,88 338,91 332,98'
  },
  {
    id: 'cataract-daycare',
    pillIndex: 2,
    width: 40,
    height: 100,
    left: 179,
    bgOffset: -231,
    color: '#7abb41', // Fresh Green
    colorName: 'Green',
    themeBg: 'bg-emerald-50/70',
    themeBorder: 'border-emerald-300',
    themeText: 'text-[#7abb41]',
    themeBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    themeRing: 'ring-emerald-400',
    category: 'Cataract Day-Care',
    scriptQuestion: {
      en: 'Is cataract surgery same-day?',
      hi: 'क्या मोतियाबिंद सर्जरी डे-केयर है?'
    },
    fullQuestion: {
      en: 'Is cataract surgery performed on a same-day (day-care) basis?',
      hi: 'क्या मोतियाबिंद सर्जरी उसी दिन घर लौटने के आधार पर की जाती है?'
    },
    boldKeyword: {
      en: 'same-day basis',
      hi: 'डे-केयर सर्जरी'
    },
    subtitle: {
      en: 'Stitchless micro-incision phacoemulsification day-care recovery',
      hi: 'बिना टांके, बिना पट्टी व बिना इंजेक्शन 15 मिनट में सुरक्षित सर्जरी'
    },
    answer: {
      en: 'Yes! Modern micro-incision phacoemulsification cataract surgery takes only 10 to 15 minutes in our HEPA-filtered Modular OT. You arrive 1 hour prior to surgery for preparation and painless topical numbing (no injections around the eye). You rest comfortably in our day-care recovery suite and return home within 1 to 2 hours post-procedure with crystal-clear vision and no hospital overnight stay.',
      hi: 'जी हाँ! आधुनिक माइक्रो-चीरा फेको सर्जरी में केवल 10 से 15 मिनट का समय लगता है। बिना किसी इंजेक्शन के केवल ड्रॉप्स डालकर आंख सुन्न की जाती है। सर्जरी के 1-2 घंटे बाद मरीज आराम से घर जा सकते हैं तथा अस्पताल में भर्ती रहने की कोई आवश्यकता नहीं होती।'
    },
    takeaways: [
      '10-15 minute stitchless micro-coaxial phacoemulsification',
      '100% injection-free topical anesthesia drops (zero eye block pain)',
      'Same-day discharge within 2 hours; crystal-clear next morning vision'
    ],
    ctaText: 'View Cataract Surgical Services',
    ctaLink: '/services',
    labelPos: { left: '360px', top: '22px' },
    arrowPath: 'M 485 160 C 480 128, 477 98, 472 62',
    arrowHead: '472,62 478,71 469,72'
  },
  {
    id: 'eye-injections',
    pillIndex: 3,
    width: 45,
    height: 100,
    left: 231,
    bgOffset: -328,
    color: '#d00889', // Magenta Pink
    colorName: 'Pink',
    themeBg: 'bg-pink-50/70',
    themeBorder: 'border-pink-300',
    themeText: 'text-[#d00889]',
    themeBadge: 'bg-pink-100 text-pink-900 border-pink-300',
    themeRing: 'ring-pink-400',
    category: 'Retina Injections',
    scriptQuestion: {
      en: 'Are eye injections painful?',
      hi: 'क्या आंख के इंजेक्शन में दर्द होता है?'
    },
    fullQuestion: {
      en: 'What is an Intravitreal Injection and is the procedure painful?',
      hi: 'इंट्राविट्रियल (Anti-VEGF) इंजेक्शन क्या है और क्या यह दर्दनाक होता है?'
    },
    boldKeyword: {
      en: 'painful',
      hi: 'दर्द मुक्त प्रक्रिया'
    },
    subtitle: {
      en: 'Topical anaesthetic drops ensure a comfortable, painless experience',
      hi: 'एनेस्थेटिक ड्रॉप्स की सहायता से प्रक्रिया पूर्णतः दर्द रहित होती है'
    },
    answer: {
      en: 'Intravitreal injections deliver targeted anti-VEGF medication directly into the vitreous to treat diabetic macular edema, retinal vein occlusion, and age-related macular degeneration (AMD). Before the procedure, the eye surface is thoroughly numbed using specialized topical anesthetic drops. Patients feel only a momentary, mild sensation of gentle pressure, but no sharp needle pain. The entire injection takes less than 2 minutes in our sterile OT.',
      hi: 'इंट्राविट्रियल इंजेक्शन रेटिना की सूजन और असामान्य रक्त वाहिकाओं के उपचार के लिए दिया जाता है। प्रक्रिया से पूर्व आंख में एनेस्थेटिक ड्रॉप्स डालकर सुन्न किया जाता है, जिससे सुई का कोई दर्द नहीं होता। केवल हल्का सा दबाव महसूस हो सकता है। यह प्रक्रिया ओटी में 2 मिनट से भी कम समय में पूरी हो जाती है।'
    },
    takeaways: [
      'Micro-targeted anti-VEGF therapy for diabetic edema & retinal vein block',
      'Topical numbing drops eliminate needle pain completely',
      'Completed in under 2 minutes in cleanroom surgical conditions'
    ],
    ctaText: 'Consult Retina Specialist',
    ctaLink: '/pre-book',
    labelPos: { left: '565px', top: '55px' },
    arrowPath: 'M 545 162 C 562 135, 582 110, 602 88',
    arrowHead: '602,88 598,98 592,91'
  },
  {
    id: 'documents-checklist',
    pillIndex: 4,
    width: 100,
    height: 100,
    left: 288,
    bgOffset: -400,
    color: '#382ea0', // Royal Purple
    colorName: 'Purple',
    themeBg: 'bg-purple-50/70',
    themeBorder: 'border-purple-300',
    themeText: 'text-[#382ea0]',
    themeBadge: 'bg-purple-100 text-purple-900 border-purple-300',
    themeRing: 'ring-purple-400',
    category: 'Patient Checklist',
    scriptQuestion: {
      en: 'What documents should I bring?',
      hi: 'परामर्श हेतु कौन से दस्तावेज लाएं?'
    },
    fullQuestion: {
      en: 'What clinical documents and medical records should I bring?',
      hi: 'आंखों के परामर्श के लिए आते समय कौन से दस्तावेज व पुराने रिकॉर्ड साथ लाएं?'
    },
    boldKeyword: {
      en: 'documents & records',
      hi: 'दस्तावेज व रिकॉर्ड्स'
    },
    subtitle: {
      en: 'Complete past records ensure the most precise clinical diagnosis',
      hi: 'पूर्व रिकॉर्ड से बीमारी का सही इतिहास जानने में मदद मिलती है'
    },
    answer: {
      en: 'Please bring all previous eye prescription glasses, prior ophthalmology case files, and any past retinal scans (OCT, FFA, B-Scan ultrasound) if available. Also bring medical summaries of systemic conditions—particularly diabetes blood sugar records (HbA1c), blood pressure readings, and any ongoing medications (such as blood thinners or cardiac drugs). This helps Dr. Gaur safely tailor your personalized clinical plan.',
      hi: 'कृपया अपने पुराने चश्मे, पिछली जांच पर्चियां, पहले हुए नेत्र परीक्षण या लेजर के कागजात अवश्य लाएं। यदि आप मधुमेह (डायबिटीज) या उच्च रक्तचाप के मरीज हैं, तो हालिया ब्लड शुगर (HbA1c) रिपोर्ट व चल रही दवाओं की सूची अवश्य साथ रखें।'
    },
    takeaways: [
      'Previous eyeglasses & contact lens prescriptions',
      'Prior ophthalmology reports, retinal scans & discharge summaries',
      'Recent blood sugar (HbA1c) log and ongoing systemic medications'
    ],
    ctaText: 'About Clinic Protocols',
    ctaLink: '/about',
    labelPos: { left: '690px', top: '135px' },
    arrowPath: 'M 645 178 C 665 170, 685 160, 706 152',
    arrowHead: '706,152 698,155 696,147'
  }
];

export default function FAQSection({ currentLang = 'en' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [viewMode, setViewMode] = useState('pills'); // 'pills' | 'all'

  const lang = currentLang === 'hi' ? 'hi' : 'en';
  const activeFaq = DOCTOR_LICENSE_FAQS[activeIndex] || DOCTOR_LICENSE_FAQS[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % DOCTOR_LICENSE_FAQS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + DOCTOR_LICENSE_FAQS.length) % DOCTOR_LICENSE_FAQS.length);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#FAFBFC] border-t border-slate-200/80 scroll-mt-24 overflow-hidden">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="reveal-up">
            <SectionHeading
              align="center"
              eyebrow={lang === 'hi' ? 'मरीजों के सामान्य प्रश्न' : 'Interactive Clinical Guidance'}
              title={lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
              description={
                lang === 'hi'
                  ? 'अपॉइंटमेंट प्रक्रिया, पुतली फैलाने का समय, मोतियाबिंद डे-केयर सर्जरी और निर्वाया आईकेयर सेंटर में आपकी यात्रा से संबंधित स्पष्ट जानकारी।'
                  : 'Clear clinical answers about appointment procedures, pupil dilation, surgical timelines and what to expect during your visit to Nirvaya Eyecare Centre.'
              }
            />
          </div>

          {/* Interactive Mode Switcher */}
          <div className="mt-8 mb-6 flex items-center justify-center gap-3">
            <div className="inline-flex p-1 bg-slate-200/70 rounded-full border border-slate-300/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('pills')}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  viewMode === 'pills'
                    ? 'bg-white text-[#0A1E3F] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>💊</span>
                <span>{lang === 'hi' ? 'इंटरैक्टिव पिल एक्सप्लोरर' : 'Interactive Pill Explorer'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-white text-[#0A1E3F] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📋</span>
                <span>{lang === 'hi' ? 'सभी 5 प्रश्न देखें' : 'View All 5 Questions'}</span>
              </button>
            </div>
          </div>

          {viewMode === 'pills' ? (
            <div className="space-y-8">
              {/* Doctor License Signature Pill Stage */}
              <div className="reveal-up rounded-3xl bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-xs relative overflow-hidden">
                {/* Subtle Radial Vignette Lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.9)_0%,rgba(241,245,249,0.4)_70%,rgba(226,232,240,0.6)_100%)] pointer-events-none" />

                {/* Helper prompt banner */}
                <div className="relative z-10 text-center mb-2">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-600 shadow-2xs backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>
                      {lang === 'hi'
                        ? 'किसी भी दवा की गोली (पिल) पर क्लिक करें और प्रश्न का उत्तर देखें'
                        : 'Hover or click any medicine pill or question to explore clinical answers'}
                    </span>
                  </span>
                </div>

                {/* Desktop 960px Panoramic Pill Canvas */}
                <div className="hidden lg:block relative w-full max-w-[960px] h-[330px] mx-auto select-none">
                  {/* SVG Curved Dotted Arrows Overlay */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    viewBox="0 0 960 330"
                    fill="none"
                  >
                    {DOCTOR_LICENSE_FAQS.map((item, idx) => {
                      const isTargeted = activeIndex === idx || hoveredIndex === idx;
                      return (
                        <g key={item.id} className="transition-all duration-300">
                          <path
                            d={item.arrowPath}
                            stroke={isTargeted ? item.color : '#94a3b8'}
                            strokeWidth={isTargeted ? '2' : '1.3'}
                            strokeDasharray="3 4"
                            strokeLinecap="round"
                            opacity={isTargeted ? 1 : 0.45}
                            className="transition-all duration-300"
                          />
                          <polygon
                            points={item.arrowHead}
                            fill={isTargeted ? item.color : '#94a3b8'}
                            opacity={isTargeted ? 1 : 0.45}
                            className="transition-all duration-300"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* 5 Floating Handwritten Questions in 'Journal' Script Font */}
                  {DOCTOR_LICENSE_FAQS.map((item, idx) => {
                    const isTargeted = activeIndex === idx || hoveredIndex === idx;
                    return (
                      <button
                        key={`label-${item.id}`}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                          left: item.labelPos.left,
                          top: item.labelPos.top,
                          color: isTargeted ? '#0A1E3F' : '#64748B'
                        }}
                        className={`absolute z-20 font-journal text-[28px] xl:text-[33px] tracking-tight leading-tight text-left cursor-pointer transition-all duration-300 origin-center ${
                          isTargeted
                            ? 'opacity-100 font-bold scale-105'
                            : 'opacity-35 hover:opacity-90'
                        }`}
                        title={item.fullQuestion[lang]}
                      >
                        <span className="relative inline-block">
                          {item.scriptQuestion[lang]}
                          {isTargeted && (
                            <span
                              className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full transition-all duration-300"
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}

                  {/* 5 Medicine Pills Row Centered Over Contact Shadow */}
                  <div
                    className="absolute z-20"
                    style={{
                      left: 'calc(50% - 194px)',
                      top: '160px',
                      width: '388px',
                      height: '100px'
                    }}
                  >
                    {/* Realistic Contact Shadow Underneath Pills */}
                    <div
                      className="absolute pointer-events-none z-1"
                      style={{
                        left: '-11px',
                        top: '78px',
                        width: '410px',
                        height: '63px',
                        backgroundImage: "url('/images/faq/pills_shadow.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        opacity: 0.95
                      }}
                    />

                    {/* 5 Medicine Pills */}
                    {DOCTOR_LICENSE_FAQS.map((item, idx) => {
                      const isTargeted = activeIndex === idx || hoveredIndex === idx;
                      return (
                        <div
                          key={`pill-${item.id}`}
                          onClick={() => setActiveIndex(idx)}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          style={{
                            left: `${item.left}px`,
                            width: `${item.width}px`,
                            height: '100px'
                          }}
                          className="absolute top-0 cursor-pointer z-10 group"
                          aria-label={item.fullQuestion[lang]}
                        >
                          {/* Top Pill Half */}
                          <span
                            style={{
                              width: `${item.width}px`,
                              height: '50px',
                              backgroundImage: "url('/images/faq/pills.png')",
                              backgroundPosition: `${item.bgOffset}px 0px`,
                              backgroundRepeat: 'no-repeat',
                              transform: isTargeted ? 'translateY(-9px)' : 'translateY(0px)'
                            }}
                            className="block absolute top-0 left-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-xs"
                          />

                          {/* Bottom Pill Half */}
                          <span
                            style={{
                              width: `${item.width}px`,
                              height: '50px',
                              backgroundImage: "url('/images/faq/pills.png')",
                              backgroundPosition: `${item.bgOffset}px -50px`,
                              backgroundRepeat: 'no-repeat',
                              transform: isTargeted ? 'translateY(9px)' : 'translateY(0px)'
                            }}
                            className="block absolute top-[50px] left-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-xs"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tablet & Mobile Friendly Pill Selector */}
                <div className="lg:hidden relative z-10 py-4">
                  <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
                    {DOCTOR_LICENSE_FAQS.map((item, idx) => {
                      const isSelected = activeIndex === idx;
                      return (
                        <button
                          key={`mobile-pill-${item.id}`}
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-white border-slate-300 shadow-md scale-105'
                              : 'bg-white/60 border-slate-200 hover:bg-white text-slate-500'
                          }`}
                        >
                          <div
                            className="relative"
                            style={{
                              width: `${item.width * 0.65}px`,
                              height: '65px'
                            }}
                          >
                            <span
                              style={{
                                width: `${item.width * 0.65}px`,
                                height: '32px',
                                backgroundImage: "url('/images/faq/pills.png')",
                                backgroundPosition: `${item.bgOffset * 0.65}px 0px`,
                                backgroundSize: '325px 65px',
                                backgroundRepeat: 'no-repeat',
                                transform: isSelected ? 'translateY(-4px)' : 'translateY(0px)'
                              }}
                              className="block absolute top-0 left-0 transition-transform duration-200"
                            />
                            <span
                              style={{
                                width: `${item.width * 0.65}px`,
                                height: '32px',
                                backgroundImage: "url('/images/faq/pills.png')",
                                backgroundPosition: `${item.bgOffset * 0.65}px -32px`,
                                backgroundSize: '325px 65px',
                                backgroundRepeat: 'no-repeat',
                                transform: isSelected ? 'translateY(4px)' : 'translateY(0px)'
                              }}
                              className="block absolute top-[32px] left-0 transition-transform duration-200"
                            />
                          </div>
                          <span
                            className={`text-xs font-bold font-sans ${
                              isSelected ? 'text-[#0A1E3F]' : 'text-slate-500'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-center mt-2 px-2">
                    <p className="font-journal text-2xl text-[#0A1E3F] font-bold">
                      &ldquo;{activeFaq.scriptQuestion[lang]}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Pill Navigator Strip Controls */}
                <div className="relative z-10 mt-2 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 px-2 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: activeFaq.color }}
                    />
                    <span className="font-bold text-[#0A1E3F]">
                      {activeFaq.category}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span>
                      {lang === 'hi'
                        ? `प्रश्न ${activeIndex + 1} / 5`
                        : `Question ${activeIndex + 1} of 5`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer shadow-2xs"
                      aria-label="Previous question"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer shadow-2xs"
                      aria-label="Next question"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Answer Card */}
              <div
                key={activeFaq.id}
                className={`reveal-up rounded-3xl border bg-white shadow-sm overflow-hidden transition-all duration-300 ${activeFaq.themeBorder}`}
              >
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: activeFaq.color }}
                />

                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: activeFaq.color }}
                      />
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
                        style={{
                          color: activeFaq.color,
                          borderColor: `${activeFaq.color}40`,
                          backgroundColor: `${activeFaq.color}10`
                        }}
                      >
                        {activeFaq.category}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      Pill #{activeFaq.pillIndex + 1} • {activeFaq.colorName}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0A1E3F] leading-snug">
                    {activeFaq.fullQuestion[lang]}
                  </h3>

                  <div className="mt-2 mb-6">
                    <p className="font-journal text-2xl sm:text-3xl lg:text-[32px] text-slate-700 tracking-wide">
                      &ldquo;{activeFaq.subtitle[lang]}&rdquo;
                    </p>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-slate-700 text-sm sm:text-base leading-relaxed">
                    <p>{activeFaq.answer[lang]}</p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1E3F] mb-3">
                      {lang === 'hi' ? 'मुख्य बिंदु (Key Takeaways):' : 'Key Clinical Points:'}
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {activeFaq.takeaways.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs text-xs sm:text-sm text-slate-700"
                        >
                          <CheckCircle2
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: activeFaq.color }}
                          />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={activeFaq.ctaLink}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition hover:opacity-90"
                        style={{ backgroundColor: activeFaq.color }}
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>{activeFaq.ctaText}</span>
                      </Link>

                      <a
                        href="https://wa.me/917554928200"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'hi' ? 'व्हाट्सएप पूछताछ' : 'WhatsApp Query'}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                      <span>
                        {lang === 'hi' ? 'अगला प्रश्न देखें:' : 'Explore next:'}
                      </span>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'पिछला' : 'Prev'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{lang === 'hi' ? 'अगला' : 'Next'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Classic Accordion View Mode */
            <div className="reveal-up space-y-4">
              {DOCTOR_LICENSE_FAQS.map((faq, index) => {
                const isOpen = activeIndex === index;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                      isOpen
                        ? `${faq.themeBorder} shadow-sm ring-1 ${faq.themeRing}`
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(isOpen ? -1 : index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-2xs"
                          style={{ backgroundColor: faq.color }}
                        >
                          #{index + 1}
                        </span>
                        <div>
                          <span className="font-bold text-sm sm:text-base text-[#0A1E3F] block">
                            {faq.fullQuestion[lang]}
                          </span>
                          <span className="font-journal text-xl text-slate-500 block -mt-0.5">
                            &ldquo;{faq.scriptQuestion[lang]}&rdquo;
                          </span>
                        </div>
                      </div>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen
                            ? 'text-white rotate-180 shadow-xs'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                        style={{
                          backgroundColor: isOpen ? faq.color : undefined
                        }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                        <p className="mb-4">{faq.answer[lang]}</p>
                        <div className="grid sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                          {faq.takeaways.map((point, pIdx) => (
                            <div
                              key={pIdx}
                              className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60"
                            >
                              <CheckCircle2
                                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                style={{ color: faq.color }}
                              />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Unanswered Questions Callout Banner */}
          <div className="reveal-up mt-12 p-6 rounded-3xl bg-sky-50/80 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-5 text-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-600/10 text-sky-800 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 text-sky-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#0A1E3F]">
                  {lang === 'hi'
                    ? 'क्या आपका कोई ऐसा प्रश्न है जिसका उत्तर यहां नहीं है?'
                    : 'Have a clinical question not addressed above?'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  {lang === 'hi'
                    ? 'हमारे क्लिनिक समन्वयक से +91 755 492 8200 पर बात करें या व्हाट्सएप पर अपना प्रश्न भेजें।'
                    : 'Speak directly with our clinic coordinator or send an inquiry on WhatsApp for prompt guidance.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="tel:+917554928200"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[#0A1E3F] font-bold text-xs sm:text-sm shadow-2xs hover:bg-slate-50 transition"
              >
                <PhoneCall className="w-4 h-4 text-[#00aeef]" />
                <span>+91 755 492 8200</span>
              </a>
              <a
                href="https://wa.me/917554928200"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

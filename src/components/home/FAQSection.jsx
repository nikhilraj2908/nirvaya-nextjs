'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    <section id="faq" className="py-16 lg:py-24 bg-[#FAFBFC] border-t border-slate-200/80 scroll-mt-24">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="reveal-up text-center mb-10 sm:mb-14">
            <SectionHeading
              align="center"
              eyebrow={lang === 'hi' ? 'मरीजों के सामान्य प्रश्न' : 'Clinical Guidance & Patient FAQ'}
              title={lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
              description={
                lang === 'hi'
                  ? 'अपॉइंटमेंट प्रक्रिया, पुतली फैलाने का समय, मोतियाबिंद डे-केयर सर्जरी और निर्वाया आईकेयर सेंटर में आपकी यात्रा से संबंधित स्पष्ट जानकारी।'
                  : 'Clear, transparent answers about appointments, retina imaging, painless cataract surgery, and what to expect during your clinic visit.'
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
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-[#DFBF64] text-[#0A1E3F] font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all group"
            >
              <span>Explore All Questions on Dedicated FAQ Page</span>
              <ArrowRight className="w-4 h-4 text-[#DFBF64] group-hover:translate-x-1 transition-transform" />
            </Link>
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
                    : 'Have a specific clinical question?'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {lang === 'hi'
                    ? 'हमारे क्लिनिक समन्वयक से +91 755 492 8200 पर बात करें या व्हाट्सएप पर पूछें।'
                    : 'Speak directly with our clinic coordinator or message us on WhatsApp for personal guidance.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <a
                href="tel:+917554928200"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0A1E3F] font-bold text-xs shadow-2xs hover:bg-slate-50 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#00aeef]" />
                <span>+91 755 492 8200</span>
              </a>
              <a
                href="https://wa.me/917554928200"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

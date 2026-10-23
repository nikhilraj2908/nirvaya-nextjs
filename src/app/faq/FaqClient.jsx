'use client';

import React, { useState, useMemo } from 'react';
import SafeLink from '@/components/common/SafeLink';
import Container from '@/components/common/Container';
import {
  Search,
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  CalendarCheck,
  ArrowRight,
  X,
  FileQuestion
} from 'lucide-react';
import { ALL_FAQS, FAQ_CATEGORIES } from '@/data/faqData';
import { CLINIC_INFO } from '@/data/siteData';

export default function FaqClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  // Filter FAQs based on active category & search query
  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((faq) => {
      const matchesCategory =
        activeCategory === 'all' || faq.category === activeCategory;

      if (!searchQuery.trim()) return matchesCategory;

      const query = searchQuery.toLowerCase();
      const matchesQuestion =
        faq.question.en.toLowerCase().includes(query) ||
        faq.question.hi?.toLowerCase().includes(query);
      const matchesAnswer =
        faq.answer.en.toLowerCase().includes(query) ||
        faq.answer.hi?.toLowerCase().includes(query);
      const matchesTag = faq.categoryLabel.toLowerCase().includes(query);

      return matchesCategory && (matchesQuestion || matchesAnswer || matchesTag);
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#061226] via-[#0A1E3F] to-[#0D244D] text-white pt-12 pb-16 lg:pt-16 lg:pb-20 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <SafeLink href="/" className="hover:text-white transition-colors">
              Home
            </SafeLink>
            <span>/</span>
            <span className="text-[#DFBF64] font-semibold">Patient FAQ</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40 mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Comprehensive Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 font-heading">
              Frequently Asked Questions
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Everything you need to know about your consultation, dilated retina checkups, micro-incision cataract day-care surgery, anti-VEGF injections, and insurance protocols under Dr. Sandhya Gaur.
            </p>

            {/* Live Search Bar */}
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., cataract, dilation, injection, insurance, pain)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/95 text-slate-900 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFBF64] shadow-lg transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Container className="pt-10 sm:pt-14">
        <div className="max-w-4xl mx-auto">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {FAQ_CATEGORIES.map((cat) => {
              const count =
                cat.id === 'all'
                  ? ALL_FAQS.length
                  : ALL_FAQS.filter((f) => f.category === cat.id).length;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(0);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0A1E3F] text-white shadow-sm ring-1 ring-[#0A1E3F]'
                      : 'bg-white text-slate-600 hover:text-[#0A1E3F] border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#DFBF64] text-[#0A1E3F]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Count when searching */}
          {searchQuery && (
            <div className="mb-4 text-xs text-slate-500 flex items-center justify-between">
              <span>
                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#C59B27] font-semibold hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Accordion List */}
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3.5">
              {filteredFaqs.map((faq, index) => {
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
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27] bg-[#C59B27]/10 px-2 py-0.5 rounded border border-[#C59B27]/20">
                              {faq.categoryLabel}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-sm sm:text-base text-[#0A1E3F] leading-snug">
                            {faq.question.en}
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
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-700 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-2 mb-3.5">
                          {faq.answer.en}
                        </p>

                        {faq.keyTakeaway && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium mb-4">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Key Takeaway:</strong> {faq.keyTakeaway}</span>
                          </div>
                        )}

                        {faq.ctaLink && faq.ctaText && (
                          <div className="pt-1">
                            <SafeLink
                              href={faq.ctaLink}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1E3F] hover:text-[#C59B27] transition-colors"
                            >
                              <span>{faq.ctaText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#C59B27]" />
                            </SafeLink>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-[#0A1E3F] mb-1">
                No questions matched your search
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Try different keywords or browse by category above.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#0A1E3F] text-white text-xs font-semibold"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Quick Pre-Book & Helpline Banner */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C59B27]">
                Personal Patient Support
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A1E3F]">
                Still Have Questions Regarding Your Eye Care?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Our front-desk clinical team is readily available to assist with appointment slots, second opinions, and procedure details.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <SafeLink
                href="/pre-book"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1E3F] hover:bg-[#16325C] text-white text-xs sm:text-sm font-bold shadow-xs transition"
              >
                <CalendarCheck className="w-4 h-4 text-[#DFBF64]" />
                <span>Pre-Book Slot</span>
              </SafeLink>
              <SafeLink
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1E3F] text-xs sm:text-sm font-bold border border-slate-200 transition"
              >
                <PhoneCall className="w-4 h-4 text-sky-600" />
                <span>Call Clinic</span>
              </SafeLink>
              <SafeLink
                href="https://wa.me/917554928200"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </SafeLink>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

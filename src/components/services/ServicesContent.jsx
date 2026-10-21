'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/common/Container';
import { SPECIALTIES, CLINIC_INFO } from '@/data/siteData';
import {
  Sparkles,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';

export default function ServicesContent() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = [
    'All',
    'Surgical Retina',
    'Medical Retina',
    'Anterior Segment',
    'Pediatric Retina'
  ];

  const filtered =
    selectedFilter === 'All'
      ? SPECIALTIES
      : SPECIALTIES.filter((s) =>
          s.category.toLowerCase().includes(selectedFilter.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="relative py-16 lg:py-24 bg-[#061226] text-white border-b border-slate-800">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-[#DFBF64] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#DFBF64]">Clinical Services & Specialties</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Clinical Portfolio</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Comprehensive Vitreo-Retinal & Advanced Cataract Care
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Specialized ophthalmic care guided strictly by evidence-based international protocols. Every surgical and laser procedure is performed by Dr Sandhya Gaur (MD AIIMS New Delhi).
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/pre-book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-book an Appointment</span>
              </Link>
              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] font-semibold text-sm border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-[#DFBF64]" />
                <span>{CLINIC_INFO.phone}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Directory */}
      <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0A1E3F]">
                Explore Clinical Sub-Specialties
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Filter by diagnostic and surgical focus area below.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === cat
                      ? 'bg-[#0A1E3F] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Specialty Cards */}
          <div className="space-y-8">
            {filtered.map((spec) => (
              <div
                key={spec.id}
                id={spec.id}
                className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Overview */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                        {spec.category}
                      </span>
                      <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                        {spec.badge}
                      </span>
                    </div>

                    <h3 className="font-heading text-2xl font-bold text-[#0A1E3F]">
                      {spec.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {spec.description}
                    </p>

                    {/* Symptoms */}
                    {spec.symptoms && spec.symptoms.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                          Common Warning Signs / Indications:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {spec.symptoms.map((symp, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>{symp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Diagnostic Approach & Booking Action */}
                  <div className="lg:col-span-5 bg-slate-50 rounded-xl p-6 border border-slate-200/80 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                      <Activity className="w-4 h-4 text-[#C59B27]" />
                      <span>Diagnostic & Clinical Protocols</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-700">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>High-resolution optical biometry / dilated fundus evaluation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Sutureless micro-incision technique for rapid same-day discharge</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Direct post-operative follow-up with operating surgeon</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
                      <Link
                        href={`/pre-book?specialty=${encodeURIComponent(spec.title)}`}
                        className="w-full py-2.5 px-4 rounded-lg bg-[#0A1E3F] hover:bg-[#16325C] text-white font-bold text-xs text-center transition-colors shadow-xs"
                      >
                        Pre-book Slot for {spec.title.split(' ')[0]}
                      </Link>

                      <a
                        href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
                          `Hello Nirvaya Eyecare, I would like to enquire about ${spec.title}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs text-center border border-slate-200 transition-colors"
                      >
                        Enquire on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

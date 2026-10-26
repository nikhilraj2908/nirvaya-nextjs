import React from 'react';
import SafeLink from '@/components/common/SafeLink';
import { SPECIALTIES } from '@/data/siteData';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import {
  ArrowRight,
  Calendar,
  Layers
} from 'lucide-react';
import en from '@/locales/en.json';

export default function SpecialtiesSection({ currentLang = 'en' }) {
  const flagshipSpecialties = SPECIALTIES.slice(0, 4);

  return (
    <section id="services" className="relative py-16 lg:py-24 bg-gradient-to-b from-[#EEF3F8] via-[#E5EDF6] to-[#EEF3F8] border-t border-slate-200/90 scroll-mt-24 overflow-hidden">
      {/* Background Pattern: Precision Clinical Blueprint Lattice Grid & Ambient Lighting */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-10 w-[450px] h-[450px] bg-[#DFBF64]/10 rounded-full blur-3xl pointer-events-none" />
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 850" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="spec-grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#0A1E3F" strokeWidth="0.75" strokeOpacity="0.05" />
              <circle cx="0" cy="0" r="1.1" fill="#0284c7" fillOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spec-grid)" />
          {/* Subtle curved dynamic boundary lines */}
          <path d="M0,450 C350,380 750,560 1150,420 C1300,370 1400,410 1440,390" stroke="#00aeef" strokeWidth="1" strokeOpacity="0.2" fill="none" />
          <path d="M0,480 C360,410 760,590 1160,450 C1310,400 1410,430 1440,415" stroke="#DFBF64" strokeWidth="0.8" strokeOpacity="0.18" strokeDasharray="6 8" fill="none" />
        </svg>
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeading
            align="left"
            eyebrow={en.specialties.eyebrow}
            title={en.specialties.title}
            description={en.specialties.description}
            className="mb-0! lg:mb-0 max-w-3xl"
          />
          <div className="shrink-0">
            <SafeLink
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#0A1E3F] bg-white hover:bg-slate-100 border border-slate-200 shadow-xs hover:shadow transition-all"
            >
              <span>{en.specialties.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C59B27]" />
            </SafeLink>
          </div>
        </div>

        {/* 4 Flagship Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flagshipSpecialties.map((spec) => (
            <div
              key={spec.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#DFBF64]/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between reveal-up"
            >
              {/* Clinical Image Header */}
              {spec.image && (
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={spec.image}
                    alt={spec.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061226]/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Floating Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#061226]/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15">
                      {spec.category}
                    </span>
                    <span className="text-[10px] font-semibold text-white bg-[#C59B27] px-2 py-0.5 rounded-full shadow-xs">
                      {spec.badge}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Badge fallback if no image */}
                  {!spec.image && (
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                        {spec.category}
                      </span>
                      <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        {spec.badge}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#0A1E3F] group-hover:text-[#C59B27] transition-colors mb-2">
                    {spec.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed mb-4 line-clamp-3">
                    {spec.shortDescription}
                  </p>
                </div>

                {/* Action Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <SafeLink
                    href={`/pre-book?specialty=${encodeURIComponent(spec.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1E3F] hover:text-[#C59B27] transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>{en.common.preBookSlot}</span>
                  </SafeLink>
                  <SafeLink
                    href="/services"
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {en.specialties.details}
                  </SafeLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance Strip */}
        <div className="mt-8 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DFBF64]/20 flex items-center justify-center shrink-0 text-[#8C6D1F]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#0A1E3F]">
                {en.specialties.reassuranceTitle}
              </p>
              <p className="text-xs text-slate-500">
                {en.specialties.reassuranceDesc}
              </p>
            </div>
          </div>
          <Button
            href="/services"
            to="/services"
            variant="outline"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            className="shrink-0 text-xs font-bold"
          >
            {en.specialties.directoryCTA}
          </Button>
        </div>
      </Container>
    </section>
  );
}

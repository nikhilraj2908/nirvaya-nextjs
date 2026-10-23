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

export default function SpecialtiesSection({ currentLang = 'en' }) {
  const flagshipSpecialties = SPECIALTIES.slice(0, 4);

  return (
    <section id="services" className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-24">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeading
            align="left"
            eyebrow="Clinical Excellence & Core Focus"
            title="Comprehensive Vitreo-Retinal & Advanced Cataract Care"
            description="Specialist-led diagnostic and surgical procedures guided by apex AIIMS protocols and performed with sutureless micro-incision precision."
            className="mb-0! lg:mb-0 max-w-3xl"
          />
          <div className="shrink-0">
            <SafeLink
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#0A1E3F] bg-white hover:bg-slate-100 border border-slate-200 shadow-xs hover:shadow transition-all"
            >
              <span>View All 8 Specialties</span>
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
                    <span>Pre-book Slot</span>
                  </SafeLink>
                  <SafeLink
                    href="/services"
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    Details →
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
                Looking for ROP screening, Uveitis care, or Optical diagnostics?
              </p>
              <p className="text-xs text-slate-500">
                Explore our full clinical directory with condition guidelines and treatment overviews.
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
            Explore Services Directory
          </Button>
        </div>
      </Container>
    </section>
  );
}

import React from 'react';
import SafeLink from '@/components/common/SafeLink';
import { ShieldCheck, Award, Building2, Calendar, ArrowRight, Microscope } from 'lucide-react';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';

import en from '@/locales/en.json';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 lg:py-24 bg-gradient-to-b from-[#FAFBFD] via-[#F3F7FC] to-[#FAFBFD] border-b border-slate-200/80 overflow-hidden">
      {/* Background Pattern: Optical Dotted Grid & Gentle Ambient Glows */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DFBF64]/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-sky-400/[0.08] rounded-full blur-3xl pointer-events-none" />
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <radialGradient id="about-dot-fade" cx="20%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <mask id="about-dot-mask">
              <rect width="100%" height="100%" fill="url(#about-dot-fade)" />
            </mask>
            <pattern id="about-dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.15" fill="#0A1E3F" fillOpacity="0.085" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-dot-grid)" mask="url(#about-dot-mask)" />
          {/* Subtle flowing contour ribbon */}
          <path d="M-100,200 C300,100 600,350 1000,180 C1250,80 1400,220 1540,160" stroke="#00aeef" strokeWidth="1" strokeOpacity="0.18" fill="none" />
          <path d="M-100,230 C320,130 620,380 1020,210 C1270,110 1420,250 1540,190" stroke="#DFBF64" strokeWidth="0.8" strokeOpacity="0.22" fill="none" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              align="left"
              eyebrow={en.about.eyebrow}
              title={en.about.title}
              className="mb-4!"
            />

            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>{en.about.lead}</p>
              <p>
                At <strong className="text-[#0A1E3F]">{en.clinic.name}</strong>, every patient evaluation, dilated fundus scan, and surgical planning is overseen directly by senior Vitreo-Retinal specialist{' '}
                <strong className="text-[#0A1E3F]">{en.clinic.medicalDirector} ({en.clinic.qualifications})</strong> with zero assembly-line rushing.
              </p>
            </div>

            {/* Concise Highlight Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 reveal-up">
              <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1E3F]">{en.about.badges.aiims.title}</h4>
                  <p className="text-[11px] text-slate-500">{en.about.badges.aiims.desc}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1E3F]">{en.about.badges.ethical.title}</h4>
                  <p className="text-[11px] text-slate-500">{en.about.badges.ethical.desc}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center shrink-0">
                  <Microscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1E3F]">{en.about.badges.microIncision.title}</h4>
                  <p className="text-[11px] text-slate-500">{en.about.badges.microIncision.desc}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5 reveal-up">
              <Button
                href="/about"
                to="/about"
                variant="gold"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
              >
                {en.about.cta}
              </Button>
              <Button
                href="/pre-book"
                to="/pre-book"
                variant="outline"
                size="md"
                icon={Calendar}
              >
                {en.about.ctaSecondary}
              </Button>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 reveal-up">
            <div className="relative rounded-2xl bg-[#0A1E3F] text-white p-7 sm:p-8 shadow-xl overflow-hidden border border-slate-700">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-[#DFBF64]/10 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{en.about.card.badge}</span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {en.about.card.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {en.about.card.description}
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-700/80 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{en.about.card.clinicalDirectorLabel}</span>
                    <strong className="text-white">{en.clinic.medicalDirector}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{en.about.card.surgicalFocusLabel}</span>
                    <strong className="text-[#DFBF64]">{en.about.card.surgicalFocusValue}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{en.about.card.infectionControlLabel}</span>
                    <strong className="text-white">{en.about.card.infectionControlValue}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <SafeLink
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#DFBF64] hover:text-white transition-colors"
                  >
                    <span>{en.about.card.storyLink}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </SafeLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

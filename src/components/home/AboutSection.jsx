import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Building2, Calendar, ArrowRight, Microscope } from 'lucide-react';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              align="left"
              eyebrow="Clinical Vision & Specialist Leadership"
              title="A Specialist-Led Vision for Eye Care in Central India"
              subtitle="Delivering meticulous, evidence-grounded retina and cataract microsurgery with unhurried clinical listening."
              className="mb-4!"
            />

            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                Retinal disorders and delicate micro-incision cataract procedures require specialized surgical skill, high-resolution diagnostic imaging, and absolute clinical integrity.
              </p>
              <p>
                At <strong className="text-[#0A1E3F]">Nirvaya Eyecare Centre</strong>, every patient evaluation, dilated fundus scan, and surgical planning is overseen directly by senior Vitreo-Retinal specialist{' '}
                <strong className="text-[#0A1E3F]">Dr Sandhya Gaur (MD AIIMS New Delhi, FVRS, FAICO Gold Medalist)</strong> with zero assembly-line rushing.
              </p>
            </div>

            {/* Concise Highlight Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 reveal-up">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1E3F]">AIIMS Rigour</h4>
                  <p className="text-[11px] text-slate-500">Apex Institute Trained</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1E3F]">Ethical Care</h4>
                  <p className="text-[11px] text-slate-500">Zero forced procedures</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center shrink-0">
                  <Microscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1E3F]">Micro-Incision</h4>
                  <p className="text-[11px] text-slate-500">25G/27G Vitrectomy</p>
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
                Learn More About Nirvaya
              </Button>
              <Button
                href="/pre-book"
                to="/pre-book"
                variant="primary"
                size="md"
                icon={Calendar}
              >
                Pre-book Slot
              </Button>
              <Link
                href="/doctors"
                className="text-xs font-bold text-[#0A1E3F] hover:text-[#C59B27] underline decoration-slate-300 underline-offset-4 ml-1"
              >
                Meet Dr Sandhya Gaur →
              </Link>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 reveal-up">
            <div className="relative rounded-2xl bg-[#0A1E3F] text-white p-7 sm:p-8 shadow-xl overflow-hidden border border-slate-700">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-[#DFBF64]/10 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Day-Care Surgical Excellence</span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Modern Outpatient & Surgical Centre
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Located along Ayodhya Bypass Road, Bhopal, custom-designed for rapid same-day recovery without stressful overnight stays.
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-700/80 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Clinical Director:</span>
                    <strong className="text-white">Dr Sandhya Gaur</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Surgical Focus:</span>
                    <strong className="text-[#DFBF64]">Retina & Phaco Cataract</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Infection Control:</span>
                    <strong className="text-white">Class 100 HEPA Clean Air OT</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#DFBF64] hover:text-white transition-colors"
                  >
                    <span>Read Full Centre Story & Institutional Pillars</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

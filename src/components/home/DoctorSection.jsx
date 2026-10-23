'use client';

import React, { useState, useEffect, useRef } from 'react';
import SafeLink from '@/components/common/SafeLink';
import { DOCTOR_PROFILE } from '@/data/siteData';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import {
  Award,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function DoctorSection() {
  const metricsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [papersCount, setPapersCount] = useState(0);
  const [surgeriesCount, setSurgeriesCount] = useState(0);

  // Count-up animation triggered when user scrolls into view of this section
  useEffect(() => {
    const node = metricsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1800; // 1.8 seconds duration
          const startTime = performance.now();

          // Smooth cubic ease-out
          const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = easeOutCubic(progress);

            // 1. Papers: 0 to 18 increments (0, 1, 2, ..., 18)
            const currentPapers = Math.min(18, Math.round(eased * 18));
            setPapersCount(currentPapers);

            // 2. Surgeries: 0 to 10,000 increments with differences of 100 (0, 100, 200, ..., 10000)
            const rawSurgeries = eased * 10000;
            const currentSurgeries = Math.min(10000, Math.floor(rawSurgeries / 100) * 100);
            setSurgeriesCount(currentSurgeries);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setPapersCount(18);
              setSurgeriesCount(10000);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  return (
    <section id="doctor" className="py-16 lg:py-24 bg-white border-t border-slate-200/80 scroll-mt-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Doctor Profile Card */}
          <div className="lg:col-span-5 reveal-up">
            <div className="rounded-3xl bg-gradient-to-b from-[#0A1E3F] to-[#122B55] text-white p-7 sm:p-8 shadow-xl border border-slate-700/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#DFBF64]/10 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Doctor Visual Avatar with AIIMS Badge */}
                <div className="relative mb-5">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-tr from-[#C59B27] to-[#DFBF64] p-1 shadow-lg">
                    <div className="w-full h-full rounded-xl bg-[#0A1E3F] flex items-center justify-center text-white overflow-hidden">
                      <span className="font-heading font-black text-3xl sm:text-4xl text-[#DFBF64]">
                        SG
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#C59B27] text-white shadow-md">
                      <Award className="w-3 h-3" />
                      AIIMS Trained
                    </span>
                  </div>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {DOCTOR_PROFILE.name}
                </h3>
                <p className="text-xs font-semibold text-[#DFBF64] mt-1">
                  {DOCTOR_PROFILE.title}
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {DOCTOR_PROFILE.degrees}
                </p>

                {/* Registration & OPD Badges */}
                <div className="w-full my-4 pt-3 border-t border-slate-700/80 grid grid-cols-2 gap-2 text-left">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px]">
                    <span className="text-slate-400 block text-[10px]">Experience:</span>
                    <strong className="text-white">10+ Years Dedicated</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px]">
                    <span className="text-slate-400 block text-[10px]">OPD Hours:</span>
                    <strong className="text-emerald-400">9:30 AM - 7:30 PM</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-2">
                  <Button
                    href="/pre-book"
                    to="/pre-book"
                    variant="gold"
                    size="md"
                    icon={Calendar}
                    className="w-full justify-center font-bold text-xs sm:text-sm shadow-md"
                  >
                    Pre-book Consultation Slot
                  </Button>
                  <Button
                    href="/doctors"
                    to="/doctors"
                    variant="outline"
                    size="sm"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full justify-center text-white border-white/25 hover:bg-white/10 text-xs"
                  >
                    View Academic Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Credentials & Surgical Philosophy */}
          <div className="lg:col-span-7 space-y-6 reveal-up">
            <SectionHeading
              align="left"
              eyebrow="Medical Leadership & Surgical Mastery"
              title="Expertise Shaped at India's Apex Institute"
              subtitle="Bringing world-standard surgical vitreo-retinal precision and uncompromised ethical patient care to Bhopal."
              className="mb-0!"
            />

            <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                <strong className="font-bold text-[#0A1E3F]">Dr Sandhya Gaur</strong> completed her <strong className="font-bold text-[#0A1E3F]">postgraduate ophthalmology</strong> residency at <strong className="font-bold text-[#0A1E3F]">AIIMS</strong> New Delhi, followed by extensive sub-specialty vitreo-retinal surgical training.
              </p>
              <p>
                She was awarded the prestigious <strong className="text-[#0A1E3F]">FAICO Retina Gold Medal</strong> and has authored 18+ peer-reviewed international scientific papers. Every patient at Nirvaya receives unhurried, direct clinical evaluation by Dr Gaur herself.
              </p>
            </div>

            {/* 3 Identical Elevated Metric Boxes with Count-Up Animation */}
            <div ref={metricsRef} className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-1">
              {/* Box 1: 18+ Scientific Papers */}
              <div className="group relative h-full min-h-[135px] sm:min-h-[145px] p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white to-[#F8FAFC] border border-slate-200/90 shadow-[0_4px_18px_-4px_rgba(10,30,63,0.06)] hover:shadow-md hover:border-[#C59B27]/40 transition-all duration-300 flex flex-col justify-between items-center text-center">
                {/* Top Metric Slot */}
                <div className="h-12 sm:h-14 flex items-center justify-center w-full">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] font-heading tracking-tight leading-none">
                    {papersCount}+
                  </span>
                </div>

                {/* Center Golden Accent Line */}
                <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#C59B27] to-transparent rounded-full my-1 opacity-70" />

                {/* Bottom Subtitle Slot */}
                <div className="h-9 sm:h-10 flex items-center justify-center w-full">
                  <span className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-tight line-clamp-2">
                    Scientific Papers
                  </span>
                </div>
              </div>

              {/* Box 2: Gold Medal FAICO Vitreo-Retina */}
              <div className="group relative h-full min-h-[135px] sm:min-h-[145px] p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white to-[#F8FAFC] border border-slate-200/90 shadow-[0_4px_18px_-4px_rgba(10,30,63,0.06)] hover:shadow-md hover:border-[#C59B27]/40 transition-all duration-300 flex flex-col justify-between items-center text-center">
                {/* Top Metric Slot */}
                <div className="h-12 sm:h-14 flex items-center justify-center w-full">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B27] shrink-0" />
                    <span className="text-base sm:text-lg lg:text-xl font-extrabold text-[#0A1E3F] font-heading tracking-tight leading-tight">
                      Gold Medal
                    </span>
                  </div>
                </div>

                {/* Center Golden Accent Line */}
                <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#C59B27] to-transparent rounded-full my-1 opacity-70" />

                {/* Bottom Subtitle Slot */}
                <div className="h-9 sm:h-10 flex items-center justify-center w-full">
                  <span className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-tight line-clamp-2">
                    FAICO Vitreo-Retina
                  </span>
                </div>
              </div>

              {/* Box 3: 10,000+ Evaluations & Surgeries */}
              <div className="group relative h-full min-h-[135px] sm:min-h-[145px] p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white to-[#F8FAFC] border border-slate-200/90 shadow-[0_4px_18px_-4px_rgba(10,30,63,0.06)] hover:shadow-md hover:border-[#C59B27]/40 transition-all duration-300 flex flex-col justify-between items-center text-center">
                {/* Top Metric Slot */}
                <div className="h-12 sm:h-14 flex items-center justify-center w-full">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0A1E3F] font-heading tracking-tight leading-none">
                    {surgeriesCount.toLocaleString()}+
                  </span>
                </div>

                {/* Center Golden Accent Line */}
                <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#C59B27] to-transparent rounded-full my-1 opacity-70" />

                {/* Bottom Subtitle Slot */}
                <div className="h-9 sm:h-10 flex items-center justify-center w-full">
                  <span className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-tight line-clamp-2">
                    Evaluations & Surgeries
                  </span>
                </div>
              </div>
            </div>

            {/* Link to Full Doctors Page */}
            <div className="pt-1 flex items-center gap-4">
              <SafeLink
                href="/doctors"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0A1E3F] hover:text-[#C59B27] transition-colors"
              >
                <span>View Full Academic Profile</span>
                <ArrowRight className="w-4 h-4 text-[#C59B27]" />
              </SafeLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

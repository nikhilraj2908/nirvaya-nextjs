'use client';

import React, { useState, useEffect, useRef } from 'react';
import SafeLink from '@/components/common/SafeLink';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import {
  Cpu,
  Zap,
  Activity,
  Wind,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function TechnologySection() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const coreTech = [
    {
      category: 'Surgical Vitreo-Retina',
      title: '25G / 27G Sutureless Vitrectomy',
      desc: 'High-speed pneumatic cut rates with micro-cannulas for retinal detachment repair, macular holes, and diabetic vitreous hemorrhage with rapid healing.',
      icon: <Zap className="w-5 h-5 text-[#DFBF64]" />,
      accentColor: 'border-[#DFBF64]/50'
    },
    {
      category: 'High-Resolution Diagnostics',
      title: 'Carl Zeiss Optics & Spectral OCT',
      desc: 'Stereoscopic high-depth red reflex visualization and micron-level optical coherence tomography for early detection of retinal disorders.',
      icon: <Activity className="w-5 h-5 text-sky-400" />,
      accentColor: 'border-sky-400/50'
    },
    {
      category: 'Cleanroom Environment',
      title: 'Class 100 HEPA Clean Air OT',
      desc: 'Modular positive-pressure laminar airflow with 99.97% bacterial air filtration for ultra-sterile microsurgical safety and zero endophthalmitis.',
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
      accentColor: 'border-cyan-400/50'
    }
  ];

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="relative py-20 lg:py-28 text-white scroll-mt-24"
    >
      {/* Sticky / Fixed Parallax Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 w-full h-full bg-fixed bg-cover bg-center transition-all duration-700 ease-out"
          style={{
            backgroundImage: "url('/assets/img1.webp')",
            backgroundPosition: 'center 40%',
            backgroundAttachment: 'fixed'
          }}
          aria-hidden="true"
        />
        {/* Calibrated Medical Navy Overlay */}
        <div className="absolute inset-0 bg-[#061226]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061226]/85 via-transparent to-[#061226]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061226]/60 via-transparent to-[#061226]/60" />
      </div>

      {/* Background ambient lighting accents */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40 shadow-xs">
              <Cpu className="w-3.5 h-3.5" />
              <span>Cutting-Edge Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Microsurgical Technology & Aseptic OT
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-xs">
              Delicate ophthalmic structures demand sub-micron imaging and precision fluidics to maximize patient visual recovery.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              href="/technology"
              to="/technology"
              variant="outline"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              className="text-white border-white/30 hover:bg-white hover:text-[#0A1E3F] text-xs font-bold shadow-md"
            >
              Explore Full OT Facility
            </Button>
          </div>
        </div>

        {/* 3 Tech Pillars with Scroll Entrance & Glassmorphic Elevation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreTech.map((item, idx) => (
            <div
              key={idx}
              className={`bg-slate-900/85 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-700/70 hover:border-[#DFBF64]/80 shadow-2xl transition-all duration-500 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-cyan-500/10 ${
                isInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${idx * 120}ms`
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-[#DFBF64]/60 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-full border border-slate-700">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#DFBF64] transition-colors mb-2.5">
                  {item.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Installed & Active</span>
                </span>
                <SafeLink
                  href="/technology"
                  className="text-[11px] font-semibold text-[#DFBF64] hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Learn more</span>
                  <span>→</span>
                </SafeLink>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

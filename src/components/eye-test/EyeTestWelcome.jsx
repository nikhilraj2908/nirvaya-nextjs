'use client';

import React from 'react';
import { Eye, Clock, ShieldAlert, ArrowRight, CheckCircle2, Target, SunDim, Compass, Palette } from 'lucide-react';
import Button from '@/components/common/Button';
import EyeLogo from '@/components/EyeLogo';
import { CLINICAL_DISCLAIMER } from '@/lib/eye-test/constants';

export default function EyeTestWelcome({ onStart }) {
  const steps = [
    { icon: Target, label: '1. Visual Acuity', desc: 'Landolt C clarity' },
    { icon: SunDim, label: '2. Contrast Vision', desc: 'Faded gray depth' },
    { icon: Compass, label: '3. Astigmatism', desc: 'Sunburst dial' },
    { icon: Palette, label: '4. Color Vision', desc: 'Ishihara plates' }
  ];

  return (
    <div className="p-5 sm:p-7 max-w-2xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
      {/* Official Nirvaya Eyecare Logo */}
      <div className="flex flex-col items-center justify-center pt-1 pb-0.5">
        <EyeLogo className="h-12 sm:h-14 w-auto max-w-[280px] sm:max-w-[320px] mx-auto transition-transform hover:scale-[1.02]" />
      </div>

      {/* Headings */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C59B27]/15 text-[#8C6D1F] border border-[#C59B27]/30">
          <span>Comprehensive Vision Screening</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          Let&apos;s Check Your Vision
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          Screen your eyesight across four essential checks: <strong>Visual Acuity</strong>, <strong>Contrast Vision</strong>, <strong>Astigmatism</strong>, and <strong>Color Vision</strong>.
        </p>
      </div>

      {/* 4 Screening Steps Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-left pt-0.5">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col items-start gap-1">
              <div className="w-7 h-7 rounded-lg bg-[#0A1E3F]/5 text-[#0A1E3F] flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-[#C59B27]" />
              </div>
              <span className="text-xs font-bold text-[#0A1E3F] block">{s.label}</span>
              <p className="text-[10px] text-slate-500 leading-tight">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full text-left">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-start gap-2.5 shadow-2xs">
          <div className="p-1.5 rounded-xl bg-blue-50 text-blue-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0A1E3F]">~2 Minutes</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Quick and guided</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-start gap-2.5 shadow-2xs">
          <div className="p-1.5 rounded-xl bg-amber-50 text-[#C59B27] shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0A1E3F]">Both Eyes</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Right & Left acuity</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-start gap-2.5 shadow-2xs">
          <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0A1E3F]">One Hand Distance</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">~40–50 cm arm&apos;s length</p>
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer Alert */}
      <div className="w-full bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 text-left flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-[11px] text-amber-950 leading-relaxed">
          <strong className="font-bold text-amber-900 block mb-0.5">Important Medical Notice:</strong>
          {CLINICAL_DISCLAIMER}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-1 w-full flex justify-center">
        <Button
          variant="gold"
          size="lg"
          onClick={onStart}
          icon={ArrowRight}
          iconPosition="right"
          className="w-full sm:w-auto font-bold text-sm px-8 py-3 shadow-lg shadow-[#C59B27]/25 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
        >
          Start Vision Screening
        </Button>
      </div>
    </div>
  );
}

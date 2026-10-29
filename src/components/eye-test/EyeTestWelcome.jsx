'use client';

import React from 'react';
import { Eye, Clock, ShieldAlert, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Button from '@/components/common/Button';
import { CLINICAL_DISCLAIMER } from '@/lib/eye-test/constants';

export default function EyeTestWelcome({ onStart }) {
  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Visual Icon Badge */}
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#0A1E3F] to-[#1E3A8A] flex items-center justify-center text-[#DFBF64] shadow-lg shadow-blue-950/15 ring-4 ring-[#C59B27]/20">
          <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-[#DFBF64]" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-[#0A1E3F] p-1.5 rounded-full shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C59B27]/15 text-[#8C6D1F] border border-[#C59B27]/30">
          <span>Preliminary Visual Acuity Screening</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A1E3F] tracking-tight">
          Let&apos;s Check Your Vision
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
          Take a quick preliminary vision screening from the comfort of your home using our clinical Tumbling&nbsp;E screening protocol.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left pt-1">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0A1E3F]">~2–3 Minutes</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Quick, guided 5-level adaptive check</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-[#C59B27] shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0A1E3F]">Both Eyes Tested</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Independent right & left eye tests</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0A1E3F]">Screen Calibrated</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Adjusted to real physical display millimeters</p>
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer Alert */}
      <div className="w-full bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-left flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong className="font-bold text-amber-900 block mb-0.5">Important Medical Notice:</strong>
          {CLINICAL_DISCLAIMER}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2 w-full flex justify-center">
        <Button
          variant="gold"
          size="lg"
          onClick={onStart}
          icon={ArrowRight}
          iconPosition="right"
          className="w-full sm:w-auto font-bold text-sm sm:text-base px-8 py-3.5 shadow-lg shadow-[#C59B27]/25 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
        >
          Start Vision Screening
        </Button>
      </div>
    </div>
  );
}

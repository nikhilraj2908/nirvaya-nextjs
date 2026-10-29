'use client';

import React from 'react';
import { Sun, Hand, Navigation, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '@/components/common/Button';

export default function EyeTestInstructions({ onContinue, onBack }) {
  const instructions = [
    {
      icon: Sun,
      title: 'Comfortable Lighting',
      desc: 'Sit in a well-lit room. Ensure there are no harsh direct reflections or glare on your display.'
    },
    {
      icon: Hand,
      title: 'Cover Without Pressure',
      desc: 'Cup one palm gently over one eye without pressing against the eyelid, keeping both eyes relaxed.'
    },
    {
      icon: Navigation,
      title: 'Indicate Direction as "C" Shrinks',
      desc: 'Notice the letter "C" will become smaller as you progress. Choose the direction the opening faces (Up, Down, Left, Right).'
    }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C59B27]/15 text-[#8C6D1F] border border-[#C59B27]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Screening Setup Guide</span>
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0A1E3F]">
          Instructions for Accurate Screening
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Follow these quick steps before we begin testing your visual acuity.
        </p>
      </div>

      {/* Prominent One Hand Distance Feature Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A1E3F] via-[#16325C] to-[#0A1E3F] text-white border border-[#DFBF64]/40 shadow-md flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-[#DFBF64]/40 flex items-center justify-center shrink-0 text-[#DFBF64]">
          <Hand className="w-8 h-8 text-[#DFBF64]" />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C59B27]/30 text-[#DFBF64] border border-[#DFBF64]/40">
            Mandatory Setup
          </div>
          <h4 className="font-heading text-base sm:text-lg font-bold text-white">
            Keep One Hand Distance (~40–50 cm) From Screen
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed">
            Sit straight and stretch your hand toward your display. Maintain this one-hand arm&apos;s length distance throughout the test for optimal accuracy.
          </p>
        </div>
      </div>

      {/* 3 Instruction Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {instructions.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 flex flex-col items-start gap-2 hover:border-[#DFBF64]/60 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs text-[#C59B27] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#0A1E3F]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-[#0A1E3F]">{item.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Hint */}
      <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl p-3 text-xs text-sky-950 flex items-center gap-2.5">
        <span className="text-base">💡</span>
        <span>
          <strong>Glasses / Lenses:</strong> If you wear distance spectacles or contact lenses for everyday vision, keep them on during this screening.
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0A1E3F] px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <Button
          variant="gold"
          size="md"
          onClick={onContinue}
          icon={ArrowRight}
          iconPosition="right"
          className="font-bold text-xs sm:text-sm shadow-md cursor-pointer"
        >
          Start Vision Screening
        </Button>
      </div>
    </div>
  );
}

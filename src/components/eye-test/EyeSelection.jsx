'use client';

import React from 'react';
import { Eye, Hand, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/common/Button';

export default function EyeSelection({ currentEye, onStartTest }) {
  const isRightEye = currentEye === 'RIGHT';
  const testingEyeLabel = isRightEye ? 'Right Eye (O.D.)' : 'Left Eye (O.S.)';
  const coveringEyeLabel = isRightEye ? 'LEFT' : 'RIGHT';

  return (
    <div className="p-6 sm:p-8 max-w-xl mx-auto flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Eye Badge & Illustration */}
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#0A1E3F] via-[#16325C] to-slate-900 border-2 border-[#C59B27]/40 flex items-center justify-center text-white shadow-xl">
          <div className="flex items-center gap-3">
            {/* Visual representation of both eyes */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                isRightEye
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-4 ring-emerald-400/20'
                  : 'border-slate-500 bg-slate-800 text-slate-500'
              }`}
              title="Right Eye"
            >
              <Eye className="w-4 h-4" />
            </div>

            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                !isRightEye
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-4 ring-emerald-400/20'
                  : 'border-slate-500 bg-slate-800 text-slate-500'
              }`}
              title="Left Eye"
            >
              <Eye className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-[#C59B27] text-[#0A1E3F] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
          {isRightEye ? 'Testing Eye 1 of 2' : 'Testing Eye 2 of 2'}
        </div>
      </div>

      {/* Main Guidance Text */}
      <div className="space-y-2 pt-1">
        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F]">
          Prepare to Test Your {testingEyeLabel}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
          Gently cover your <span className="font-extrabold text-[#0A1E3F] underline decoration-[#DFBF64] underline-offset-4">{coveringEyeLabel} eye</span> with your palm. Keep your {isRightEye ? 'right' : 'left'} eye open and focused on the screen.
        </p>
      </div>

      {/* Checklist Reminder */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
        <div className="flex items-start gap-2.5 text-xs text-slate-700">
          <Hand className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
          <span>Do not press against the covered eyelid. Keep both eyes relaxed.</span>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Sit straight and avoid leaning forward toward the screen.</span>
        </div>
      </div>

      {/* Ready Button */}
      <div className="pt-2 w-full flex justify-center">
        <Button
          variant="gold"
          size="lg"
          onClick={onStartTest}
          icon={ArrowRight}
          iconPosition="right"
          className="w-full sm:w-auto font-bold text-sm sm:text-base px-8 py-3.5 shadow-lg shadow-[#C59B27]/25 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
        >
          I&apos;m Ready — Start Test
        </Button>
      </div>
    </div>
  );
}

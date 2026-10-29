'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Hand, Eye } from 'lucide-react';

export default function AstigmatismTest({ onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const spokeAngles = [15, 40, 65, 90, 115, 140, 165];

  const handleAnswer = (isUniform) => {
    setSelectedOption(isUniform ? 'uniform' : 'non-uniform');

    setTimeout(() => {
      if (onComplete) {
        onComplete({
          isUniform,
          hasAstigmatism: !isUniform
        });
      }
    }, 350);
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto flex flex-col items-center space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="text-center space-y-1">
        <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#0A1E3F]">
          Astigmatism Test
        </h3>
        <p className="text-sm sm:text-base font-bold text-[#0A1E3F]">
          Do all radiating lines appear equally dark and sharp?
        </p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Focus on the central dot. Check whether every radiating spoke looks uniform in shade, or if some lines look darker.
        </p>
      </div>

      {/* Eye Instruction Banner: Keep Both Eyes Open */}
      <div className="w-full bg-blue-50/70 border border-blue-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0A1E3F] text-emerald-400 flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0A1E3F] flex items-center gap-1.5">
              Keep Both Eyes Open
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Both Eyes
              </span>
            </span>
            <span className="text-[11px] text-slate-600 block mt-0.5">
              Look with both eyes open (wear your everyday glasses if you use them).
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
          <Hand className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>~40–50 cm</span>
        </div>
      </div>

      {/* Sunburst Fan Chart */}
      <div className="w-full max-w-sm aspect-[4/3] rounded-3xl bg-white border-2 border-slate-200 flex flex-col items-center justify-center p-4 shadow-sm relative select-none">
        <svg
          viewBox="-110 -85 220 100"
          className="w-full h-auto max-w-[280px]"
          shapeRendering="geometricPrecision"
          aria-label="Astigmatic Fan Chart"
        >
          {/* Baseline arc and horizontal lines */}
          <path
            d="M -34 0 A 34 34 0 0 1 34 0"
            fill="none"
            stroke="#0A1E3F"
            strokeWidth="2"
          />
          <line x1="-95" y1="0" x2="-34" y2="0" stroke="#0A1E3F" strokeWidth="2" />
          <line x1="34" y1="0" x2="95" y2="0" stroke="#0A1E3F" strokeWidth="2" />

          {/* 7 triple-spoke bundles */}
          {spokeAngles.map((baseAngle) => {
            const subAngles = [baseAngle - 2.2, baseAngle, baseAngle + 2.2];

            return (
              <g key={baseAngle}>
                {subAngles.map((deg, subIdx) => {
                  const rad = (deg * Math.PI) / 180;
                  const rInner = 38;
                  const rOuter = 88;
                  const x1 = -Math.cos(rad) * rInner;
                  const y1 = -Math.sin(rad) * rInner;
                  const x2 = -Math.cos(rad) * rOuter;
                  const y2 = -Math.sin(rad) * rOuter;

                  return (
                    <line
                      key={subIdx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#0A1E3F"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Central fixation dot */}
          <circle cx="0" cy="12" r="3.5" fill="#0A1E3F" />
        </svg>

        <span className="text-[11px] text-slate-500 font-medium mt-1">
          Focus on dot and observe
        </span>
      </div>

      {/* Decision Buttons — Single Clear Problem Statement */}
      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Option 1: Uniform (Normal) */}
        <button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={Boolean(selectedOption)}
          className={`p-3.5 rounded-2xl font-bold border-2 transition-all cursor-pointer shadow-sm active:scale-98 text-center flex flex-col items-center justify-center gap-1 ${
            selectedOption === 'uniform'
              ? 'bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-500 text-[#0A1E3F] hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-4 h-4 ${selectedOption === 'uniform' ? 'text-white' : 'text-emerald-600'}`} />
            <span className="text-xs sm:text-sm font-bold">Yes, all lines are equally dark</span>
          </div>
          <span className={`text-[11px] font-normal ${selectedOption === 'uniform' ? 'text-emerald-100' : 'text-slate-500'}`}>
            All lines look uniform & sharp
          </span>
        </button>

        {/* Option 2: Non-uniform (Astigmatism indicated) */}
        <button
          type="button"
          onClick={() => handleAnswer(false)}
          disabled={Boolean(selectedOption)}
          className={`p-3.5 rounded-2xl font-bold border-2 transition-all cursor-pointer shadow-sm active:scale-98 text-center flex flex-col items-center justify-center gap-1 ${
            selectedOption === 'non-uniform'
              ? 'bg-amber-600 border-amber-600 text-white ring-4 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-500 text-[#0A1E3F] hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <AlertCircle className={`w-4 h-4 ${selectedOption === 'non-uniform' ? 'text-white' : 'text-amber-600'}`} />
            <span className="text-xs sm:text-sm font-bold">No, some lines look darker</span>
          </div>
          <span className={`text-[11px] font-normal ${selectedOption === 'non-uniform' ? 'text-amber-100' : 'text-slate-500'}`}>
            Certain lines look darker or blurrier
          </span>
        </button>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { CheckCircle2, XCircle, Eye, Hand } from 'lucide-react';
import Button from '@/components/common/Button';

// Reusable SVG for the semicircular sunburst fan chart
function SunburstFanSVG({ isAstigmatic = false }) {
  // 7 spokes across 180 degrees
  const spokeAngles = [15, 40, 65, 90, 115, 140, 165];

  return (
    <svg
      viewBox="-100 -80 200 95"
      className="w-full max-w-[200px] h-auto mx-auto"
      shapeRendering="geometricPrecision"
    >
      {/* Semicircle inner baseline arc */}
      <path
        d="M -32 0 A 32 32 0 0 1 32 0"
        fill="none"
        stroke="#0A1E3F"
        strokeWidth="2"
      />
      <line x1="-80" y1="0" x2="-32" y2="0" stroke="#0A1E3F" strokeWidth="2" />
      <line x1="32" y1="0" x2="80" y2="0" stroke="#0A1E3F" strokeWidth="2" />

      {/* 7 triple-spoke bundles */}
      {spokeAngles.map((baseAngle, index) => {
        // In astigmatic version: the left 3 spokes (indices 0, 1, 2) are faded light gray
        const isFaded = isAstigmatic && index < 3;
        const strokeColor = isFaded ? '#CBD5E1' : '#0A1E3F';
        const strokeWidth = isFaded ? 1.5 : 2.2;

        // Triple line offsets: -2.2deg, 0deg, +2.2deg
        const subAngles = [baseAngle - 2.2, baseAngle, baseAngle + 2.2];

        return (
          <g key={baseAngle}>
            {subAngles.map((deg, subIdx) => {
              // Convert polar (radius 36 to 75) to cartesian
              const rad = (deg * Math.PI) / 180;
              const rInner = 36;
              const rOuter = 75;
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
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        );
      })}

      {/* Center fixation dot below semicircle */}
      <circle cx="0" cy="10" r="3" fill="#0A1E3F" />
    </svg>
  );
}

export default function AstigmatismIntro({ onProceed }) {
  return (
    <div className="p-4 sm:p-7 max-w-xl mx-auto flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Title */}
      <div className="text-center space-y-1">
        <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0A1E3F]">
          Astigmatism Test Guide
        </h3>
        <p className="text-xs text-slate-500">
          Learn how radiating lines appear with uniform vision versus astigmatism.
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
              Keep both eyes open. Look at the examples below at one hand distance (~40–50 cm).
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
          <Hand className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>~40–50 cm</span>
        </div>
      </div>

      {/* Two Comparison Cards Side-by-Side (matching user screenshot) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left: Perfect Vision */}
        <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-2">
          <SunburstFanSVG isAstigmatic={false} />
          <span className="text-xs text-slate-500 font-medium">
            Focus on dot and observe
          </span>

          <div className="inline-flex items-center gap-1.5 pt-1 text-emerald-600 font-extrabold text-sm sm:text-base">
            <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
            <span>Perfect Vision</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-[200px]">
            All radiating lines look equally dark, sharp, and uniform.
          </p>
        </div>

        {/* Right: Astigmatism Detected */}
        <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-2">
          <SunburstFanSVG isAstigmatic={true} />
          <span className="text-xs text-slate-500 font-medium">
            Focus on dot and observe
          </span>

          <div className="inline-flex items-center gap-1.5 pt-1 text-[#FF5E48] font-extrabold text-sm sm:text-base">
            <XCircle className="w-5 h-5 fill-[#FF5E48] text-white" />
            <span>Astigmatism Detected</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-[200px]">
            Some lines look darker, while others seem lighter or blurrier.
          </p>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="w-full pt-1">
        <button
          type="button"
          onClick={onProceed}
          className="w-full py-3.5 px-6 rounded-xl bg-[#000042] hover:bg-[#0A1E3F] text-white font-bold text-sm shadow-md active:scale-[0.99] transition-all cursor-pointer"
        >
          Proceed to Astigmatism Test
        </button>
      </div>
    </div>
  );
}


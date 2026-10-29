'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Check, ArrowRight, ArrowLeft, RotateCcw, HelpCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import { PHYSICAL_CARD_MM } from '@/lib/eye-test/constants';
import { calculatePixelsPerMm, getDefaultPixelsPerMm } from '@/lib/eye-test/calibration';

export default function ScreenCalibration({ onComplete, onBack }) {
  // Initial card width in CSS pixels (approx standard size based on default PPM)
  const defaultPpm = getDefaultPixelsPerMm();
  const initialCardWidthPx = Math.round(PHYSICAL_CARD_MM.width * defaultPpm);

  const [cardWidth, setCardWidth] = useState(initialCardWidthPx);
  const [isCalibrated, setIsCalibrated] = useState(false);

  // Sync state if window resizes
  useEffect(() => {
    const defaultWidth = Math.round(PHYSICAL_CARD_MM.width * getDefaultPixelsPerMm());
    setCardWidth((prev) => (prev ? prev : defaultWidth));
  }, []);

  const cardHeight = Math.round(cardWidth / PHYSICAL_CARD_MM.aspectRatio);
  const currentPpm = calculatePixelsPerMm(cardWidth);

  const handleSliderChange = (e) => {
    setCardWidth(parseInt(e.target.value, 10));
    setIsCalibrated(true);
  };

  const adjustWidth = (delta) => {
    setCardWidth((prev) => Math.max(180, Math.min(500, prev + delta)));
    setIsCalibrated(true);
  };

  const handleUseStandard = () => {
    const stdPpm = getDefaultPixelsPerMm();
    onComplete({
      pixelsPerMm: stdPpm,
      method: 'standard_estimate',
      cardWidthPx: Math.round(PHYSICAL_CARD_MM.width * stdPpm)
    });
  };

  const handleConfirm = () => {
    onComplete({
      pixelsPerMm: currentPpm,
      method: 'physical_card',
      cardWidthPx: cardWidth
    });
  };

  return (
    <div className="p-5 sm:p-7 max-w-2xl mx-auto flex flex-col space-y-5 animate-in fade-in zoom-in-95 duration-200">
      {/* Title */}
      <div className="text-center space-y-1">
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0A1E3F]">
          Screen Size Calibration
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Screens vary in physical size. Place any standard card (ATM, debit card, or driving license) against the box below and adjust the slider until the outline matches your card exactly.
        </p>
      </div>

      {/* Interactive Calibration Card Container */}
      <div className="w-full flex flex-col items-center justify-center py-2">
        <div
          style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
          className="relative rounded-xl border-2 border-dashed border-[#C59B27] bg-gradient-to-br from-slate-900 via-[#0A1E3F] to-slate-950 text-white p-3.5 flex flex-col justify-between shadow-xl transition-all duration-75 select-none overflow-hidden"
        >
          {/* Subtle golden corner marks */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#DFBF64]" />
          <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#DFBF64]" />
          <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#DFBF64]" />
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#DFBF64]" />

          {/* Simulated Chip & Bank Card Details */}
          <div className="flex items-center justify-between">
            <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 border border-amber-600/50 flex items-center justify-center opacity-90 shadow-xs">
              <div className="w-6 h-4 border border-amber-800/40 rounded-xs grid grid-cols-2" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#DFBF64]/90 font-bold uppercase">
              Standard ID-1 Card
            </div>
          </div>

          <div className="text-center">
            <p className="text-[11px] font-semibold text-slate-200 tracking-wide">
              Match your card to this outline
            </p>
            <p className="text-[9px] text-[#DFBF64] font-mono">
              85.60 mm × 53.98 mm
            </p>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>•••• 1234</span>
            <CreditCard className="w-3.5 h-3.5 text-[#DFBF64]" />
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="w-full max-w-md mx-auto space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Card Width Size</span>
          <span className="font-mono text-[#0A1E3F] font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
            {cardWidth} px ({currentPpm.toFixed(2)} px/mm)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => adjustWidth(-3)}
            aria-label="Decrease card size"
            className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-sm shadow-2xs active:scale-95 cursor-pointer"
          >
            −
          </button>

          <input
            type="range"
            min="180"
            max="480"
            step="1"
            value={cardWidth}
            onChange={handleSliderChange}
            aria-label="Screen calibration card width slider"
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C59B27]"
          />

          <button
            type="button"
            onClick={() => adjustWidth(3)}
            aria-label="Increase card size"
            className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-sm shadow-2xs active:scale-95 cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Bypass Option */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
          <button
            type="button"
            onClick={handleUseStandard}
            className="text-slate-600 hover:text-[#0A1E3F] underline decoration-slate-400 font-medium cursor-pointer"
          >
            Don&apos;t have a card? Use standard display baseline
          </button>
          <span className="inline-flex items-center gap-1 text-[#8C6D1F]">
            <Check className="w-3 h-3 text-[#C59B27]" />
            ISO 8596 Ready
          </span>
        </div>
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
          onClick={handleConfirm}
          icon={ArrowRight}
          iconPosition="right"
          className="font-bold text-xs sm:text-sm shadow-md cursor-pointer"
        >
          Confirm & Test Right Eye
        </Button>
      </div>
    </div>
  );
}

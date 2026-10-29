'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, SunDim, Hand, Eye } from 'lucide-react';
import { DIRECTIONS, DIRECTION_CONFIG, CONTRAST_LEVELS } from '@/lib/eye-test/constants';
import { generateRandomDirection } from '@/lib/eye-test/testEngine';

export default function ContrastVisionTest({ onComplete }) {
  const [trialIndex, setTrialIndex] = useState(0);
  const [currentDirection, setCurrentDirection] = useState(() => generateRandomDirection());
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isDeciding, setIsDeciding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentLevel = CONTRAST_LEVELS[trialIndex] || CONTRAST_LEVELS[0];
  const directionMeta = DIRECTION_CONFIG[currentDirection] || DIRECTION_CONFIG.RIGHT;
  const optotypePx = isMobile ? currentLevel.mobilePx : currentLevel.desktopPx;

  const handleSelect = useCallback(
    (chosenDirection) => {
      if (feedback || isDeciding) return;
      const isCorrect = chosenDirection === currentDirection;

      setIsDeciding(true);
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      const updatedCount = correctCount + (isCorrect ? 1 : 0);
      setCorrectCount(updatedCount);

      setTimeout(() => {
        setFeedback(null);
        setIsDeciding(false);

        if (trialIndex + 1 < CONTRAST_LEVELS.length) {
          setTrialIndex((prev) => prev + 1);
          setCurrentDirection(generateRandomDirection(currentDirection));
        } else {
          // Completed all contrast trials
          if (onComplete) {
            onComplete({
              contrastScore: updatedCount,
              totalTrials: CONTRAST_LEVELS.length
            });
          }
        }
      }, 300);
    },
    [feedback, isDeciding, currentDirection, correctCount, trialIndex, onComplete]
  );

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleSelect(DIRECTIONS.UP);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSelect(DIRECTIONS.RIGHT);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleSelect(DIRECTIONS.DOWN);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSelect(DIRECTIONS.LEFT);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect]);

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto flex flex-col items-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header Row */}
      <div className="w-full flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0A1E3F] text-white">
          <SunDim className="w-3.5 h-3.5 text-[#DFBF64]" />
          <span>Contrast Vision Test</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#8C6D1F] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
            {currentLevel.label}
          </span>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Step {trialIndex + 1}/{CONTRAST_LEVELS.length}
          </span>
        </div>
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
              Do not cover either eye. Wear your everyday glasses/lenses if you use them.
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
          <Hand className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>~40–50 cm</span>
        </div>
      </div>

      {/* Instruction question */}
      <div className="text-center space-y-1">
        <p className="text-sm sm:text-base font-bold text-[#0A1E3F]">
          Which direction is the opening of the faded &ldquo;C&rdquo; facing?
        </p>
        <p className="text-xs text-slate-500">
          Contrast sensitivity checks how well your eyes distinguish subtle gray shades against a bright background.
        </p>
      </div>

      {/* Optotype Display Area */}
      <div
        className={`w-full max-w-[240px] sm:max-w-[260px] aspect-square mx-auto rounded-3xl bg-white border-2 flex flex-col items-center justify-center p-4 shadow-inner transition-colors duration-200 relative select-none ${
          feedback === 'correct'
            ? 'border-emerald-500 ring-4 ring-emerald-400/25 bg-emerald-50/20'
            : feedback === 'incorrect'
            ? 'border-amber-400 ring-4 ring-amber-300/25 bg-amber-50/20'
            : 'border-slate-300 shadow-md'
        }`}
      >
        {/* Subtle center crosshairs watermark */}
        <div className="absolute inset-x-8 top-1/2 h-[1px] bg-slate-100 pointer-events-none" />
        <div className="absolute inset-y-8 left-1/2 w-[1px] bg-slate-100 pointer-events-none" />

        {/* Outer element handles subtle scale feedback without jump */}
        <div
          style={{
            width: `${optotypePx}px`,
            height: `${optotypePx}px`,
            transform: isDeciding ? 'scale(0.88)' : 'scale(1)',
            opacity: isDeciding ? 0.75 : 1,
            transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, width 0.2s ease-out, height 0.2s ease-out'
          }}
          className="flex items-center justify-center"
        >
          {/* Inner element handles rotation without transition, changes direction cleanly and normally */}
          <div
            style={{
              transform: `rotate(${directionMeta.degree}deg)`,
              color: currentLevel.color
            }}
            className="w-full h-full flex items-center justify-center transition-colors duration-200"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full fill-current"
              shapeRendering="geometricPrecision"
              aria-label={`Contrast C opening ${directionMeta.label}`}
            >
              <path
                d="M 98.99 40 A 50 50 0 1 0 98.99 60 L 78.28 60 A 30 30 0 1 1 78.28 40 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Live indicator */}
        <div className="absolute bottom-2.5 inset-x-0 mx-auto text-center pointer-events-none">
          <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100/90 px-2 py-0.5 rounded-full border border-slate-200">
            Gray Depth: {currentLevel.contrastPct}
          </span>
        </div>
      </div>

      {/* One Hand Distance Reminder */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
        <Hand className="w-3.5 h-3.5 text-[#C59B27]" />
        <span>Maintain <strong>one hand distance</strong> (~40–50 cm)</span>
      </div>

      {/* Direction Selection Controls */}
      <div className="w-full max-w-xs pt-0.5 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => handleSelect(DIRECTIONS.UP)}
          disabled={Boolean(feedback) || isDeciding}
          aria-label="Opening faces UP"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#DFBF64] hover:bg-[#0A1E3F] hover:text-white text-[#0A1E3F] font-bold flex flex-col items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer group disabled:opacity-60"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Up</span>
        </button>

        <div className="flex items-center justify-between w-full px-4">
          <button
            type="button"
            onClick={() => handleSelect(DIRECTIONS.LEFT)}
            disabled={Boolean(feedback) || isDeciding}
            aria-label="Opening faces LEFT"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#DFBF64] hover:bg-[#0A1E3F] hover:text-white text-[#0A1E3F] font-bold flex flex-col items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer group disabled:opacity-60"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Left</span>
          </button>

          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-mono font-bold">
            {trialIndex + 1}/{CONTRAST_LEVELS.length}
          </div>

          <button
            type="button"
            onClick={() => handleSelect(DIRECTIONS.RIGHT)}
            disabled={Boolean(feedback) || isDeciding}
            aria-label="Opening faces RIGHT"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#DFBF64] hover:bg-[#0A1E3F] hover:text-white text-[#0A1E3F] font-bold flex flex-col items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer group disabled:opacity-60"
          >
            <ArrowRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Right</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleSelect(DIRECTIONS.DOWN)}
          disabled={Boolean(feedback) || isDeciding}
          aria-label="Opening faces DOWN"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#DFBF64] hover:bg-[#0A1E3F] hover:text-white text-[#0A1E3F] font-bold flex flex-col items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer group disabled:opacity-60"
        >
          <ArrowDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Down</span>
        </button>
      </div>
    </div>
  );
}

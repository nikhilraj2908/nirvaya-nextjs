'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, Hand, Sparkles } from 'lucide-react';
import { DIRECTIONS, DIRECTION_CONFIG, TRIALS_PER_LEVEL, ACUITY_LEVELS } from '@/lib/eye-test/constants';

export default function VisualAcuityTest({
  currentEye,
  eyeState,
  pixelsPerMm,
  onAnswer
}) {
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
  const [isDeciding, setIsDeciding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isRightEye = currentEye === 'RIGHT';
  const eyeLabel = isRightEye ? 'Right Eye (O.D.)' : 'Left Eye (O.S.)';

  // Responsive device check for sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute optotype base pixel size directly from progressive acuity levels
  const currentLevelConfig = eyeState.currentLevel || ACUITY_LEVELS[0];
  const baseSize = isMobile
    ? (currentLevelConfig.mobilePx || 20)
    : (currentLevelConfig.desktopPx || 26);

  // Progressive micro-shrink per trial within the level so it gets smaller on every round
  const trialShrink = (eyeState.trialIndex || 0) * (isMobile ? 0.75 : 1);
  const optotypePx = Math.max(isMobile ? 5 : 6, Math.round((baseSize - trialShrink) * 10) / 10);

  // Direction angle
  const directionMeta = DIRECTION_CONFIG[eyeState.currentDirection] || DIRECTION_CONFIG.RIGHT;

  const handleSelect = useCallback(
    (chosenDirection) => {
      if (feedback || isDeciding) return; // Prevent double-tap during transition
      const isCorrect = chosenDirection === eyeState.currentDirection;

      // Trigger immediate decision shrink animation
      setIsDeciding(true);
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      setTimeout(() => {
        setFeedback(null);
        setIsDeciding(false);
        onAnswer(chosenDirection);
      }, 350);
    },
    [feedback, isDeciding, eyeState.currentDirection, onAnswer]
  );

  // Keyboard support for desktop arrow keys
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
    <div className="p-4 sm:p-6 max-w-xl mx-auto flex flex-col items-center space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header Row: Eye Badge & Progress Level */}
      <div className="w-full flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0A1E3F] text-white">
          <Eye className="w-3.5 h-3.5 text-[#DFBF64]" />
          <span>{eyeLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#8C6D1F] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
            {currentLevelConfig.snellenUS} • Level {(eyeState.levelIndex || 0) + 1}/5
          </span>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Trial {eyeState.trialIndex + 1}/{TRIALS_PER_LEVEL}
          </span>
        </div>
      </div>

      {/* Instruction question & dynamic shrinking badge */}
      <div className="text-center space-y-1">
        <p className="text-sm sm:text-base font-bold text-[#0A1E3F]">
          Which direction is the opening of the &ldquo;C&rdquo; facing?
        </p>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#8C6D1F] bg-amber-50 border border-amber-200/60">
          <Sparkles className="w-3 h-3 text-[#C59B27]" />
          <span>Notice: Letter &ldquo;C&rdquo; shrinks as you decide</span>
        </div>
      </div>

      {/* Clinical Optotype Display Chart Area */}
      <div
        className={`w-full max-w-[240px] sm:max-w-[260px] aspect-square mx-auto rounded-3xl bg-white border-2 flex flex-col items-center justify-center p-4 shadow-inner transition-colors duration-200 relative select-none ${
          feedback === 'correct'
            ? 'border-emerald-500 ring-4 ring-emerald-400/25 bg-emerald-50/20'
            : feedback === 'incorrect'
            ? 'border-amber-400 ring-4 ring-amber-300/25 bg-amber-50/20'
            : 'border-slate-300 shadow-md'
        }`}
      >
        {/* Subtle center alignment crosshairs (very light watermark) */}
        <div className="absolute inset-x-8 top-1/2 h-[1px] bg-slate-100 pointer-events-none" />
        <div className="absolute inset-y-8 left-1/2 w-[1px] bg-slate-100 pointer-events-none" />

        {/* Landolt C (Broken Ring) SVG Optotype */}
        <div
          style={{
            width: `${optotypePx}px`,
            height: `${optotypePx}px`,
            transform: isDeciding ? 'scale(0.85)' : 'scale(1)',
            opacity: isDeciding ? 0.85 : 1,
            transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, width 0.2s ease-out, height 0.2s ease-out'
          }}
          className="flex items-center justify-center"
        >
          {/* Inner rotation container: changes direction cleanly and normally without jumping */}
          <div
            style={{
              transform: `rotate(${directionMeta.degree}deg)`
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-black fill-current"
              shapeRendering="geometricPrecision"
              aria-label={`Landolt C Optotype opening ${directionMeta.label}`}
            >
              {/* Standard Landolt C (Broken Ring) opening to the Right at 0 degrees:
                  Outer Diameter: 100, Stroke Width: 20 (D/5), Gap Width: 20 (D/5)
              */}
              <path
                d="M 98.99 40 A 50 50 0 1 0 98.99 60 L 78.28 60 A 30 30 0 1 1 78.28 40 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Live Size & Acuity Indicator under the optotype */}
        <div className="absolute bottom-2.5 inset-x-0 mx-auto text-center pointer-events-none">
          <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100/90 px-2 py-0.5 rounded-full border border-slate-200">
            Acuity: {currentLevelConfig.snellenUS} ({optotypePx}px)
          </span>
        </div>
      </div>

      {/* One Hand Distance Reminder Pill */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
        <Hand className="w-3.5 h-3.5 text-[#C59B27]" />
        <span>Maintain <strong>one hand distance</strong> (~40–50 cm)</span>
      </div>

      {/* Direction Selection Controls (DPad / Diamond Button Layout) */}
      <div className="w-full max-w-xs pt-0.5 flex flex-col items-center gap-2">
        {/* UP Button */}
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

        {/* LEFT and RIGHT Buttons */}
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
            {eyeState.trialIndex + 1}/{TRIALS_PER_LEVEL}
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

        {/* DOWN Button */}
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

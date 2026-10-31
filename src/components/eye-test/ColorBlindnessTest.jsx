'use client';

import React, { useState, useMemo } from 'react';
import { Palette, Eye, Hand } from 'lucide-react';
import { getRandomColorPlates } from '@/lib/eye-test/constants';

// Precise digit stroke dot coordinates (5 columns x 7 rows)
const DIGIT_PATTERNS = {
  '0': [[1,0],[2,0],[3,0],[0,1],[4,1],[0,2],[4,2],[0,3],[4,3],[0,4],[4,4],[0,5],[4,5],[1,6],[2,6],[3,6]],
  '1': [[1,1],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[1,6],[3,6]],
  '2': [[0,1],[1,0],[2,0],[3,0],[4,1],[4,2],[3,3],[2,4],[1,5],[0,6],[1,6],[2,6],[3,6],[4,6]],
  '3': [[1,0],[2,0],[3,0],[0,1],[4,1],[4,2],[2,3],[3,3],[4,4],[4,5],[0,5],[1,6],[2,6],[3,6]],
  '4': [[3,0],[2,1],[1,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4],[3,1],[3,2],[3,3],[3,5],[3,6]],
  '5': [[4,0],[3,0],[2,0],[1,0],[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,3],[4,4],[4,5],[3,6],[2,6],[1,6],[0,5]],
  '6': [[2,0],[1,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[4,3],[0,4],[4,4],[0,5],[4,5],[1,6],[2,6],[3,6]],
  '7': [[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[3,2],[2,3],[2,4],[2,5],[2,6]],
  '8': [[1,0],[2,0],[3,0],[0,1],[4,1],[0,2],[4,2],[1,3],[2,3],[3,3],[0,4],[4,4],[0,5],[4,5],[1,6],[2,6],[3,6]],
  '9': [[1,0],[2,0],[3,0],[0,1],[4,1],[0,2],[4,2],[1,3],[2,3],[3,3],[4,3],[4,4],[4,5],[3,6],[2,6],[1,6]]
};

/**
 * Procedurally generates authentic, non-overlapping Ishihara stipple dots for any number
 */
function generatePlateDots(numStr) {
  const cx = 100;
  const cy = 100;
  const R = 86;
  const digits = String(numStr).split('');
  const isSingle = digits.length === 1;

  const colSpacing = isSingle ? 11 : 8.5;
  const rowSpacing = isSingle ? 13 : 10.5;
  const digitWidth = 4 * colSpacing;
  const spacingBetweenDigits = 14;

  const totalWidth = isSingle ? digitWidth : (digitWidth * 2 + spacingBetweenDigits);
  const startX = cx - (totalWidth / 2);
  const startY = cy - ((6 * rowSpacing) / 2);

  const numDots = [];
  digits.forEach((digit, dIdx) => {
    const coords = DIGIT_PATTERNS[digit] || [];
    const digitStartX = startX + (dIdx * (digitWidth + spacingBetweenDigits));
    coords.forEach(([col, row]) => {
      // Subtle organic jitter
      const x = digitStartX + (col * colSpacing) + (Math.random() - 0.5) * 1.5;
      const y = startY + (row * rowSpacing) + (Math.random() - 0.5) * 1.5;
      const r = isSingle ? (7 + Math.random() * 2) : (6 + Math.random() * 2);
      numDots.push({
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        r: Math.round(r * 10) / 10
      });
    });
  });

  // Background dots filling the circle with collision avoidance
  const bgDots = [];
  const minDistance = isSingle ? 13 : 11.5;

  for (let y = cy - R + 4; y <= cy + R - 4; y += 13) {
    const rowOffset = (Math.floor(y / 13) % 2 === 0) ? 0 : 6.5;
    for (let x = cx - R + 4 + rowOffset; x <= cx + R - 4; x += 13) {
      const jx = x + (Math.random() - 0.5) * 3;
      const jy = y + (Math.random() - 0.5) * 3;
      const distFromCenter = Math.hypot(jx - cx, jy - cy);

      if (distFromCenter <= R - 2) {
        const tooClose = numDots.some((nd) => Math.hypot(nd.x - jx, nd.y - jy) < minDistance);
        if (!tooClose) {
          const r = 5.5 + (Math.random() * 2.5);
          bgDots.push({
            x: Math.round(jx * 10) / 10,
            y: Math.round(jy * 10) / 10,
            r: Math.round(r * 10) / 10
          });
        }
      }
    }
  }

  return { numDots, bgDots };
}

// Renders an Ishihara pseudoisochromatic plate with procedural randomized dots
function IshiharaPlateSVG({ plate }) {
  const numberStr = plate.number || '12';
  const targetColors = plate.targetColors || ['#E76F51', '#F4A261'];
  const bgColors = plate.bgColors || ['#588157', '#83A598', '#6A994E'];

  // Memoize dots so they remain stable across re-renders of the same plate
  const { numDots, bgDots } = useMemo(() => {
    return generatePlateDots(numberStr);
  }, [plate.id, numberStr]);

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full max-w-[220px] aspect-square mx-auto rounded-full shadow-inner bg-slate-50 select-none"
      shapeRendering="geometricPrecision"
      aria-label={`Ishihara Plate ${plate.id}`}
    >
      {/* Base circular disc */}
      <circle cx="100" cy="100" r="92" fill="#FAFAFA" stroke="#E2E8F0" strokeWidth="2" />

      {/* Background stipple dots */}
      {bgDots.map((d, i) => (
        <circle
          key={`bg-${i}`}
          cx={d.x}
          cy={d.y}
          r={d.r || 6.5}
          fill={bgColors[i % bgColors.length]}
          opacity="0.88"
        />
      ))}

      {/* Target Number Dots */}
      {numDots.map((d, i) => (
        <circle
          key={`num-${i}`}
          cx={d.x}
          cy={d.y}
          r={d.r || 7}
          fill={targetColors[i % targetColors.length]}
          stroke="#FFFFFF"
          strokeWidth="0.75"
        />
      ))}
    </svg>
  );
}

export default function ColorBlindnessTest({ onComplete }) {
  // Randomly select 3 distinct plates per test session
  const [plates] = useState(() => getRandomColorPlates(3));
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const activePlate = plates[currentPlateIndex] || plates[0];

  const handleSelect = (option) => {
    setSelectedOption(option);
    const isCorrect = option === activePlate.correctAnswer;
    const updatedAnswers = [...answers, { plateId: activePlate.id, selected: option, isCorrect }];
    setAnswers(updatedAnswers);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentPlateIndex + 1 < plates.length) {
        setCurrentPlateIndex((prev) => prev + 1);
      } else {
        // Completed all color plates
        const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
        if (onComplete) {
          onComplete({
            colorScore: correctCount,
            totalPlates: plates.length,
            isNormal: correctCount >= plates.length
          });
        }
      }
    }, 350);
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header Row */}
      <div className="w-full flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0A1E3F] text-white">
          <Palette className="w-3.5 h-3.5 text-[#DFBF64]" />
          <span>Color Vision Test</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#8C6D1F] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
            Ishihara Plate {currentPlateIndex + 1}/{plates.length}
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
              Keep both eyes open. Wear your everyday glasses/lenses if you use them.
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
          What number do you see in the circle?
        </p>
        <p className="text-xs text-slate-500">
          Observe the colored circle below and choose the number that stands out.
        </p>
      </div>

      {/* Ishihara Plate Display */}
      <div className="p-2 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-md">
        <IshiharaPlateSVG plate={activePlate} />
      </div>

      {/* Multiple Choice Options */}
      <div className="w-full max-w-xs grid grid-cols-2 gap-2.5 pt-1">
        {activePlate.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            disabled={Boolean(selectedOption)}
            className={`py-3 px-4 rounded-2xl font-bold text-sm sm:text-base border-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
              selectedOption === option
                ? 'bg-[#0A1E3F] border-[#0A1E3F] text-[#DFBF64] ring-4 ring-[#DFBF64]/20'
                : 'bg-white border-slate-200 hover:border-[#DFBF64] text-[#0A1E3F] hover:bg-slate-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

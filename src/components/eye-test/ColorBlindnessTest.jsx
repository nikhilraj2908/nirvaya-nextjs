'use client';

import React, { useState } from 'react';
import { Palette, Eye, Hand } from 'lucide-react';
import { COLOR_PLATES } from '@/lib/eye-test/constants';

// Renders an Ishihara-style pseudoisochromatic plate with dots forming a number
function IshiharaPlateSVG({ plateId }) {
  const isPlate12 = plateId === 'plate-12';

  // Seeded coordinates for a 200x200 circular plate (radius 90)
  // Number dots: for "12" or "74"
  // Background dots: randomly scattered inside circle
  const numberColor1 = isPlate12 ? '#E76F51' : '#2A9D8F'; // Orange/Red for 12, Teal/Green for 74
  const numberColor2 = isPlate12 ? '#F4A261' : '#48CAE4';
  const bgColor1 = isPlate12 ? '#588157' : '#E07A5F';     // Green/Sage for 12, Terracotta for 74
  const bgColor2 = isPlate12 ? '#83A598' : '#D4A373';

  // Number 12 dot coordinates (digit '1' and digit '2')
  const dots12 = [
    // Digit 1
    { x: 75, y: 70 }, { x: 75, y: 85 }, { x: 75, y: 100 }, { x: 75, y: 115 }, { x: 75, y: 130 },
    { x: 65, y: 80 }, { x: 65, y: 130 }, { x: 85, y: 130 },
    // Digit 2
    { x: 105, y: 75 }, { x: 115, y: 70 }, { x: 125, y: 75 }, { x: 130, y: 85 },
    { x: 125, y: 100 }, { x: 115, y: 112 }, { x: 105, y: 122 },
    { x: 105, y: 130 }, { x: 115, y: 130 }, { x: 125, y: 130 }, { x: 135, y: 130 }
  ];

  // Number 74 dot coordinates (digit '7' and digit '4')
  const dots74 = [
    // Digit 7
    { x: 65, y: 70 }, { x: 75, y: 70 }, { x: 85, y: 70 }, { x: 95, y: 70 },
    { x: 90, y: 85 }, { x: 85, y: 100 }, { x: 80, y: 115 }, { x: 75, y: 130 },
    // Digit 4
    { x: 130, y: 70 }, { x: 125, y: 85 }, { x: 120, y: 100 },
    { x: 110, y: 110 }, { x: 120, y: 110 }, { x: 130, y: 110 }, { x: 140, y: 110 },
    { x: 130, y: 120 }, { x: 130, y: 130 }
  ];

  const targetDots = isPlate12 ? dots12 : dots74;

  // Background dots filler
  const bgDots = [
    { x: 45, y: 55, r: 7 }, { x: 65, y: 45, r: 8 }, { x: 95, y: 40, r: 7 }, { x: 125, y: 45, r: 8 },
    { x: 150, y: 60, r: 7 }, { x: 165, y: 85, r: 8 }, { x: 160, y: 115, r: 7 }, { x: 155, y: 140, r: 8 },
    { x: 135, y: 155, r: 7 }, { x: 105, y: 165, r: 8 }, { x: 75, y: 160, r: 7 }, { x: 50, y: 145, r: 8 },
    { x: 35, y: 120, r: 7 }, { x: 35, y: 90, r: 8 }, { x: 45, y: 75, r: 7 }, { x: 85, y: 55, r: 6 },
    { x: 115, y: 55, r: 7 }, { x: 140, y: 75, r: 6 }, { x: 150, y: 100, r: 7 }, { x: 145, y: 125, r: 6 },
    { x: 120, y: 145, r: 7 }, { x: 95, y: 150, r: 6 }, { x: 65, y: 145, r: 7 }, { x: 45, y: 105, r: 6 },
    { x: 55, y: 125, r: 7 }, { x: 55, y: 95, r: 6 }, { x: 100, y: 90, r: 7 }, { x: 100, y: 125, r: 6 }
  ];

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full max-w-[220px] aspect-square mx-auto rounded-full shadow-inner bg-slate-50"
      shapeRendering="geometricPrecision"
      aria-label={`Ishihara Plate ${plateId}`}
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
          fill={i % 2 === 0 ? bgColor1 : bgColor2}
          opacity="0.85"
        />
      ))}

      {/* Target Number Dots */}
      {targetDots.map((d, i) => (
        <circle
          key={`num-${i}`}
          cx={d.x}
          cy={d.y}
          r={i % 3 === 0 ? 8 : 7}
          fill={i % 2 === 0 ? numberColor1 : numberColor2}
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

export default function ColorBlindnessTest({ onComplete }) {
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const activePlate = COLOR_PLATES[currentPlateIndex] || COLOR_PLATES[0];

  const handleSelect = (option) => {
    setSelectedOption(option);
    const isCorrect = option === activePlate.correctAnswer;
    const updatedAnswers = [...answers, { plateId: activePlate.id, selected: option, isCorrect }];
    setAnswers(updatedAnswers);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentPlateIndex + 1 < COLOR_PLATES.length) {
        setCurrentPlateIndex((prev) => prev + 1);
      } else {
        // Completed all color plates
        const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
        if (onComplete) {
          onComplete({
            colorScore: correctCount,
            totalPlates: COLOR_PLATES.length,
            isNormal: correctCount >= 2
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
            Ishihara Plate {currentPlateIndex + 1}/{COLOR_PLATES.length}
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
        <IshiharaPlateSVG plateId={activePlate.id} />
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

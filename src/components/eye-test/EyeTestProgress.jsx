'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { EYE_TEST_STEPS } from '@/lib/eye-test/constants';

const STAGES = [
  { id: 'setup', label: 'Instructions', steps: [EYE_TEST_STEPS.WELCOME, EYE_TEST_STEPS.INSTRUCTIONS] },
  { id: 'right_eye', label: 'Right Eye', steps: [EYE_TEST_STEPS.PREPARE_RIGHT, EYE_TEST_STEPS.TEST_RIGHT] },
  { id: 'left_eye', label: 'Left Eye', steps: [EYE_TEST_STEPS.PREPARE_LEFT, EYE_TEST_STEPS.TEST_LEFT] },
  { id: 'results', label: 'Results', steps: [EYE_TEST_STEPS.COMPLETION] }
];

export default function EyeTestProgress({ currentStep }) {
  // Determine which stage is active
  const activeStageIndex = STAGES.findIndex((s) => s.steps.includes(currentStep));

  return (
    <div className="w-full px-4 sm:px-6 pt-3 pb-2 border-b border-slate-200/80 bg-slate-50/80">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStageIndex;
          const isCurrent = idx === activeStageIndex;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Step Node */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#0A1E3F] text-[#DFBF64] ring-4 ring-[#C59B27]/20 shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-semibold tracking-tight transition-colors hidden xs:block sm:block ${
                    isCurrent
                      ? 'text-[#0A1E3F] font-bold'
                      : isDone
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connecting Bar */}
              {idx < STAGES.length - 1 && (
                <div className="flex-1 mx-1.5 sm:mx-3 h-[2px] bg-slate-200 relative overflow-hidden rounded-full">
                  <div
                    className={`h-full transition-all duration-500 ${
                      idx < activeStageIndex
                        ? 'w-full bg-emerald-600'
                        : isCurrent
                        ? 'w-1/2 bg-[#C59B27]'
                        : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

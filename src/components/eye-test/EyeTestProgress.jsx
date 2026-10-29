'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { EYE_TEST_STEPS } from '@/lib/eye-test/constants';

const STAGES = [
  {
    id: 'instructions',
    label: 'Instructions',
    steps: [
      EYE_TEST_STEPS.WELCOME,
      EYE_TEST_STEPS.INSTRUCTIONS
    ]
  },
  {
    id: 'right-eye',
    label: 'Right Eye',
    steps: [
      EYE_TEST_STEPS.PREPARE_RIGHT,
      EYE_TEST_STEPS.TEST_RIGHT
    ]
  },
  {
    id: 'left-eye',
    label: 'Left Eye',
    steps: [
      EYE_TEST_STEPS.PREPARE_LEFT,
      EYE_TEST_STEPS.TEST_LEFT,
      EYE_TEST_STEPS.CONTRAST_TEST,
      EYE_TEST_STEPS.ASTIGMATISM_INTRO,
      EYE_TEST_STEPS.ASTIGMATISM_TEST,
      EYE_TEST_STEPS.COLOR_BLINDNESS_TEST
    ]
  },
  {
    id: 'results',
    label: 'Results',
    steps: [
      EYE_TEST_STEPS.OPTIONAL_LEAD,
      EYE_TEST_STEPS.COMPLETION
    ]
  }
];

export default function EyeTestProgress({ currentStep }) {
  // Determine which stage is active
  const activeStageIndex = STAGES.findIndex((s) => s.steps.includes(currentStep));

  return (
    <div className="w-full px-4 sm:px-8 pt-3 pb-2.5 border-b border-slate-100 bg-white">
      <div className="max-w-xl mx-auto flex items-start justify-between">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStageIndex;
          const isCurrent = idx === activeStageIndex;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Step Node */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isDone
                      ? 'bg-[#0EAE8A] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#0A1E3F] text-white ring-4 ring-[#0A1E3F]/15 shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-xs tracking-tight transition-colors ${
                    isDone
                      ? 'text-[#0EAE8A] font-bold'
                      : isCurrent
                      ? 'text-[#0A1E3F] font-bold'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connecting Bar (aligned with circle center) */}
              {idx < STAGES.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-3 h-[2px] bg-slate-200 relative overflow-hidden rounded-full mt-3.5 sm:mt-4">
                  <div
                    className={`h-full transition-all duration-500 ${
                      idx < activeStageIndex
                        ? 'w-full bg-[#0EAE8A]'
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


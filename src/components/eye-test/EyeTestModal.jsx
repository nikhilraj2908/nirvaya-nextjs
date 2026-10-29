'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import { EYE_TEST_STEPS } from '@/lib/eye-test/constants';
import { createEyeState, evaluateTrialAnswer } from '@/lib/eye-test/testEngine';
import { getDefaultPixelsPerMm } from '@/lib/eye-test/calibration';
import { trackEvent } from '@/lib/gtag';

import EyeTestProgress from './EyeTestProgress';
import EyeTestWelcome from './EyeTestWelcome';
import EyeTestInstructions from './EyeTestInstructions';
import EyeSelection from './EyeSelection';
import VisualAcuityTest from './VisualAcuityTest';
import EyeTestCompletion from './EyeTestCompletion';

export default function EyeTestModal({
  isOpen,
  onClose,
  onOpenPreBook
}) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(EYE_TEST_STEPS.WELCOME);
  const [pixelsPerMm, setPixelsPerMm] = useState(() => getDefaultPixelsPerMm());
  const [rightEyeState, setRightEyeState] = useState(() => createEyeState());
  const [leftEyeState, setLeftEyeState] = useState(() => createEyeState());
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(EYE_TEST_STEPS.WELCOME);
      setRightEyeState(createEyeState());
      setLeftEyeState(createEyeState());
      setShowExitConfirm(false);

      // Lock background scrolling
      document.body.style.overflow = 'hidden';

      // Analytics: eye test opened
      trackEvent('eye_test_opened', {
        event_category: 'Vision Screening',
        event_label: 'Modal Opened'
      });
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Safe Close request
  const requestClose = useCallback(() => {
    // If the test is actively in progress (between setup and completion), confirm first
    if (
      step > EYE_TEST_STEPS.WELCOME &&
      step < EYE_TEST_STEPS.COMPLETION
    ) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  }, [step, onClose]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showExitConfirm) {
          setShowExitConfirm(false);
        } else {
          requestClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showExitConfirm, requestClose]);

  // 1. Start from Welcome
  const handleStart = () => {
    trackEvent('eye_test_started', {
      event_category: 'Vision Screening',
      event_label: 'Instructions Reached'
    });
    setStep(EYE_TEST_STEPS.INSTRUCTIONS);
  };

  // 2. Instructions -> Right Eye Setup (One hand distance accepted)
  const handleInstructionsContinue = () => {
    trackEvent('eye_test_instructions_completed', {
      event_category: 'Vision Screening',
      event_label: 'Instructions Accepted'
    });
    setStep(EYE_TEST_STEPS.PREPARE_RIGHT);
  };

  // 3. Right Eye Ready -> Start Right Eye Acuity Test
  const handleStartRightTest = () => {
    setStep(EYE_TEST_STEPS.TEST_RIGHT);
  };

  // 4. Answer for Right Eye
  const handleRightAnswer = (chosenDirection) => {
    setRightEyeState((prev) => {
      const updated = evaluateTrialAnswer(prev, chosenDirection);
      if (updated.isComplete) {
        // Automatically transition to Left Eye Setup
        setTimeout(() => {
          setStep(EYE_TEST_STEPS.PREPARE_LEFT);
        }, 400);
      }
      return updated;
    });
  };

  // 5. Left Eye Ready -> Start Left Eye Acuity Test
  const handleStartLeftTest = () => {
    setStep(EYE_TEST_STEPS.TEST_LEFT);
  };

  // 6. Answer for Left Eye
  const handleLeftAnswer = (chosenDirection) => {
    setLeftEyeState((prev) => {
      const updated = evaluateTrialAnswer(prev, chosenDirection);
      if (updated.isComplete) {
        // Automatically transition to Completion
        setTimeout(() => {
          trackEvent('eye_test_completed', {
            event_category: 'Vision Screening',
            event_label: 'All Eyes Completed'
          });
          setStep(EYE_TEST_STEPS.COMPLETION);
        }, 400);
      }
      return updated;
    });
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="eye-test-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
    >
      {/* Dimmed Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#061226]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={requestClose}
        aria-hidden="true"
      />

      {/* Main Modal Window */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200/90 shadow-[0_25px_70px_rgba(10,30,63,0.35)] overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header Bar */}
        <div className="px-5 sm:px-7 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DFBF64] animate-pulse" />
            <h2 id="eye-test-modal-title" className="text-xs sm:text-sm font-bold text-[#0A1E3F] tracking-tight font-heading">
              Nirvaya Eyecare Centre • Online Vision Screening
            </h2>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close Vision Screening"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0A1E3F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Stepper Bar (visible once started) */}
        {step > EYE_TEST_STEPS.WELCOME && (
          <EyeTestProgress currentStep={step} />
        )}

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {step === EYE_TEST_STEPS.WELCOME && (
            <EyeTestWelcome onStart={handleStart} />
          )}

          {step === EYE_TEST_STEPS.INSTRUCTIONS && (
            <EyeTestInstructions
              onContinue={handleInstructionsContinue}
              onBack={() => setStep(EYE_TEST_STEPS.WELCOME)}
            />
          )}

          {step === EYE_TEST_STEPS.PREPARE_RIGHT && (
            <EyeSelection
              currentEye="RIGHT"
              onStartTest={handleStartRightTest}
            />
          )}

          {step === EYE_TEST_STEPS.TEST_RIGHT && (
            <VisualAcuityTest
              currentEye="RIGHT"
              eyeState={rightEyeState}
              pixelsPerMm={pixelsPerMm}
              onAnswer={handleRightAnswer}
            />
          )}

          {step === EYE_TEST_STEPS.PREPARE_LEFT && (
            <EyeSelection
              currentEye="LEFT"
              onStartTest={handleStartLeftTest}
            />
          )}

          {step === EYE_TEST_STEPS.TEST_LEFT && (
            <VisualAcuityTest
              currentEye="LEFT"
              eyeState={leftEyeState}
              pixelsPerMm={pixelsPerMm}
              onAnswer={handleLeftAnswer}
            />
          )}

          {step === EYE_TEST_STEPS.COMPLETION && (
            <EyeTestCompletion
              rightEyeResult={rightEyeState}
              leftEyeResult={leftEyeState}
              onBookAppointment={() => {
                onClose();
                if (onOpenPreBook) {
                  onOpenPreBook();
                } else {
                  window.location.href = '/pre-book';
                }
              }}
              onClose={onClose}
            />
          )}
        </div>

        {/* Accidental Exit Confirmation Prompt */}
        {showExitConfirm && (
          <div className="absolute inset-0 bg-[#061226]/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-bold text-[#0A1E3F]">
                  Exit Vision Screening?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your current screening progress will be reset. Are you sure you want to exit?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Continue Test
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExitConfirm(false);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Exit Screening
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

'use client';

import React, { useState } from 'react';
import {
  Calendar,
  MessageCircle,
  Phone,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Target,
  SunDim,
  Compass,
  Palette,
  ShieldAlert
} from 'lucide-react';
import Button from '@/components/common/Button';
import { CLINIC_INFO } from '@/data/siteData';
import { CLINICAL_DISCLAIMER } from '@/lib/eye-test/constants';
import {
  interpretEyeResult,
  interpretContrastResult,
  interpretAstigmatismResult,
  interpretColorVisionResult,
  calculatePillarScores
} from '@/lib/eye-test/scoring';
import EyeTestLeadForm from './EyeTestLeadForm';
import { trackEvent } from '@/lib/gtag';

/**
 * Smiling Eye Icon matching the clinical screening design:
 * Almond eye contour outline. Green smile if 12/12, Amber concerned pupil if <12/12.
 */
function SmilingEyeIcon({ score = 12, maxScore = 12, className = 'w-24 h-13' }) {
  const isHealthy = score >= maxScore;
  const pupilColor = isHealthy ? '#0EAE8A' : '#D97706';

  return (
    <svg
      viewBox="0 0 100 56"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Almond Eye Contour */}
      <path
        d="M 6 28 C 22 10, 78 10, 94 28 C 78 46, 22 46, 6 28 Z"
        stroke="#0A1E3F"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FFFFFF"
      />
      {/* Pupil Circle */}
      <circle cx="50" cy="28" r="16.5" fill={pupilColor} />
      {/* Pupil Eyes */}
      <circle cx="44.5" cy="24" r="2.2" fill="#0A1E3F" />
      <circle cx="55.5" cy="24" r="2.2" fill="#0A1E3F" />
      {/* Mouth Expression: Smile if 12, concerned/neutral if < 12 */}
      {isHealthy ? (
        <path
          d="M 43.5 30.5 C 45.5 36.5, 54.5 36.5, 56.5 30.5"
          stroke="#0A1E3F"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M 43.5 33.5 C 46.5 30.5, 53.5 30.5, 56.5 33.5"
          stroke="#0A1E3F"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

export default function EyeTestCompletion({
  rightEyeResult = {},
  leftEyeResult = {},
  contrastResult = {},
  astigmatismResult = {},
  colorResult = {},
  leadData = null,
  onBookAppointment,
  onRetake,
  onClose
}) {
  const [expandedPillar, setExpandedPillar] = useState(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);

  const scores = calculatePillarScores({
    rightEyeResult,
    leftEyeResult,
    contrastResult,
    astigmatismResult,
    colorResult
  });

  const rightInterpretation = interpretEyeResult(rightEyeResult?.achievedAcuity);
  const leftInterpretation = interpretEyeResult(leftEyeResult?.achievedAcuity);
  const contrastInterp = interpretContrastResult(contrastResult?.contrastScore, contrastResult?.totalTrials);
  const astigmatismInterp = interpretAstigmatismResult(astigmatismResult?.isUniform);
  const colorInterp = interpretColorVisionResult(colorResult?.colorScore, colorResult?.totalPlates);

  const togglePillar = (id) => {
    setExpandedPillar((prev) => (prev === id ? null : id));
  };

  const whatsappMessage = encodeURIComponent(
    scores.isHealthy
      ? `Hello Nirvaya Eyecare Centre, I just completed your online eye test (Score: 12/12) and would like to schedule a routine consultation with Dr. Sandhya Gaur.`
      : `Hello Nirvaya Eyecare Centre, my online vision screening indicated that my eyes need a check-up (Left: ${scores.leftScore}/12, Right: ${scores.rightScore}/12${scores.issueSummary ? ` - ${scores.issueSummary}` : ''}). I would like to book an appointment with Dr. Sandhya Gaur.`
  );
  const whatsappUrl = `https://wa.me/${CLINIC_INFO.whatsappRaw || '919425018200'}?text=${whatsappMessage}`;

  const handleBookClick = () => {
    trackEvent('eye_test_book_appointment_clicked', {
      event_category: 'Consultation',
      event_label: 'Online Eye Test Completion'
    });
    if (onBookAppointment) {
      onBookAppointment();
    } else {
      window.location.href = '/pre-book';
    }
  };

  const handleWhatsAppClick = () => {
    trackEvent('eye_test_whatsapp_clicked', {
      event_category: 'Lead Generation',
      event_label: 'WhatsApp Click'
    });
  };

  // Generate dynamic clinical banner text based on user's results
  const bannerDescription = (() => {
    if (scores.isHealthy) {
      return "You've done well. Schedule an in-person consultation at Nirvaya Eyecare for the most accurate in-clinic results.";
    }
    if (scores.leftScore < 12 && scores.rightScore === 12) {
      return `A variation was detected in your Left Eye (${scores.leftScore}/12). Please contact us or schedule a consultation with Dr. Sandhya Gaur at Nirvaya Eyecare Centre for a detailed in-person check-up.`;
    }
    if (scores.rightScore < 12 && scores.leftScore === 12) {
      return `A variation was detected in your Right Eye (${scores.rightScore}/12). Please contact us or schedule a consultation with Dr. Sandhya Gaur at Nirvaya Eyecare Centre for a detailed in-person check-up.`;
    }
    return `Variations were detected in your vision screening${scores.issueSummary ? ` (${scores.issueSummary})` : ''}. Please contact our clinic or schedule a consultation with Dr. Sandhya Gaur at Nirvaya Eyecare Centre to evaluate your eye health.`;
  })();

  return (
    <div className="p-4 sm:p-7 max-w-xl mx-auto flex flex-col space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Overall Eye Health Heading */}
      <div className="text-center space-y-1">
        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          Overall Eye Health
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
          Preliminary 4-Pillar Screening (Visual Acuity • Contrast Vision • Astigmatism • Visual Field)
        </p>
      </div>

      {/* 2. Smiling Eye Scores (Left Score & Right Score) */}
      <div className="grid grid-cols-2 gap-4 sm:gap-10 max-w-sm mx-auto items-center justify-center pt-1 pb-1">
        {/* Left Score */}
        <div className="flex flex-col items-center">
          <SmilingEyeIcon score={scores.leftScore} className="w-20 h-11 sm:w-24 sm:h-13" />
          <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#0A1E3F] mt-2">
            LEFT SCORE
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-[#0A1E3F] tracking-tight">
            ( {scores.leftScore} / 12 )
          </span>
          {scores.leftScore < 12 && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 mt-1">
              Check-up Advised
            </span>
          )}
        </div>

        {/* Right Score */}
        <div className="flex flex-col items-center">
          <SmilingEyeIcon score={scores.rightScore} className="w-20 h-11 sm:w-24 sm:h-13" />
          <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-[#0A1E3F] mt-2">
            RIGHT SCORE
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-[#0A1E3F] tracking-tight">
            ( {scores.rightScore} / 12 )
          </span>
          {scores.rightScore < 12 && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 mt-1">
              Check-up Advised
            </span>
          )}
        </div>
      </div>

      {/* 3. Health Status Banner (Green if 12/12, Amber Alert if variation detected) */}
      <div
        className={`text-white rounded-2xl sm:rounded-[22px] p-4 sm:p-5 flex items-start gap-3.5 shadow-sm text-left transition-colors ${
          scores.isHealthy
            ? 'bg-[#0EAE8A]'
            : 'bg-gradient-to-r from-amber-600 to-amber-700 ring-2 ring-amber-400/40 shadow-md'
        }`}
      >
        <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shrink-0 mt-0.5">
          {scores.isHealthy ? (
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          )}
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-base sm:text-lg text-white tracking-tight leading-snug">
            {scores.isHealthy ? 'Your Eyesight is in Good Health.' : 'Your Eyes Need a Check-up'}
          </h4>
          <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal">
            {bannerDescription}
          </p>
        </div>
      </div>

      {/* 4. Action Buttons: Book Consultation first, then Retake */}
      <div className="space-y-2.5">
        <Button
          variant="gold"
          size="lg"
          onClick={handleBookClick}
          icon={Calendar}
          className={`w-full font-bold text-sm sm:text-base py-3.5 sm:py-4 justify-center shadow-md hover:shadow-lg cursor-pointer ${
            !scores.isHealthy ? 'ring-2 ring-[#C59B27] animate-pulse' : ''
          }`}
        >
          Book an Eye Consultation
        </Button>

        <button
          type="button"
          onClick={onRetake}
          className="w-full py-3 px-4 rounded-xl sm:rounded-2xl border-2 border-[#0A1E3F] bg-white hover:bg-slate-50 text-[#0A1E3F] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-4 h-4 text-[#C59B27]" />
          <span>Retake the test</span>
        </button>
      </div>

      {/* 5. Detailed 4-Pillar Analysis Accordion */}
      <div className="space-y-2.5 text-left pt-1">
        <h4 className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-slate-500 px-1">
          DETAILED 4-PILLAR ANALYSIS
        </h4>

        {/* Pillar 1: Visual Acuity */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => togglePillar('acuity')}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#C59B27] shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-[#0A1E3F] block">
                  Visual Acuity
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Snellen / Landolt C broken-ring resolution
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  scores.rightAcuityPts >= 3 && scores.leftAcuityPts >= 3
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {scores.rightAcuityPts >= 3 && scores.leftAcuityPts >= 3
                  ? rightEyeResult?.achievedAcuity?.snellenUS || 'Normal'
                  : 'Check-up Advised'}
              </span>
              {expandedPillar === 'acuity' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {expandedPillar === 'acuity' && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-xs text-slate-700 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <strong className="text-[#0A1E3F]">Right Eye:</strong> {rightEyeResult?.achievedAcuity?.snellenUS || 'Not Completed'}
                  <p className="text-[11px] text-slate-600 mt-0.5">{rightInterpretation.title}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <strong className="text-[#0A1E3F]">Left Eye:</strong> {leftEyeResult?.achievedAcuity?.snellenUS || 'Not Completed'}
                  <p className="text-[11px] text-slate-600 mt-0.5">{leftInterpretation.title}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Visual acuity measures resolving capacity under calibrated screen viewing distance.
              </p>
            </div>
          )}
        </div>

        {/* Pillar 2: Contrast Vision */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => togglePillar('contrast')}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#C59B27] shrink-0">
                <SunDim className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-[#0A1E3F] block">
                  Contrast Vision
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Subtle gray gradation sensitivity
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${contrastInterp.badgeColor}`}>
                {contrastInterp.isNormal ? 'Normal' : 'Reduced'}
              </span>
              {expandedPillar === 'contrast' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {expandedPillar === 'contrast' && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-1.5 text-xs text-slate-700 animate-in fade-in duration-150">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {contrastInterp.summary}
              </p>
            </div>
          )}
        </div>

        {/* Pillar 3: Astigmatism */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => togglePillar('astigmatism')}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#C59B27] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-[#0A1E3F] block">
                  Astigmatism
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Radial fan dial meridian curvature
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${astigmatismInterp.badgeColor}`}>
                {astigmatismInterp.isNormal ? 'Normal' : 'Possible'}
              </span>
              {expandedPillar === 'astigmatism' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {expandedPillar === 'astigmatism' && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-1.5 text-xs text-slate-700 animate-in fade-in duration-150">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {astigmatismInterp.summary}
              </p>
            </div>
          )}
        </div>

        {/* Pillar 4: Visual Field / Color Vision */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => togglePillar('color')}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#C59B27] shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-[#0A1E3F] block">
                  Visual Field & Color Vision
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Pseudoisochromatic Ishihara discrimination
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${colorInterp.badgeColor}`}>
                {colorInterp.isNormal ? 'Normal' : 'Variance'}
              </span>
              {expandedPillar === 'color' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {expandedPillar === 'color' && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-1.5 text-xs text-slate-700 animate-in fade-in duration-150">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {colorInterp.summary}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Clinical Consultation CTAs */}
      <div className="space-y-2.5 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Primary CTA: Book Consultation */}
          <Button
            variant="gold"
            size="lg"
            onClick={handleBookClick}
            icon={Calendar}
            className={`w-full font-bold text-xs sm:text-sm py-3 justify-center shadow-md hover:shadow-lg cursor-pointer ${
              !scores.isHealthy ? 'ring-2 ring-[#C59B27] animate-pulse' : ''
            }`}
          >
            Book an Eye Consultation
          </Button>

          {/* Secondary CTA: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Direct phone contact */}
        <div className="text-center pt-0.5">
          <a
            href={`tel:${CLINIC_INFO.phoneRaw || '+917554928200'}`}
            className="text-xs text-slate-500 hover:text-[#0A1E3F] inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Or call us directly at <strong>{CLINIC_INFO.phone}</strong> (Ayodhya Bypass, Bhopal)</span>
          </a>
        </div>
      </div>

      {/* 7. Optional Callback Request Toggle */}
      {!leadData?.saved && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowCallbackForm(!showCallbackForm)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#0A1E3F] transition-colors cursor-pointer"
          >
            <span>Need our clinical coordinator to call you back?</span>
            <span className="flex items-center gap-1 text-[#C59B27]">
              {showCallbackForm ? 'Hide Form' : 'Request Callback'}
              {showCallbackForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>

          {showCallbackForm && (
            <div className="mt-3 text-left">
              <EyeTestLeadForm
                screeningSummary={{
                  rightEye: rightEyeResult?.achievedAcuity?.snellenUS || '20/20',
                  leftEye: leftEyeResult?.achievedAcuity?.snellenUS || '20/20',
                  contrast: contrastInterp.status,
                  astigmatism: astigmatismInterp.status,
                  colorVision: colorInterp.status
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 8. Clinical Disclaimer Box */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-left flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-950 leading-relaxed">
          <strong>Important Clinical Reminder:</strong> {CLINICAL_DISCLAIMER}
        </p>
      </div>

      {/* 9. Close & Return Link */}
      <div className="text-center pt-0.5 pb-1">
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-[#0A1E3F] underline decoration-slate-300 hover:decoration-slate-600 cursor-pointer font-semibold"
        >
          Close & Return to Nirvaya Eyecare Homepage
        </button>
      </div>
    </div>
  );
}

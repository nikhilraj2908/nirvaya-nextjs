'use client';

import React, { useState } from 'react';
import {
  Calendar,
  MessageCircle,
  Phone,
  Eye,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Button from '@/components/common/Button';
import SafeLink from '@/components/common/SafeLink';
import { CLINIC_INFO } from '@/data/siteData';
import { CLINICAL_DISCLAIMER } from '@/lib/eye-test/constants';
import { interpretEyeResult } from '@/lib/eye-test/scoring';
import EyeTestLeadForm from './EyeTestLeadForm';
import { trackEvent } from '@/lib/gtag';

export default function EyeTestCompletion({
  rightEyeResult,
  leftEyeResult,
  onBookAppointment,
  onClose
}) {
  const [showCallbackForm, setShowCallbackForm] = useState(false);

  const rightInterpretation = interpretEyeResult(rightEyeResult?.achievedAcuity);
  const leftInterpretation = interpretEyeResult(leftEyeResult?.achievedAcuity);

  const whatsappMessage = encodeURIComponent(
    `Hello Nirvaya Eyecare Centre, I just completed your online vision screening and would like to consult Dr. Sandhya Gaur.`
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

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Completion Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm ring-4 ring-emerald-500/15">
          <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          Your Vision Screening Is Complete!
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Thank you for completing your online vision screening. This preliminary screening cannot replace a professional eye examination. For a detailed evaluation and personalized guidance, connect with our eye-care specialists.
        </p>
      </div>

      {/* Results Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Right Eye Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A1E3F] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
              Right Eye (O.D.)
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${rightInterpretation.badgeColor}`}>
              {rightEyeResult?.achievedAcuity?.snellenUS || 'Screened'}
            </span>
          </div>

          <h4 className="text-sm font-bold text-[#0A1E3F]">
            {rightInterpretation.title}
          </h4>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            {rightInterpretation.summary}
          </p>
        </div>

        {/* Left Eye Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A1E3F] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
              Left Eye (O.S.)
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${leftInterpretation.badgeColor}`}>
              {leftEyeResult?.achievedAcuity?.snellenUS || 'Screened'}
            </span>
          </div>

          <h4 className="text-sm font-bold text-[#0A1E3F]">
            {leftInterpretation.title}
          </h4>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            {leftInterpretation.summary}
          </p>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Primary CTA: Book an Eye Consultation */}
          <Button
            variant="gold"
            size="lg"
            onClick={handleBookClick}
            icon={Calendar}
            className="w-full font-bold text-xs sm:text-sm py-3 justify-center shadow-md hover:shadow-lg cursor-pointer"
          >
            Book an Eye Consultation
          </Button>

          {/* Secondary CTA: Talk to Our Team (WhatsApp) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Talk to Our Team on WhatsApp</span>
          </a>
        </div>

        {/* Call Hospital directly option */}
        <div className="text-center">
          <a
            href={`tel:${CLINIC_INFO.phoneRaw || '+917554928200'}`}
            className="text-xs text-slate-500 hover:text-[#0A1E3F] inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Or call us directly at <strong>{CLINIC_INFO.phone}</strong> (Ayodhya Bypass, Bhopal)</span>
          </a>
        </div>
      </div>

      {/* Optional CTA: Request a Callback Toggle */}
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
          <div className="mt-3">
            <EyeTestLeadForm
              screeningSummary={{
                rightEye: rightEyeResult?.achievedAcuity?.snellenUS,
                leftEye: leftEyeResult?.achievedAcuity?.snellenUS
              }}
            />
          </div>
        )}
      </div>

      {/* Clinical Disclaimer Notice */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-left flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-950 leading-relaxed">
          <strong>Important Clinical Reminder:</strong> {CLINICAL_DISCLAIMER}
        </p>
      </div>

      {/* Close button to return to homepage */}
      <div className="text-center pt-1">
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

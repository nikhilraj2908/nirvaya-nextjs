'use client';

import React, { useState } from 'react';
import { User, Phone, CheckCircle2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Button from '@/components/common/Button';
import { trackEvent } from '@/lib/gtag';

export default function OptionalLeadGate({
  screeningSummary = {},
  onContinue
}) {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = patientName.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    // If submitted, validate properly
    if (cleanName.length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        patientName: cleanName,
        phone: cleanPhone,
        preferredSlot: 'Flexible / As soon as possible',
        preferredDate: new Date().toISOString().split('T')[0],
        specialty: 'Online Vision Screening Report',
        source: 'online_eye_test',
        status: 'new',
        reason: `Completed online eye test: Acuity R: ${screeningSummary.rightAcuity || 'Screened'}, L: ${screeningSummary.leftAcuity || 'Screened'}, Contrast: ${screeningSummary.contrast || 'Screened'}, Astigmatism: ${screeningSummary.astigmatism || 'Screened'}, Color Vision: ${screeningSummary.colorVision || 'Screened'}`
      };

      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      trackEvent('eye_test_lead_submitted', {
        event_category: 'Lead Generation',
        event_label: 'Optional Lead Gate'
      });

      onContinue({
        name: cleanName,
        phone: cleanPhone,
        saved: true
      });
    } catch (err) {
      // Even if network fails, proceed so user sees their result
      onContinue({
        name: cleanName,
        phone: cleanPhone,
        saved: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    trackEvent('eye_test_lead_skipped', {
      event_category: 'Vision Screening',
      event_label: 'Lead Gate Skipped'
    });
    onContinue({ saved: false });
  };

  return (
    <div className="p-5 sm:p-7 max-w-lg mx-auto flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Icon */}
      <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center ring-4 ring-emerald-500/15">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      {/* Headings */}
      <div className="space-y-1">
        <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0A1E3F]">
          Your Eye Test Is Complete!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Enter your name and number to save your report and receive consultation assistance from Nirvaya Eyecare specialists.
        </p>
      </div>

      {/* Optional Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-3 text-left pt-1">
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Name input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Full Name (Optional)</span>
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 text-xs sm:text-sm outline-none transition-all"
          />
        </div>

        {/* Mobile Number input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Mobile Number (Optional)</span>
          </label>
          <div className="flex items-center">
            <span className="px-3 py-2.5 rounded-l-xl bg-slate-100 border border-r-0 border-slate-300 text-xs font-bold text-slate-600">
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              maxLength={10}
              className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-300 focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 text-xs sm:text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 space-y-2.5">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            disabled={loading}
            icon={loading ? Loader2 : ArrowRight}
            iconPosition="right"
            className="w-full font-bold text-xs sm:text-sm py-3 justify-center shadow-md cursor-pointer"
          >
            {loading ? 'Saving...' : 'View My Report & Save'}
          </Button>

          {/* Skip Link (Makes entering details optional) */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-bold text-slate-500 hover:text-[#0A1E3F] hover:underline cursor-pointer transition-colors"
            >
              Skip and view result directly &rarr;
            </button>
          </div>
        </div>
      </form>

      {/* Privacy note */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Your information is confidential and used only for clinical care.</span>
      </div>
    </div>
  );
}

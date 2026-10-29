'use client';

import React, { useState } from 'react';
import { Phone, User, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/common/Button';
import { trackEvent } from '@/lib/gtag';

export default function EyeTestLeadForm({ screeningSummary }) {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    preferredSlot: 'Flexible / As soon as possible',
    consent: true
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Name validation
    if (!formData.patientName || formData.patientName.trim().length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }

    // Phone validation (10 digits Indian format)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.consent) {
      setErrorMsg('Please check the consent box to allow our medical coordinator to reach you.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        patientName: formData.patientName.trim(),
        phone: cleanPhone,
        preferredSlot: formData.preferredSlot,
        preferredDate: new Date().toISOString().split('T')[0],
        specialty: 'Online Vision Screening Follow-up',
        source: 'online_eye_test',
        status: 'new',
        reason: 'Requested callback after completing the online vision screening.'
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit callback request.');
      }

      setSuccessData(data.appointment);
      trackEvent('eye_test_callback_requested', {
        event_category: 'Lead Generation',
        event_label: 'Online Eye Test Callback'
      });
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-5 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading text-base font-bold text-emerald-950">
            Callback Request Received!
          </h4>
          <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
            Thank you, <strong>{successData.patientName}</strong>. Our clinical coordination desk has received your request. We will reach you shortly at <strong>+91 {successData.phone}</strong>.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-mono font-bold text-emerald-900">
          <span>Enquiry Ref:</span>
          <span>{successData.bookingRef}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3.5 text-left">
      <div className="space-y-0.5">
        <h4 className="text-sm font-bold text-[#0A1E3F] flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-[#C59B27]" />
          <span>Request a Callback from Nirvaya Eyecare</span>
        </h4>
        <p className="text-xs text-slate-500">
          Have questions regarding your vision or doctor availability? Leave your contact details below.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Rajesh Kumar"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27] placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Mobile Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              maxLength={14}
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27] placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Preferred Time Slot */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Preferred Call Time
        </label>
        <div className="relative">
          <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={formData.preferredSlot}
            onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0A1E3F] focus:outline-none focus:ring-2 focus:ring-[#C59B27] cursor-pointer"
          >
            <option value="Flexible / As soon as possible">Flexible / As soon as possible</option>
            <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
            <option value="Afternoon (2:00 PM – 5:00 PM)">Afternoon (2:00 PM – 5:00 PM)</option>
            <option value="Evening (5:00 PM – 8:00 PM)">Evening (5:00 PM – 8:00 PM)</option>
          </select>
        </div>
      </div>

      {/* Consent Checkbox */}
      <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-0.5">
        <input
          type="checkbox"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="mt-0.5 rounded text-[#C59B27] focus:ring-[#C59B27] accent-[#C59B27]"
        />
        <span>I consent to be contacted by Nirvaya Eyecare Centre regarding this enquiry.</span>
      </label>

      {/* Submit Button */}
      <div className="pt-1">
        <Button
          type="submit"
          variant="gold"
          size="sm"
          disabled={loading}
          className="w-full font-bold text-xs justify-center py-2.5 shadow-sm cursor-pointer"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Submitting...
            </span>
          ) : (
            'Request Free Callback'
          )}
        </Button>
      </div>
    </form>
  );
}

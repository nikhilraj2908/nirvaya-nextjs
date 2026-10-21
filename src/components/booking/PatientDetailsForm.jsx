'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  FileText,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { formatReadableDate } from '@/utils/bookingDateHelpers';

export default function PatientDetailsForm({
  doctor,
  selectedDate,
  selectedSlot,
  formData,
  onChangeFormData,
  onSubmitBooking,
  onBackToSlots,
  submitting = false,
  submitError = null,
  isSlotConflict = false
}) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.patientName || formData.patientName.trim().length < 2) {
      errs.patientName = "Please enter the patient's full name (at least 2 letters)";
    }

    const cleanPhone = (formData.phone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number starting with 6-9';
    }

    if (formData.email && formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = 'Please provide a valid email address';
      }
    }

    if (!formData.consent) {
      errs.consent = 'Consent is required to schedule clinical consultation';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    if (validate()) {
      onSubmitBooking();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <button
          type="button"
          onClick={onBackToSlots}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-[#0A1E3F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Slot / Date</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-[#DFBF64] bg-[#0A1E3F] px-3 py-1 rounded-full">
          Step 4 of 4 • Patient Details
        </span>
      </div>

      {/* Appointment Summary Strip */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase font-bold block">
            Specialist
          </span>
          <span className="font-bold text-[#0A1E3F] truncate block">
            {doctor?.name || 'Eye Surgeon'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 text-[10px] uppercase font-bold block">
            Date
          </span>
          <div className="font-bold text-[#0A1E3F] flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-[#DFBF64]" />
            <span>{formatReadableDate(selectedDate)}</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-[10px] uppercase font-bold block">
            Time Slot
          </span>
          <div className="font-bold text-[#0A1E3F] flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-[#DFBF64]" />
            <span>{selectedSlot?.displayTime} (IST)</span>
          </div>
        </div>
      </div>

      {/* Conflict / Error Banner */}
      {submitError && (
        <div
          className={`p-4 rounded-xl mb-6 flex items-start space-x-3 text-xs ${
            isSlotConflict
              ? 'bg-amber-50 border border-amber-200 text-amber-900'
              : 'bg-red-50 border border-red-200 text-red-900'
          }`}
        >
          {isSlotConflict ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-bold">
              {isSlotConflict ? 'Time Slot Conflict' : 'Booking Error'}
            </p>
            <p className="mt-0.5">{submitError}</p>
            {isSlotConflict && (
              <button
                type="button"
                onClick={onBackToSlots}
                className="mt-2.5 inline-flex items-center space-x-1 font-bold text-amber-900 underline hover:text-amber-950 cursor-pointer"
              >
                <span>Choose another slot (Your form inputs are saved)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Patient Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Patient Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={(e) => onChangeFormData({ patientName: e.target.value })}
              placeholder="e.g. Ramesh Chandra Verma"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DFBF64] focus:bg-white transition-all ${
                errors.patientName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.patientName && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.patientName}</p>
          )}
        </div>

        {/* Phone & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                +91
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => onChangeFormData({ phone: e.target.value })}
                placeholder="98765 43210"
                maxLength={12}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DFBF64] focus:bg-white transition-all ${
                  errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Email Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => onChangeFormData({ email: e.target.value })}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DFBF64] focus:bg-white transition-all ${
                  errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Symptoms / Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Symptoms / Reason for Visit <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              name="reason"
              rows={2}
              value={formData.reason}
              onChange={(e) => onChangeFormData({ reason: e.target.value })}
              placeholder="e.g. Blurred vision in right eye, diabetic checkup, foreign body sensation"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DFBF64] focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => onChangeFormData({ consent: e.target.checked })}
              className="mt-0.5 rounded text-[#0A1E3F] focus:ring-[#DFBF64] w-4 h-4"
            />
            <span className="text-xs text-slate-600 leading-snug">
              I confirm the above details are accurate and authorize Nirvaya Eyecare Centre to contact
              me via call/SMS regarding this consultation schedule.
            </span>
          </label>
          {errors.consent && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.consent}</p>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onBackToSlots}
            className="w-full sm:w-auto px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Back to Slots
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto flex-1 py-3 px-6 bg-[#0A1E3F] text-[#DFBF64] font-bold text-sm rounded-xl hover:bg-[#132c57] transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#DFBF64] cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#DFBF64]" />
                <span>Reserving Appointment Slot...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Reserve Appointment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

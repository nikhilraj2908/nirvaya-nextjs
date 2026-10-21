'use client';

import React from 'react';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatReadableDate, TIME_ZONE_LABEL } from '@/utils/bookingDateHelpers';

export default function BookingSummary({
  doctor,
  selectedDate,
  selectedSlot,
  onProceedToPatientDetails
}) {
  const isComplete = Boolean(doctor && selectedDate && selectedSlot);

  return (
    <div className="bg-[#0A1E3F] text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#DFBF64]">
            Booking Summary
          </h3>
          <span className="text-[11px] font-medium text-slate-300">
            {TIME_ZONE_LABEL}
          </span>
        </div>

        {/* Selected Details Grid */}
        <div className="mt-4 space-y-3.5">
          {/* Doctor */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#DFBF64] shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Consulting Surgeon</p>
              <p className="text-sm font-bold text-white truncate">
                {doctor ? doctor.name : 'Select a doctor'}
              </p>
              {doctor && (
                <p className="text-xs text-[#DFBF64] truncate">
                  {doctor.specialties?.[0] || doctor.designation}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#DFBF64] shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Consultation Date</p>
              <p className="text-sm font-bold text-white truncate">
                {selectedDate ? formatReadableDate(selectedDate) : 'Pick a date on the calendar'}
              </p>
            </div>
          </div>

          {/* Slot */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#DFBF64] shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Appointment Time</p>
              <p className="text-sm font-bold text-white truncate">
                {selectedSlot
                  ? `${selectedSlot.displayTime} - ${selectedSlot.displayEndTime} (IST)`
                  : 'Select an available slot'}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#DFBF64] shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Hospital Location</p>
              <p className="text-xs font-semibold text-white">
                Nirvaya Eyecare Centre, Ayodhya Bypass Road, Bhopal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
        <button
          type="button"
          disabled={!isComplete}
          onClick={onProceedToPatientDetails}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DFBF64] ${
            isComplete
              ? 'bg-[#DFBF64] text-[#0A1E3F] hover:bg-[#cfae4f] shadow-lg shadow-amber-500/20 cursor-pointer active:scale-[0.99]'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          <span>Continue to Patient Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-[#DFBF64]" />
          <span>Slot reservation confirmed upon details submission.</span>
        </p>
      </div>
    </div>
  );
}

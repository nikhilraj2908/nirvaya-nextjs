'use client';

import React from 'react';
import SafeLink from '@/components/common/SafeLink';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  MapPin,
  Home,
  PlusCircle,
  Eye
} from 'lucide-react';
import { formatReadableDate, TIME_ZONE_LABEL } from '@/utils/bookingDateHelpers';

export default function BookingConfirmation({ booking, onResetBooking }) {
  if (!booking) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-9 shadow-lg max-w-2xl mx-auto">
      {/* Success Badge & Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/70 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        <div>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Consultation Confirmed</span>
          </span>
          <h2 className="text-2xl font-bold text-[#0A1E3F] mt-2">
            Appointment Confirmed
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Your clinical consultation has been booked and reserved in our hospital schedule.
          </p>
        </div>

        {/* Reference Banner */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Booking Reference ID
          </span>
          <span className="text-lg font-black tracking-wider text-[#0A1E3F] font-mono">
            {booking.bookingRef}
          </span>
        </div>
      </div>

      {/* Appointment Snapshot Card */}
      <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-[#0A1E3F]/5 to-amber-500/5 border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Surgeon */}
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
              <User className="w-3 h-3 text-[#DFBF64]" />
              <span>Consulting Specialist</span>
            </span>
            <p className="font-bold text-sm text-[#0A1E3F]">{booking.doctorName}</p>
            <p className="text-slate-500 font-medium">{booking.specialty}</p>
          </div>

          {/* Patient */}
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
              <User className="w-3 h-3 text-[#DFBF64]" />
              <span>Patient Name</span>
            </span>
            <p className="font-bold text-sm text-[#0A1E3F]">{booking.patientName}</p>
            <p className="text-slate-500 font-medium">+91 {booking.phone}</p>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-[#DFBF64]" />
              <span>Appointment Date</span>
            </span>
            <p className="font-bold text-sm text-[#0A1E3F]">
              {formatReadableDate(booking.preferredDate)}
            </p>
            <p className="text-slate-500 font-medium">In-Clinic OPD</p>
          </div>

          {/* Time Slot */}
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#DFBF64]" />
              <span>Time Slot ({TIME_ZONE_LABEL.slice(0, 19)})</span>
            </span>
            <p className="font-bold text-sm text-[#0A1E3F]">{booking.preferredSlot}</p>
            <p className="text-emerald-600 font-bold">Discrete 30-min window</p>
          </div>
        </div>

        {/* Hospital Address */}
        <div className="pt-3 border-t border-slate-200/60 flex items-start space-x-2 text-xs text-slate-600">
          <MapPin className="w-4 h-4 text-[#DFBF64] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800">Hospital Address: </span>
            <span>Nirvaya Eyecare Centre, Ayodhya Bypass Road, Bhopal, MP</span>
          </div>
        </div>
      </div>

      {/* Clinical Preparation Notice */}
      <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-2">
        <div className="flex items-center space-x-1.5 font-bold text-amber-950">
          <Eye className="w-4 h-4 text-amber-600" />
          <span>Patient Preparation for Dilated Eye Examination</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
          <li>Please arrive 15 minutes before your scheduled slot for registration & visual acuity.</li>
          <li>Dilated retina evaluations require diagnostic drops causing temporary blurred vision (2-3 hours). We recommend bringing sunglasses and an accompanying attendant.</li>
          <li>Carry your previous eye prescriptions, spectacles, and recent medical reports (especially diabetes or hypertension records).</li>
        </ul>
      </div>

      {/* Navigation Actions */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <SafeLink
          href="/"
          className="w-full sm:w-auto px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </SafeLink>

        <button
          type="button"
          onClick={onResetBooking}
          className="w-full sm:w-auto px-6 py-3 bg-[#0A1E3F] text-[#DFBF64] rounded-xl text-xs font-bold hover:bg-[#132c57] transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Another Appointment</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  Loader2,
  CalendarX,
  ShieldAlert,
  Info
} from 'lucide-react';
import { formatReadableDate } from '@/utils/bookingDateHelpers';

export default function TimeSlotPicker({
  selectedDate, // YYYY-MM-DD
  selectedSlot, // full slot object or null
  onSelectSlot,
  slots = [],
  groupedSlots = {},
  loadingSlots = false,
  slotsError = null,
  isBlocked = false,
  blockReason = null,
  doctorName = 'Consultant'
}) {
  const getPeriodIcon = (period) => {
    switch (period) {
      case 'Morning':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'Afternoon':
        return <Sunset className="w-3.5 h-3.5 text-orange-500" />;
      case 'Evening':
        return <Moon className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  if (!selectedDate) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col items-center justify-center text-center h-full min-h-[320px]">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-[#0A1E3F]">Select a Clinical Date</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Pick an available day on the calendar to view real-time appointment consultation slots.
        </p>
      </div>
    );
  }

  if (loadingSlots) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col items-center justify-center text-center h-full min-h-[320px]">
        <Loader2 className="w-8 h-8 text-[#0A1E3F] animate-spin mb-3" />
        <h4 className="font-bold text-sm text-[#0A1E3F]">Loading Available Slots</h4>
        <p className="text-xs text-slate-500 mt-1">
          Querying schedule for {formatReadableDate(selectedDate)}...
        </p>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col items-center justify-center text-center h-full min-h-[320px]">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <CalendarX className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-[#0A1E3F]">Date Unavailable</h4>
        <p className="text-xs text-slate-600 font-medium max-w-xs mt-1">
          {blockReason || 'No clinical consultations scheduled for this date.'}
        </p>
        <span className="text-[11px] text-slate-400 mt-3">
          Please select another open date on the calendar.
        </span>
      </div>
    );
  }

  if (slotsError) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col items-center justify-center text-center h-full min-h-[320px]">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-[#0A1E3F]">Unable to Fetch Slots</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">{slotsError}</p>
      </div>
    );
  }

  const availableSlotsCount = slots.filter((s) => s.isAvailable).length;
  if (slots.length === 0 || availableSlotsCount === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col items-center justify-center text-center h-full min-h-[320px]">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <CalendarX className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-[#0A1E3F]">All Slots Booked</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          There are no remaining consultation slots with {doctorName} on{' '}
          {formatReadableDate(selectedDate)}.
        </p>
        <span className="text-[11px] text-[#0A1E3F] font-semibold mt-3">
          Please choose an alternate date.
        </span>
      </div>
    );
  }

  const periodKeys = Object.keys(groupedSlots);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-[#0A1E3F]">
              Step 3 • Choose Consultation Time
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {formatReadableDate(selectedDate)}
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {availableSlotsCount} slots available
          </span>
        </div>

        {/* Grouped Time Slots */}
        <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
          {periodKeys.map((period) => {
            const periodSlots = groupedSlots[period] || [];
            if (periodSlots.length === 0) return null;

            return (
              <div key={period} className="space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {getPeriodIcon(period)}
                  <span>{period} Slots</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {periodSlots.map((slot) => {
                    const isSelected = selectedSlot?.slotId === slot.slotId;
                    const isDisabled = !slot.isAvailable;

                    return (
                      <button
                        key={slot.slotId}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => onSelectSlot(slot)}
                        aria-pressed={isSelected}
                        className={`relative py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#DFBF64] ${
                          isSelected
                            ? 'bg-[#0A1E3F] text-[#DFBF64] shadow-sm ring-1 ring-[#0A1E3F]'
                            : isDisabled
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60 line-through'
                            : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 cursor-pointer'
                        }`}
                      >
                        <span>{slot.displayTime}</span>
                        {slot.reason && !slot.isAvailable && (
                          <span className="text-[9px] font-normal no-underline block text-slate-400 truncate max-w-full">
                            {slot.reason}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimers & Notes */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start space-x-2 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
        <span>
          Discrete 30-minute consultation slot. Availability is re-verified at confirmation.
        </span>
      </div>
    </div>
  );
}

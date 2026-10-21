'use client';

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import {
  Calendar as CalendarIcon,
  Loader2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import {
  formatToHospitalDateStr,
  HOSPITAL_TIME_ZONE,
  TIME_ZONE_LABEL
} from '@/utils/bookingDateHelpers';

export default function AppointmentCalendar({
  selectedDoctorId,
  selectedDate, // YYYY-MM-DD string
  onSelectDate,
  availability = {},
  loadingAvailability = false,
  availabilityError = null,
  onRetryAvailability,
  currentMonth,
  onMonthChange
}) {
  const todayDateStr = formatToHospitalDateStr(new Date());

  // Convert selectedDate YYYY-MM-DD string to local Date object for DayPicker
  const selectedDateObj = selectedDate
    ? (() => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        return new Date(y, m - 1, d);
      })()
    : undefined;

  // Determine if a date is disabled
  const isDateDisabled = (date) => {
    const dateStr = formatToHospitalDateStr(date);

    // Disable past dates
    if (dateStr < todayDateStr) return true;

    // Disable beyond 30 days window
    const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const maxDateStr = formatToHospitalDateStr(maxDate);
    if (dateStr > maxDateStr) return true;

    // If availability error occurred
    if (availabilityError) return true;

    // Check availability map from backend
    const dayInfo = availability[dateStr];
    if (dayInfo) {
      if (dayInfo.isBookable === false) return true;
      if (dayInfo.availableSlotsCount === 0) return true;
      return false;
    }

    if (loadingAvailability) return true;

    return false;
  };

  const handleDaySelect = (day) => {
    if (!day) return;
    const dateStr = formatToHospitalDateStr(day);
    if (!isDateDisabled(day)) {
      onSelectDate(dateStr);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Calendar Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A1E3F]/5 text-[#0A1E3F] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-[#0A1E3F]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0A1E3F]">
                Step 2 • Select Date
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {TIME_ZONE_LABEL}
              </p>
            </div>
          </div>

          {loadingAvailability && (
            <div className="flex items-center space-x-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 font-medium">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Checking slots...</span>
            </div>
          )}
        </div>

        {/* Error / Retry Banner */}
        {availabilityError && (
          <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>Could not load clinic schedule.</span>
            </div>
            <button
              type="button"
              onClick={onRetryAvailability}
              className="inline-flex items-center space-x-1 font-semibold text-red-800 hover:text-red-950 underline ml-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Interactive Calendar Body */}
        <div className="calendar-container py-2 flex justify-center">
          <style>{`
            .rdp-root {
              --rdp-accent-color: #0A1E3F;
              --rdp-accent-background-color: #0A1E3F;
              margin: 0;
              font-family: inherit;
            }
            .rdp-day {
              font-size: 0.85rem;
              font-weight: 500;
              border-radius: 9999px;
              transition: all 0.15s ease;
            }
            .rdp-day_button {
              width: 38px;
              height: 38px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 9999px;
            }
            .rdp-day_button:hover:not(:disabled) {
              background-color: #f1f5f9;
              color: #0A1E3F;
            }
            .rdp-selected .rdp-day_button {
              background-color: #0A1E3F !important;
              color: #DFBF64 !important;
              font-weight: 700;
              box-shadow: 0 2px 8px rgba(10, 30, 63, 0.25);
            }
            .rdp-today:not(.rdp-selected) .rdp-day_button {
              border: 1.5px solid #DFBF64 !important;
              font-weight: 700;
              color: #0A1E3F;
            }
            .rdp-disabled {
              opacity: 0.35;
              cursor: not-allowed;
            }
            .rdp-caption_label {
              font-weight: 700;
              color: #0A1E3F;
              font-size: 0.95rem;
            }
            .rdp-nav {
              color: #0A1E3F;
            }
            .rdp-weekday {
              font-size: 0.72rem;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
          `}</style>

          <DayPicker
            mode="single"
            month={currentMonth}
            onMonthChange={onMonthChange}
            selected={selectedDateObj}
            onSelect={handleDaySelect}
            disabled={isDateDisabled}
            timeZone={HOSPITAL_TIME_ZONE}
          />
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full border-1.5 border-[#DFBF64] inline-block" />
          <span>Today</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0A1E3F] inline-block" />
          <span className="font-semibold text-slate-700">Selected</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-200 inline-block opacity-60" />
          <span>Closed / Full</span>
        </div>
      </div>
    </div>
  );
}

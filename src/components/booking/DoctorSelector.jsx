'use client';

import React from 'react';
import { Check, Award, Clock } from 'lucide-react';

export default function DoctorSelector({
  doctors = [],
  selectedDoctorId,
  onSelectDoctor,
  loading = false
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Step 1 • Select Consulting Eye Surgeon
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 animate-pulse flex items-center space-x-3"
            >
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label id="doctor-selector-label" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          Step 1 • Select Consulting Eye Surgeon
        </label>
        <span className="text-[11px] font-medium text-slate-400">
          {doctors.length} Specialists Available
        </span>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="doctor-selector-label"
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        {doctors.map((doctor) => {
          const isSelected = selectedDoctorId === doctor.id;
          const initials = doctor.name
            .split(' ')
            .filter((_, idx, arr) => idx === 1 || idx === arr.length - 1)
            .map((w) => w[0])
            .join('')
            .toUpperCase() || 'DR';

          const workingDaysLabel = Array.isArray(doctor.availableDays)
            ? doctor.availableDays.length === 6
              ? 'Mon - Sat'
              : doctor.availableDays.map((d) => d.slice(0, 3)).join(', ')
            : 'Clinical Sessions';

          return (
            <button
              key={doctor.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectDoctor(doctor.id)}
              className={`relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#DFBF64] cursor-pointer ${
                isSelected
                  ? 'border-[#0A1E3F] bg-gradient-to-br from-[#0A1E3F]/5 to-amber-500/5 ring-1 ring-[#0A1E3F] shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#0A1E3F] text-[#DFBF64] flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#0A1E3F] text-[#DFBF64] ring-2 ring-[#DFBF64]/50'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {initials}
                  </div>
                  {doctor.isDirector && (
                    <div className="absolute -bottom-1 -right-1 bg-[#DFBF64] text-[#0A1E3F] rounded-full p-0.5">
                      <Award className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-bold text-sm text-[#0A1E3F] truncate">
                      {doctor.name}
                    </h4>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 truncate">
                    {doctor.qualification || 'Specialist Eye Surgeon'}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 font-medium">
                    {doctor.specialties && doctor.specialties[0]
                      ? doctor.specialties[0]
                      : doctor.designation}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#DFBF64]" />
                  <span>{workingDaysLabel}</span>
                </span>
                {doctor.consultationFee && (
                  <span className="font-semibold text-slate-700">
                    ₹{doctor.consultationFee}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/common/Container';
import {
  getDoctors,
  getDoctorAvailability,
  getDoctorSlots,
  createAppointmentBooking,
  trackEvent
} from '@/services/api';
import {
  formatToHospitalMonthStr,
  generateIdempotencyKey
} from '@/utils/bookingDateHelpers';

import DoctorSelector from '@/components/booking/DoctorSelector';
import AppointmentCalendar from '@/components/booking/AppointmentCalendar';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import BookingSummary from '@/components/booking/BookingSummary';
import PatientDetailsForm from '@/components/booking/PatientDetailsForm';
import BookingConfirmation from '@/components/booking/BookingConfirmation';

import {
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';

const isAbortError = (err) => {
  if (!err) return false;
  return (
    err.name === 'AbortError' ||
    err.name === 'CanceledError' ||
    err.code === 20 ||
    (typeof err.message === 'string' && (
      err.message.includes('aborted') ||
      err.message.includes('abort') ||
      err.message.includes('canceled')
    ))
  );
};

export default function PreBookContent() {
  const searchParams = useSearchParams();
  const queryDoctorId = searchParams.get('doctorId');
  const querySpecialty = searchParams.get('specialty');

  // Multi-step Flow: 'SELECT' | 'DETAILS' | 'CONFIRMED'
  const [currentStep, setCurrentStep] = useState('SELECT');

  // 1. Doctors State
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc-sandhya-01');

  // 2. Calendar Month & Selected Date State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(''); // YYYY-MM-DD
  const [monthAvailability, setMonthAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  // 3. Time Slots State
  const [slots, setSlots] = useState([]);
  const [groupedSlots, setGroupedSlots] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // 4. Patient Form State
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    reason: '',
    consent: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSlotConflict, setIsSlotConflict] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey());

  // 5. Confirmed Booking Result
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Abort Controllers for Stale Request Cancellation
  const availabilityAbortRef = useRef(null);
  const slotsAbortRef = useRef(null);

  // Abort pending requests on unmount
  useEffect(() => {
    return () => {
      if (availabilityAbortRef.current) availabilityAbortRef.current.abort();
      if (slotsAbortRef.current) slotsAbortRef.current.abort();
    };
  }, []);

  // Track page intent on mount
  useEffect(() => {
    trackEvent('booking_intent', {
      source: 'booking_calendar_page',
      selectedDoctorId
    });
  }, [selectedDoctorId]);

  // Fetch doctors on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDoctors() {
      try {
        setLoadingDoctors(true);
        const res = await getDoctors();
        if (isMounted && res && res.doctors && res.doctors.length > 0) {
          setDoctors(res.doctors);
          let targetId = res.doctors[0].id;
          if (queryDoctorId && res.doctors.some((d) => d.id === queryDoctorId)) {
            targetId = queryDoctorId;
          } else if (querySpecialty) {
            const match = res.doctors.find((d) =>
              (d.specialties || []).some((s) =>
                s.toLowerCase().includes(querySpecialty.toLowerCase())
              )
            );
            if (match) targetId = match.id;
          }
          setSelectedDoctorId((prev) => (prev === targetId ? prev : targetId));
        }
      } catch (err) {
        console.warn('[PreBookPage] Doctor load fallback:', err.message);
      } finally {
        if (isMounted) setLoadingDoctors(false);
      }
    }
    loadDoctors();
    return () => {
      isMounted = false;
    };
  }, [queryDoctorId, querySpecialty]);

  // Fetch Month Availability for selected doctor
  const fetchMonthAvailability = useCallback(
    async (doctorId, monthDate) => {
      if (!doctorId || !monthDate) return;

      if (availabilityAbortRef.current) {
        availabilityAbortRef.current.abort();
      }
      const controller = new AbortController();
      availabilityAbortRef.current = controller;

      const monthStr = formatToHospitalMonthStr(monthDate);
      setLoadingAvailability(true);
      setAvailabilityError(null);

      try {
        const res = await getDoctorAvailability(doctorId, monthStr, {
          signal: controller.signal
        });
        if (res && res.days) {
          setMonthAvailability(res.days);
        }
      } catch (err) {
        if (!isAbortError(err)) {
          console.error('[PreBookPage] Month availability failed:', err.message);
          setAvailabilityError(err.message || 'Failed to load doctor calendar');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAvailability(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchMonthAvailability(selectedDoctorId, currentMonth);
  }, [selectedDoctorId, currentMonth, fetchMonthAvailability]);

  // Fetch Slots when Date or Doctor changes
  const fetchSlotsForDate = useCallback(
    async (doctorId, dateStr) => {
      if (!doctorId || !dateStr) {
        setSlots([]);
        setGroupedSlots({});
        return;
      }

      if (slotsAbortRef.current) {
        slotsAbortRef.current.abort();
      }
      const controller = new AbortController();
      slotsAbortRef.current = controller;

      setLoadingSlots(true);
      setSlotsError(null);
      setIsBlocked(false);
      setBlockReason(null);

      try {
        const res = await getDoctorSlots(doctorId, dateStr, {
          signal: controller.signal
        });
        if (res) {
          setIsBlocked(Boolean(res.isBlocked));
          setBlockReason(res.reason || null);
          setSlots(res.slots || []);
          setGroupedSlots(res.groupedSlots || {});
        }
      } catch (err) {
        if (!isAbortError(err)) {
          console.error('[PreBookPage] Slots query failed:', err.message);
          setSlotsError(err.message || 'Unable to retrieve consultation slots');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSlots(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForDate(selectedDoctorId, selectedDate);
    } else {
      setSlots([]);
      setGroupedSlots({});
    }
  }, [selectedDoctorId, selectedDate, fetchSlotsForDate]);

  // Window Focus / Visibility change listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMonthAvailability(selectedDoctorId, currentMonth);
        if (selectedDate) {
          fetchSlotsForDate(selectedDoctorId, selectedDate);
        }
      }
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedDoctorId, currentMonth, selectedDate, fetchMonthAvailability, fetchSlotsForDate]);

  const handleSelectDoctor = (newDocId) => {
    if (newDocId === selectedDoctorId) return;
    setSelectedDoctorId(newDocId);
    setSelectedSlot(null);
  };

  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setSubmitError(null);
    setIsSlotConflict(false);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setSubmitError(null);
    setIsSlotConflict(false);
  };

  const handleProceedToDetails = () => {
    if (!selectedDoctorId || !selectedDate || !selectedSlot) return;
    setIdempotencyKey(generateIdempotencyKey());
    setCurrentStep('DETAILS');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleBackToSlots = () => {
    setCurrentStep('SELECT');
    if (selectedDate) {
      fetchSlotsForDate(selectedDoctorId, selectedDate);
    }
  };

  const handleFormChange = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmitBooking = async () => {
    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    setIsSlotConflict(false);

    try {
      const payload = {
        doctorId: selectedDoctorId,
        date: selectedDate,
        slotId: selectedSlot.slotId,
        patientName: formData.patientName,
        phone: formData.phone,
        email: formData.email,
        reason: formData.reason,
        consent: formData.consent,
        source: 'website_calendar_flow'
      };

      const res = await createAppointmentBooking(payload, idempotencyKey);

      if (res && res.success && res.booking) {
        setConfirmedBooking(res.booking);
        setCurrentStep('CONFIRMED');
        window.scrollTo({ top: 80, behavior: 'smooth' });
        fetchMonthAvailability(selectedDoctorId, currentMonth);
      } else {
        throw new Error(res.message || 'Booking reservation could not be completed');
      }
    } catch (err) {
      console.warn('[PreBookPage] Booking failed:', err.message);
      if (err.status === 409 || err.code === 'SLOT_CONFLICT') {
        setIsSlotConflict(true);
        setSubmitError(
          'This consultation slot was just taken by another patient. Your contact details have been preserved — please choose another open slot.'
        );
        fetchSlotsForDate(selectedDoctorId, selectedDate);
      } else {
        setSubmitError(err.message || 'An unexpected error occurred while saving your appointment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setConfirmedBooking(null);
    setSelectedSlot(null);
    setSelectedDate('');
    setCurrentStep('SELECT');
    setFormData({
      patientName: '',
      phone: '',
      email: '',
      reason: '',
      consent: true
    });
    setIdempotencyKey(generateIdempotencyKey());
    fetchMonthAvailability(selectedDoctorId, currentMonth);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <Container>
        {/* Header Hero Banner */}
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1E3F]/5 border border-[#0A1E3F]/10 text-xs font-bold text-[#0A1E3F] mb-3 animate-fade-in-up stagger-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Real-Time Clinical Scheduling Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0A1E3F] tracking-tight animate-fade-in-up stagger-2">
            Book an Eye Care Consultation
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium animate-fade-in-up stagger-3">
            Select your consulting ophthalmologist, view verified calendar availability, and
            reserve your consultation with immediate confirmation.
          </p>

          {/* Stepper Indicator */}
          <div className="mt-5 flex items-center space-x-3 text-xs font-bold animate-fade-in-up stagger-4">
            <div
              className={`flex items-center space-x-1.5 ${
                currentStep === 'SELECT' ? 'text-[#0A1E3F]' : 'text-emerald-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 'SELECT'
                    ? 'bg-[#0A1E3F] text-[#DFBF64]'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                1
              </span>
              <span>Doctor, Date & Slot</span>
            </div>

            <span className="text-slate-300">→</span>

            <div
              className={`flex items-center space-x-1.5 ${
                currentStep === 'DETAILS'
                  ? 'text-[#0A1E3F]'
                  : currentStep === 'CONFIRMED'
                  ? 'text-emerald-700'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 'DETAILS'
                    ? 'bg-[#0A1E3F] text-[#DFBF64]'
                    : currentStep === 'CONFIRMED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </span>
              <span>Patient Details</span>
            </div>

            <span className="text-slate-300">→</span>

            <div
              className={`flex items-center space-x-1.5 ${
                currentStep === 'CONFIRMED' ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === 'CONFIRMED'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        {/* STEP 1: DOCTOR + CALENDAR + SLOTS + SUMMARY */}
        {currentStep === 'SELECT' && (
          <div className="space-y-6">
            <DoctorSelector
              doctors={doctors}
              selectedDoctorId={selectedDoctorId}
              onSelectDoctor={handleSelectDoctor}
              loading={loadingDoctors}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-6">
                <AppointmentCalendar
                  selectedDoctorId={selectedDoctorId}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                  availability={monthAvailability}
                  loadingAvailability={loadingAvailability}
                  availabilityError={availabilityError}
                  onRetryAvailability={() => fetchMonthAvailability(selectedDoctorId, currentMonth)}
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                />
              </div>

              <div className="lg:col-span-6">
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSelectSlot}
                  slots={slots}
                  groupedSlots={groupedSlots}
                  loadingSlots={loadingSlots}
                  slotsError={slotsError}
                  isBlocked={isBlocked}
                  blockReason={blockReason}
                  doctorName={selectedDoctor?.name || 'Surgeon'}
                />
              </div>
            </div>

            <BookingSummary
              doctor={selectedDoctor}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onProceedToPatientDetails={handleProceedToDetails}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-slate-600">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#DFBF64] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">AIIMS Faculty Led</span>
                  <span>Direct consultation with fellowship-trained surgeon.</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#DFBF64] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Unhurried Clinical Care</span>
                  <span>Discrete 30-minute consultation window.</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-[#DFBF64] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Class 100 HEPA OT</span>
                  <span>Super-specialty vitreoretinal & phaco surgical suite.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PATIENT DETAILS FORM */}
        {currentStep === 'DETAILS' && (
          <PatientDetailsForm
            doctor={selectedDoctor}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            formData={formData}
            onChangeFormData={handleFormChange}
            onSubmitBooking={handleSubmitBooking}
            onBackToSlots={handleBackToSlots}
            submitting={submitting}
            submitError={submitError}
            isSlotConflict={isSlotConflict}
          />
        )}

        {/* STEP 3: BOOKING CONFIRMATION */}
        {currentStep === 'CONFIRMED' && (
          <BookingConfirmation
            booking={confirmedBooking}
            onResetBooking={handleResetBooking}
          />
        )}
      </Container>
    </div>
  );
}

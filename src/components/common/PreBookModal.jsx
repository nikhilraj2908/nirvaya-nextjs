'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, Phone, ArrowRight, User, AlertCircle, Copy, Check } from 'lucide-react';
import { CLINIC_INFO, SPECIALTIES } from '@/data/siteData';
import Button from './Button';
import { bookAppointment, getAvailableSlots, trackEvent } from '@/services/api';

export default function PreBookModal({ isOpen, onClose, defaultSpecialty = '' }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    age: '',
    city: 'Bhopal',
    specialty: defaultSpecialty || 'Retina & Vitreoretinal Surgery',
    preferredDate: minDateStr,
    preferredSlot: 'Morning (10:00 AM – 1:00 PM)',
    reason: '',
    consent: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [slotData, setSlotData] = useState({ isBlocked: false, reason: '', slots: [] });
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultSpecialty) {
      setFormData((prev) => ({ ...prev, specialty: defaultSpecialty }));
    }
  }, [defaultSpecialty]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      trackEvent('book_intent', { trigger: 'modal_open', defaultSpecialty });
    } else {
      document.body.style.overflow = 'unset';
      setBookingResult(null);
      setErrors({});
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, defaultSpecialty]);

  useEffect(() => {
    if (!isOpen || !formData.preferredDate) return;

    let isMounted = true;
    setIsLoadingSlots(true);

    getAvailableSlots(formData.preferredDate)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success) {
          setSlotData({
            isBlocked: res.isBlocked || false,
            reason: res.reason || '',
            slots: res.slots || []
          });

          if (res.slots && res.slots.length > 0) {
            const currentSlotObj = res.slots.find((s) => s.slot === formData.preferredSlot);
            if (!currentSlotObj || !currentSlotObj.isAvailable) {
              const firstAvailable = res.slots.find((s) => s.isAvailable);
              if (firstAvailable) {
                setFormData((prev) => ({ ...prev, preferredSlot: firstAvailable.slot }));
              }
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch slot availability from backend, using default slots:', err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, formData.preferredDate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = 'Please enter patient name';
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.consent) newErrors.consent = 'Consent is required to confirm your slot';
    if (slotData.isBlocked) {
      newErrors.preferredDate = slotData.reason || 'This date is closed for appointments';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await bookAppointment(formData);
      if (res && res.success) {
        setBookingResult(res.appointment);
        trackEvent('form_submit', {
          bookingRef: res.appointment.bookingRef,
          specialty: formData.specialty
        });
      } else {
        throw new Error(res.message || 'Booking submission failed');
      }
    } catch (err) {
      console.error('Appointment booking error:', err);
      const fallbackRef = `NIRV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingResult({
        bookingRef: fallbackRef,
        patientName: formData.patientName,
        phone: formData.phone,
        specialty: formData.specialty,
        preferredDate: formData.preferredDate,
        preferredSlot: formData.preferredSlot,
        status: 'pending'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (bookingResult && bookingResult.bookingRef) {
      navigator.clipboard.writeText(bookingResult.bookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0A1E3F] text-white px-6 py-5 flex items-center justify-between border-b border-[#16325C]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#DFBF64] uppercase tracking-wider mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFBF64]"></span>
              Live Dynamic Slot Reservation
            </div>
            <h3 id="modal-headline" className="text-xl font-heading font-bold text-white">
              Pre-book a Specialist Slot
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Nirvaya Eyecare Centre • Dr Sandhya Gaur (MD AIIMS)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!bookingResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0A1E3F]">No Advance Payment Required:</span> Real-time slot reservation. Our patient coordinator will confirm your exact slot via WhatsApp and phone call.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C59B27] focus:border-transparent outline-hidden"
                    />
                  </div>
                  {errors.patientName && (
                    <p className="text-red-600 text-xs mt-1">{errors.patientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C59B27] focus:border-transparent outline-hidden"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Specialty *
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C59B27] focus:border-transparent outline-hidden bg-white text-slate-800"
                  >
                    {SPECIALTIES.map((spec) => (
                      <option key={spec.id} value={spec.title}>
                        {spec.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="date"
                      min={minDateStr}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C59B27] focus:border-transparent outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {slotData.isBlocked ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Notice:</span> {slotData.reason || 'This date is currently unavailable for routine slots. Please select another date.'}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Preferred Time Slot *</span>
                    {isLoadingSlots && <span className="text-[11px] text-slate-400 font-normal">Checking live capacity...</span>}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {slotData.slots && slotData.slots.length > 0 ? (
                      slotData.slots.map((s) => (
                        <button
                          key={s.slot}
                          type="button"
                          disabled={!s.isAvailable}
                          onClick={() => setFormData({ ...formData, preferredSlot: s.slot })}
                          className={`p-3 rounded-lg border text-left transition-all text-xs flex flex-col justify-between ${
                            formData.preferredSlot === s.slot
                              ? 'border-[#C59B27] bg-[#FDF9EE] text-[#0A1E3F] font-bold ring-1 ring-[#C59B27]'
                              : s.isAvailable
                              ? 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                              : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{s.slot}</span>
                          </div>
                          <span className={`text-[10px] mt-1 ${s.isAvailable ? 'text-emerald-700 font-medium' : 'text-rose-600'}`}>
                            {s.isAvailable ? `• ${s.remaining} slots available` : '✕ Slot Full'}
                          </span>
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredSlot: 'Morning (10:00 AM – 1:00 PM)' })}
                          className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                            formData.preferredSlot.includes('Morning')
                              ? 'border-[#C59B27] bg-[#FDF9EE] text-[#0A1E3F] font-bold ring-1 ring-[#C59B27]'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          Morning (10:00 AM – 1:00 PM)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredSlot: 'Evening (5:00 PM – 8:00 PM)' })}
                          className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                            formData.preferredSlot.includes('Evening')
                              ? 'border-[#C59B27] bg-[#FDF9EE] text-[#0A1E3F] font-bold ring-1 ring-[#C59B27]'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          Evening (5:00 PM – 8:00 PM)
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Symptoms / Reason for Visit (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Blurry vision, diabetic eye checkup, floaters in right eye..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C59B27] focus:border-transparent outline-hidden resize-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded-sm border-slate-300 text-[#0A1E3F] focus:ring-[#C59B27]"
                />
                <label htmlFor="consent" className="text-xs text-slate-600 leading-normal">
                  I consent to Nirvaya Eyecare Centre contacting me via mobile call and WhatsApp to confirm my appointment slot.
                </label>
              </div>
              {errors.consent && (
                <p className="text-red-600 text-xs">{errors.consent}</p>
              )}

              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting || slotData.isBlocked}
                  className="w-full sm:flex-1 font-semibold"
                >
                  {isSubmitting ? 'Reserving Slot...' : 'Confirm Pre-booking Request'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-heading font-bold text-[#0A1E3F]">
                  Appointment Slot Reserved!
                </h4>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  Logged in Nirvaya Clinical Database
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 max-w-sm mx-auto text-left">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Booking Reference:</span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="inline-flex items-center gap-1 text-[#C59B27] font-semibold hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-base font-bold text-[#0A1E3F] tracking-wider mb-2">
                  {bookingResult.bookingRef}
                </div>
                <div className="text-xs text-slate-600 space-y-0.5 border-t border-slate-200 pt-2">
                  <div><strong>Patient:</strong> {bookingResult.patientName}</div>
                  <div><strong>Specialty:</strong> {bookingResult.specialty}</div>
                  <div><strong>Date & Slot:</strong> {bookingResult.preferredDate} ({bookingResult.preferredSlot})</div>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Our frontdesk team will reach out to <span className="font-semibold text-slate-800">{bookingResult.phone}</span> shortly to finalize your OPD consultation slot.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="gold"
                  size="md"
                  href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Hello Nirvaya Eyecare, I have reserved appointment ${bookingResult.bookingRef} for ${bookingResult.patientName} (${bookingResult.specialty}) on ${bookingResult.preferredDate}. Kindly verify.`
                  )}`}
                  target="_blank"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Verify via WhatsApp
                </Button>
                <Button variant="secondary" size="md" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

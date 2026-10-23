'use client';

import React, { useState } from 'react';
import SafeLink from '@/components/common/SafeLink';
import Container from '@/components/common/Container';
import { CLINIC_INFO } from '@/data/siteData';
import { IS_PREVIEW, showPreviewToast } from '@/lib/preview';
import {
  MapPin,
  Phone,
  Clock,
  Calendar,
  Send,
  CheckCircle2,
  Navigation,
  MessageCircle,
  ShieldCheck,
  Building2,
  Car
} from 'lucide-react';

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    concern: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (IS_PREVIEW) {
      showPreviewToast('Preview mode – submissions disabled');
      return;
    }
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    if (IS_PREVIEW) return;
    const text = encodeURIComponent(
      `Hello Nirvaya Eyecare Centre, I would like to inquire about consultation and clinic directions.\nName: ${
        formData.name || 'Patient'
      }\nPhone: ${formData.phone || 'Not provided'}\nConcern: ${
        formData.concern || 'General Eye Examination'
      }`
    );
    window.open(`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#0A1E3F] to-[#122B55] text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DFBF64_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#DFBF64]/10 blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DFBF64]/20 text-[#DFBF64] border border-[#DFBF64]/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>Ayodhya Bypass Road, Bhopal</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Get in Touch with Our Eye Care Specialists
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Conveniently located along Ayodhya Bypass Road, Bhopal with hassle-free ground-floor access and dedicated patient parking.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <SafeLink
                href="/pre-book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-book OPD Slot</span>
              </SafeLink>
              <SafeLink
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] font-semibold text-sm border border-white/20 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#DFBF64]" />
                <span>Call {CLINIC_INFO.phone}</span>
              </SafeLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details & Info (Left 5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
                  Direct Clinical Desk
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] mt-1 tracking-tight">
                  Reach Our Care Team
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Have questions about retina procedures, cataract surgery options, or scheduling a dilated exam? We are here to assist you.
                </p>
              </div>

              {/* Cards */}
              <div className="space-y-4">
                {/* Address Card */}
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1E3F] text-[#DFBF64] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#0A1E3F]">Clinic Address</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {CLINIC_INFO.addressLine1}, {CLINIC_INFO.addressLine2}
                      <br />
                      {CLINIC_INFO.city}, {CLINIC_INFO.state} — {CLINIC_INFO.pincode}
                    </p>
                    <p className="text-xs text-slate-500 pt-1">
                      Landmark: {CLINIC_INFO.landmark}
                    </p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1E3F] text-[#DFBF64] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#0A1E3F]">Helpline & OPD Appointments</h3>
                    <p className="text-sm text-slate-600">
                      General OPD:{' '}
                      <a
                        href={`tel:${CLINIC_INFO.phoneRaw}`}
                        className="font-bold text-[#0A1E3F] hover:text-[#C59B27]"
                      >
                        {CLINIC_INFO.phone}
                      </a>
                    </p>
                    <p className="text-sm text-slate-600">
                      Emergency Retina Care:{' '}
                      <a
                        href={`tel:${CLINIC_INFO.phoneEmergency}`}
                        className="font-bold text-[#DC2626]"
                      >
                        {CLINIC_INFO.phoneEmergency}
                      </a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp & Email Card */}
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1E3F] text-[#DFBF64] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#0A1E3F]">WhatsApp & Email Support</h3>
                    <p className="text-sm text-slate-600">
                      WhatsApp:{' '}
                      <a
                        href={`https://wa.me/${CLINIC_INFO.whatsappRaw}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#059669] hover:underline"
                      >
                        {CLINIC_INFO.whatsapp}
                      </a>
                    </p>
                    <p className="text-sm text-slate-600">
                      Email:{' '}
                      <a
                        href={`mailto:${CLINIC_INFO.email}`}
                        className="font-semibold text-[#0A1E3F] hover:underline"
                      >
                        {CLINIC_INFO.email}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Timings Card */}
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0A1E3F] text-[#DFBF64] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#0A1E3F]">OPD Consultation Hours</h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      <strong>Monday – Saturday:</strong> 9:30 AM – 7:30 PM
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      <strong>Sunday:</strong> 10:00 AM – 1:00 PM (Emergency & Prior Appointments)
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>24/7 Ocular Trauma & Retinal Detachment on call</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form (Right 7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-[#F8FAFC] p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="mb-6 space-y-1">
                  <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
                    Quick Clinical Inquiry
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0A1E3F]">
                    Send a Message or Request a Callback
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Our care coordinator will respond promptly during clinic working hours.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-white border border-emerald-200 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-heading text-xl font-bold text-[#0A1E3F]">
                      Inquiry Received Successfully!
                    </h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Thank you, <strong className="text-[#0A1E3F]">{formData.name}</strong>. Our front desk will call you at{' '}
                      <strong className="text-[#0A1E3F]">{formData.phone}</strong> shortly to confirm details.
                    </p>
                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={handleWhatsAppDirect}
                        className="px-5 py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat via WhatsApp Now</span>
                      </button>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0A1E3F] uppercase tracking-wider mb-1.5">
                          Patient Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rajesh Sharma"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0A1E3F] uppercase tracking-wider mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0A1E3F] uppercase tracking-wider mb-1.5">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. rajesh@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0A1E3F] uppercase tracking-wider mb-1.5">
                          Primary Eye Concern
                        </label>
                        <select
                          value={formData.concern}
                          onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all"
                        >
                          <option value="">Select Specialty / Concern</option>
                          <option value="Retina & Macula Consultation">Retina & Macula Consultation</option>
                          <option value="Cataract & Lens Replacement">Cataract & Lens Replacement</option>
                          <option value="Diabetic Retinopathy Screening">Diabetic Retinopathy Screening</option>
                          <option value="Intravitreal Injections (Anti-VEGF)">Intravitreal Injections (Anti-VEGF)</option>
                          <option value="Floaters & Sudden Flashes">Floaters & Sudden Flashes (Urgent)</option>
                          <option value="Glaucoma Evaluation">Glaucoma Evaluation</option>
                          <option value="Comprehensive Eye Checkup">Comprehensive Eye Checkup</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A1E3F] uppercase tracking-wider mb-1.5">
                        Describe Symptoms or Queries
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please share details such as duration of blurred vision, diabetic history, previous reports, or preferred consultation dates..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3.5 px-6 rounded-xl bg-[#0A1E3F] hover:bg-[#122B55] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-[#DFBF64]" />
                        <span>Submit Consultation Inquiry</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppDirect}
                        className="py-3.5 px-6 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Quick WhatsApp</span>
                      </button>
                    </div>

                    <p className="text-[11.5px] text-slate-500 text-center pt-2">
                      🔒 Your clinical data is strictly private. We never share patient information.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Map & Route Guidance */}
      <section className="py-16 bg-[#F8FAFC]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
              Easy Location & Travel
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F]">
              How to Reach Nirvaya Eyecare Centre
            </h2>
            <p className="text-sm text-slate-600">
              Situated in an easily accessible zone of Bhopal with seamless connectivity from major city nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-[#0A1E3F] text-base">From Bhopal Railway Station</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Approx. 15–20 minutes via Ayodhya Bypass. Direct auto-rickshaws and cabs are readily available round-the-clock.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-[#0A1E3F] text-base">From MP Nagar / New Market</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Approx. 20–25 minutes via Link Road 1 / Chetak Bridge to Ayodhya Bypass. Smooth arterial road transit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A1E3F]/5 text-[#C59B27] flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-[#0A1E3F] text-base">Parking & Accessibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated on-premises ground-level vehicle parking with ramp accessibility for elderly and wheelchair-assisted patients.
              </p>
            </div>
          </div>

          {/* Map Preview Box */}
          <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-white p-2">
            <iframe
              title="Nirvaya Eyecare Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117325.21558237728!2d77.34848348630718!3d23.228026199672052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c427f7fb2ec21%3A0xe5a3637e72a74c2e!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl w-full"
            />
          </div>
        </Container>
      </section>
    </div>
  );
}

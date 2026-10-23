import React from 'react';
import { CLINIC_INFO } from '@/data/siteData';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import SafeLink from '@/components/common/SafeLink';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Car,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function LocationSection() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-white border-t border-slate-200/80 scroll-mt-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start reveal-up">
          {/* Left Column: Heading + Consultation Timings + Arterial Connectivity */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              eyebrow="Visit Our Centre"
              title="Convenient Location on Ayodhya Bypass Road, Bhopal"
              description="Nirvaya Eyecare Centre is purpose-built to offer relaxed, ground-floor accessibility with spacious waiting areas and hassle-free vehicular parking."
            />

            {/* Timings Card */}
            <div className="bg-sky-50/70 border border-sky-100/90 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-sky-800" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0A1E3F]">
                      Consultation & Day-Care Hours
                    </h4>
                    <span className="text-xs text-sky-700 font-medium">
                      Routine OPD & Surgical Admissions
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open Today
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm pt-2">
                <div className="flex justify-between items-center py-2 border-b border-sky-100/80">
                  <span className="font-semibold text-slate-700">Monday to Saturday</span>
                  <span className="font-bold text-sky-950">9:30 AM - 7:30 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-sky-100/80">
                  <span className="font-semibold text-slate-700">Sunday</span>
                  <span className="font-semibold text-amber-800">10:00 AM - 1:00 PM (Prior Slots)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold text-slate-700">Ocular Emergencies</span>
                  <span className="text-emerald-700 font-bold">24/7 Retina Trauma On-Call</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic pt-1 border-t border-sky-100/60">
                * Pupil dilation for retinal exams takes 45 minutes; please schedule arrival at least 1 hour before OPD closing.
              </p>
            </div>

            {/* Arterial Connectivity & Landmarks */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
                <span>Prime Arterial Highway Connectivity</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Square Access</span>
                  <span className="font-bold text-[#0A1E3F] block">Ayodhya Nagar</span>
                  <span className="text-[11px] text-emerald-600 block font-medium mt-0.5">2 mins away</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Rail Transit</span>
                  <span className="font-bold text-[#0A1E3F] block">Bhopal Central</span>
                  <span className="text-[11px] text-slate-500 block font-medium mt-0.5">~15 mins drive</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Airport Corridor</span>
                  <span className="font-bold text-[#0A1E3F] block">Raja Bhoj BHO</span>
                  <span className="text-[11px] text-slate-500 block font-medium mt-0.5">~25 mins drive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Address Card + Google Map Frame */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 shadow-inner">
                  <MapPin className="w-5 h-5 text-sky-700" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Complete Address
                  </h4>
                  <p className="text-base font-bold text-[#0A1E3F]">
                    {CLINIC_INFO.name}
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    {CLINIC_INFO.addressLine1}, {CLINIC_INFO.addressLine2}
                  </p>
                  <p className="text-sm text-slate-700">
                    {CLINIC_INFO.city}, {CLINIC_INFO.state} - {CLINIC_INFO.pincode}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600">Landmark:</span>
                    <span>{CLINIC_INFO.landmark}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ample Dedicated Parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Senior Citizen & Wheelchair Friendly</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  href={CLINIC_INFO.social.googleBusiness}
                  target="_blank"
                  icon={Navigation}
                  className="font-semibold text-xs"
                >
                  Get Directions in Google Maps
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  href={`tel:${CLINIC_INFO.phoneRaw}`}
                  icon={Phone}
                  className="text-xs font-semibold"
                >
                  Call: {CLINIC_INFO.phone}
                </Button>
              </div>
            </div>

            {/* Google Map Frame */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative h-[340px] sm:h-[380px] flex flex-col justify-between">
              <iframe
                title="Nirvaya Eyecare Centre Location Map"
                src="https://maps.google.com/maps?q=23.269999,77.458997&hl=en&z=15&output=embed"
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <div className="relative z-10 m-3 sm:m-4 max-w-xs bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xl pointer-events-auto">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#0A1E3F]">
                    Nirvaya Eyecare Centre
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2.5 leading-snug">
                  Ayodhya Bypass Road, Bhopal. Direct main road access.
                </p>
                <SafeLink
                  href={CLINIC_INFO.social.googleBusiness}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 group"
                >
                  <span>Open in Navigation App</span>
                  <Navigation className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </SafeLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

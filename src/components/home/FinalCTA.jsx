import React from 'react';
import { CLINIC_INFO } from '@/data/siteData';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import { Calendar, MessageSquare, Phone, ShieldCheck, Sparkles, Clock, MapPin } from 'lucide-react';

export default function FinalCTA({ onOpenPreBook, currentLang = 'en' }) {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <Container>
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0A1E3F] via-[#0D2852] to-[#061226] p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl border border-slate-700/60 reveal-up">
          {/* Subtle luminous ambient accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFBF64]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Specialist Ophthalmology in Bhopal
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Protect Your Vision with Timely, Specialist-Led Eye Care
            </h2>

            {/* Subtext */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-2xl">
              Whether you require a detailed retina evaluation, expert cataract assessment, diabetic screening, or a second opinion on surgery—our dedicated team is here to guide you with clinical integrity.
            </p>

            {/* Quick trust strip */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium mb-10 pb-6 border-b border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Dr Sandhya Gaur (MD AIIMS)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#DFBF64]" />
                <span>Mon-Sat: 9:30 AM - 7:30 PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Ayodhya Bypass Road, Bhopal</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="gold"
                size="lg"
                href="/pre-book"
                to="/pre-book"
                icon={Calendar}
                className="font-bold shadow-xl text-sm"
              >
                Pre-book Consultation Slot
              </Button>

              <Button
                variant="secondary"
                size="lg"
                href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
                  CLINIC_INFO.whatsappDefaultMessage
                )}`}
                target="_blank"
                icon={MessageSquare}
                className="bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] border-white/25 backdrop-blur-xs font-semibold text-sm"
              >
                Chat on WhatsApp
              </Button>

              <Button
                variant="outline"
                size="lg"
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                icon={Phone}
                className="border-slate-600 text-slate-200 hover:text-white hover:border-slate-400 text-sm"
              >
                Call: {CLINIC_INFO.phone}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

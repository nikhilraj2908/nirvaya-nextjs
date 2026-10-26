import React from 'react';
import { CLINIC_INFO } from '@/data/siteData';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import { Calendar, MessageSquare, Phone, ShieldCheck, Clock, MapPin } from 'lucide-react';
import en from '@/locales/en.json';

export default function FinalCTA({ onOpenPreBook, currentLang = 'en' }) {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <Container>
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0A1E3F] via-[#0D2852] to-[#061226] p-8 sm:p-12 lg:p-14 xl:p-16 text-white overflow-hidden shadow-2xl border border-slate-700/60 reveal-up">
          {/* Left-Side Blended Clinical Image (img2.webp) with Seamless Fade Mask & Gradients */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-[56%] pointer-events-none overflow-hidden z-0">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-left lg:bg-center"
              style={{
                backgroundImage: "url('/assets/img2.webp')",
                WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0) 95%)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0) 95%)'
              }}
              aria-hidden="true"
            />
            {/* Color tone multiplier to integrate seamlessly into dark medical blue */}
            <div className="absolute inset-0 bg-[#0A1E3F]/35 mix-blend-multiply" />

            {/* Seamless gradient overlays so there is no cut-off or separate boundary */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#0A1E3F]/30 via-transparent via-[40%] to-[#0D2852] to-[100%]" />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0A1E3F]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#061226]/80 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0A1E3F]/50 to-transparent" />

            {/* Mobile overlay for 100% text legibility */}
            <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#0A1E3F]/80 via-[#0A1E3F]/90 to-[#061226]/95" />
          </div>

          {/* Subtle luminous ambient accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFBF64]/10 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none z-0" />

          {/* Right-Side Content Block */}
          <div className="relative z-10 w-full lg:max-w-2xl xl:max-w-[640px] 2xl:max-w-[700px] lg:ml-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              {en.finalCTA.badge}
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              {en.finalCTA.headline}
            </h2>

            {/* Subtext */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 max-w-2xl">
              {en.finalCTA.subtext}
            </p>

            {/* Quick trust strip */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium mb-8 pb-5 border-b border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{en.finalCTA.trust1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#DFBF64] shrink-0" />
                <span>{en.finalCTA.trust2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{en.finalCTA.trust3}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                variant="gold"
                size="lg"
                href="/pre-book"
                to="/pre-book"
                icon={Calendar}
                className="font-bold shadow-xl text-sm"
              >
                {en.finalCTA.ctaPrimary}
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
                {en.finalCTA.ctaWhatsApp}
              </Button>

              <Button
                variant="outline"
                size="lg"
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                icon={Phone}
                className="border-slate-600 text-slate-200 hover:text-white hover:border-slate-400 text-sm"
              >
                {en.common.phoneLabel} {CLINIC_INFO.phone}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import SafeLink from '@/components/common/SafeLink';
import { CLINIC_INFO } from '@/data/siteData';
import Container from '@/components/common/Container';
import Logo from '@/components/common/Logo';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  const [legalModal, setLegalModal] = useState(null);

  return (
    <footer className="bg-[#061226] text-white border-t border-slate-800 pt-16 pb-24 lg:pb-12 text-xs sm:text-sm">
      <Container>
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          <div className="lg:col-span-4 space-y-4">
            <Logo type="round" size="md" />

            <p className="text-slate-300 text-xs leading-relaxed pt-2">
              A specialized day-care eye centre in Bhopal focused on vitreo-retinal surgery, micro-incision cataract surgery, diabetic eye disease, and pediatric ROP screening under Dr Sandhya Gaur (MD AIIMS, FVRS, FAICO Gold Medalist).
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p>Legal Entity: <span className="text-slate-200 font-semibold">{CLINIC_INFO.legalEntity}</span></p>
              <p>Medical Director: <span className="text-[#DFBF64] font-semibold">{CLINIC_INFO.medicalDirector}</span></p>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <SafeLink
                href={CLINIC_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#DFBF64] hover:text-[#0A1E3F] text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </SafeLink>
              <SafeLink
                href={CLINIC_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#DFBF64] hover:text-[#0A1E3F] text-slate-300 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </SafeLink>
              <SafeLink
                href={CLINIC_INFO.social.googleBusiness}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <span>Google Business Profile</span>
                <ExternalLink className="w-3 h-3 text-[#DFBF64]" />
              </SafeLink>
            </div>
          </div>

          {/* Column 2: Clinical Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Clinical Specialties
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <SafeLink href="/services#services-retina" className="hover:text-[#DFBF64] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#DFBF64]" />
                  Retina & Vitreoretinal Surgery
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/services#services-injections" className="hover:text-[#DFBF64] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#DFBF64]" />
                  Intravitreal Anti-VEGF Injections
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/services#services-diabetic" className="hover:text-[#DFBF64] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#DFBF64]" />
                  Diabetic Retinopathy Care
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/services#services-rop" className="hover:text-[#DFBF64] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#DFBF64]" />
                  Neonatal ROP Screening
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/services#services-cataract" className="hover:text-[#DFBF64] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#DFBF64]" />
                  Micro-Incision Cataract (Phaco)
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/services#services-uveitis" className="hover:text-[#DFBF64] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#DFBF64]" />
                  Uveitis & Ocular Immunology
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/services" className="hover:text-[#DFBF64] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#DFBF64]" />
                  View All Specialties →
                </SafeLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Patient Resources & Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Patient Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <SafeLink href="/about" className="hover:text-[#DFBF64] transition-colors">
                  About Nirvaya
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/doctors" className="hover:text-[#DFBF64] transition-colors">
                  Dr Sandhya Gaur
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/services" className="hover:text-[#DFBF64] transition-colors">
                  Clinical Services
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/technology" className="hover:text-[#DFBF64] transition-colors">
                  Technology & OT
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/contact" className="hover:text-[#DFBF64] transition-colors">
                  Clinic Location & Map
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/blog" className="hover:text-[#DFBF64] transition-colors">
                  Articles & Eye Guides
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/research" className="hover:text-[#DFBF64] transition-colors">
                  Research Publications
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/faq" className="hover:text-[#DFBF64] transition-colors">
                  Patient FAQs
                </SafeLink>
              </li>
              <li>
                <SafeLink
                  href="/pre-book"
                  className="hover:text-[#DFBF64] text-amber-300 font-bold block pt-1"
                >
                  Pre-book Slot →
                </SafeLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact, Timings & Emergency (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Clinic Contact & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  {CLINIC_INFO.addressLine1}, {CLINIC_INFO.addressLine2}, {CLINIC_INFO.city} - {CLINIC_INFO.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DFBF64] shrink-0" />
                <SafeLink href={`tel:${CLINIC_INFO.phoneRaw}`} className="hover:text-white transition-colors">
                  {CLINIC_INFO.phone}
                </SafeLink>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <SafeLink href={`mailto:${CLINIC_INFO.email}`} className="hover:text-white transition-colors">
                  {CLINIC_INFO.email}
                </SafeLink>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Mon - Sat: 9:30 AM - 7:30 PM</p>
                  <p className="text-[11px] text-slate-400">Sunday: Prior Slots / Emergency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical & Statutory Disclaimer */}
        <div className="py-6 border-b border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
          <p>
            <strong className="text-slate-300">Medical Disclaimer:</strong> The information provided on this website is for general patient educational purposes and does not replace individualized clinical evaluation or ophthalmological consultation by a qualified doctor. If you experience sudden vision loss, severe eye pain, or flashes/floaters, please seek immediate emergency ophthalmic care.
          </p>
          <p>
            Compliant with Indian Digital Personal Data Protection (DPDP) Act 2023. Patient inquiries and pre-booking records are processed solely for clinical scheduling and communication.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © 2026 {CLINIC_INFO.legalEntity}. All rights reserved. NIRVAYA EYECARE CENTRE™
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-200 transition-colors underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-200 transition-colors underline cursor-pointer"
            >
              Terms of Use
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal('disclaimer')}
              className="hover:text-slate-200 transition-colors underline cursor-pointer"
            >
              Patient Charter
            </button>
          </div>
        </div>

        {/* Legal Modal */}
        {legalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-[#0A1E3F] mb-3 capitalize">
                {legalModal === 'privacy' && 'Privacy Policy & DPDP Notice'}
                {legalModal === 'terms' && 'Terms of Use'}
                {legalModal === 'disclaimer' && 'Patient Rights & Clinical Charter'}
              </h3>
              <div className="text-xs text-slate-600 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                <p>
                  At M/s Nirvaya Health, patient confidentiality is held with the highest ethical commitment. We do not sell or monetize personal contact data. Pre-booking submissions are strictly utilized by our front-desk coordinators to coordinate clinic appointments and patient follow-ups.
                </p>
                <p>
                  Diagnostic procedures and surgical interventions are discussed transparently with patients prior to execution, detailing clinical indications, alternative options, and projected recovery courses.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#0A1E3F] text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </footer>
  );
}

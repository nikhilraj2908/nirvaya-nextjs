import React from 'react';
import { DOCTOR_REVIEWS } from '@/data/doctorReviews';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import {
  ShieldCheck,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import en from '@/locales/en.json';

// Preserved credentials data (per requirement: do not delete the data)
export const credentialsStats = [
  {
    icon: GraduationCap,
    value: 'MD AIIMS',
    label: 'Apex National Institute',
    sub: 'Dr. R.P. Centre for Ophthalmic Sciences'
  },
  {
    icon: Award,
    value: 'Gold Medal',
    label: 'FAICO (Retina) National Honours',
    sub: 'All India Ophthalmological Society'
  },
  {
    icon: BookOpen,
    value: '18+',
    label: 'Published Research Papers',
    sub: 'Indexed International Journals'
  }
];

function getDoctorInitials(name) {
  if (!name) return 'DR';
  const clean = name.replace(/^Dr\.?\s+/i, '').replace(/\[.*?\]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'DR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ReviewsSection() {
  // Only render client-approved reviews
  const approvedReviews = DOCTOR_REVIEWS.filter((item) => item.approved);

  return (
    <section id="reviews" className="relative py-20 lg:py-28 bg-gradient-to-b from-[#EEF3F8] via-[#E5EDF6] to-[#EEF3F8] border-t border-slate-200/80 scroll-mt-24 overflow-hidden">
      {/* Decorative Optical Vector Background (Tone B: Architectural Clinical Grid) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <defs>
            {/* Tone B Clinical Micro-grid Pattern */}
            <pattern id="rev-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path
                d="M 44 0 L 0 0 0 44"
                fill="none"
                stroke="#0A1E3F"
                strokeWidth="0.8"
                strokeOpacity="0.04"
              />
              <circle cx="0" cy="0" r="1.2" fill="#0A1E3F" fillOpacity="0.08" />
            </pattern>
            {/* Tone B Radial Glows */}
            <radialGradient id="rev-sky-glow" cx="20%" cy="40%" r="45%">
              <stop offset="0%" stopColor="#00aeef" stopOpacity="0.1" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.01" />
              <stop offset="100%" stopColor="#EEF3F8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rev-gold-glow" cx="80%" cy="60%" r="40%">
              <stop offset="0%" stopColor="#DFBF64" stopOpacity="0.1" />
              <stop offset="65%" stopColor="#C59B27" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#EEF3F8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid pattern fill */}
          <rect width="100%" height="100%" fill="url(#rev-grid)" />
          {/* Ambient Glows */}
          <rect width="100%" height="100%" fill="url(#rev-sky-glow)" />
          <rect width="100%" height="100%" fill="url(#rev-gold-glow)" />

          {/* Clinical Sine Contour Ribbon */}
          <path
            d="M-50,300 C300,180 650,420 1020,240 C1220,140 1380,220 1500,260"
            fill="none"
            stroke="#00aeef"
            strokeWidth="1.2"
            strokeOpacity="0.18"
            strokeDasharray="4 6"
          />
          <path
            d="M-50,340 C340,220 690,460 1060,280 C1260,180 1420,260 1500,300"
            fill="none"
            stroke="#C59B27"
            strokeWidth="1.2"
            strokeOpacity="0.14"
          />
        </svg>
      </div>

      <Container className="relative z-10">
        {/* Symmetrically Centered Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14">
          <SectionHeading
            align="center"
            light={false}
            eyebrow={en.reviews.eyebrow}
            title={en.reviews.title}
            subtitle={en.reviews.subtitle}
          />
        </div>

        {/* Doctor Reviews Cards Grid: Equal-height, 3 columns desktop, 1 on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch reveal-up">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div className="flex-1 flex flex-col">
                {/* Card Header: Specialty & Doctor's View Badges on one line */}
                <div className="flex items-center justify-between gap-2 mb-4 flex-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 shrink-0 truncate max-w-[62%]">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{rev.specialty || 'Specialist'}</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md shrink-0 whitespace-nowrap">
                    {en.reviews.cardBadge}
                  </span>
                </div>

                {/* Referral Context */}
                {rev.referralContext && (
                  <div className="text-[11px] text-slate-500 font-medium mb-3 flex items-start gap-1.5 leading-snug">
                    <span className="text-slate-400 shrink-0">{en.reviews.referredFor}</span>
                    <span className="text-slate-700 font-semibold">{rev.referralContext}</span>
                  </div>
                )}

                {/* Doctor's Quote */}
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              {/* Card Footer: Author block pinned to bottom */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3.5">
                {rev.photo ? (
                  <img
                    src={rev.photo}
                    alt={rev.doctorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0A1E3F] text-[#DFBF64] flex items-center justify-center font-heading font-extrabold text-xs shadow-xs shrink-0">
                    {getDoctorInitials(rev.doctorName)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#0A1E3F] truncate">
                    {rev.doctorName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium truncate">
                    {rev.designation}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {rev.hospitalOrClinic} {rev.specialty ? `• ${rev.specialty}` : ''}
                  </p>
                  {rev.registrationNo && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      Reg: {rev.registrationNo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Small Muted Footnote */}
        <div className="mt-8 sm:mt-10 text-center text-xs text-slate-400 max-w-2xl mx-auto">
          <p>{en.reviews.footnote}</p>
        </div>
      </Container>
    </section>
  );
}

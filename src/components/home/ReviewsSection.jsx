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
    <section id="reviews" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80 scroll-mt-24">
      <Container>
        {/* Symmetrically Centered Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14">
          <SectionHeading
            align="center"
            light={false}
            eyebrow="WHAT FELLOW DOCTORS SAY"
            title="Doctors' Point of View"
            subtitle="Referring physicians, paediatricians and diabetologists share their clinical experience of working with Dr Sandhya Gaur."
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
                    DOCTOR&apos;S VIEW
                  </span>
                </div>

                {/* Referral Context */}
                {rev.referralContext && (
                  <div className="text-[11px] text-slate-500 font-medium mb-3 flex items-start gap-1.5 leading-snug">
                    <span className="text-slate-400 shrink-0">Referred for:</span>
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
          <p>Views shared by fellow medical professionals with their consent.</p>
        </div>
      </Container>
    </section>
  );
}

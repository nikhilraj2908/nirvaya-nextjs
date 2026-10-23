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

  const credentialsStats = [
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

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80 scroll-mt-24">
      <Container>
        {/* Symmetrically Centered Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <SectionHeading
            align="center"
            light={false}
            eyebrow="Peer Recommendations"
            title="Professional Collaboration & Clinical Trust"
            subtitle="Observations and referral experiences shared by referring physicians, paediatricians, diabetologists, and medical colleagues collaborating with Dr Sandhya Gaur for specialized vitreo-retinal care."
          />
        </div>

        {/* Clinical Credentials Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16 max-w-4xl mx-auto reveal-up">
          {credentialsStats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 text-center flex flex-col items-center justify-center hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0A1E3F]/5 border border-[#0A1E3F]/10 text-[#C59B27] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight mb-1">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 mb-0.5">
                  {stat.label}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {stat.sub}
                </span>
              </div>
            );
          })}
        </div>

        {/* Doctor Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto reveal-up">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Header: Specialty & Peer Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>{rev.specialty || 'Peer Review'}</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Peer Recommendation
                  </span>
                </div>

                {rev.referralContext && (
                  <div className="text-[11px] text-slate-500 font-medium mb-3 flex items-center gap-1.5">
                    <span className="text-slate-400">Context:</span>
                    <span className="text-slate-700 font-semibold">{rev.referralContext}</span>
                  </div>
                )}

                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              {/* Card Footer: Doctor Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
                {rev.photo ? (
                  <img
                    src={rev.photo}
                    alt={rev.doctorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
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

        {/* Compliance Footnote */}
        <div className="mt-10 text-center text-xs text-slate-500 max-w-2xl mx-auto">
          <p>
            * Reviews are shared by fellow medical professionals with their consent. Individual outcomes may vary.
          </p>
        </div>
      </Container>
    </section>
  );
}

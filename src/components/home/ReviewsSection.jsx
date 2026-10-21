import React from 'react';
import { GOOGLE_REVIEWS_PLACEHOLDER, CLINIC_INFO } from '@/data/siteData';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import {
  Star,
  ShieldCheck,
  MessageCircle,
  ExternalLink,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function ReviewsSection() {
  const { averageRating, reviews, disclaimer, source } = GOOGLE_REVIEWS_PLACEHOLDER;

  const impactStats = [
    {
      icon: Star,
      value: `${averageRating} ★`,
      label: 'Google Patient Rating',
      sub: 'Verified Clinical Feedback'
    },
    {
      icon: BookOpen,
      value: '18+',
      label: 'Published Research Papers',
      sub: 'Indexed International Journals'
    },
    {
      icon: GraduationCap,
      value: 'MD AIIMS',
      label: 'Apex National Institute',
      sub: 'Dr. R.P. Centre Fellowship'
    },
    {
      icon: Award,
      value: 'Gold Medal',
      label: 'FAICO (Retina) National Honours',
      sub: 'All India Ophthalmological Society'
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
            eyebrow="Patient Feedback & Trust"
            title="Ethical Care. Transparent Outcomes. Restored Vision."
            subtitle="Verified patient experiences regarding surgical precision, unhurried clinical counselling, and dedicated vitreo-retinal attention under Dr Sandhya Gaur."
          />

          {/* Centered Rating Trust Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 shadow-sm -mt-6">
            <div className="flex items-center gap-1 text-amber-500">
              <span className="font-extrabold text-[#0A1E3F] text-sm mr-1">{averageRating}</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {source}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <a
              href={CLINIC_INFO.social.googleBusiness}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold transition-colors"
            >
              <span>View Google Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Clinical Impact Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 max-w-5xl mx-auto reveal-up">
          {impactStats.map((stat, idx) => {
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

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto reveal-up">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {rev.date}
                  </span>
                </div>

                <div className="inline-block text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md mb-3 border border-sky-100">
                  {rev.treatment}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0A1E3F]">
                    {rev.author}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {rev.city}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="mt-10 text-center text-xs text-slate-500 max-w-2xl mx-auto">
          <p>
            * {disclaimer} Live API synchronisation with Google Maps Business Place ID configured for upcoming deployment.
          </p>
        </div>
      </Container>
    </section>
  );
}

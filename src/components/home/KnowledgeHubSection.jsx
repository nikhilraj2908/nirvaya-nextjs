'use client';

import React, { useState, useEffect } from 'react';
import SafeLink from '@/components/common/SafeLink';
import { FileText, BookOpen, ArrowRight } from 'lucide-react';
import Container from '@/components/common/Container';
import { getResourceHub } from '@/services/api';
import en from '@/locales/en.json';

export default function KnowledgeHubSection() {
  const [hubData, setHubData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getResourceHub()
      .then((res) => {
        if (isMounted && res && res.success) {
          setHubData(res.hub);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch knowledge hub from API, using fallback content:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const defaultSubOptions = en.knowledgeHub.subOptions.map((opt) => ({
    ...opt,
    slug: opt.id === 'blogs' ? 'blog' : 'research',
    route: opt.id === 'blogs' ? '/blog' : '/research'
  }));

  const subOptions = hubData?.subOptions || defaultSubOptions;

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-[#FAFBFD] via-[#F3F7FC] to-[#FAFBFD] border-t border-slate-200/80 overflow-hidden">
      {/* Decorative Optical Vector Background */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
        >
          <defs>
            {/* Tone A Dot Matrix */}
            <pattern id="kh-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#0A1E3F" fillOpacity="0.065" />
            </pattern>
            {/* Ambient Radial Gradients */}
            <radialGradient id="kh-gold" cx="15%" cy="30%" r="45%">
              <stop offset="0%" stopColor="#DFBF64" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#C59B27" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#FAFBFD" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="kh-sky" cx="85%" cy="75%" r="50%">
              <stop offset="0%" stopColor="#00aeef" stopOpacity="0.09" />
              <stop offset="65%" stopColor="#0284c7" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#FAFBFD" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Dot Grid */}
          <rect width="100%" height="100%" fill="url(#kh-dots)" />
          {/* Ambient Glows */}
          <rect width="100%" height="100%" fill="url(#kh-gold)" />
          <rect width="100%" height="100%" fill="url(#kh-sky)" />

          {/* Flowing Research / Waveform Contours */}
          <path
            d="M-50,220 C280,320 620,120 1020,260 C1240,340 1380,280 1500,240"
            fill="none"
            stroke="#00aeef"
            strokeWidth="1.2"
            strokeOpacity="0.18"
            strokeDasharray="4 6"
          />
          <path
            d="M-50,260 C320,380 680,180 1060,300 C1280,370 1410,320 1500,280"
            fill="none"
            stroke="#C59B27"
            strokeWidth="1.2"
            strokeOpacity="0.16"
          />
          <path
            d="M-50,620 C360,520 740,700 1120,580 C1300,520 1420,560 1500,590"
            fill="none"
            stroke="#0A1E3F"
            strokeWidth="1"
            strokeOpacity="0.08"
          />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1E3F]/5 text-[#0A1E3F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#0A1E3F]/10">
            <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>{en.knowledgeHub.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#0A1E3F] tracking-tight">
            {en.knowledgeHub.title}
          </h2>

          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            {en.knowledgeHub.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto reveal-up">
          {subOptions.map((opt) => {
            const isBlog = opt.id === 'blogs';
            const Icon = isBlog ? FileText : BookOpen;
            const badgeBg = isBlog ? 'bg-amber-50 text-[#C59B27] border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200';
            const iconBg = isBlog ? 'bg-[#FDF9EE] text-[#C59B27]' : 'bg-[#0A1E3F]/5 text-[#0A1E3F]';

            return (
              <div
                key={opt.id}
                className="group relative bg-white rounded-2xl p-8 sm:p-10 shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-[#C59B27]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBg} shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeBg}`}>
                      {opt.countLabel}
                    </span>
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-[#0A1E3F] group-hover:text-[#C59B27] transition-colors mb-3">
                    {opt.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <SafeLink
                    href={opt.route}
                    className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1E3F] group-hover:text-[#C59B27] transition-colors"
                  >
                    <span>{opt.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </SafeLink>

                  <span className="text-xs text-slate-400 font-medium">
                    {opt.tag || (isBlog ? 'Public Guides' : 'Indexed Studies')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

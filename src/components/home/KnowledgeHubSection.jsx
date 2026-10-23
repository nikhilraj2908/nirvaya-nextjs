'use client';

import React, { useState, useEffect } from 'react';
import SafeLink from '@/components/common/SafeLink';
import { FileText, BookOpen, ArrowRight } from 'lucide-react';
import Container from '@/components/common/Container';
import { getResourceHub } from '@/services/api';

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

  const subOptions = hubData?.subOptions || [
    {
      id: 'blogs',
      title: 'Articles & Patient Guides',
      slug: 'blog',
      description: 'Read practical medical perspectives on retinal health, digital eye strain, diabetic eye care, and emergency warning signs.',
      countLabel: '3 Articles Published',
      ctaText: 'Read Articles',
      route: '/blog'
    },
    {
      id: 'papers',
      title: 'Research Papers & Clinical Studies',
      slug: 'research',
      description: 'Explore indexed peer-reviewed publications, surgical techniques, and clinical research in vitreoretinal surgery by Dr. Sandhya Gaur.',
      countLabel: '5 Indexed Publications',
      ctaText: 'Explore Research',
      route: '/research'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-slate-200/80 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-[#0A1E3F]/5 rounded-full blur-3xl pointer-events-none" />

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1E3F]/5 text-[#0A1E3F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#0A1E3F]/10">
            <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Academic & Clinical Publications</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#0A1E3F] tracking-tight">
            Knowledge & Clinical Insights
          </h2>

          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Delivering transparent, evidence-based ophthalmology education for patients and publishing peer-reviewed clinical research for the global medical community.
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
                    {isBlog ? 'Public Guides' : 'Indexed Studies'}
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

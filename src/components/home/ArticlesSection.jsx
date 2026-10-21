'use client';

import React, { useState } from 'react';
import { PATIENT_ARTICLES } from '@/data/siteData';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import {
  Clock,
  ArrowRight,
  X
} from 'lucide-react';

export default function ArticlesSection() {
  const [activeArticle, setActiveArticle] = useState(null);

  const articleContent = {
    'diabetic-retinopathy-guide': {
      title: 'Why People with Diabetes Need Annual Dilated Retina Examinations',
      author: 'Dr Sandhya Gaur (MD AIIMS, FVRS)',
      date: 'Published for Patient Education',
      body: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Diabetes affects the delicate micro-vasculature of the retina long before any change in vision is noticed by the patient. The high circulating blood sugar levels gradually weaken the capillary pericytes, causing tiny microaneurysms, fluid leakage (diabetic macular edema), and eventually ischemia.
          </p>
          <h4 className="font-bold text-[#0A1E3F] text-base pt-2">Why Early Screening Is Non-Negotiable</h4>
          <p>
            In its mild or moderate non-proliferative stages, diabetic retinopathy is completely asymptomatic. By the time a patient experiences blurred vision, significant macular edema or vitreous hemorrhage may already have developed.
          </p>
          <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded-r-lg my-3">
            <p className="font-medium text-sky-950 text-xs">
              Clinical Consensus: Every person diagnosed with Type 2 Diabetes should have a baseline dilated indirect ophthalmoscopy and OCT scan immediately upon diagnosis, followed by annual surveillance.
            </p>
          </div>
          <h4 className="font-bold text-[#0A1E3F] text-base pt-2">Modern Therapeutic Interventions</h4>
          <p>
            With modern intravitreal anti-VEGF injections and precision green laser photocoagulation, severe visual loss from diabetes is over 95% preventable when detected early.
          </p>
        </div>
      )
    },
    'modern-cataract-iol-choices': {
      title: 'Understanding Monofocal vs Toric vs Multifocal IOLs for Cataract Surgery',
      author: 'Dr Sandhya Gaur (MD AIIMS, FVRS)',
      date: 'Published for Patient Education',
      body: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Cataract surgery today is both a restorative procedure and a refractive opportunity. Once the cloudy natural crystalline lens is emulsified through a 2.2mm micro-incision, an artificial intraocular lens (IOL) is permanently inserted.
          </p>
          <h4 className="font-bold text-[#0A1E3F] text-base pt-2">Monofocal Intraocular Lenses</h4>
          <p>
            The tried-and-tested standard of care. Focuses light sharply at a single distance (typically distant vision for driving and TV). Reading glasses are still required for mobile phone use and reading.
          </p>
          <h4 className="font-bold text-[#0A1E3F] text-base pt-2">Toric Intraocular Lenses</h4>
          <p>
            Engineered specifically for eyes with pre-existing corneal astigmatism (cylindrical error). Eliminates corneal distortion to provide crisp, uncompromised distance sight.
          </p>
          <h4 className="font-bold text-[#0A1E3F] text-base pt-2">Multifocal & Extended Depth of Focus (EDOF) Lenses</h4>
          <p>
            Distributes incoming light across intermediate (computer monitor/dashboard) and near focal points to minimize dependency on spectacles for active lifestyle freedom.
          </p>
        </div>
      )
    },
    'what-is-rop-screening': {
      title: 'What Every Parent of a Preterm Baby Must Know About ROP',
      author: 'Dr Sandhya Gaur (MD AIIMS, FVRS)',
      date: 'Published for Patient Education',
      body: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Retinopathy of Prematurity (ROP) is a vasoproliferative vitreoretinal disorder affecting premature, low-birth-weight neonates. When a baby is born early, the normal blood vessel growth of the retina is abruptly halted.
          </p>
          <h4 className="font-bold text-[#0A1E3F] text-base pt-2">The 'Golden 30 Days' Screening Window</h4>
          <p>
            Indian national guidelines dictate that every baby born with a birth weight under 1,750 grams or gestational age less than 34 weeks must undergo an indirect ophthalmoscopic ROP screening by an experienced vitreo-retinal specialist within 20 to 30 days of birth ("Tees Din, Roshni Ke Naam").
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-lg my-3">
            <p className="font-medium text-amber-950 text-xs">
              Important: Never wait until a baby is 3-4 months old or displays a white pupil (leukocoria). Late presentation often signifies total retinal detachment, which has guarded visual outcomes.
            </p>
          </div>
          <p>
            Early stages often regress spontaneously or respond promptly to timely diode laser photocoagulation or intravitreal anti-VEGF therapy in the NICU.
          </p>
        </div>
      )
    }
  };

  return (
    <section
      id="articles"
      className="relative py-24 lg:py-32 overflow-hidden scroll-mt-24 text-white"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 w-full h-full bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/img1.webp')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061226]/95 via-[#0A1E3F]/88 to-[#061226]/95" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <SectionHeading
            align="center"
            light={true}
            eyebrow="Evidence-Based Patient Knowledge"
            title="Understanding Your Eyes: Expert Clinical Guides"
            subtitle="Clear, medical-grade educational articles curated by Dr Sandhya Gaur to help patients and families make informed decisions about their vision health."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {PATIENT_ARTICLES.map((article) => (
            <div
              key={article.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/30 text-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className="font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0A1E3F] group-hover:text-blue-900 transition-colors mb-3 leading-snug">
                  {article.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveArticle(article.id)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0A1E3F] group-hover:text-[#C59B27] transition-colors cursor-pointer"
                >
                  <span>{article.actionText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {activeArticle && articleContent[activeArticle] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 text-slate-900">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                aria-label="Close article modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-md">
                  Patient Education Guide
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0A1E3F] mt-3 leading-snug">
                  {articleContent[activeArticle].title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <span className="font-semibold text-slate-700">
                    {articleContent[activeArticle].author}
                  </span>
                  <span>•</span>
                  <span>{articleContent[activeArticle].date}</span>
                </div>
              </div>

              <div className="py-4 border-t border-b border-slate-100">
                {articleContent[activeArticle].body}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveArticle(null)}
                >
                  Close Article
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

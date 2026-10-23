'use client';

import React, { useState, useEffect } from 'react';
import SafeLink from '@/components/common/SafeLink';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import { CLINIC_INFO } from '@/data/siteData';
import { getDoctors } from '@/services/api';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Phone,
  GraduationCap,
  FileText,
  UserCheck,
  ArrowRight
} from 'lucide-react';

export default function DoctorsContent() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await getDoctors();
        if (res && res.doctors) {
          setDoctorsList(res.doctors);
        }
      } catch (err) {
        console.warn('Using local doctor fallback data:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const surgicalExpertise = [
    {
      title: 'Advanced Sutureless Vitrectomy (25G / 27G)',
      desc: 'Precision micro-vitrectomy for rhegmatogenous retinal detachments, vitreous hemorrhages, and complex proliferative diabetic retinopathy.'
    },
    {
      title: 'Macular Surgery & Membrane Peeling',
      desc: 'Delicate sub-millimeter internal limiting membrane (ILM) peeling for full-thickness macular holes and epiretinal membranes.'
    },
    {
      title: 'Micro-Incision Cataract Surgery (Phaco)',
      desc: 'Topical blade-free phacoemulsification with customized monofocal, toric, and extended depth of focus (EDOF) intraocular lenses.'
    },
    {
      title: 'Targeted Intravitreal Therapy (Anti-VEGF)',
      desc: 'Protocol-guided intravitreal injections for neovascular AMD, diabetic macular edema, and retinal vein occlusion maculopathy.'
    },
    {
      title: 'Pediatric ROP Screening & Bedside Laser',
      desc: 'Expert neonatal fundus screening and laser photocoagulation for retinopathy of prematurity in high-risk preterm infants.'
    },
    {
      title: 'Diabetic Retinal Laser Photocoagulation',
      desc: 'Green 532nm pattern-scan retinal laser treatments for proliferative diabetic retinopathy and retinal tears.'
    }
  ];

  const credentialsList = [
    {
      degree: 'MD (Ophthalmology)',
      institute: 'Dr. R.P. Centre for Ophthalmic Sciences, AIIMS, New Delhi',
      highlight: 'Premier Apex Medical Institute of India'
    },
    {
      degree: 'Fellowship in Vitreo-Retinal Surgery (FVRS)',
      institute: 'Sadguru Netra Chikitsalaya, Chitrakoot',
      highlight: 'High-Volume Vitreoretinal Microsurgery'
    },
    {
      degree: 'FAICO (Vitreo-Retina - Gold Medalist)',
      institute: 'All India Ophthalmological Society (AIOS)',
      highlight: 'National Gold Medal Honor'
    },
    {
      degree: 'Diplomate of National Board (DNB)',
      institute: 'National Board of Examinations, New Delhi',
      highlight: 'National Board Certification'
    }
  ];

  const publicationsSample = [
    'Surgical outcomes of 27-gauge micro-incision vitrectomy in complex tractional retinal detachments.',
    'Comparative evaluation of anti-VEGF agents in refractory diabetic macular edema in Central Indian cohort.',
    'Screening protocols and structural outcomes of bedside laser photocoagulation in Retinopathy of Prematurity (ROP).',
    'Macular hole closure dynamics following inverted ILM flap technique in high myopia.'
  ];

  const secondaryDoctors = doctorsList.filter(
    (d) => !d.name.toLowerCase().includes('sandhya gaur')
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 bg-[#061226] text-white border-b border-slate-800">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <SafeLink href="/" className="hover:text-[#DFBF64] transition-colors">
              Home
            </SafeLink>
            <span>/</span>
            <span className="text-[#DFBF64]">Our Doctors</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40 animate-fade-in-up stagger-1">
              <Award className="w-3.5 h-3.5" />
              <span>Medical Leadership & Specialist Faculty</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight animate-fade-in-up stagger-2">
              Dr Sandhya Gaur
            </h1>

            <p className="text-base sm:text-lg text-[#DFBF64] font-medium leading-relaxed animate-fade-in-up stagger-3">
              MD (AIIMS New Delhi) • DNB • FVRS • FAICO (Retina Gold Medalist)
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal animate-fade-in-up stagger-4">
              Senior Consultant Vitreo-Retinal Surgeon & Medical Director at Nirvaya Eyecare Centre, bringing apex institute surgical rigour and patient-centred clinical empathy to Bhopal.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 animate-fade-in-up stagger-5">
              <SafeLink
                href="/pre-book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-book Consultation Slot</span>
              </SafeLink>
              <SafeLink
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] font-semibold text-sm border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-[#DFBF64]" />
                <span>Call Clinic Desk</span>
              </SafeLink>
              <SafeLink
                href="/research"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#DFBF64]" />
                <span>View 18+ Research Papers</span>
              </SafeLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Profile & Academic Qualifications */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Bio Column */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                align="left"
                eyebrow="Academic Excellence"
                title="Trained at India's Foremost Institute: AIIMS, New Delhi"
                description="Rigorous clinical grounding, ethical diagnosis, and high-complexity vitreo-retinal surgery."
                className="mb-0 max-w-3xl"
              />

              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Dr Sandhya Gaur completed her postgraduate medical residency (MD Ophthalmology) at the prestigious{' '}
                  <strong className="text-[#0A1E3F]">
                    Dr. Rajendra Prasad Centre for Ophthalmic Sciences, All India Institute of Medical Sciences (AIIMS, New Delhi)
                  </strong>{' '}
                  — the country&apos;s apex eye care institute.
                </p>
                <p>
                  Following her residency, she undertook rigorous advanced fellowship training in{' '}
                  <strong className="text-[#0A1E3F]">Vitreo-Retinal Surgery (FVRS)</strong>, mastering state-of-the-art sutureless vitrectomy techniques, delicate macular peeling, and pediatric retinal screening.
                </p>
                <p>
                  She was conferred the prestigious{' '}
                  <strong className="text-[#0A1E3F]">FAICO Gold Medal in Vitreo-Retina</strong> by the All India Ophthalmological Society and has published 18+ research articles in national and international peer-reviewed journals.
                </p>
              </div>

              {/* Degrees Grid */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                  Formal Qualifications & Certifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {credentialsList.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0A1E3F] mb-1">
                        <GraduationCap className="w-4 h-4 text-[#C59B27] shrink-0" />
                        <span>{item.degree}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">{item.institute}</p>
                      <span className="text-[11px] text-[#8C6D1F] font-semibold mt-1 block">
                        {item.highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card: Clinical Philosophy & OPD Timings */}
            <div className="lg:col-span-5 space-y-6">
              {/* OPD Schedule Box */}
              <div className="bg-[#0A1E3F] text-white rounded-2xl p-7 border border-slate-700 shadow-md space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DFBF64]">
                  <Clock className="w-4 h-4" />
                  <span>OPD Consultation Hours</span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-700">
                    <span>Monday – Friday:</span>
                    <strong className="text-white">9:30 AM – 7:30 PM</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-700">
                    <span>Saturday:</span>
                    <strong className="text-white">9:30 AM – 7:30 PM</strong>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span>Sunday:</span>
                    <strong className="text-[#DFBF64]">Emergencies Only</strong>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-700 text-xs text-slate-300">
                  <span className="text-[#DFBF64] font-bold block mb-0.5">Clinical Policy:</span>
                  Consultations are intentionally spaced to ensure thorough dilated fundus evaluation without assembly-line rushing.
                </div>

                <SafeLink
                  href="/pre-book"
                  className="w-full py-3 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-xs text-center block transition-all cursor-pointer shadow-md"
                >
                  Reserve Slot with Dr Sandhya Gaur
                </SafeLink>
              </div>

              {/* Research and Papers Card */}
              <div className="bg-slate-50 rounded-2xl p-7 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                    <FileText className="w-4 h-4 text-[#C59B27]" />
                    <span>Research Publications</span>
                  </div>
                  <SafeLink
                    href="/research"
                    className="text-xs font-bold text-[#C59B27] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </SafeLink>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Active academician with 18+ publications in indexed journals focusing on surgical outcomes in retinal detachment, diabetic maculopathy, and pediatric ROP management.
                </p>

                <div className="space-y-2 pt-2 text-xs text-slate-700">
                  {publicationsSample.map((pub, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27] mt-1.5 shrink-0" />
                      <span className="italic text-slate-600">{pub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Dynamic Clinical Team Section (if additional specialists in MongoDB) */}
      {secondaryDoctors.length > 0 && (
        <section className="py-20 lg:py-24 bg-white border-b border-slate-200/80">
          <Container>
            <SectionHeading
              align="left"
              eyebrow="Clinical Specialists"
              title="Our Specialist Eye Surgeons & Consultants"
              description="Fellowship-trained ophthalmologists delivering comprehensive eye care across Cornea, Glaucoma, and Anterior Segment."
              className="mb-12 max-w-3xl"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {secondaryDoctors.map((doc) => (
                <div
                  key={doc.id || doc._id}
                  className="rounded-2xl p-6 sm:p-7 bg-[#F8FAFC] border border-slate-200 hover:border-[#DFBF64] transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-100 text-sky-800 mb-2">
                          <UserCheck className="w-3 h-3" />
                          <span>{doc.designation}</span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-[#0A1E3F]">
                          {doc.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#8C6D1F] mt-0.5">
                          {doc.qualification}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-500 block">Experience</span>
                        <strong className="text-sm font-bold text-[#0A1E3F]">
                          {doc.experienceYears}+ Years
                        </strong>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {doc.biography}
                    </p>

                    {/* Specialties Pills */}
                    {doc.specialties && doc.specialties.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Areas of Expertise
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {doc.specialties.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-md text-[11px] bg-white border border-slate-200 text-[#0A1E3F] font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* OPD Days */}
                    {doc.availableDays && (
                      <div className="text-xs text-slate-600 pt-2 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                        <span>
                          OPD Days:{' '}
                          <strong className="text-[#0A1E3F]">{doc.availableDays.join(', ')}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Consultation: ₹{doc.consultationFee || 700}
                    </span>
                    <SafeLink
                      href="/pre-book"
                      className="px-4 py-2 rounded-lg bg-[#0A1E3F] hover:bg-[#16325C] text-white text-xs font-bold transition-all"
                    >
                      Pre-book Slot
                    </SafeLink>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Surgical Competencies Grid */}
      <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Surgical Expertise"
            title="Core Specialized Surgical Procedures"
            description="Dedicated microsurgical capabilities performed in our Class 100 HEPA clean air modular OT."
            className="mb-12 max-w-3xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surgicalExpertise.map((spec, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-[#DFBF64]/80 shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center mb-4 font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-heading text-lg font-bold text-[#0A1E3F] mb-2">
                  {spec.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

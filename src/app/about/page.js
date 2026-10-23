import Link from 'next/link';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import { CLINIC_INFO } from '@/data/siteData';
import {
  ShieldCheck,
  Award,
  Heart,
  Calendar,
  CheckCircle2,
  Microscope,
  Clock,
  MapPin,
  ArrowRight,
  Phone
} from 'lucide-react';

export const metadata = {
  title: 'About Nirvaya Eyecare Centre | Dr Sandhya Gaur (MD AIIMS)',
  description:
    'Learn about Nirvaya Eyecare Centre in Bhopal. Founded by Dr Sandhya Gaur (MD AIIMS New Delhi, FVRS, FAICO Gold Medalist) with dedicated Day-Care vitreoretinal surgery and Class 100 HEPA cleanroom OT.',
  alternates: {
    canonical: 'https://nirvayaeyecare.com/about'
  },
  openGraph: {
    title: 'About Nirvaya Eyecare Centre Bhopal | Dr Sandhya Gaur',
    description:
      'Apex-institute surgical precision and ethical ophthalmology. Specialized in 25G/27G sutureless vitrectomy, retinal detachment, and micro-incision cataract surgery.',
    url: 'https://nirvayaeyecare.com/about',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'website'
  }
};

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Ethical & Transparent Ophthalmology',
    desc: 'Clear surgical prognosis discussions, upfront diagnostic breakdowns, and an absolute institutional policy against unnecessary investigations or forced surgeries.'
  },
  {
    icon: Award,
    title: 'AIIMS New Delhi Surgical Rigour',
    desc: 'Directed by Dr Sandhya Gaur (MD AIIMS, FVRS, FAICO Gold Medalist), bringing apex-institute surgical precision and evidence-based protocols to Bhopal.'
  },
  {
    icon: Microscope,
    title: 'Micro-Incision Vitreo-Retina',
    desc: 'Advanced 25G/27G sutureless vitrectomy, precision intravitreal therapy, and custom phacoemulsification utilizing international-grade optics and fluidics.'
  },
  {
    icon: Heart,
    title: 'Unhurried Day-Care Experience',
    desc: 'A calm, modern clinic setting dedicated to respectful patient listening, same-day recovery without stressful overnight stays, and compassionate post-op care.'
  }
];

const milestones = [
  {
    year: 'Apex Training',
    title: 'Residency at AIIMS New Delhi',
    desc: "Specialized training in complex ocular diseases and retinal pathology at India's premier medical institute."
  },
  {
    year: 'Sub-Specialty Mastery',
    title: 'Advanced Vitreo-Retinal Fellowship',
    desc: 'Extensive surgical fellowship managing thousands of complex retinal detachments, diabetic eye emergencies, and macular surgeries.'
  },
  {
    year: 'Academic Honors',
    title: 'FAICO Gold Medal & 18+ Publications',
    desc: 'Awarded Gold Medal in Retina and contributed international peer-reviewed ophthalmology research.'
  },
  {
    year: 'Center Launch',
    title: 'Nirvaya Eyecare Centre, Bhopal',
    desc: 'Establishing a dedicated day-care centre on Ayodhya Bypass Road equipped with modular Class 100 HEPA OT facilities.'
  }
];

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Nirvaya Eyecare Centre',
    description:
      'Founded by Dr Sandhya Gaur (MD AIIMS New Delhi), Nirvaya Eyecare Centre is Bhopal’s dedicated super-specialty vitreo-retina and micro-incision cataract day-care surgical center.',
    mainEntity: {
      '@type': 'MedicalBusiness',
      name: 'Nirvaya Eyecare Centre',
      founder: {
        '@type': 'Physician',
        name: 'Dr Sandhya Gaur',
        jobTitle: 'Consultant Vitreo-Retinal Surgeon & Medical Director',
        alumniOf: 'All India Institute of Medical Sciences (AIIMS, New Delhi)'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: CLINIC_INFO.addressLine1,
        addressLocality: CLINIC_INFO.city,
        addressRegion: CLINIC_INFO.state,
        postalCode: CLINIC_INFO.pincode,
        addressCountry: 'IN'
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Hero Header */}
      <section className="relative py-16 lg:py-24 bg-[#061226] text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#061226] via-[#0A1E3F] to-[#061226] opacity-90" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#DFBF64]/10 blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-[#DFBF64] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#DFBF64]">About Nirvaya</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Specialist-Led Day-Care Centre</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              A Specialist-Led Vision for Precision Eye Care in Bhopal
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Founded on the belief that delicate retina and cataract surgeries require unhurried diagnostic listening, academic integrity, and world-class microsurgical technology.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/pre-book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-book a Consultation</span>
              </Link>
              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] font-semibold text-sm border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-[#DFBF64]" />
                <span>{CLINIC_INFO.phone}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Founder Story & Clinical Philosophy */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                align="left"
                eyebrow="Our Story & Vision"
                title="Bridging the Gap in Vitreo-Retinal Healthcare"
                description="Why Nirvaya Eyecare Centre was built as a dedicated day-care surgical center."
                className="mb-0 max-w-3xl"
              />

              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  In high-volume hospital environments, patients facing sight-threatening conditions like retinal detachment, diabetic vitreous hemorrhage, and advanced cataract often experience rushed consultations and impersonal surgical handoffs.
                </p>
                <p>
                  <strong className="text-[#0A1E3F]">Nirvaya Eyecare Centre</strong> was conceived by <strong className="text-[#0A1E3F]">Dr Sandhya Gaur (MD AIIMS New Delhi, FVRS, FAICO Gold Medalist)</strong> as an antidote to assembly-line medicine. We established an environment where every scan, detailed dilated fundus examination, and surgical plan is conducted directly by the operating specialist.
                </p>
                <p>
                  From sutureless 25G/27G vitrectomy and anti-VEGF injections to customized micro-incision cataract surgery, every clinical protocol adheres strictly to international evidence-based standards.
                </p>
              </div>

              {/* Key Highlights list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  'Direct consultation with senior AIIMS specialist',
                  'Purpose-designed Day-Care surgical model',
                  'Class 100 HEPA-filtered sterile air OT',
                  'Ethical diagnostics with zero commercial targets',
                  'Dilated high-definition fundus biomicroscopy',
                  'Same-day discharge with rapid visual rehabilitation'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Clinical Director Spotlight */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-[#0A1E3F] to-[#061226] text-white p-8 sm:p-10 shadow-xl border border-slate-700/80 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#DFBF64]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C59B27]/25 text-[#DFBF64] border border-[#C59B27]/40">
                    <Award className="w-3.5 h-3.5" />
                    <span>Clinical Leadership</span>
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white">
                      Dr Sandhya Gaur
                    </h3>
                    <p className="text-xs text-[#DFBF64] font-medium mt-1 leading-snug">
                      MD (AIIMS New Delhi) • DNB • FVRS • FAICO (Retina Gold Medalist)
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Consultant Vitreo-Retinal Surgeon & Medical Director
                    </p>
                  </div>

                  <blockquote className="border-l-2 border-[#C59B27] pl-4 text-xs sm:text-sm italic text-slate-300 leading-relaxed">
                    &ldquo;Preserving sight demands technical mastery and patient trust. We prioritize transparent discussions, explaining exactly what is happening inside the eye before recommending any intervention.&rdquo;
                  </blockquote>

                  <div className="pt-4 border-t border-slate-700 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Primary Specialization:</span>
                      <strong className="text-white">Vitreo-Retina & Cataract</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Research & Papers:</span>
                      <strong className="text-[#DFBF64]">18+ Peer-Reviewed Publications</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Consultation Focus:</span>
                      <strong className="text-white">Unhurried Dilated Evaluations</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/doctors"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#DFBF64] hover:text-white transition-colors"
                    >
                      <span>View Full Academic & Surgical Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Clinical Excellence"
            title="Our Four Pillars of Patient Care"
            description="The values and institutional standards that guide every consultation and procedure at Nirvaya."
            className="mb-12 max-w-3xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-[#DFBF64]/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0A1E3F]/5 text-[#C59B27] border border-[#C59B27]/20 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#0A1E3F] mb-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Journey & Milestones */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200/80">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Background & Rigour"
            title="The Journey Behind Nirvaya"
            description="Grounded in continuous academic excellence and dedicated microsurgical practice."
            className="mb-12 max-w-3xl"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27] bg-[#FDF9EE] px-2.5 py-1 rounded border border-[#C59B27]/30 inline-block mb-3">
                  {m.year}
                </span>
                <h4 className="font-heading text-base font-bold text-[#0A1E3F] mb-2">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-[#0A1E3F] text-white">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold tracking-widest uppercase text-[#DFBF64]">
                Expert Retina & Cataract Care in Bhopal
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Schedule a Detailed Consultation Today
              </h2>
              <p className="text-sm text-slate-300">
                Dilated fundus evaluations, diabetic retinopathy screening, and surgical opinions under Dr Sandhya Gaur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href="/pre-book"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-book a Slot</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] font-semibold text-sm border border-white/20 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#DFBF64]" />
                <span>Find Our Clinic</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

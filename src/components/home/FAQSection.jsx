'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import {
  HelpCircle,
  CalendarCheck,
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import Button from '@/components/common/Button';

export const CLINICAL_FAQS = [
  {
    id: 'appointment',
    category: 'Appointment Policy',
    question: {
      en: 'Do I need an appointment before visiting Nirvaya Eyecare Centre?',
      hi: 'क्या निर्वाया आईकेयर सेंटर में आने से पहले अपॉइंटमेंट लेना जरूरी है?'
    },
    subtitle: {
      en: 'Great clinical care requires planned, unhurried consultation time',
      hi: 'उत्तम नैदानिक एवं परामर्श मूल्यांकन के लिए पर्याप्त समय आवश्यक है'
    },
    answer: {
      en: 'Prior slot pre-booking is strongly recommended to minimize waiting times and ensure Dr. Sandhya Gaur can give you dedicated, unhurried clinical time. However, sudden ocular emergencies (such as sudden loss of vision, acute eye trauma, severe sudden pain, or fresh retinal detachment symptoms) are attended to promptly with priority emergency triage.',
      hi: 'अनावश्यक प्रतीक्षा समय से बचने तथा विस्तृत जांच एवं परामर्श हेतु पहले से स्लॉट बुक करना अत्यधिक उचित है। तथापि, दृष्टि में अचानक गिरावट या किसी भी नेत्र आघात (इमरजेंसी) पर तुरंत प्राथमिकता के साथ देखा जाता है।'
    },
    takeaways: [
      'Dedicated 20-30 min unhurried consultation with senior retina & cataract specialist',
      'Pre-booked time slots eliminate tedious waiting room delays',
      'Immediate walk-in priority triage for acute eye trauma and sudden vision loss'
    ],
    ctaText: 'Pre-Book Appointment Slot',
    ctaLink: '/pre-book'
  },
  {
    id: 'retina-checkup',
    category: 'Retina Diagnostics',
    question: {
      en: 'How long does a comprehensive dilated retina evaluation take?',
      hi: 'विस्तृत डायलेटेड रेटिना जांच में कुल कितना समय लगता है?'
    },
    subtitle: {
      en: 'Dilated fundus examinations require medical precision & patience',
      hi: 'पुतली फैलाने व माइक्रोन-स्तरीय स्कैनिंग में थोड़ा समय लगता है'
    },
    answer: {
      en: 'A comprehensive retinal evaluation requires pupil dilation using specialized eye drops, taking approximately 30 to 45 minutes to achieve maximum dilation. Subsequent High-Definition Spectral OCT micrometer scanning, indirect ophthalmoscopy, and doctor counselling take an additional 20 to 30 minutes. Vision remains temporarily blurred for 2 to 4 hours post-dilation, so we strongly advise bringing a companion to drive you home.',
      hi: 'रेटिना की सूक्ष्म जांच के लिए पुतली फैलाना जरूरी होता है, जिसमें दवा डालने के बाद 30 से 45 मिनट का समय लगता है। इसके उपरांत ओसीटी व विशेषज्ञ परामर्श में 20 से 30 मिनट लगते हैं। जांच के बाद कुछ समय दृष्टि धुंधली रह सकती है, अतः किसी सहयोगी के साथ आना उचित है।'
    },
    takeaways: [
      'Total clinic visit takes approximately 60 to 75 minutes',
      'Includes sub-micron High-Definition Spectral OCT imaging',
      'Bring sunglasses and an accompanying family member to assist with travel'
    ],
    ctaText: 'Explore Retina Diagnostic Tech',
    ctaLink: '/technology'
  },
  {
    id: 'cataract-daycare',
    category: 'Cataract Day-Care',
    question: {
      en: 'Is cataract surgery performed on a same-day (day-care) basis?',
      hi: 'क्या मोतियाबिंद सर्जरी उसी दिन घर लौटने के आधार पर की जाती है?'
    },
    subtitle: {
      en: 'Stitchless micro-incision phacoemulsification day-care recovery',
      hi: 'बिना टांके, बिना पट्टी व बिना इंजेक्शन 15 मिनट में सुरक्षित सर्जरी'
    },
    answer: {
      en: 'Yes! Modern micro-incision phacoemulsification cataract surgery takes only 10 to 15 minutes in our HEPA-filtered Modular OT. You arrive 1 hour prior to surgery for preparation and painless topical numbing (no injections around the eye). You rest comfortably in our day-care recovery suite and return home within 1 to 2 hours post-procedure with crystal-clear vision and no hospital overnight stay.',
      hi: 'जी हाँ! आधुनिक माइक्रो-चीरा फेको सर्जरी में केवल 10 से 15 मिनट का समय लगता है। बिना किसी इंजेक्शन के केवल ड्रॉप्स डालकर आंख सुन्न की जाती है। सर्जरी के 1-2 घंटे बाद मरीज आराम से घर जा सकते हैं तथा अस्पताल में भर्ती रहने की कोई आवश्यकता नहीं होती।'
    },
    takeaways: [
      '10-15 minute stitchless micro-coaxial phacoemulsification',
      '100% injection-free topical anesthesia drops (zero eye block pain)',
      'Same-day discharge within 2 hours; crystal-clear next morning vision'
    ],
    ctaText: 'View Cataract Surgical Services',
    ctaLink: '/services'
  },
  {
    id: 'eye-injections',
    category: 'Retina Injections',
    question: {
      en: 'What is an Intravitreal Injection and is the procedure painful?',
      hi: 'इंट्राविट्रियल (Anti-VEGF) इंजेक्शन क्या है और क्या यह दर्दनाक होता है?'
    },
    subtitle: {
      en: 'Topical anaesthetic drops ensure a comfortable, painless experience',
      hi: 'एनेस्थेटिक ड्रॉप्स की सहायता से प्रक्रिया पूर्णतः दर्द रहित होती है'
    },
    answer: {
      en: 'Intravitreal injections deliver targeted anti-VEGF medication directly into the vitreous to treat diabetic macular edema, retinal vein occlusion, and age-related macular degeneration (AMD). Before the procedure, the eye surface is thoroughly numbed using specialized topical anesthetic drops. Patients feel only a momentary, mild sensation of gentle pressure, but no sharp needle pain. The entire injection takes less than 2 minutes in our sterile OT.',
      hi: 'इंट्राविट्रियल इंजेक्शन रेटिना की सूजन और असामान्य रक्त वाहिकाओं के उपचार के लिए दिया जाता है। प्रक्रिया से पूर्व आंख में एनेस्थेटिक ड्रॉप्स डालकर सुन्न किया जाता है, जिससे सुई का कोई दर्द नहीं होता। केवल हल्का सा दबाव महसूस हो सकता है। यह प्रक्रिया ओटी में 2 मिनट से भी कम समय में पूरी हो जाती है।'
    },
    takeaways: [
      'Micro-targeted anti-VEGF therapy for diabetic edema & retinal vein block',
      'Topical numbing drops eliminate needle pain completely',
      'Completed in under 2 minutes in cleanroom surgical conditions'
    ],
    ctaText: 'Consult Retina Specialist',
    ctaLink: '/pre-book'
  },
  {
    id: 'documents-checklist',
    category: 'Patient Checklist',
    question: {
      en: 'What clinical documents and medical records should I bring?',
      hi: 'आंखों के परामर्श के लिए आते समय कौन से दस्तावेज व पुराने रिकॉर्ड साथ लाएं?'
    },
    subtitle: {
      en: 'Complete past records ensure the most precise clinical diagnosis',
      hi: 'पूर्व रिकॉर्ड से बीमारी का सही इतिहास जानने में मदद मिलती है'
    },
    answer: {
      en: 'Please bring all previous eye prescription glasses, prior ophthalmology case files, and any past retinal scans (OCT, FFA, B-Scan ultrasound) if available. Also bring medical summaries of systemic conditions—particularly diabetes blood sugar records (HbA1c), blood pressure readings, and any ongoing medications (such as blood thinners or cardiac drugs). This helps Dr. Gaur safely tailor your personalized clinical plan.',
      hi: 'कृपया अपने पुराने चश्मे, पिछली जांच पर्चियां, पहले हुए नेत्र परीक्षण या लेजर के कागजात अवश्य लाएं। यदि आप मधुमेह (डायबिटीज) या उच्च रक्तचाप के मरीज हैं, तो हालिया ब्लड शुगर (HbA1c) रिपोर्ट व चल रही दवाओं की सूची अवश्य साथ रखें।'
    },
    takeaways: [
      'Previous eyeglasses & contact lens prescriptions',
      'Prior ophthalmology reports, retinal scans & discharge summaries',
      'Recent blood sugar (HbA1c) log and ongoing systemic medications'
    ],
    ctaText: 'About Clinic Protocols',
    ctaLink: '/about'
  }
];

// Backwards compatibility alias
export const DOCTOR_LICENSE_FAQS = CLINICAL_FAQS;

export default function FAQSection({ currentLang = 'en' }) {
  // First item open by default
  const [openIndex, setOpenIndex] = useState(0);

  const lang = currentLang === 'hi' ? 'hi' : 'en';

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#FAFBFC] border-t border-slate-200/80 scroll-mt-24">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="reveal-up text-center mb-12 sm:mb-16">
            <SectionHeading
              align="center"
              eyebrow={lang === 'hi' ? 'मरीजों के सामान्य प्रश्न' : 'Clinical Guidance & Patient FAQ'}
              title={lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
              description={
                lang === 'hi'
                  ? 'अपॉइंटमेंट प्रक्रिया, पुतली फैलाने का समय, मोतियाबिंद डे-केयर सर्जरी और निर्वाया आईकेयर सेंटर में आपकी यात्रा से संबंधित स्पष्ट जानकारी।'
                  : 'Clear, transparent answers about appointment procedures, pupil dilation, surgical timelines, and what to expect during your visit to Nirvaya Eyecare Centre.'
              }
            />
          </div>

          {/* Clean Normal FAQ Accordion */}
          <div className="space-y-4">
            {CLINICAL_FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
                    isOpen
                      ? 'border-[#DFBF64]/60 shadow-md ring-1 ring-[#DFBF64]/30'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0">
                      <span
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-[#0A1E3F] text-[#DFBF64]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C59B27] bg-[#C59B27]/10 px-2 py-0.5 rounded-md border border-[#C59B27]/20">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A1E3F] leading-snug">
                          {faq.question[lang]}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-[#0A1E3F] text-[#DFBF64] rotate-180 shadow-xs'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-700 leading-relaxed border-t border-slate-100/90 animate-in fade-in duration-200">
                      {/* Clinical Subtitle Context */}
                      <p className="text-xs sm:text-sm font-semibold text-[#0A1E3F] mb-3 flex items-center gap-1.5 pt-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                        <span>{faq.subtitle[lang]}</span>
                      </p>

                      {/* Detailed Medical Answer */}
                      <p className="text-sm sm:text-base text-slate-600 mb-5 leading-relaxed font-normal">
                        {faq.answer[lang]}
                      </p>

                      {/* Key Clinical Takeaways */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 mb-5">
                        {faq.takeaways.map((point, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0 mt-0.5" />
                            <span className="leading-snug">{point}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            href={faq.ctaLink}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-[#0A1E3F] bg-[#DFBF64] hover:bg-[#C59B27] hover:text-white shadow-xs transition-colors"
                          >
                            <CalendarCheck className="w-4 h-4" />
                            <span>{faq.ctaText}</span>
                          </Link>

                          <a
                            href="https://wa.me/917554928200"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                            <span>{lang === 'hi' ? 'व्हाट्सएप पूछताछ' : 'WhatsApp Query'}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Unanswered Questions Callout Banner */}
          <div className="mt-12 p-6 rounded-3xl bg-sky-50/80 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-5 text-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-600/10 text-sky-800 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 text-sky-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#0A1E3F]">
                  {lang === 'hi'
                    ? 'क्या आपका कोई ऐसा प्रश्न है जिसका उत्तर यहां नहीं है?'
                    : 'Have a clinical question not addressed above?'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  {lang === 'hi'
                    ? 'हमारे क्लिनिक समन्वयक से +91 755 492 8200 पर बात करें या व्हाट्सएप पर अपना प्रश्न भेजें।'
                    : 'Speak directly with our clinic coordinator or send an inquiry on WhatsApp for prompt guidance.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="tel:+917554928200"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[#0A1E3F] font-bold text-xs sm:text-sm shadow-2xs hover:bg-slate-50 transition"
              >
                <PhoneCall className="w-4 h-4 text-[#00aeef]" />
                <span>+91 755 492 8200</span>
              </a>
              <a
                href="https://wa.me/917554928200"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

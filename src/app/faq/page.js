import React from 'react';
import FaqClient from './FaqClient';
import { ALL_FAQS } from '@/data/faqData';

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | Patient Care & Surgery Guide | Nirvaya Eyecare',
  description: 'Comprehensive answers to patient questions on appointments, dilated retina examinations, micro-incision cataract surgery, anti-VEGF eye injections, ROP screening, and clinic guidelines at Nirvaya Eyecare Centre, Bhopal.',
  keywords: [
    'eye care FAQ Bhopal',
    'retina checkup time',
    'cataract surgery day care',
    'anti-VEGF injection pain',
    'ROP screening timeline',
    'Dr Sandhya Gaur consultation',
    'Nirvaya Eyecare Centre FAQ'
  ],
  alternates: {
    canonical: 'https://nirvayaeyecare.com/faq'
  },
  openGraph: {
    title: 'Patient FAQ & Clinical Care Guide | Nirvaya Eyecare Centre',
    description: 'Frequently asked questions on retinal disease, cataract surgery, appointments, and diagnostic procedures in Bhopal.',
    url: 'https://nirvayaeyecare.com/faq',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function FaqPage() {
  // Schema.org FAQPage structured data for rich Google search snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ALL_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question.en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.en
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient />
    </>
  );
}

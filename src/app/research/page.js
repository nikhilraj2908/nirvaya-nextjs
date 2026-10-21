import ResearchContent from '@/components/research/ResearchContent';

export const metadata = {
  title: 'Clinical Research & Publications | Dr Sandhya Gaur (MD AIIMS)',
  description:
    '18+ peer-reviewed ophthalmology research publications on 27G micro-incision vitrectomy, diabetic macular edema, and pediatric ROP screening by Dr Sandhya Gaur.',
  alternates: {
    canonical: 'https://nirvayaeyecare.com/research'
  },
  openGraph: {
    title: 'Ophthalmology Research & Surgical Publications | Nirvaya Eyecare',
    description:
      'Explore published surgical outcomes, retinal clinical trials, and international journal papers authored by Dr Sandhya Gaur (AIIMS New Delhi, FAICO Gold Medalist).',
    url: 'https://nirvayaeyecare.com/research',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function ResearchPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Peer-Reviewed Ophthalmology Research Papers',
    description:
      'Indexed medical publications on vitreoretinal surgery, diabetic macular edema, and ROP by Dr Sandhya Gaur.',
    url: 'https://nirvayaeyecare.com/research'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResearchContent />
    </>
  );
}

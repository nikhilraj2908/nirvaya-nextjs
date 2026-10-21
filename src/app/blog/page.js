import BlogListContent from '@/components/blog/BlogListContent';

export const metadata = {
  title: 'Clinical Eye Care Articles & Blogs | Dr. Sandhya Gaur | Nirvaya Eyecare Bhopal',
  description:
    'Expert ophthalmic insights on vitreo-retinal diseases, diabetic retinopathy prevention, macular health, and advanced cataract surgery from Dr. Sandhya Gaur (MD AIIMS).',
  alternates: {
    canonical: 'https://nirvayaeyecare.com/blog'
  },
  openGraph: {
    title: 'Clinical Eye Care Articles & Medical Guides | Nirvaya Eyecare Bhopal',
    description:
      'Evidence-based patient guides, surgical insights, and diagnostic perspectives on eye health by Dr. Sandhya Gaur (MD AIIMS New Delhi).',
    url: 'https://nirvayaeyecare.com/blog',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function BlogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Nirvaya Eyecare Clinical Blog',
    description:
      'Medical articles on vitreoretinal pathology, diabetic eye diseases, and cataract surgical breakthroughs by Dr. Sandhya Gaur.',
    url: 'https://nirvayaeyecare.com/blog'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListContent />
    </>
  );
}

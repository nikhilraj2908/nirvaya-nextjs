import ServicesContent from '@/components/services/ServicesContent';
import { CLINIC_INFO, SPECIALTIES } from '@/data/siteData';

export const metadata = {
  title: 'Eye Care Services & Retina Surgery in Bhopal | Nirvaya Eyecare',
  description:
    'Comprehensive eye care: 25G/27G sutureless vitrectomy, retinal detachment surgery, diabetic retinopathy management, micro-incision cataract (Phaco), and anti-VEGF injections in Bhopal.',
  alternates: {
    canonical: 'https://nirvayaeyecare.com/services'
  },
  openGraph: {
    title: 'Ophthalmic Services & Retina Specialties | Nirvaya Eyecare Centre',
    description:
      'Explore specialized eye treatments guided by Dr Sandhya Gaur (MD AIIMS). Class 100 HEPA cleanroom OT, same-day recovery, and advanced vitreoretinal microsurgery.',
    url: 'https://nirvayaeyecare.com/services',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function ServicesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'Clinical Services & Specialties | Nirvaya Eyecare Centre',
    description:
      'Comprehensive ophthalmic surgical directory for Nirvaya Eyecare Centre, Ayodhya Bypass Road, Bhopal.',
    about: SPECIALTIES.map((spec) => ({
      '@type': 'MedicalProcedure',
      name: spec.title,
      procedureType: spec.category,
      description: spec.description
    })),
    provider: {
      '@type': 'MedicalBusiness',
      name: 'Nirvaya Eyecare Centre',
      telephone: CLINIC_INFO.phoneRaw,
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesContent />
    </>
  );
}

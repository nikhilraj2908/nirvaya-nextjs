import ContactContent from '@/components/contact/ContactContent';
import { CLINIC_INFO } from '@/data/siteData';

export const metadata = {
  title: 'Contact Nirvaya Eyecare Centre | Ayodhya Bypass Road Bhopal',
  description:
    'Contact Nirvaya Eyecare Centre in Bhopal. Call +91 91710 03795 or visit us at Ayodhya Bypass Road. Ground-level parking, ramp access, and emergency retina support.',
  alternates: {
    canonical: 'https://nirvayaeyecare.com/contact'
  },
  openGraph: {
    title: 'Contact Nirvaya Eyecare Centre | Bhopal Retina & Eye Hospital',
    description:
      'Get clinic directions, OPD timings, helpline numbers, and direct WhatsApp support for retina consultations and cataract surgeries.',
    url: 'https://nirvayaeyecare.com/contact',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Nirvaya Eyecare Centre',
    mainEntity: {
      '@type': 'MedicalBusiness',
      name: 'Nirvaya Eyecare Centre',
      telephone: CLINIC_INFO.phoneRaw,
      email: CLINIC_INFO.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CLINIC_INFO.addressLine1,
        addressLocality: CLINIC_INFO.city,
        addressRegion: CLINIC_INFO.state,
        postalCode: CLINIC_INFO.pincode,
        addressCountry: 'IN'
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:30',
          closes: '19:30'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '10:00',
          closes: '13:00'
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent />
    </>
  );
}

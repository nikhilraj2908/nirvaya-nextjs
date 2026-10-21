import DoctorsContent from '@/components/doctors/DoctorsContent';
import { CLINIC_INFO } from '@/data/siteData';

export const metadata = {
  title: 'Eye Specialists & Surgeons in Bhopal | Dr Sandhya Gaur (MD AIIMS)',
  description:
    'Meet Dr Sandhya Gaur (MD AIIMS New Delhi, FVRS, FAICO Retina Gold Medalist) and ophthalmology faculty at Nirvaya Eyecare Centre, Bhopal. Consult for retinal detachment, diabetic eye disease, and cataract.',
  alternates: {
    canonical: 'https://nirvayaeyecare.com/doctors'
  },
  openGraph: {
    title: 'Dr Sandhya Gaur - Vitreo-Retinal Surgeon | Nirvaya Eyecare Bhopal',
    description:
      'MD (AIIMS New Delhi) • DNB • FVRS • FAICO Gold Medalist. Vitreo-retinal specialist with 18+ publications and advanced microsurgical expertise.',
    url: 'https://nirvayaeyecare.com/doctors',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'profile'
  }
};

export default function DoctorsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: 'Dr Sandhya Gaur',
    jobTitle: 'Consultant Vitreo-Retinal Surgeon & Medical Director',
    medicalSpecialty: [
      'Ophthalmology',
      'Vitreo-Retinal Surgery',
      'Cataract Surgery',
      'Diabetic Retinopathy Management'
    ],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Dr. R.P. Centre for Ophthalmic Sciences, AIIMS, New Delhi'
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Sadguru Netra Chikitsalaya, Chitrakoot'
      }
    ],
    worksFor: {
      '@type': 'MedicalBusiness',
      name: 'Nirvaya Eyecare Centre',
      address: {
        '@type': 'PostalAddress',
        streetAddress: CLINIC_INFO.addressLine1,
        addressLocality: CLINIC_INFO.city,
        addressRegion: CLINIC_INFO.state,
        postalCode: CLINIC_INFO.pincode,
        addressCountry: 'IN'
      },
      telephone: CLINIC_INFO.phoneRaw
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DoctorsContent />
    </>
  );
}

import { Plus_Jakarta_Sans, Noto_Sans, Noto_Sans_Devanagari, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import AppLayoutClient from '@/components/layout/AppLayoutClient';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-KY995SYKY6';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hindi',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-serif-luxury',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://nirvayaeyecare.com'),
  ...(process.env.PREVIEW_MODE === 'true' || process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true'
    ? {
        robots: {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        },
      }
    : {}),
  title: {
    default: 'Nirvaya Eyecare Centre | Specialist-led Retina, Cataract & Comprehensive Eye Care in Bhopal',
    template: '%s | Nirvaya Eyecare Centre'
  },
  description: 'Nirvaya Eyecare Centre is a specialist-led day-care eye centre in Bhopal focused on vitreo-retinal surgery, cataract, diabetic retinopathy, ROP, and comprehensive eye care. Directed by Dr Sandhya Gaur (MD AIIMS, FVRS).',
  keywords: [
    'Nirvaya Eyecare Centre',
    'Dr Sandhya Gaur',
    'retina specialist Bhopal',
    'cataract surgery Bhopal',
    'diabetic eye care',
    'ROP screening Bhopal',
    'vitreo-retina AIIMS',
    'eye hospital Bhopal',
    'Ayodhya Bypass Road eye clinic',
    'macular degeneration injection'
  ],
  authors: [{ name: 'Dr Sandhya Gaur' }, { name: 'M/s Nirvaya Health' }],
  creator: 'Nirvaya Eyecare Centre',
  publisher: 'M/s Nirvaya Health',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: 'Nirvaya Eyecare Centre | Specialist-led Eye Care in Bhopal',
    description: 'Advanced Vitreo-Retinal & Micro-Incision Cataract Surgery Centre led by Dr Sandhya Gaur (MD AIIMS, FVRS, FAICO Gold Medalist).',
    url: 'https://nirvayaeyecare.com',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/assets/img1.webp',
        width: 1200,
        height: 630,
        alt: 'Nirvaya Eyecare Centre Operating Facility'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nirvaya Eyecare Centre | Specialist-led Eye Care in Bhopal',
    description: 'Advanced Vitreo-Retinal & Micro-Incision Cataract Surgery Centre led by Dr Sandhya Gaur (MD AIIMS).',
    images: ['/assets/img1.webp']
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/site.webmanifest'
};

const clinicJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['MedicalBusiness', 'Optician', 'MedicalClinic'],
      '@id': 'https://nirvayaeyecare.com/#medicalbusiness',
      'name': 'Nirvaya Eyecare Centre',
      'alternateName': 'M/s Nirvaya Health',
      'url': 'https://nirvayaeyecare.com',
      'logo': 'https://nirvayaeyecare.com/images/nirvaya-logo.png',
      'image': 'https://nirvayaeyecare.com/assets/img1.webp',
      'telephone': '+91-755-4928200',
      'email': 'care@nirvayahealth.com',
      'priceRange': '$$',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Ayodhya Bypass Road',
        'addressLocality': 'Bhopal',
        'addressRegion': 'Madhya Pradesh',
        'postalCode': '462041',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 23.269999,
        'longitude': 77.458997
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          'opens': '09:30',
          'closes': '19:30'
        }
      ],
      'medicalSpecialty': [
        'Ophthalmology',
        'Vitreoretinal Surgery',
        'Cataract Surgery',
        'Diabetic Retinopathy',
        'Pediatric Ophthalmology'
      ],
      'founder': {
        '@type': 'Person',
        'name': 'Dr Sandhya Gaur',
        'jobTitle': 'Medical Director & Senior Vitreo-Retinal Surgeon',
        'alumniOf': 'All India Institute of Medical Sciences (AIIMS New Delhi)',
        'honorificPrefix': 'Dr.',
        'medicalSpecialty': 'Vitreoretinal Surgery'
      }
    },
    {
      '@type': 'Physician',
      '@id': 'https://nirvayaeyecare.com/#physician',
      'name': 'Dr Sandhya Gaur',
      'jobTitle': 'Senior Consultant Vitreo-Retinal Surgeon',
      'medicalSpecialty': 'Vitreoretinal Surgery',
      'alumniOf': 'AIIMS New Delhi',
      'award': 'FAICO Retina Gold Medalist',
      'worksFor': {
        '@id': 'https://nirvayaeyecare.com/#medicalbusiness'
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${notoSans.variable} ${notoDevanagari.variable} ${playfairDisplay.variable} font-scale-md h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {/* Google Analytics 4 (gtag.js) - Disabled in Client Preview Mode */}
        {process.env.PREVIEW_MODE !== 'true' &&
          process.env.NEXT_PUBLIC_PREVIEW_MODE !== 'true' &&
          GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}

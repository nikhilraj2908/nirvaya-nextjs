import { Suspense } from 'react';
import PreBookContent from '@/components/booking/PreBookContent';

export const metadata = {
  title: 'Pre-book Eye Consultation & Retina Surgery | Nirvaya Eyecare Bhopal',
  description:
    'Book your consultation slot with Dr Sandhya Gaur (MD AIIMS New Delhi) at Nirvaya Eyecare Centre, Bhopal. Real-time availability, discrete 30-min OPD slots, immediate confirmation.',
  alternates: {
    canonical: 'https://nirvayaeyecare.com/pre-book'
  },
  openGraph: {
    title: 'Pre-book OPD Slot | Nirvaya Eyecare Centre Bhopal',
    description:
      'Real-time appointment scheduling with senior ophthalmic consultants. Choose verified dates, consultation times, and secure your hospital visit.',
    url: 'https://nirvayaeyecare.com/pre-book',
    siteName: 'Nirvaya Eyecare Centre',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function PreBookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-[#C59B27] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500 font-medium">Loading clinical scheduling calendar...</p>
          </div>
        </div>
      }
    >
      <PreBookContent />
    </Suspense>
  );
}

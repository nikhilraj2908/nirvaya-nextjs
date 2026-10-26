import React from 'react';
import EyeScrollVideo from '@/components/home/EyeScrollVideo';
import TrustStrip from '@/components/home/TrustStrip';
import AboutSection from '@/components/home/AboutSection';
import SpecialtiesSection from '@/components/home/SpecialtiesSection';
import DoctorSection from '@/components/home/DoctorSection';
import TechnologySection from '@/components/home/TechnologySection';
import KnowledgeHubSection from '@/components/home/KnowledgeHubSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import LocationSection from '@/components/home/LocationSection';
import FAQSection from '@/components/home/FAQSection';
import FinalCTA from '@/components/home/FinalCTA';
import en from '@/locales/en.json';

export const metadata = {
  title: en.metadata.title,
  description: en.metadata.description
};

export default function HomePage() {
  return (
    <div className="flex-1 pb-16 lg:pb-0 overflow-x-clip w-full">
      {/* 1. Interactive Scroll-controlled Eye Disassembly Hero (GSAP ScrollTrigger) */}
      <EyeScrollVideo />

      {/* 2. Clinical Credentials & Trust Strip */}
      <TrustStrip />

      {/* 3. About Nirvaya & Clinical Story */}
      <AboutSection />

      {/* 4. Core Clinical Specialties (4 Flagship Focus Areas) */}
      <SpecialtiesSection />

      {/* 5. Specialist Spotlight: Dr Sandhya Gaur */}
      <DoctorSection />

      {/* 6. Clinical Technology & OT Cleanroom Facility (3 Core Pillars) */}
      <TechnologySection />

      {/* 7. Clinical Knowledge Hub: Articles & Research Publications */}
      <KnowledgeHubSection />

      {/* 8. Doctors' Point of View (Referring Doctors) */}
      <ReviewsSection />

      {/* 9. Clinic Location, Hours & Map Directions */}
      <LocationSection />

      {/* 10. Frequently Asked Questions (5 Medical Pills & Accordion) */}
      <FAQSection />

      {/* 11. Final Pre-Footer Call-To-Action */}
      <FinalCTA />
    </div>
  );
}

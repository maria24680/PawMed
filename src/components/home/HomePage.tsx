'use client';

import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ServicesSection from './ServicesSection';
import StatsSection from './StatsSection';
import TestimonialsSection from './TestimonialsSection';
import NewsletterSection from './NewsletterSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import PetsGallerySection from './PetsGallerySection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <PetsGallerySection />
      <NewsletterSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
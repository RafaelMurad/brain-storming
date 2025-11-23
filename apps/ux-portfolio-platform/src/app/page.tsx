import Hero from '@/components/sections/Hero';
import FeaturedWork from '@/components/sections/FeaturedWork';
import ServicesSection from '@/components/sections/Services';
import CTASection from '@/components/sections/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <ServicesSection />
      <CTASection />
    </>
  );
}

import Image from 'next/image';
import Header from './(marketing)/components/header';
import HeroSection from './(marketing)/components/hero-section';
import PainPointsSection from './(marketing)/components/pain-points-section';
import PilotSection from './(marketing)/components/pilot-section';
import ScreenshotsSection from './(marketing)/components/screenshots-section';
import TestimonialsSection from './(marketing)/components/testimonials-section';
import PricingSection from './(marketing)/components/pricing-section';
import NewsletterSection from './(marketing)/components/newsletter-section';
import Footer from './(marketing)/components/footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <HeroSection />
      <PainPointsSection />
      <PilotSection />
      <ScreenshotsSection />
      <TestimonialsSection />
      <PricingSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}

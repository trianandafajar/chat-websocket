import { PreviewSection } from "@/components/landing/preview/preview-section";
import { HeaderSection } from "@/components/landing/sections/header-section";
import { HeroSection } from "@/components/landing/sections/hero-section";
import { FeaturesSection } from "@/components/landing/sections/features-section";
import { HowItWorksSection } from "@/components/landing/sections/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/sections/testimonials-section";
import { CtaSection } from "@/components/landing/sections/cta-section";
import { FooterSection } from "@/components/landing/sections/footer-section";
import { Divider } from "@/components/landing/sections/divider";
import { ScrollToTop } from "@/components/landing/scroll-to-top";

export function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
      <HeaderSection />
      <HeroSection />
      <PreviewSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Divider />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
      <ScrollToTop />
    </main>
  );
}

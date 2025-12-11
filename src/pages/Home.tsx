import React, { useEffect } from "react";
import { motion } from "framer-motion";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import AboutSection from "@/components/home/AboutSection";
import EducationalContentSection from "@/components/home/EducationalContentSection";
import CtaSection from "@/components/home/CtaSection";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function Home() {
  useEffect(() => {
    console.log("Home page rendered");
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Carousel Section - com fade in inicial */}
      <motion.section 
        className="relative mb-0 pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroCarousel />
      </motion.section>

      {/* Featured Species Section */}
      <AnimatedSection delay={0.1}>
        <FeaturedProductsSection />
      </AnimatedSection>
      
      {/* About Section */}
      <AnimatedSection delay={0.15}>
        <AboutSection />
      </AnimatedSection>
      
      {/* Educational Content Preview */}
      <AnimatedSection delay={0.1}>
        <EducationalContentSection />
      </AnimatedSection>
      
      {/* CTA Section */}
      <AnimatedSection delay={0.1}>
        <CtaSection />
      </AnimatedSection>
    </div>
  );
}


import React, { useEffect } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import AboutSection from "@/components/home/AboutSection";
import EducationalContentSection from "@/components/home/EducationalContentSection";
import CtaSection from "@/components/home/CtaSection";

export default function Home() {
  useEffect(() => {
    console.log("Home page rendered");
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Carousel Section */}
      <section className="relative">
        <HeroCarousel />
      </section>

      {/* Featured Species Section */}
      <FeaturedProductsSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Educational Content Preview */}
      <EducationalContentSection />
      
      {/* CTA Section */}
      <CtaSection />
    </div>
  );
}

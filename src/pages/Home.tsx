import React from "react";
import { Helmet } from "react-helmet-async";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import AboutSection from "@/components/home/AboutSection";
import EducationalContentSection from "@/components/home/EducationalContentSection";
import CtaSection from "@/components/home/CtaSection";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>PET SERPENTES & COMPANHIA</title>
        <meta 
          name="description" 
          content="O Pet Serpentes & Companhia é um criadouro comercial legalizado localizado no Rio de Janeiro, certificado pelo IBAMA e INEA-RJ. Trabalhamos exclusivamente com répteis silvestres nativos." 
        />
      </Helmet>
      <div className="flex flex-col w-full">
        {/* Hero Carousel Section */}
        <section className="relative mb-0 pb-0">
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
    </>
  );
}

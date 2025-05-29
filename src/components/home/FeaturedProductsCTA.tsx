
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FeaturedProductsCTA() {
  return (
    <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
      <Button size="lg" className="min-h-[44px] w-full sm:w-auto text-sm sm:text-base touch-manipulation" asChild>
        <Link to="/catalogo">Ver Catálogo Completo <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
    </div>
  );
}
